const express = require('express');
const router = express.Router();
const { requireAuth } = require('@clerk/express');
const analyticsController = require('../controllers/analyticsController');
const { featureAccess } = require('../middleware/featureAccess');
const { apiLimiter } = require('../middleware/rateLimiter');

// Apply authentication to all analytics routes
router.use(requireAuth());

// Apply rate limiting
router.use(apiLimiter);

// User Analytics Routes
router.get('/user/overview', analyticsController.getUserAnalytics);
router.get('/user/usage', analyticsController.getUserUsage);
router.get('/user/engagement', analyticsController.getUserEngagement);
router.post('/user/activity', analyticsController.trackUserActivity);

// Feature Analytics Routes (Pro+ feature)
router.get('/features/usage', featureAccess('advancedAnalytics'), analyticsController.getFeatureAnalytics);
router.get('/features/trends', featureAccess('advancedAnalytics'), analyticsController.getFeatureTrends);

// Real-time Metrics (Pro+ feature)
router.get('/realtime/metrics', featureAccess('advancedAnalytics'), analyticsController.getRealTimeMetrics);
router.get('/realtime/activity', featureAccess('advancedAnalytics'), analyticsController.getRealTimeActivity);

// Insights and Reports (Pro+ feature)
router.get('/insights/dashboard', featureAccess('advancedAnalytics'), analyticsController.getInsights);
router.get('/insights/recommendations', featureAccess('advancedAnalytics'), analyticsController.getRecommendations);

// Export Analytics Data (Pro+ feature)
router.get('/export/csv', featureAccess('advancedAnalytics'), analyticsController.exportAnalytics);
router.get('/export/pdf', featureAccess('advancedAnalytics'), analyticsController.exportAnalyticsPDF);

// Admin Analytics Routes (Enterprise only)
router.get('/admin/overview', featureAccess('enterprise'), analyticsController.getApplicationAnalytics);
router.get('/admin/users', featureAccess('enterprise'), analyticsController.getUserMetrics);
router.get('/admin/features', featureAccess('enterprise'), analyticsController.getFeatureMetrics);
router.get('/admin/performance', featureAccess('enterprise'), analyticsController.getPerformanceMetrics);

module.exports = router;
