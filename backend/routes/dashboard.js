const express = require('express');
const router = express.Router();
const { requireAuth } = require('@clerk/express');
const dashboardController = require('../controllers/dashboardController');
const { apiLimiter } = require('../middleware/rateLimiter');

// Apply authentication to all dashboard routes
router.use(requireAuth());

// Apply rate limiting
router.use(apiLimiter);

// Dashboard Routes
router.get('/', dashboardController.getDashboard);
router.get('/activity', dashboardController.getRecentActivity);
router.post('/refresh', dashboardController.refreshDashboard);

module.exports = router;
