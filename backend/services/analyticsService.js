const logger = require('../utils/logger');
const cache = require('../utils/cache');
const User = require('../models/User');

/**
 * Advanced Analytics and Insights Service
 * Provides detailed analytics for users and administrators
 */

class AnalyticsService {
  constructor() {
    this.metricsCache = new Map();
  }

  /**
   * Track user activity
   */
  async trackActivity(userId, activityType, metadata = {}) {
    try {
      const activity = {
        userId,
        activityType,
        metadata,
        timestamp: new Date(),
        userAgent: metadata.userAgent,
        ipAddress: metadata.ipAddress,
        sessionId: metadata.sessionId
      };

      // Store in database (you might want to create a separate Activities collection)
      await User.findByIdAndUpdate(userId, {
        $push: {
          activities: {
            $each: [activity],
            $slice: -1000 // Keep only last 1000 activities
          }
        },
        $set: { lastActivity: new Date() }
      });

      // Update real-time metrics
      this.updateRealTimeMetrics(activityType, metadata);

      logger.debug('Activity tracked', { userId, activityType });
    } catch (error) {
      logger.error('Error tracking activity', { error: error.message, userId, activityType });
    }
  }

  /**
   * Update real-time metrics
   */
  updateRealTimeMetrics(activityType, metadata = {}) {
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = `metrics_${today}`;
    
    let metrics = this.metricsCache.get(cacheKey) || {
      totalActivities: 0,
      activityTypes: {},
      uniqueUsers: new Set(),
      deviceTypes: {},
      browsers: {},
      timestamps: []
    };

    metrics.totalActivities++;
    metrics.activityTypes[activityType] = (metrics.activityTypes[activityType] || 0) + 1;
    
    if (metadata.userId) metrics.uniqueUsers.add(metadata.userId);
    if (metadata.deviceType) metrics.deviceTypes[metadata.deviceType] = (metrics.deviceTypes[metadata.deviceType] || 0) + 1;
    if (metadata.browser) metrics.browsers[metadata.browser] = (metrics.browsers[metadata.browser] || 0) + 1;
    
    metrics.timestamps.push(new Date());

    this.metricsCache.set(cacheKey, metrics);
  }

  /**
   * Get user analytics
   */
  async getUserAnalytics(userId, timeRange = '30d') {
    try {
      const cacheKey = `user_analytics_${userId}_${timeRange}`;
      let analytics = await cache.get(cacheKey);

      if (!analytics) {
        const user = await User.findById(userId);
        if (!user) return null;

        const endDate = new Date();
        const startDate = this.getStartDate(endDate, timeRange);

        // Filter activities by time range
        const activities = (user.activities || []).filter(activity => 
          new Date(activity.timestamp) >= startDate && new Date(activity.timestamp) <= endDate
        );

        analytics = {
          userId,
          timeRange,
          totalActivities: activities.length,
          activityBreakdown: this.getActivityBreakdown(activities),
          dailyActivity: this.getDailyActivity(activities, startDate, endDate),
          mostActiveDay: this.getMostActiveDay(activities),
          averageSessionDuration: this.getAverageSessionDuration(activities),
          deviceUsage: this.getDeviceUsage(activities),
          featureUsage: user.featureUsage || {},
          performanceMetrics: {
            totalResumes: user.resumes?.length || 0,
            totalCoverLetters: user.coverLetters?.length || 0,
            totalApplications: user.jobApplications?.length || 0,
            successRate: this.calculateSuccessRate(user.jobApplications || [])
          },
          engagementScore: this.calculateEngagementScore(activities, user)
        };

        // Cache for 1 hour
        await cache.set(cacheKey, analytics, 3600);
      }

      return analytics;
    } catch (error) {
      logger.error('Error getting user analytics', { error: error.message, userId });
      return null;
    }
  }

  /**
   * Get application analytics
   */
  async getApplicationAnalytics(timeRange = '30d') {
    try {
      const cacheKey = `app_analytics_${timeRange}`;
      let analytics = await cache.get(cacheKey);

      if (!analytics) {
        const endDate = new Date();
        const startDate = this.getStartDate(endDate, timeRange);

        // Get all users with activities in time range
        const users = await User.find({
          lastActivity: { $gte: startDate, $lte: endDate }
        });

        const allActivities = [];
        users.forEach(user => {
          if (user.activities) {
            const filteredActivities = user.activities.filter(activity =>
              new Date(activity.timestamp) >= startDate && new Date(activity.timestamp) <= endDate
            );
            allActivities.push(...filteredActivities);
          }
        });

        analytics = {
          timeRange,
          totalUsers: users.length,
          activeUsers: users.filter(user => user.lastActivity >= startDate).length,
          newUsers: users.filter(user => user.createdAt >= startDate).length,
          totalActivities: allActivities.length,
          activityBreakdown: this.getActivityBreakdown(allActivities),
          dailyActiveUsers: this.getDailyActiveUsers(users, startDate, endDate),
          userRetention: this.calculateUserRetention(users),
          featureAdoption: this.getFeatureAdoption(users),
          performanceOverview: {
            totalResumes: users.reduce((sum, user) => sum + (user.resumes?.length || 0), 0),
            totalCoverLetters: users.reduce((sum, user) => sum + (user.coverLetters?.length || 0), 0),
            totalApplications: users.reduce((sum, user) => sum + (user.jobApplications?.length || 0), 0),
            averageSuccessRate: this.calculateAverageSuccessRate(users)
          },
          topFeatures: this.getTopFeatures(allActivities),
          deviceStats: this.getDeviceUsage(allActivities),
          peakUsageHours: this.getPeakUsageHours(allActivities)
        };

        // Cache for 30 minutes
        await cache.set(cacheKey, analytics, 1800);
      }

      return analytics;
    } catch (error) {
      logger.error('Error getting application analytics', { error: error.message });
      return null;
    }
  }

  /**
   * Get real-time metrics
   */
  getRealTimeMetrics() {
    const today = new Date().toISOString().split('T')[0];
    const metrics = this.metricsCache.get(`metrics_${today}`) || {
      totalActivities: 0,
      activityTypes: {},
      uniqueUsers: new Set(),
      deviceTypes: {},
      browsers: {},
      timestamps: []
    };

    return {
      totalActivities: metrics.totalActivities,
      activityTypes: metrics.activityTypes,
      activeUsers: metrics.uniqueUsers.size,
      deviceTypes: metrics.deviceTypes,
      browsers: metrics.browsers,
      lastHourActivity: this.getLastHourActivity(metrics.timestamps)
    };
  }

  /**
   * Helper Methods
   */
  getStartDate(endDate, timeRange) {
    const start = new Date(endDate);
    switch (timeRange) {
      case '7d': start.setDate(start.getDate() - 7); break;
      case '30d': start.setDate(start.getDate() - 30); break;
      case '90d': start.setDate(start.getDate() - 90); break;
      case '1y': start.setFullYear(start.getFullYear() - 1); break;
      default: start.setDate(start.getDate() - 30);
    }
    return start;
  }

  getActivityBreakdown(activities) {
    const breakdown = {};
    activities.forEach(activity => {
      breakdown[activity.activityType] = (breakdown[activity.activityType] || 0) + 1;
    });
    return breakdown;
  }

  getDailyActivity(activities, startDate, endDate) {
    const dailyActivity = {};
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0];
      dailyActivity[dateKey] = 0;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    activities.forEach(activity => {
      const dateKey = new Date(activity.timestamp).toISOString().split('T')[0];
      if (dailyActivity.hasOwnProperty(dateKey)) {
        dailyActivity[dateKey]++;
      }
    });

    return dailyActivity;
  }

  getMostActiveDay(activities) {
    const dayActivity = {};
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    activities.forEach(activity => {
      const day = days[new Date(activity.timestamp).getDay()];
      dayActivity[day] = (dayActivity[day] || 0) + 1;
    });

    return Object.entries(dayActivity)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Monday';
  }

  getAverageSessionDuration(activities) {
    // Simplified calculation - in real implementation, you'd track session start/end
    const sessions = this.groupActivitiesBySessions(activities);
    if (sessions.length === 0) return 0;
    
    const totalDuration = sessions.reduce((sum, session) => sum + session.duration, 0);
    return Math.round(totalDuration / sessions.length / 1000 / 60); // Convert to minutes
  }

  groupActivitiesBySessions(activities) {
    // Group activities into sessions (activities within 30 minutes of each other)
    const sessions = [];
    let currentSession = null;
    
    activities.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    activities.forEach(activity => {
      const timestamp = new Date(activity.timestamp);
      
      if (!currentSession || timestamp - currentSession.lastActivity > 30 * 60 * 1000) {
        // Start new session
        currentSession = {
          start: timestamp,
          lastActivity: timestamp,
          activities: [activity],
          duration: 0
        };
        sessions.push(currentSession);
      } else {
        // Continue current session
        currentSession.duration = timestamp - currentSession.start;
        currentSession.lastActivity = timestamp;
        currentSession.activities.push(activity);
      }
    });
    
    return sessions;
  }

  getDeviceUsage(activities) {
    const deviceUsage = {};
    activities.forEach(activity => {
      if (activity.metadata?.deviceType) {
        const device = activity.metadata.deviceType;
        deviceUsage[device] = (deviceUsage[device] || 0) + 1;
      }
    });
    return deviceUsage;
  }

  calculateSuccessRate(applications) {
    if (applications.length === 0) return 0;
    const successful = applications.filter(app => app.status === 'interview' || app.status === 'hired').length;
    return Math.round((successful / applications.length) * 100);
  }

  calculateEngagementScore(activities, user) {
    // Simplified engagement score calculation
    const activityScore = Math.min(activities.length / 10, 10) * 10; // Max 100 points for activities
    const featureScore = Object.keys(user.featureUsage || {}).length * 5; // 5 points per feature used
    const recencyScore = this.getRecencyScore(user.lastActivity);
    
    return Math.min(Math.round(activityScore + featureScore + recencyScore), 100);
  }

  getRecencyScore(lastActivity) {
    if (!lastActivity) return 0;
    const daysSinceLastActivity = (Date.now() - new Date(lastActivity)) / (1000 * 60 * 60 * 24);
    return Math.max(20 - daysSinceLastActivity, 0); // Max 20 points, decreases with time
  }

  getDailyActiveUsers(users, startDate, endDate) {
    const dailyUsers = {};
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0];
      dailyUsers[dateKey] = 0;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    users.forEach(user => {
      if (user.activities) {
        const activeDays = new Set();
        user.activities.forEach(activity => {
          const activityDate = new Date(activity.timestamp);
          if (activityDate >= startDate && activityDate <= endDate) {
            activeDays.add(activityDate.toISOString().split('T')[0]);
          }
        });
        
        activeDays.forEach(day => {
          if (dailyUsers.hasOwnProperty(day)) {
            dailyUsers[day]++;
          }
        });
      }
    });

    return dailyUsers;
  }

  calculateUserRetention(users) {
    // Calculate 7-day and 30-day retention
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const newUsers7d = users.filter(user => user.createdAt >= sevenDaysAgo);
    const activeUsers7d = users.filter(user => user.lastActivity >= sevenDaysAgo);
    
    const newUsers30d = users.filter(user => user.createdAt >= thirtyDaysAgo);
    const activeUsers30d = users.filter(user => user.lastActivity >= sevenDaysAgo && user.createdAt <= thirtyDaysAgo);

    return {
      retention7d: newUsers7d.length > 0 ? Math.round((activeUsers7d.length / newUsers7d.length) * 100) : 0,
      retention30d: newUsers30d.length > 0 ? Math.round((activeUsers30d.length / newUsers30d.length) * 100) : 0
    };
  }

  getFeatureAdoption(users) {
    const featureAdoption = {};
    users.forEach(user => {
      if (user.featureUsage) {
        Object.keys(user.featureUsage).forEach(feature => {
          featureAdoption[feature] = (featureAdoption[feature] || 0) + 1;
        });
      }
    });
    
    const totalUsers = users.length;
    const adoptionPercentages = {};
    Object.entries(featureAdoption).forEach(([feature, count]) => {
      adoptionPercentages[feature] = Math.round((count / totalUsers) * 100);
    });
    
    return adoptionPercentages;
  }

  calculateAverageSuccessRate(users) {
    const successRates = users
      .map(user => this.calculateSuccessRate(user.jobApplications || []))
      .filter(rate => rate > 0);
    
    return successRates.length > 0 
      ? Math.round(successRates.reduce((sum, rate) => sum + rate, 0) / successRates.length)
      : 0;
  }

  getTopFeatures(activities) {
    const featureUsage = {};
    activities.forEach(activity => {
      featureUsage[activity.activityType] = (featureUsage[activity.activityType] || 0) + 1;
    });
    
    return Object.entries(featureUsage)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([feature, count]) => ({ feature, count }));
  }

  getPeakUsageHours(activities) {
    const hourlyUsage = {};
    for (let i = 0; i < 24; i++) {
      hourlyUsage[i] = 0;
    }
    
    activities.forEach(activity => {
      const hour = new Date(activity.timestamp).getHours();
      hourlyUsage[hour]++;
    });
    
    return Object.entries(hourlyUsage)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }));
  }

  getLastHourActivity(timestamps) {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return timestamps.filter(timestamp => timestamp >= oneHourAgo).length;
  }
}

// Activity types constants
const ACTIVITY_TYPES = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  RESUME_UPLOAD: 'resume_upload',
  RESUME_DOWNLOAD: 'resume_download',
  COVER_LETTER_GENERATE: 'cover_letter_generate',
  JOB_SEARCH: 'job_search',
  JOB_APPLY: 'job_apply',
  PROFILE_UPDATE: 'profile_update',
  SUBSCRIPTION_CHANGE: 'subscription_change',
  FEATURE_USE: 'feature_use',
  PAGE_VIEW: 'page_view',
  SEARCH: 'search',
  DOWNLOAD: 'download',
  SHARE: 'share'
};

// Create singleton instance
const analyticsService = new AnalyticsService();

module.exports = {
  analyticsService,
  ACTIVITY_TYPES
};
