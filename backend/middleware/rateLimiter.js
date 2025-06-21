const rateLimit = require('express-rate-limit');
const MongoStore = require('rate-limit-mongo');

// Check if MongoDB URI is available
const mongoUri = process.env.MONGODB_URI;

// General API rate limiter
const apiLimiter = rateLimit({
  store: mongoUri ? new MongoStore({
    uri: mongoUri,
    collectionName: 'rate_limits',
    expireTimeMs: 15 * 60 * 1000, // 15 minutes
  }) : undefined, // Fall back to memory store if no MongoDB
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'rate_limit_exceeded',
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: 15 * 60 // seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/api/health';
  }
});

// Strict rate limiter for authentication endpoints
const authLimiter = rateLimit({
  store: mongoUri ? new MongoStore({
    uri: mongoUri,
    collectionName: 'auth_rate_limits',
    expireTimeMs: 15 * 60 * 1000,
  }) : undefined, // Fall back to memory store if no MongoDB
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: {
    success: false,
    error: 'auth_rate_limit_exceeded',
    message: 'Too many authentication attempts, please try again later.',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Upload rate limiter
const uploadLimiter = rateLimit({
  store: mongoUri ? new MongoStore({
    uri: mongoUri,
    collectionName: 'upload_rate_limits',
    expireTimeMs: 60 * 60 * 1000, // 1 hour
  }) : undefined, // Fall back to memory store if no MongoDB
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit uploads per hour
  message: {
    success: false,
    error: 'upload_rate_limit_exceeded',
    message: 'Too many uploads, please try again later.',
    retryAfter: 60 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// AI API rate limiter
const aiLimiter = rateLimit({
  store: mongoUri ? new MongoStore({
    uri: mongoUri,
    collectionName: 'ai_rate_limits',
    expireTimeMs: 60 * 60 * 1000, // 1 hour
  }) : undefined, // Fall back to memory store if no MongoDB
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit AI requests per hour for free users
  message: {
    success: false,
    error: 'ai_rate_limit_exceeded',
    message: 'AI service rate limit exceeded. Upgrade to Pro for higher limits.',
    retryAfter: 60 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for Pro users
    return req.user && req.user.isPro;
  }
});

module.exports = {
  apiLimiter,
  authLimiter,
  uploadLimiter,
  aiLimiter
};
