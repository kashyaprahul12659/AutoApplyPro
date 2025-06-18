const express = require('express');
const router = express.Router();
const { requireAuth } = require('@clerk/express');
const apiController = require('../controllers/apiController');
const { featureAccess } = require('../middleware/featureAccess');
const { apiLimiter } = require('../middleware/rateLimiter');

// Apply authentication to all API management routes
router.use(requireAuth());

// Apply rate limiting
router.use(apiLimiter);

// API key management routes (Basic+ feature)
router.use(featureAccess('apiCalls'));

// Get API key information
router.get('/key', apiController.getApiKey);

// Generate new API key
router.post('/key/generate', apiController.generateApiKey);

// Regenerate API key
router.post('/key/regenerate', apiController.regenerateApiKey);

// Revoke API key
router.delete('/key', apiController.revokeApiKey);

// Get API usage statistics
router.get('/usage', apiController.getApiUsage);

// Get rate limit information
router.get('/limits', apiController.getRateLimits);

// API documentation endpoints
router.get('/docs/endpoints', apiController.getApiEndpoints);
router.get('/docs/examples', apiController.getApiExamples);

module.exports = router;
