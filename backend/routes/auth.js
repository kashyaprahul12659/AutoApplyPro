const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const clerkAuth = require('../middleware/clerkAuth');

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', clerkAuth, getMe);

module.exports = router;
