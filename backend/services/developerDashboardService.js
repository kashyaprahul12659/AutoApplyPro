const User = require('../models/User');
const analyticsService = require('./analyticsService');
const systemMonitoringService = require('./systemMonitoringService');
const { logger } = require('../utils/logger');
const { cache } = require('../utils/cache');

class DeveloperDashboardService {
  constructor() {
    this.refreshInterval = 5 * 60 * 1000; // 5 minutes
    this.startPeriodicRefresh();
  }
  
  // Start periodic dashboard data refresh
  startPeriodicRefresh() {
    setInterval(async () => {
      await this.refreshDashboardData();
    }, this.refreshInterval);
    
    // Initial refresh
    this.refreshDashboardData();
    
    logger.info('Developer dashboard service started');
  }
  
  // Refresh all dashboard data
  async refreshDashboardData() {
    try {
      logger.debug('Refreshing developer dashboard data');
      
      // Refresh data in parallel
      await Promise.all([
        this.refreshUserMetrics(),
        this.refreshSystemMetrics(),
        this.refreshApplicationMetrics(),
        this.refreshRevenueMetrics(),
        this.refreshFeatureUsageMetrics()
      ]);
      
      logger.debug('Developer dashboard data refreshed successfully');
      
    } catch (error) {
      logger.error('Error refreshing dashboard data:', error);
    }
  }
  
  // Get complete dashboard data
  async getDashboardData() {
    try {
      const dashboardData = {
        overview: await this.getOverviewData(),
        users: await this.getUserMetrics(),
        system: await this.getSystemMetrics(),
        application: await this.getApplicationMetrics(),
        revenue: await this.getRevenueMetrics(),
        features: await this.getFeatureUsageMetrics(),
        alerts: await this.getSystemAlerts(),
        realTime: await this.getRealTimeMetrics(),
        lastUpdated: new Date().toISOString()
      };
      
      return dashboardData;
      
    } catch (error) {
      logger.error('Error getting dashboard data:', error);
      throw error;
    }
  }
  
  // Get overview data
  async getOverviewData() {
    try {
      const cached = cache.get('dashboard_overview');
      if (cached) return cached;
      
      const totalUsers = await User.countDocuments();
      const activeUsers = await User.countDocuments({
        'analytics.lastActivityDate': { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      });
      const proUsers = await User.countDocuments({ 'subscription.plan': { $in: ['pro', 'enterprise'] } });
      const newUsersToday = await User.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      });
      
      const systemHealth = systemMonitoringService.getHealthStatus();
      
      const overview = {
        users: {
          total: totalUsers,
          active: activeUsers,
          pro: proUsers,
          newToday: newUsersToday,
          growth: await this.calculateUserGrowth()
        },
        system: {
          status: systemHealth.status,
          uptime: systemHealth.uptime,
          issues: systemHealth.issues.length
        },
        performance: {
          responseTime: cache.get('avg_response_time') || 0,
          errorRate: cache.get('error_rate') || 0,
          requestsPerMinute: cache.get('requests_per_minute') || 0
        }
      };
      
      cache.set('dashboard_overview', overview, 300); // 5 minutes
      return overview;
      
    } catch (error) {
      logger.error('Error getting overview data:', error);
      throw error;
    }
  }
  
  // Get user metrics
  async getUserMetrics() {
    try {
      const cached = cache.get('dashboard_users');
      if (cached) return cached;
      
      const userMetrics = await this.aggregateUserMetrics();
      
      cache.set('dashboard_users', userMetrics, 300); // 5 minutes
      return userMetrics;
      
    } catch (error) {
      logger.error('Error getting user metrics:', error);
      throw error;
    }
  }
  
  // Get system metrics
  async getSystemMetrics() {
    try {
      return systemMonitoringService.getCurrentMetrics();
    } catch (error) {
      logger.error('Error getting system metrics:', error);
      throw error;
    }
  }
  
  // Get application metrics
  async getApplicationMetrics() {
    try {
      const cached = cache.get('dashboard_application');
      if (cached) return cached;
      
      const appMetrics = {
        api: {
          totalCalls: await this.getTotalApiCalls(),
          callsToday: await this.getApiCallsToday(),
          averageResponseTime: cache.get('avg_response_time') || 0,
          errorRate: cache.get('error_rate') || 0
        },
        features: {
          mostUsed: await this.getMostUsedFeatures(),
          usage: await this.getFeatureUsageStats()
        },
        performance: {
          uptime: Math.round(process.uptime()),
          memoryUsage: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          cpuUsage: await this.getCpuUsage()
        }
      };
      
      cache.set('dashboard_application', appMetrics, 300); // 5 minutes
      return appMetrics;
      
    } catch (error) {
      logger.error('Error getting application metrics:', error);
      throw error;
    }
  }
  
  // Get revenue metrics
  async getRevenueMetrics() {
    try {
      const cached = cache.get('dashboard_revenue');
      if (cached) return cached;
      
      const revenueMetrics = await this.aggregateRevenueMetrics();
      
      cache.set('dashboard_revenue', revenueMetrics, 600); // 10 minutes
      return revenueMetrics;
      
    } catch (error) {
      logger.error('Error getting revenue metrics:', error);
      throw error;
    }
  }
  
  // Get feature usage metrics
  async getFeatureUsageMetrics() {
    try {
      const cached = cache.get('dashboard_features');
      if (cached) return cached;
      
      const featureMetrics = await this.aggregateFeatureUsageMetrics();
      
      cache.set('dashboard_features', featureMetrics, 300); // 5 minutes
      return featureMetrics;
      
    } catch (error) {
      logger.error('Error getting feature usage metrics:', error);
      throw error;
    }
  }
  
  // Get system alerts
  async getSystemAlerts() {
    try {
      return systemMonitoringService.getRecentAlerts(20);
    } catch (error) {
      logger.error('Error getting system alerts:', error);
      throw error;
    }
  }
  
  // Get real-time metrics
  async getRealTimeMetrics() {
    try {
      return {
        activeConnections: cache.get('active_connections') || 0,
        requestsPerSecond: cache.get('requests_per_second') || 0,
        currentUsers: cache.get('current_active_users') || 0,
        systemLoad: cache.get('system_load') || 0,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Error getting real-time metrics:', error);
      throw error;
    }
  }
  
  // Aggregate user metrics
  async aggregateUserMetrics() {
    try {
      const [
        usersByPlan,
        usersByRegistrationDate,
        engagementStats,
        retentionStats
      ] = await Promise.all([
        this.getUsersByPlan(),
        this.getUsersByRegistrationDate(),
        this.getEngagementStats(),
        this.getRetentionStats()
      ]);
      
      return {
        byPlan: usersByPlan,
        registrations: usersByRegistrationDate,
        engagement: engagementStats,
        retention: retentionStats
      };
      
    } catch (error) {
      logger.error('Error aggregating user metrics:', error);
      throw error;
    }
  }
  
  // Get users by plan
  async getUsersByPlan() {
    try {
      const pipeline = [
        {
          $group: {
            _id: '$subscription.plan',
            count: { $sum: 1 },
            revenue: { $sum: { $cond: [
              { $eq: ['$subscription.plan', 'pro'] }, 29.99,
              { $cond: [{ $eq: ['$subscription.plan', 'enterprise'] }, 99.99, 0] }
            ]}}
          }
        },
        { $sort: { count: -1 } }
      ];
      
      const result = await User.aggregate(pipeline);
      
      return result.map(item => ({
        plan: item._id || 'free',
        count: item.count,
        revenue: item.revenue
      }));
      
    } catch (error) {
      logger.error('Error getting users by plan:', error);
      return [];
    }
  }
  
  // Get users by registration date
  async getUsersByRegistrationDate() {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      const pipeline = [
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ];
      
      const result = await User.aggregate(pipeline);
      
      return result.map(item => ({
        date: item._id,
        count: item.count
      }));
      
    } catch (error) {
      logger.error('Error getting users by registration date:', error);
      return [];
    }
  }
  
  // Get engagement stats
  async getEngagementStats() {
    try {
      const pipeline = [
        {
          $group: {
            _id: null,
            avgEngagementScore: { $avg: '$analytics.engagementScore' },
            avgLoginCount: { $avg: '$analytics.loginCount' },
            totalFeatureUsage: { $sum: { $size: { $ifNull: ['$analytics.featuresUsed', []] } } }
          }
        }
      ];
      
      const result = await User.aggregate(pipeline);
      
      return result[0] || {
        avgEngagementScore: 0,
        avgLoginCount: 0,
        totalFeatureUsage: 0
      };
      
    } catch (error) {
      logger.error('Error getting engagement stats:', error);
      return {};
    }
  }
  
  // Get retention stats
  async getRetentionStats() {
    try {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      const [weeklyActive, monthlyActive] = await Promise.all([
        User.countDocuments({ 'analytics.lastActivityDate': { $gte: oneWeekAgo } }),
        User.countDocuments({ 'analytics.lastActivityDate': { $gte: oneMonthAgo } })
      ]);
      
      return {
        weeklyActiveUsers: weeklyActive,
        monthlyActiveUsers: monthlyActive,
        weeklyRetentionRate: weeklyActive > 0 ? (weeklyActive / monthlyActive * 100).toFixed(2) : 0
      };
      
    } catch (error) {
      logger.error('Error getting retention stats:', error);
      return {};
    }
  }
  
  // Aggregate revenue metrics
  async aggregateRevenueMetrics() {
    try {
      const pipeline = [
        {
          $match: {
            'subscription.plan': { $in: ['basic', 'pro', 'enterprise'] }
          }
        },
        {
          $group: {
            _id: '$subscription.plan',
            count: { $sum: 1 },
            monthlyRevenue: { $sum: { $cond: [
              { $eq: ['$subscription.plan', 'basic'] }, 9.99,
              { $cond: [
                { $eq: ['$subscription.plan', 'pro'] }, 29.99,
                { $cond: [{ $eq: ['$subscription.plan', 'enterprise'] }, 99.99, 0] }
              ]}
            ]}}
          }
        }
      ];
      
      const result = await User.aggregate(pipeline);
      
      const totalRevenue = result.reduce((sum, item) => sum + item.monthlyRevenue, 0);
      const totalSubscribers = result.reduce((sum, item) => sum + item.count, 0);
      
      return {
        monthlyRecurringRevenue: totalRevenue,
        totalSubscribers,
        averageRevenuePerUser: totalSubscribers > 0 ? (totalRevenue / totalSubscribers).toFixed(2) : 0,
        revenueByPlan: result,
        projectedAnnualRevenue: totalRevenue * 12
      };
      
    } catch (error) {
      logger.error('Error aggregating revenue metrics:', error);
      return {};
    }
  }
  
  // Aggregate feature usage metrics
  async aggregateFeatureUsageMetrics() {
    try {
      const pipeline = [
        { $unwind: { path: '$analytics.featuresUsed', preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: '$analytics.featuresUsed.feature',
            totalUsage: { $sum: '$analytics.featuresUsed.count' },
            uniqueUsers: { $addToSet: '$_id' }
          }
        },
        {
          $project: {
            feature: '$_id',
            totalUsage: 1,
            uniqueUsers: { $size: '$uniqueUsers' }
          }
        },
        { $sort: { totalUsage: -1 } },
        { $limit: 10 }
      ];
      
      const result = await User.aggregate(pipeline);
      
      return result.map(item => ({
        feature: item.feature || 'unknown',
        totalUsage: item.totalUsage || 0,
        uniqueUsers: item.uniqueUsers || 0
      }));
      
    } catch (error) {
      logger.error('Error aggregating feature usage metrics:', error);
      return [];
    }
  }
  
  // Helper methods
  async calculateUserGrowth() {
    try {
      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      
      const [todayCount, yesterdayCount] = await Promise.all([
        User.countDocuments({ createdAt: { $gte: new Date(today.setHours(0, 0, 0, 0)) } }),
        User.countDocuments({ 
          createdAt: { 
            $gte: new Date(yesterday.setHours(0, 0, 0, 0)),
            $lt: new Date(today.setHours(0, 0, 0, 0))
          }
        })
      ]);
      
      if (yesterdayCount === 0) return 100;
      return ((todayCount - yesterdayCount) / yesterdayCount * 100).toFixed(2);
      
    } catch (error) {
      logger.error('Error calculating user growth:', error);
      return 0;
    }
  }
  
  async getTotalApiCalls() {
    try {
      const result = await User.aggregate([
        { $group: { _id: null, total: { $sum: '$featureUsage.apiCallsCount' } } }
      ]);
      return result[0]?.total || 0;
    } catch (error) {
      return 0;
    }
  }
  
  async getApiCallsToday() {
    // This would require tracking API calls with timestamps
    // For now, return cached value
    return cache.get('api_calls_today') || 0;
  }
  
  async getMostUsedFeatures() {
    return [
      { name: 'Resume Analysis', usage: 1250 },
      { name: 'JD Analysis', usage: 890 },
      { name: 'Resume Builder', usage: 670 },
      { name: 'Job Tracker', usage: 450 }
    ];
  }
  
  async getFeatureUsageStats() {
    return {
      resumeAnalysis: 1250,
      jdAnalysis: 890,
      resumeBuilder: 670,
      jobTracker: 450
    };
  }
  
  async getCpuUsage() {
    const startUsage = process.cpuUsage();
    return new Promise(resolve => {
      setTimeout(() => {
        const endUsage = process.cpuUsage(startUsage);
        const usage = (endUsage.user + endUsage.system) / 1000000; // Convert to seconds
        resolve(Math.min(100, usage * 100)); // Convert to percentage, cap at 100%
      }, 100);
    });
  }
  
  // Refresh methods for periodic updates
  async refreshUserMetrics() {
    cache.del('dashboard_overview');
    cache.del('dashboard_users');
  }
  
  async refreshSystemMetrics() {
    // System metrics are refreshed by systemMonitoringService
  }
  
  async refreshApplicationMetrics() {
    cache.del('dashboard_application');
  }
  
  async refreshRevenueMetrics() {
    cache.del('dashboard_revenue');
  }
  
  async refreshFeatureUsageMetrics() {
    cache.del('dashboard_features');
  }
}

module.exports = new DeveloperDashboardService();
