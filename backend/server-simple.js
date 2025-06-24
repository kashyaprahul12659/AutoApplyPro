// Simple test server for Heroku deployment
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Basic middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://autoapplypro.netlify.app',
  credentials: true
}));

app.use(express.json());

// Setup basic logging
const logDirectory = path.join(__dirname, 'logs');
// Ensure log directory exists
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

// Simple logger for this simplified server
const logger = {
  error: (message, meta = {}) => {
    const logEntry = {
      level: 'error',
      message,
      meta,
      timestamp: new Date().toISOString()
    };
    fs.appendFileSync(path.join(logDirectory, 'error.log'), JSON.stringify(logEntry) + '\n');
    console.error(`ERROR: ${message}`, meta);
  },
  info: (message, meta = {}) => {
    console.info(`INFO: ${message}`, meta);
  }
};

// Basic health check
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'AutoApply Pro API is running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Client error logging route
app.post('/api/client-errors', (req, res) => {
  try {
    // Extract error details from request
    const { message, stack, componentStack, timestamp, url, userAgent, userId } = req.body;
    
    // Log the error
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
    logger.error('Failed to log client error:', err);
    res.status(500).json({ error: 'Failed to log error' });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!'
  });
});

// Start server
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
