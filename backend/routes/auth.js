const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const clerkAuth = require('../middleware/clerkAuth');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const rateLimiter = require('../middleware/rateLimiter');

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', rateLimiter.auth, validateRegistration, register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', rateLimiter.auth, validateLogin, login);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', clerkAuth, getMe);

module.exports = router;
