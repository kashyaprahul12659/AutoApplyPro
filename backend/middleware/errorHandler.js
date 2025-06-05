/**
 * Global error handling middleware
 * Provides consistent error responses for all API routes
 */

const errorHandler = (err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  console.error(err.stack);

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
    return res.status(400).json({
      success: false,
      error: 'payment_processing_error',
      message: 'Payment processing error. Please contact support.'
    });
  }

  // JWT/Auth errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'authentication_error',
      message: 'Authentication failed. Please log in again.'
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'validation_error',
      message: 'Invalid input data. Please check your request and try again.',
      details: err.errors
    });
  }

  // File upload errors
  if (err.message && err.message.includes('upload')) {
    return res.status(400).json({
      success: false,
      error: 'file_upload_error',
      message: 'File upload failed. Please try again with a different file.'
    });
  }

  // Default error
  return res.status(500).json({
    success: false,
    error: 'server_error',
    message: 'Something went wrong. Please try again later.'
  });
};

module.exports = errorHandler;
