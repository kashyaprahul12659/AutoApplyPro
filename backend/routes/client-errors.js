const express = require('express');
const router = express.Router();
const { logger } = require('../utils/logger');

/**
 * Client Error Logging API
 * Collects client-side errors for monitoring and debugging
 */

// Accepts error logs from the client
router.post('/', (req, res) => {
  try {
    // Extract error details from request
    const { message, stack, componentStack, timestamp, url, userAgent, userId } = req.body;
    
    // Log the error properly
    logger.error('Client-side error:', {
      message,
      stack: stack?.substring(0, 500), // Limit stack trace size
      componentStack: componentStack?.substring(0, 500),
      timestamp,
      url,
      userAgent: userAgent?.substring(0, 200),
      userId: userId || 'anonymous',
      ip: req.ip
    });
    
    // Respond with success
    res.status(200).json({ status: 'error_logged' });
  } catch (err) {
    // Handle errors in error logging (ironic)
    logger.error('Failed to log client error:', err);
    res.status(500).json({ error: 'Failed to log error' });
  }
});

// Get summary of recent client errors (admin only)
router.get('/summary', (req, res) => {
  // This would normally check for admin permissions
  res.status(200).json({
    status: 'available',
    message: 'Client error logging is active'
  });
});

module.exports = router;
