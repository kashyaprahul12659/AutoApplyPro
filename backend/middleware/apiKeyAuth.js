const User = require('../models/User');
const { logger } = require('../utils/logger');
const { cache } = require('../utils/cache');

// API Key Authentication Middleware
const apiKeyAuth = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
    
    if (!apiKey) {
      return res.status(401).json({
        success: false,
        error: 'API key required',
        message: 'Please provide an API key in the X-API-Key header'
      });
    }
    
    // Check if API key is valid format
    if (!apiKey.startsWith('aap_')) {
      return res.status(401).json({
        success: false,
        error: 'Invalid API key format',
        message: 'API key must start with "aap_"'
      });
    }
    
    // Try to get user from cache first
    const cacheKey = `api_key:${apiKey}`;
    let user = cache.get(cacheKey);
    
    if (!user) {
      // Find user by API key
      user = await User.findOne({
        'apiAccess.apiKey': apiKey,
        'apiAccess.enabled': true
      }).select('+apiAccess.apiKey');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid API key',
          message: 'The provided API key is invalid or has been revoked'
        });
      }
      
      // Cache user for 5 minutes
      cache.set(cacheKey, user, 300);
    }
    
    // Check if user's subscription allows API access
    const hasApiAccess = user.hasFeatureAccess('apiCalls');
    if (!hasApiAccess) {
      return res.status(403).json({
        success: false,
        error: 'API access not allowed',
        message: 'Your current plan does not include API access. Please upgrade your subscription.'
      });
    }
    
    // Attach user to request
    req.user = user;
    req.apiKey = apiKey;
    
    // Track API usage
    await user.incrementFeatureUsage('apiCalls');
    
    next();
    
  } catch (error) {
    logger.error('API key authentication error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication failed',
      message: 'Unable to authenticate API key'
    });
  }
};

// Rate limiting middleware for API keys
const apiKeyRateLimit = (req, res, next) => {
  const user = req.user;
  const tier = user.apiAccess?.rateLimitTier || 'basic';
  
  // This is a simplified rate limiting implementation
  // In production, you'd want to use Redis or a proper rate limiting service
  const rateLimits = {
    basic: { perMinute: 10, perHour: 100 },
    premium: { perMinute: 50, perHour: 1000 },
    enterprise: { perMinute: 200, perHour: 5000 }
  };
  
  const limits = rateLimits[tier];
  
  // Add rate limit headers
  res.set({
    'X-RateLimit-Tier': tier,
    'X-RateLimit-Limit-Minute': limits.perMinute,
    'X-RateLimit-Limit-Hour': limits.perHour,
    'X-RateLimit-Remaining-Minute': Math.max(0, limits.perMinute - 1), // Simplified
    'X-RateLimit-Remaining-Hour': Math.max(0, limits.perHour - 1) // Simplified
  });
  
  next();
};

// Middleware to check specific API feature access
const requireApiFeature = (feature) => {
  return (req, res, next) => {
    const user = req.user;
    
    if (!user.hasFeatureAccess(feature)) {
      return res.status(403).json({
        success: false,
        error: 'Feature not available',
        message: `This feature is not available in your current plan. Please upgrade to access ${feature}.`
      });
    }
    
    next();
  };
};

module.exports = {
  apiKeyAuth,
  apiKeyRateLimit,
  requireApiFeature
};
