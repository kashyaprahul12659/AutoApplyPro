const express = require('express');
const router = express.Router();
const { requireAuth } = require('@clerk/express');
const webhookController = require('../controllers/webhookController');
const { featureAccess } = require('../middleware/featureAccess');
const { apiLimiter } = require('../middleware/rateLimiter');

// Apply authentication to all webhook routes
router.use(requireAuth());

// Apply rate limiting
router.use(apiLimiter);

// Webhook management routes (Pro+ feature)
router.use(featureAccess('webhooks'));

// Get user's webhook configuration
router.get('/config', webhookController.getWebhookConfig);

// Update webhook configuration
router.put('/config', webhookController.updateWebhookConfig);

// Test webhook endpoint
router.post('/test', webhookController.testWebhook);

// Get webhook logs
router.get('/logs', webhookController.getWebhookLogs);

// Regenerate webhook secret
router.post('/regenerate-secret', webhookController.regenerateWebhookSecret);

// Get webhook events documentation
router.get('/events', webhookController.getWebhookEvents);

module.exports = router;
