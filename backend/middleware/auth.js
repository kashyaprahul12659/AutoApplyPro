const jwt = require('jsonwebtoken');
const { logger, securityLogger } = require('../utils/logger');

/**
 * Authentication middleware
 * Validates JWT tokens and sets user information on the request object
 * Supports both x-auth-token header and Authorization: Bearer token formats
 */
module.exports = function(req, res, next) {
  // Try to get token from various headers
  let token;
  
  // First check x-auth-token header (legacy/extension support)
  const authHeader = req.header('x-auth-token');
  if (authHeader) {
    token = authHeader;
  }
  
  // If not found, try Authorization header with Bearer token format
  if (!token) {
    const bearerHeader = req.header('Authorization');
    if (bearerHeader && bearerHeader.startsWith('Bearer ')) {
      token = bearerHeader.split(' ')[1];
    }
  }
  // Check if no token
  if (!token) {
    securityLogger('authentication_failure', {
      reason: 'no_token',
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl
    });
    return res.status(401).json({ 
      success: false,
      error: 'auth_required',
      message: 'Authentication required. Please log in.'
    });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Check if token payload has required user data
    if (!decoded.user || !decoded.user.id) {
      securityLogger('authentication_failure', {
        reason: 'invalid_token_payload',
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        url: req.originalUrl
      });
      return res.status(401).json({ 
        success: false,
        error: 'invalid_token',
        message: 'Invalid authentication token.'
      });
    }
    
    // Set user info on request object
    req.user = decoded.user;
    next();
      } catch (err) {
    securityLogger('authentication_failure', {
      reason: err.name,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl
    });
    
    // Handle different JWT errors with appropriate responses
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        error: 'token_expired',
        message: 'Your session has expired. Please log in again.'
      });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        error: 'invalid_token',
        message: 'Invalid authentication token.'
      });
    } else {
      return res.status(401).json({ 
        success: false,
        error: 'auth_failed',
        message: 'Authentication failed. Please try again.'
      });
    }
  }
};
