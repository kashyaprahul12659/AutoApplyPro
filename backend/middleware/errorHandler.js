/**
 * Global error handling middleware
 * Provides consistent error responses for all API routes
 */

const { logger, errorLogger, securityLogger } = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  // Prepare safe context for logging (exclude sensitive data)
  const logContext = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id,
    // Only log non-sensitive parts of body
    bodyKeys: req.method !== 'GET' && req.body ? Object.keys(req.body) : undefined
  };

  // Log the error with context
  errorLogger(err, logContext);

  // Network/server errors
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    return res.status(503).json({
      success: false,
      error: 'service_unavailable',
      message: 'Service temporarily unavailable. Please try again later.'
    });
  }

  // MongoDB errors
  if (err.name === 'MongooseError' || err.name === 'MongoError') {
    return res.status(500).json({
      success: false,
      error: 'database_error',
      message: 'Database operation failed. Please try again later.'
    });
  }

  // OpenAI API errors
  if (err.message && err.message.includes('OpenAI')) {
    return res.status(503).json({
      success: false,
      error: 'ai_service_error',
      message: 'AI service temporarily unavailable. Please try again later.'
    });
  }

  // Razorpay webhook errors
  if (err.message && err.message.includes('Razorpay')) {
    console.error('Razorpay webhook error:', err);
    return res.status(400).json({      success: false,
      error: 'payment_processing_error',
      message: 'Payment processing error. Please contact support.'
    });
  }

  // JWT/Auth errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    // Log security event for failed authentication
    securityLogger('authentication_failure', {
      error: err.name,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl
    });
    
    return res.status(401).json({
      success: false,
      error: 'authentication_error',
      message: 'Authentication failed. Please log in again.'
    });
  }

  // Rate limiting errors
  if (err.status === 429) {
    securityLogger('rate_limit_exceeded', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl
    });
    
    return res.status(429).json({
      success: false,
      error: 'rate_limit_exceeded',
      message: 'Too many requests. Please try again later.'
    });
  }

  // CORS errors
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({
      success: false,
      error: 'cors_error',
      message: 'Cross-origin request blocked.'
    });
  }

  // File size/upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      error: 'file_too_large',
      message: 'File size exceeds the maximum allowed limit.'
    });
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(413).json({
      success: false,
      error: 'too_many_files',
      message: 'Too many files uploaded at once.'
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      error: 'invalid_file_field',
      message: 'Unexpected file field or invalid file type.'
    });
  }

  // Custom application errors
  if (err.isOperational) {
    return res.status(err.statusCode || 400).json({
      success: false,
      error: err.code || 'application_error',      message: err.message,
      ...(err.details && { details: err.details })
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    const validationDetails = {};
    if (err.errors) {
      Object.keys(err.errors).forEach(key => {
        validationDetails[key] = err.errors[key].message;
      });
    }
    
    return res.status(400).json({
      success: false,      error: 'validation_error',
      message: 'Invalid input data. Please check your request and try again.',
      details: validationDetails
    });
  }

  // File upload errors
  if (err.message && (err.message.includes('upload') || err.message.includes('multer'))) {
    return res.status(400).json({
      success: false,
      error: 'file_upload_error',
      message: 'File upload failed. Please try again with a different file.'
    });
  }

  // Development vs Production error details
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Default error response
  const errorResponse = {
    success: false,
    error: 'server_error',
    message: 'Something went wrong. Please try again later.'
  };

  // Add stack trace in development mode
  if (isDevelopment) {
    errorResponse.stack = err.stack;
    errorResponse.details = err.message;
  }

  return res.status(err.status || err.statusCode || 500).json(errorResponse);
};

module.exports = errorHandler;
