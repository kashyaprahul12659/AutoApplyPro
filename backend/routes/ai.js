const express = require('express');
const router = express.Router();
const { 
  generateCoverLetter, 
  getCoverLetters, 
  getCoverLetter, 
  updateCoverLetter, 
  deleteCoverLetter 
} = require('../controllers/aiController');
const { 
  analyzeJobDescription, 
  getAnalyzerHistory, 
  getAnalyzerHistoryItem, 
  deleteAnalyzerHistoryItem 
} = require('../controllers/analyzerController');
const clerkAuth = require('../middleware/clerkAuth');
const rateLimiter = require('../middleware/rateLimiter');
const { sanitizeInput } = require('../middleware/validation');

// @route   POST /api/ai/cover-letter
// @desc    Generate a cover letter
// @access  Private
router.post('/cover-letter', clerkAuth, rateLimiter.ai, sanitizeInput, generateCoverLetter);

// @route   GET /api/ai/cover-letters
// @desc    Get all user's cover letters
// @access  Private
router.get('/cover-letters', clerkAuth, rateLimiter.general, getCoverLetters);

// @route   GET /api/ai/cover-letters/:id
// @desc    Get a single cover letter
// @access  Private
router.get('/cover-letters/:id', clerkAuth, rateLimiter.general, getCoverLetter);

// @route   PUT /api/ai/cover-letters/:id
// @desc    Update a cover letter
// @access  Private
router.put('/cover-letters/:id', clerkAuth, rateLimiter.general, sanitizeInput, updateCoverLetter);

// @route   DELETE /api/ai/cover-letters/:id
// @desc    Delete a cover letter
// @access  Private
router.delete('/cover-letters/:id', clerkAuth, rateLimiter.general, deleteCoverLetter);

// @route   POST /api/ai/analyze-jd
// @desc    Analyze job description against user profile
// @access  Private
router.post('/analyze-jd', clerkAuth, rateLimiter.ai, sanitizeInput, analyzeJobDescription);

// @route   GET /api/ai/analyzer-history
// @desc    Get all analyzer history entries for a user
// @access  Private
router.get('/analyzer-history', clerkAuth, rateLimiter.general, getAnalyzerHistory);

// @route   GET /api/ai/analyzer-history/:id
// @desc    Get a single analyzer history entry
// @access  Private
router.get('/analyzer-history/:id', clerkAuth, rateLimiter.general, getAnalyzerHistoryItem);

// @route   DELETE /api/ai/analyzer-history/:id
// @desc    Delete an analyzer history entry
// @access  Private
router.delete('/analyzer-history/:id', clerkAuth, rateLimiter.general, deleteAnalyzerHistoryItem);

module.exports = router;
