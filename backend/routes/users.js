const express = require('express');
const router = express.Router();
const { 
  updateProfile, 
  updatePassword,
  getAIStatus,
  upgradeUser,
  addAICredits,
  getUserData
} = require('../controllers/userController');
const auth = require('../middleware/auth');

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, updateProfile);

// @route   PUT /api/users/password
// @desc    Update user password
// @access  Private
router.put('/password', auth, updatePassword);

// @route   GET /api/users/ai-status
// @desc    Get user's AI credits and Pro status
// @access  Private
router.get('/ai-status', auth, getAIStatus);

// @route   POST /api/users/upgrade
// @desc    Upgrade user to Pro (temporary admin route)
// @access  Private
router.post('/upgrade', auth, upgradeUser);

// @route   POST /api/users/add-credits
// @desc    Add AI credits to user account (temporary admin route)
// @access  Private
router.post('/add-credits', auth, addAICredits);

// @route   GET /api/users/data
// @desc    Get user data for extension
// @access  Private
router.get('/data', auth, getUserData);

module.exports = router;
