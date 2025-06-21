const express = require('express');
const router = express.Router();
const { requireAuth } = require('@clerk/express');
const notificationController = require('../controllers/notificationController');
const { apiLimiter } = require('../middleware/rateLimiter');

// Apply authentication to all notification routes
router.use(requireAuth());

// Apply rate limiting
router.use(apiLimiter);

// Get user's notifications
router.get('/', notificationController.getUserNotifications);

// Get unread notification count
router.get('/unread-count', notificationController.getUnreadCount);

// Mark notification as read
router.put('/:notificationId/read', notificationController.markAsRead);

// Mark all notifications as read
router.put('/mark-all-read', notificationController.markAllAsRead);

// Delete notification
router.delete('/:notificationId', notificationController.deleteNotification);

// Update notification preferences
router.put('/preferences', notificationController.updatePreferences);

// Get notification preferences
router.get('/preferences', notificationController.getPreferences);

// Send test notification (for testing purposes)
router.post('/test', notificationController.sendTestNotification);

// Subscribe to push notifications
router.post('/push/subscribe', notificationController.subscribeToPush);

// Unsubscribe from push notifications
router.post('/push/unsubscribe', notificationController.unsubscribeFromPush);

module.exports = router;
