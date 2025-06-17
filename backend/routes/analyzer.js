const express = require('express');
const router = express.Router();
const { 
  analyzeJobDescription, 
  getAnalyzerHistory,
  getAnalyzerHistoryItem,
  deleteAnalyzerHistoryItem 
} = require('../controllers/analyzerController');
const clerkAuth = require('../middleware/clerkAuth');

// @route   POST /api/ai/analyze-jd
// @desc    Analyze job description against user profile
// @access  Private
router.post('/analyze-jd', clerkAuth, analyzeJobDescription);

// @route   GET /api/ai/analyzer-history
// @desc    Get all analyzer history entries for a user
// @access  Private
router.get('/analyzer-history', clerkAuth, getAnalyzerHistory);

// @route   GET /api/ai/analyzer-history/:id
// @desc    Get a single analyzer history entry
// @access  Private
router.get('/analyzer-history/:id', clerkAuth, getAnalyzerHistoryItem);

// @route   DELETE /api/ai/analyzer-history/:id
// @desc    Delete an analyzer history entry
// @access  Private
router.delete('/analyzer-history/:id', clerkAuth, deleteAnalyzerHistoryItem);

module.exports = router;
