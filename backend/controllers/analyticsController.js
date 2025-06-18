const { analyticsService, ACTIVITY_TYPES } = require('../services/analyticsService');
const { getUserFeatureAccess } = require('../middleware/featureAccess');
const logger = require('../utils/logger');
const cache = require('../utils/cache');

/**
 * Analytics Controller
 * Handles analytics and insights endpoints for users and admins
 */

// @desc    Get user's personal analytics
// @route   GET /api/analytics/user
// @access  Private
exports.getUserAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { timeRange = '30d' } = req.query;

    logger.info('User analytics requested', { userId, timeRange });

    const analytics = await analyticsService.getUserAnalytics(userId, timeRange);
    
    if (!analytics) {
      return res.status(404).json({
        success: false,
        message: 'Analytics data not found'
      });
    }

    // Track this activity
    await analyticsService.trackActivity(userId, ACTIVITY_TYPES.PAGE_VIEW, {
      page: 'analytics',
      timeRange,
      userAgent: req.get('User-Agent'),
      ipAddress: req.ip
    });

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    logger.error('Get user analytics error', { 
      error: error.message, 
      userId: req.user?.id 
    });
    next(error);
  }
};

// @desc    Get user's feature access and usage
// @route   GET /api/analytics/features
// @access  Private
exports.getFeatureAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;

    logger.info('Feature analytics requested', { userId });

    const featureAccess = await getUserFeatureAccess(userId);
    
    if (!featureAccess) {
      return res.status(404).json({
        success: false,
        message: 'Feature access data not found'
      });
    }

    res.json({
      success: true,
      data: featureAccess
    });
  } catch (error) {
    logger.error('Get feature analytics error', { 
      error: error.message, 
      userId: req.user?.id 
    });
    next(error);
  }
};

// @desc    Get application-wide analytics (Admin only)
// @route   GET /api/analytics/application
// @access  Private (Admin)
exports.getApplicationAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { timeRange = '30d' } = req.query;

    // Check if user is admin (you might want to implement proper admin middleware)
    const user = await User.findById(userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    logger.info('Application analytics requested', { userId, timeRange });

    const analytics = await analyticsService.getApplicationAnalytics(timeRange);
    
    if (!analytics) {
      return res.status(500).json({
        success: false,
        message: 'Unable to retrieve analytics data'
      });
    }

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    logger.error('Get application analytics error', { 
      error: error.message, 
      userId: req.user?.id 
    });
    next(error);
  }
};

// @desc    Get real-time metrics (Admin only)
// @route   GET /api/analytics/realtime
// @access  Private (Admin)
exports.getRealTimeMetrics = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Check if user is admin
    const user = await User.findById(userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    logger.info('Real-time metrics requested', { userId });

    const metrics = analyticsService.getRealTimeMetrics();

    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    logger.error('Get real-time metrics error', { 
      error: error.message, 
      userId: req.user?.id 
    });
    next(error);
  }
};

// @desc    Track custom activity
// @route   POST /api/analytics/track
// @access  Private
exports.trackActivity = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { activityType, metadata = {} } = req.body;

    if (!activityType) {
      return res.status(400).json({
        success: false,
        message: 'Activity type is required'
      });
    }

    // Add request metadata
    const enrichedMetadata = {
      ...metadata,
      userAgent: req.get('User-Agent'),
      ipAddress: req.ip,
      timestamp: new Date()
    };

    await analyticsService.trackActivity(userId, activityType, enrichedMetadata);

    logger.debug('Activity tracked via API', { userId, activityType });

    res.json({
      success: true,
      message: 'Activity tracked successfully'
    });
  } catch (error) {
    logger.error('Track activity error', { 
      error: error.message, 
      userId: req.user?.id 
    });
    next(error);
  }
};

// @desc    Get analytics insights
// @route   GET /api/analytics/insights
// @access  Private
exports.getAnalyticsInsights = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { timeRange = '30d' } = req.query;

    logger.info('Analytics insights requested', { userId, timeRange });

    // Get user analytics
    const analytics = await analyticsService.getUserAnalytics(userId, timeRange);
    
    if (!analytics) {
      return res.status(404).json({
        success: false,
        message: 'Analytics data not found'
      });
    }

    // Generate insights based on analytics data
    const insights = generateInsights(analytics);

    res.json({
      success: true,
      data: {
        analytics,
        insights
      }
    });
  } catch (error) {
    logger.error('Get analytics insights error', { 
      error: error.message, 
      userId: req.user?.id 
    });
    next(error);
  }
};

// @desc    Export analytics data
// @route   GET /api/analytics/export
// @access  Private
exports.exportAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { timeRange = '30d', format = 'json' } = req.query;

    logger.info('Analytics export requested', { userId, timeRange, format });

    const analytics = await analyticsService.getUserAnalytics(userId, timeRange);
    
    if (!analytics) {
      return res.status(404).json({
        success: false,
        message: 'Analytics data not found'
      });
    }

    // Track export activity
    await analyticsService.trackActivity(userId, ACTIVITY_TYPES.DOWNLOAD, {
      type: 'analytics_export',
      format,
      timeRange,
      userAgent: req.get('User-Agent'),
      ipAddress: req.ip
    });

    if (format === 'csv') {
      // Convert to CSV format
      const csv = convertToCSV(analytics);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="analytics_${timeRange}.csv"`);
      res.send(csv);
    } else {
      // Default JSON format
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="analytics_${timeRange}.json"`);
      res.json({
        success: true,
        data: analytics,
        exportedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    logger.error('Export analytics error', { 
      error: error.message, 
      userId: req.user?.id 
    });
    next(error);
  }
};

/**
 * Helper Functions
 */

function generateInsights(analytics) {
  const insights = [];

  // Activity level insights
  if (analytics.totalActivities < 10) {
    insights.push({
      type: 'engagement',
      level: 'low',
      title: 'Increase Your Activity',
      message: 'Try exploring more features to get better results from AutoApplyPro.',
      recommendation: 'Upload your resume and try generating a cover letter.',
      actionUrl: '/dashboard'
    });
  } else if (analytics.totalActivities > 50) {
    insights.push({
      type: 'engagement',
      level: 'high',
      title: 'Great Activity Level!',
      message: 'You\'re making great use of AutoApplyPro features.',
      recommendation: 'Consider upgrading to Pro for unlimited access.',
      actionUrl: '/upgrade'
    });
  }

  // Success rate insights
  if (analytics.performanceMetrics.successRate < 20) {
    insights.push({
      type: 'performance',
      level: 'warning',
      title: 'Improve Your Success Rate',
      message: 'Your application success rate could be improved.',
      recommendation: 'Try using our AI resume optimization feature.',
      actionUrl: '/resume-builder'
    });
  }

  // Feature usage insights
  const unusedFeatures = Object.entries(analytics.featureUsage)
    .filter(([, usage]) => usage === 0)
    .map(([feature]) => feature);

  if (unusedFeatures.length > 0) {
    insights.push({
      type: 'features',
      level: 'info',
      title: 'Discover New Features',
      message: `You haven't tried ${unusedFeatures.length} available features yet.`,
      recommendation: 'Explore AI cover letter generation and job analysis.',
      actionUrl: '/features'
    });
  }

  // Engagement insights
  if (analytics.engagementScore < 50) {
    insights.push({
      type: 'engagement',
      level: 'warning',
      title: 'Boost Your Engagement',
      message: 'Regular use of AutoApplyPro leads to better job search results.',
      recommendation: 'Set aside time daily to work on applications.',
      actionUrl: '/dashboard'
    });
  }

  return insights;
}

function convertToCSV(analytics) {
  const csvRows = [];
  
  // Add headers
  csvRows.push('Metric,Value');
  
  // Add basic metrics
  csvRows.push(`Total Activities,${analytics.totalActivities}`);
  csvRows.push(`Engagement Score,${analytics.engagementScore}`);
  csvRows.push(`Most Active Day,${analytics.mostActiveDay}`);
  csvRows.push(`Average Session Duration,${analytics.averageSessionDuration} minutes`);
  
  // Add activity breakdown
  csvRows.push(''); // Empty row
  csvRows.push('Activity Type,Count');
  Object.entries(analytics.activityBreakdown).forEach(([type, count]) => {
    csvRows.push(`${type},${count}`);
  });
  
  // Add daily activity
  csvRows.push(''); // Empty row
  csvRows.push('Date,Activities');
  Object.entries(analytics.dailyActivity).forEach(([date, count]) => {
    csvRows.push(`${date},${count}`);
  });
  
  return csvRows.join('\n');
}

module.exports = {
  getUserAnalytics,
  getFeatureAnalytics,
  getApplicationAnalytics,
  getRealTimeMetrics,
  trackActivity,
  getAnalyticsInsights,
  exportAnalytics
};
