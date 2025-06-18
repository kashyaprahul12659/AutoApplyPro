const User = require('../models/User');
const logger = require('../utils/logger');
const cache = require('../utils/cache');

// @desc    Get user's AI credits and Pro status
// @route   GET /api/users/ai-status
// @access  Private
exports.getAIStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Try cache first
    const cacheKey = `user_ai_status_${userId}`;
    let userData = await cache.get(cacheKey);
    
    if (!userData) {
      const user = await User.findById(userId).select('aiCredits isProUser');
      
      if (!user) {
        logger.warn('User not found for AI status check', { userId });
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }
      
      userData = {
        aiCredits: user.aiCredits,
        isProUser: user.isProUser
      };
      
      // Cache for 5 minutes
      await cache.set(cacheKey, userData, 300);
    }
    
    logger.debug('AI status retrieved', { userId, credits: userData.aiCredits });
    
    res.json({
      success: true,
      data: userData
    });
  } catch (error) {
    logger.error('Get AI status error', { 
      error: error.message, 
      userId: req.user?.id 
    });
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  const { name, email } = req.body;

  try {
    const userId = req.user.id;
    
    logger.info('Profile update attempt', { userId, name, email });

    // Build user object
    const userFields = {};
    if (name) userFields.name = name;
    if (email) userFields.email = email;

    // Get current user
    let user = await User.findById(userId);

    if (!user) {
      logger.warn('User not found for profile update', { userId });
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // If user is updating email, check if it already exists
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        logger.warn('Profile update with existing email', { userId, email });
        return res.status(400).json({ 
          success: false,
          message: 'Email already in use by another account' 
        });
      }
    }

    // Update user
    user = await User.findByIdAndUpdate(
      userId,
      { $set: userFields },
      { new: true, runValidators: true }
    ).select('-password');

    // Clear relevant caches
    await Promise.all([
      cache.del(`user_profile_${userId}`),
      cache.del(`user_session_${userId}`),
      cache.del(`user_ai_status_${userId}`)
    ]);

    logger.info('Profile updated successfully', { userId, updatedFields: Object.keys(userFields) });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isProUser: user.isProUser,
        aiCredits: user.aiCredits
      }
    });
  } catch (error) {
    logger.error('Profile update error', { 
      error: error.message, 
      userId: req.user?.id 
    });
    next(error);
  }
};

// @desc    Update user password
// @route   PUT /api/users/password
// @access  Private
exports.updatePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const userId = req.user.id;
    
    logger.info('Password update attempt', { userId });

    // Get user with password field
    const user = await User.findById(userId).select('+password');

    if (!user) {
      logger.warn('User not found for password update', { userId });
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      logger.warn('Invalid current password for password update', { userId });
      return res.status(400).json({ 
        success: false,
        message: 'Current password is incorrect' 
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Clear user sessions/cache
    await Promise.all([
      cache.del(`user_profile_${userId}`),
      cache.del(`user_session_${userId}`)
    ]);

    logger.info('Password updated successfully', { userId });

    res.json({ 
      success: true,
      message: 'Password updated successfully' 
    });
  } catch (error) {
    logger.error('Password update error', { 
      error: error.message, 
      userId: req.user?.id 
    });
    next(error);
  }
};

// @desc    Upgrade user to Pro (temporary admin route)
// @route   POST /api/users/upgrade
// @access  Private
exports.upgradeUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    logger.info('User upgrade attempt', { userId });

    // Find user and toggle Pro status
    const user = await User.findById(userId);
    
    if (!user) {
      logger.warn('User not found for upgrade', { userId });
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Toggle isProUser status
    const wasProUser = user.isProUser;
    user.isProUser = !user.isProUser;
    await user.save();

    // Clear relevant caches
    await Promise.all([
      cache.del(`user_profile_${userId}`),
      cache.del(`user_session_${userId}`),
      cache.del(`user_ai_status_${userId}`)
    ]);

    logger.info('User upgrade status changed', { 
      userId, 
      wasProUser, 
      isProUser: user.isProUser 
    });
    
    res.json({
      success: true,
      data: {
        isProUser: user.isProUser,
        message: user.isProUser ? 'Upgraded to Pro successfully' : 'Downgraded from Pro'
      }
    });
  } catch (error) {
    logger.error('User upgrade error', { 
      error: error.message, 
      userId: req.user?.id 
    });
    next(error);
  }
};

// @desc    Get user data for extension
// @route   GET /api/users/data
// @access  Private
exports.getUserData = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Try cache first
    const cacheKey = `user_extension_data_${userId}`;
    let userData = await cache.get(cacheKey);
    
    if (!userData) {
      // Find the user but exclude sensitive information
      const user = await User.findById(userId)
        .select('name email isProUser aiCredits createdAt');
      
      if (!user) {
        logger.warn('User not found for extension data', { userId });
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }
      
      userData = {
        name: user.name,
        email: user.email,
        subscription: {
          status: user.isProUser ? 'active' : 'inactive',
          plan: user.isProUser ? 'pro' : 'free'
        },
        credits: user.aiCredits || 0,
        memberSince: user.createdAt
      };
      
      // Cache for 10 minutes
      await cache.set(cacheKey, userData, 600);
    }

    logger.debug('Extension user data retrieved', { userId });
    
    res.json({
      success: true,
      data: userData
    });
  } catch (error) {
    logger.error('Get user data error', { 
      error: error.message, 
      userId: req.user?.id 
    });
    next(error);
  }
};

// @desc    Add AI credits to user account (temporary admin route)
// @route   POST /api/users/add-credits
// @access  Private
exports.addAICredits = async (req, res, next) => {
  try {
    const { credits } = req.body;
    const userId = req.user.id;
    
    logger.info('Add AI credits attempt', { userId, credits });
    
    if (!credits || !Number.isInteger(credits) || credits <= 0) {
      logger.warn('Invalid credits amount', { userId, credits });
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid positive integer for credits'
      });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      logger.warn('User not found for add credits', { userId });
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    const previousCredits = user.aiCredits;
    user.aiCredits += credits;
    await user.save();

    // Clear relevant caches
    await Promise.all([
      cache.del(`user_ai_status_${userId}`),
      cache.del(`user_extension_data_${userId}`),
      cache.del(`user_profile_${userId}`)
    ]);

    logger.info('AI credits added successfully', { 
      userId, 
      creditsAdded: credits, 
      previousCredits, 
      newCredits: user.aiCredits 
    });
    
    res.json({
      success: true,
      data: {
        aiCredits: user.aiCredits,
        creditsAdded: credits,
        message: `Added ${credits} AI credits to your account`
      }
    });
  } catch (error) {
    logger.error('Add AI credits error', { 
      error: error.message, 
      userId: req.user?.id 
    });
    next(error);
  }
};
