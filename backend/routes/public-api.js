const express = require('express');
const router = express.Router();
const { apiKeyAuth, apiKeyRateLimit, requireApiFeature } = require('../middleware/apiKeyAuth');
const publicApiController = require('../controllers/publicApiController');

// Apply API key authentication and rate limiting to all routes
router.use(apiKeyAuth);
router.use(apiKeyRateLimit);

// API versioning
const v1Router = express.Router();

// Resume analysis endpoints
v1Router.post('/resumes/analyze', requireApiFeature('resumeAnalysis'), publicApiController.analyzeResume);
v1Router.post('/resumes/score', requireApiFeature('resumeAnalysis'), publicApiController.scoreResume);

// Job description analysis endpoints
v1Router.post('/jd/analyze', requireApiFeature('jdAnalysis'), publicApiController.analyzeJobDescription);
v1Router.post('/jd/match', requireApiFeature('jdAnalysis'), publicApiController.matchResumeToJob);

// Profile endpoints
v1Router.get('/profile', publicApiController.getProfile);
v1Router.put('/profile', publicApiController.updateProfile);

// Analytics endpoints (premium feature)
v1Router.get('/analytics/usage', requireApiFeature('advancedAnalytics'), publicApiController.getUsageAnalytics);
v1Router.get('/analytics/insights', requireApiFeature('advancedAnalytics'), publicApiController.getInsights);

// Resume building endpoints
v1Router.post('/resume-builder/generate', requireApiFeature('resumeBuilds'), publicApiController.generateResume);
v1Router.post('/resume-builder/optimize', requireApiFeature('resumeBuilds'), publicApiController.optimizeResume);

// Batch processing endpoints (enterprise feature)
v1Router.post('/batch/resumes/analyze', requireApiFeature('batchProcessing'), publicApiController.batchAnalyzeResumes);
v1Router.get('/batch/status/:batchId', requireApiFeature('batchProcessing'), publicApiController.getBatchStatus);

// Webhooks test endpoint
v1Router.post('/webhooks/test', requireApiFeature('webhooks'), publicApiController.testWebhook);

// Mount v1 routes
router.use('/v1', v1Router);

// API info endpoint (no additional auth required beyond API key)
router.get('/info', publicApiController.getApiInfo);

module.exports = router;
