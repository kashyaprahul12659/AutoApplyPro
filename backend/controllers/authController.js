const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');
const cache = require('../utils/cache');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    logger.info('User registration attempt', { email, name });

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      logger.warn('Registration attempt with existing email', { email });
      return res.status(400).json({ 
        success: false,
        message: 'User already exists with this email address'
      });
    }

    // Create new user
    user = new User({
      name,
      email,
      password
    });

    // Save user to database
    await user.save();

    logger.info('User registered successfully', { 
      userId: user._id, 
      email: user.email 
    });

    // Create JWT payload
    const payload = {
      user: {
        id: user.id
      }
    };

    // Sign and return JWT
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );

    // Cache user session
    await cache.set(`user_session_${user._id}`, {
      userId: user._id,
      email: user.email,
      name: user.name
    }, 86400); // 24 hours

    res.status(201).json({ 
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isProUser: user.isProUser,
        aiCredits: user.aiCredits
      }
    });
  } catch (error) {
    logger.error('Registration error', { error: error.message, email });
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    logger.info('User login attempt', { email });

    // Check if user exists
    const user = await User.findOne({ email }).select('+password +loginAttempts +lockUntil');

    if (!user) {
      logger.warn('Login attempt with non-existent email', { email });
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      logger.warn('Login attempt on locked account', { email, userId: user._id });
      return res.status(423).json({
        success: false,
        message: 'Account temporarily locked due to too many failed login attempts. Please try again later.'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      logger.warn('Failed login attempt - invalid password', { email, userId: user._id });
      
      // Increment failed attempts
      await user.incLoginAttempts();
      
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Reset failed attempts on successful login
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    logger.info('User logged in successfully', { 
      userId: user._id, 
      email: user.email 
    });

    // Create JWT payload
    const payload = {
      user: {
        id: user.id
      }
    };

    // Sign and return JWT
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );

    // Cache user session
    await cache.set(`user_session_${user._id}`, {
      userId: user._id,
      email: user.email,
      name: user.name
    }, 86400); // 24 hours

    res.json({ 
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isProUser: user.isProUser,
        aiCredits: user.aiCredits
      }
    });
  } catch (error) {
    logger.error('Login error', { error: error.message, email });
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Try to get user from cache first
    const cacheKey = `user_profile_${userId}`;
    let user = await cache.get(cacheKey);
    
    if (!user) {
      // Fetch from database if not in cache
      user = await User.findById(userId).select('-password');
      
      if (!user) {
        logger.warn('User not found for valid token', { userId });
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Cache user profile for 30 minutes
      await cache.set(cacheKey, user, 1800);
    }

    logger.debug('User profile retrieved', { userId });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isProUser: user.isProUser,
        aiCredits: user.aiCredits,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    logger.error('Get user profile error', { 
      error: error.message, 
      userId: req.user?.id 
    });
    next(error);
  }
};
