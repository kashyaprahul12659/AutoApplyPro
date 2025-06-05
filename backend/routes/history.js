const express = require('express');
const router = express.Router();
const { 
  createHistory, 
  getHistory, 
  getHistoryItem, 
  deleteHistory 
} = require('../controllers/historyController');
const auth = require('../middleware/auth');

// @route   POST /api/history
// @desc    Create new history entry
// @access  Private
router.post('/', auth, createHistory);

// @route   GET /api/history
// @desc    Get all user history entries
// @access  Private
router.get('/', auth, getHistory);

// @route   GET /api/history/:id
// @desc    Get single history entry
// @access  Private
router.get('/:id', auth, getHistoryItem);

// @route   DELETE /api/history/:id
// @desc    Delete history entry
// @access  Private
router.delete('/:id', auth, deleteHistory);

module.exports = router;
