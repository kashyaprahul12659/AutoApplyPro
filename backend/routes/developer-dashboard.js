const express = require('express');
const router = express.Router();
const { requireAuth } = require('@clerk/express');
const developerDashboardController = require('../controllers/developerDashboardController');
const { featureAccess } = require('../middleware/featureAccess');
const { apiLimiter } = require('../middleware/rateLimiter');

// Apply authentication to all dashboard routes
router.use(requireAuth());

// Apply rate limiting
router.use(apiLimiter);

// Developer dashboard routes (Enterprise only)
router.use(featureAccess('enterprise'));

// Complete dashboard data
router.get('/', developerDashboardController.getDashboard);

// Dashboard sections
router.get('/overview', developerDashboardController.getOverview);
router.get('/users', developerDashboardController.getUserMetrics);
router.get('/system', developerDashboardController.getSystemStatus);
router.get('/application', developerDashboardController.getApplicationMetrics);
router.get('/revenue', developerDashboardController.getRevenueMetrics);
router.get('/features', developerDashboardController.getFeatureMetrics);
router.get('/realtime', developerDashboardController.getRealTimeMetrics);
router.get('/alerts', developerDashboardController.getAlerts);

// Dashboard management
router.post('/refresh', developerDashboardController.refreshDashboard);
router.get('/config', developerDashboardController.getConfig);

module.exports = router;
