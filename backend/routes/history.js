const express = require('express');
const router = express.Router();
const { 
  createHistory, 
  getHistory, 
  getHistoryItem, 
  deleteHistory 
} = require('../controllers/historyController');
const clerkAuth = require('../middleware/clerkAuth');

// @route   POST /api/history
// @desc    Create new history entry
// @access  Private
router.post('/', clerkAuth, createHistory);

// @route   GET /api/history
// @desc    Get all user history entries
// @access  Private
router.get('/', clerkAuth, getHistory);

// @route   GET /api/history/:id
// @desc    Get single history entry
// @access  Private
router.get('/:id', clerkAuth, getHistoryItem);

// @route   DELETE /api/history/:id
// @desc    Delete history entry
// @access  Private
router.delete('/:id', clerkAuth, deleteHistory);

module.exports = router;
