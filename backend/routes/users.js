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
const clerkAuth = require('../middleware/clerkAuth');
const { validateProfileUpdate, validatePasswordUpdate } = require('../middleware/validation');
const rateLimiter = require('../middleware/rateLimiter');

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', clerkAuth, rateLimiter.general, validateProfileUpdate, updateProfile);

// @route   PUT /api/users/password
// @desc    Update user password
// @access  Private
router.put('/password', clerkAuth, rateLimiter.strict, validatePasswordUpdate, updatePassword);

// @route   GET /api/users/ai-status
// @desc    Get user's AI credits and Pro status
// @access  Private
router.get('/ai-status', clerkAuth, rateLimiter.general, getAIStatus);

// @route   POST /api/users/upgrade
// @desc    Upgrade user to Pro (temporary admin route)
// @access  Private
router.post('/upgrade', clerkAuth, rateLimiter.strict, upgradeUser);

// @route   POST /api/users/add-credits
// @desc    Add AI credits to user account (temporary admin route)
// @access  Private
router.post('/add-credits', clerkAuth, rateLimiter.strict, addAICredits);

// @route   GET /api/users/data
// @desc    Get user data for extension
// @access  Private
router.get('/data', clerkAuth, rateLimiter.general, getUserData);

module.exports = router;
