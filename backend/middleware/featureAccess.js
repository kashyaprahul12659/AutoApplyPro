const logger = require('../utils/logger');
const User = require('../models/User');

/**
 * Advanced Access Control Middleware
 * Manages user permissions based on subscription plans and feature access
 */

// Feature access levels
const FEATURE_LEVELS = {
  FREE: 'free',
  PRO: 'pro',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise'
};

// Feature definitions with required access levels
const FEATURES = {
  // Basic features (available to all)
  BASIC_RESUME_UPLOAD: { level: FEATURE_LEVELS.FREE, limit: 3 },
  BASIC_JOB_SEARCH: { level: FEATURE_LEVELS.FREE, limit: 10 },
  BASIC_PROFILE: { level: FEATURE_LEVELS.FREE, limit: 1 },
  
  // Pro features
  UNLIMITED_RESUME_UPLOAD: { level: FEATURE_LEVELS.PRO, limit: -1 },
  AI_COVER_LETTER: { level: FEATURE_LEVELS.PRO, limit: 50 },
  ADVANCED_JOB_SEARCH: { level: FEATURE_LEVELS.PRO, limit: 100 },
  PRIORITY_SUPPORT: { level: FEATURE_LEVELS.PRO, limit: -1 },
  
  // Premium features
  AI_RESUME_OPTIMIZATION: { level: FEATURE_LEVELS.PREMIUM, limit: 200 },
  BULK_APPLICATIONS: { level: FEATURE_LEVELS.PREMIUM, limit: 500 },
  ADVANCED_ANALYTICS: { level: FEATURE_LEVELS.PREMIUM, limit: -1 },
  WHITE_LABEL_REPORTS: { level: FEATURE_LEVELS.PREMIUM, limit: 50 },
  
  // Enterprise features
  API_ACCESS: { level: FEATURE_LEVELS.ENTERPRISE, limit: -1 },
  CUSTOM_INTEGRATIONS: { level: FEATURE_LEVELS.ENTERPRISE, limit: -1 },
  DEDICATED_SUPPORT: { level: FEATURE_LEVELS.ENTERPRISE, limit: -1 },
  CUSTOM_BRANDING: { level: FEATURE_LEVELS.ENTERPRISE, limit: -1 }
};

// User plan hierarchy
const PLAN_HIERARCHY = {
  [FEATURE_LEVELS.FREE]: 0,
  [FEATURE_LEVELS.PRO]: 1,
  [FEATURE_LEVELS.PREMIUM]: 2,
  [FEATURE_LEVELS.ENTERPRISE]: 3
};

/**
 * Check if user has access to a specific feature
 */
const hasFeatureAccess = (userPlan, featureName) => {
  const feature = FEATURES[featureName];
  if (!feature) {
    logger.warn('Unknown feature requested', { featureName });
    return false;
  }
  
  const userLevel = PLAN_HIERARCHY[userPlan] || 0;
  const requiredLevel = PLAN_HIERARCHY[feature.level] || 0;
  
  return userLevel >= requiredLevel;
};

/**
 * Get user's current usage for a feature
 */
const getFeatureUsage = async (userId, featureName) => {
  try {
    // This would typically query a usage tracking collection
    // For now, we'll simulate with user document
    const user = await User.findById(userId);
    if (!user) return 0;
    
    const usage = user.featureUsage || {};
    return usage[featureName] || 0;
  } catch (error) {
    logger.error('Error getting feature usage', { error: error.message, userId, featureName });
    return 0;
  }
};

/**
 * Check if user has remaining quota for a feature
 */
const hasQuotaRemaining = async (userId, featureName) => {
  const feature = FEATURES[featureName];
  if (!feature || feature.limit === -1) return true; // Unlimited
  
  const currentUsage = await getFeatureUsage(userId, featureName);
  return currentUsage < feature.limit;
};

/**
 * Increment feature usage
 */
const incrementFeatureUsage = async (userId, featureName, increment = 1) => {
  try {
    await User.findByIdAndUpdate(
      userId,
      { 
        $inc: { [`featureUsage.${featureName}`]: increment },
        $set: { [`featureUsage.${featureName}_lastUsed`]: new Date() }
      },
      { upsert: true }
    );
    
    logger.info('Feature usage incremented', { userId, featureName, increment });
  } catch (error) {
    logger.error('Error incrementing feature usage', { error: error.message, userId, featureName });
  }
};

/**
 * Middleware to check feature access
 */
const requireFeatureAccess = (featureName) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const userPlan = user.subscriptionPlan || FEATURE_LEVELS.FREE;
      
      // Check feature access
      if (!hasFeatureAccess(userPlan, featureName)) {
        logger.warn('Feature access denied', { userId, featureName, userPlan });
        return res.status(403).json({
          success: false,
          message: 'This feature requires a higher subscription plan',
          requiredPlan: FEATURES[featureName].level,
          currentPlan: userPlan,
          upgradeUrl: '/upgrade'
        });
      }

      // Check quota
      const hasQuota = await hasQuotaRemaining(userId, featureName);
      if (!hasQuota) {
        logger.warn('Feature quota exceeded', { userId, featureName, userPlan });
        return res.status(429).json({
          success: false,
          message: 'Feature usage limit exceeded for your current plan',
          feature: featureName,
          limit: FEATURES[featureName].limit,
          upgradeUrl: '/upgrade'
        });
      }

      // Add feature info to request
      req.feature = {
        name: featureName,
        limit: FEATURES[featureName].limit,
        currentUsage: await getFeatureUsage(userId, featureName)
      };

      next();
    } catch (error) {
      logger.error('Feature access check error', { error: error.message, featureName });
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
};

/**
 * Middleware to track feature usage
 */
const trackFeatureUsage = (featureName, increment = 1) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Only increment usage on successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        incrementFeatureUsage(req.user?.id, featureName, increment);
      }
      originalSend.call(this, data);
    };
    
    next();
  };
};

/**
 * Get user's feature access summary
 */
const getUserFeatureAccess = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    const userPlan = user.subscriptionPlan || FEATURE_LEVELS.FREE;
    const featureAccess = {};

    for (const [featureName, feature] of Object.entries(FEATURES)) {
      const hasAccess = hasFeatureAccess(userPlan, featureName);
      const currentUsage = await getFeatureUsage(userId, featureName);
      
      featureAccess[featureName] = {
        hasAccess,
        limit: feature.limit,
        currentUsage,
        remaining: feature.limit === -1 ? -1 : Math.max(0, feature.limit - currentUsage),
        requiredPlan: feature.level
      };
    }

    return {
      currentPlan: userPlan,
      features: featureAccess
    };
  } catch (error) {
    logger.error('Error getting user feature access', { error: error.message, userId });
    return null;
  }
};

module.exports = {
  FEATURE_LEVELS,
  FEATURES,
  hasFeatureAccess,
  hasQuotaRemaining,
  requireFeatureAccess,
  trackFeatureUsage,
  getUserFeatureAccess,
  incrementFeatureUsage,
  getFeatureUsage
};
