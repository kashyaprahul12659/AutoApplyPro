const express = require('express');
const router = express.Router();
const { requireAuth } = require('@clerk/express');
const systemMonitoringController = require('../controllers/systemMonitoringController');
const { featureAccess } = require('../middleware/featureAccess');
const { apiLimiter } = require('../middleware/rateLimiter');

// Apply authentication to all monitoring routes
router.use(requireAuth());

// Apply rate limiting
router.use(apiLimiter);

// System monitoring routes (Enterprise only)
router.use(featureAccess('enterprise'));

// System overview
router.get('/overview', systemMonitoringController.getSystemOverview);

// Detailed system metrics
router.get('/metrics', systemMonitoringController.getSystemMetrics);

// Health status
router.get('/health', systemMonitoringController.getHealthStatus);

// System alerts
router.get('/alerts', systemMonitoringController.getSystemAlerts);

// Performance metrics
router.get('/performance', systemMonitoringController.getPerformanceMetrics);

// Resource usage
router.get('/resources', systemMonitoringController.getResourceUsage);

// Monitoring configuration
router.get('/config', systemMonitoringController.getMonitoringConfig);

module.exports = router;
