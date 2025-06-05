const express = require('express');
const router = express.Router();
const { 
  analyzeJobDescription, 
  getAnalyzerHistory,
  getAnalyzerHistoryItem,
  deleteAnalyzerHistoryItem 
} = require('../controllers/analyzerController');
const auth = require('../middleware/auth');

// @route   POST /api/ai/analyze-jd
// @desc    Analyze job description against user profile
// @access  Private
router.post('/analyze-jd', auth, analyzeJobDescription);

// @route   GET /api/ai/analyzer-history
// @desc    Get all analyzer history entries for a user
// @access  Private
router.get('/analyzer-history', auth, getAnalyzerHistory);

// @route   GET /api/ai/analyzer-history/:id
// @desc    Get a single analyzer history entry
// @access  Private
router.get('/analyzer-history/:id', auth, getAnalyzerHistoryItem);

// @route   DELETE /api/ai/analyzer-history/:id
// @desc    Delete an analyzer history entry
// @access  Private
router.delete('/analyzer-history/:id', auth, deleteAnalyzerHistoryItem);

module.exports = router;
