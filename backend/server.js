const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const { clerkMiddleware } = require('@clerk/express');
const errorHandler = require('./middleware/errorHandler');

// Security and logging imports
const securityHeaders = require('./middleware/security');
const { apiLimiter, authLimiter, uploadLimiter, aiLimiter } = require('./middleware/rateLimiter');
const { sanitizeInput } = require('./middleware/validation');
const { logger, httpLogger, securityLogger } = require('./utils/logger');

// Services imports
const notificationService = require('./services/notificationService');
const analyticsService = require('./services/analyticsService');
const webhookService = require('./services/webhookService');

// Route imports
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const resumeRoutes = require('./routes/resumes');
const historyRoutes = require('./routes/history');
const aiRoutes = require('./routes/ai');
const paymentRoutes = require('./routes/payments');
const jdAnalyzerRoutes = require('./routes/jdAnalyzer');
const jobTrackerRoutes = require('./routes/jobTracker');
const resumeBuilderRoutes = require('./routes/resumeBuilder');
const resumeAIRoutes = require('./routes/resumeAI');
const dashboardRoutes = require('./routes/dashboard');
const clientErrorsRoutes = require('./routes/client-errors');

// New enhanced route imports
const analyticsRoutes = require('./routes/analytics');
const notificationRoutes = require('./routes/notifications');
const searchRoutes = require('./routes/search');
const webhookRoutes = require('./routes/webhooks');
const apiManagementRoutes = require('./routes/api-management');
const publicApiRoutes = require('./routes/public-api');
const systemMonitoringRoutes = require('./routes/system-monitoring');
const developerDashboardRoutes = require('./routes/developer-dashboard');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Create HTTP server for WebSocket support
const server = http.createServer(app);

// Security headers (must be early in middleware stack)
app.use(securityHeaders);

// Trust proxy for rate limiting and IP detection
app.set('trust proxy', 1);

// Enhanced CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',      'https://autoapplypro.tech',
      'https://www.autoapplypro.tech'
    ];
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Fixed: Allow Chrome extension origins
    if (origin && origin.startsWith('chrome-extension://')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      securityLogger('cors_violation', { origin });
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Apply general rate limiting to all API routes
app.use('/api', apiLimiter);

// Body parsing middleware with increased limit for resume uploads
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    // Store raw body for webhook verification if needed
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization middleware
app.use(sanitizeInput);

// API Documentation with Swagger
if (process.env.NODE_ENV !== 'production') {
  const swaggerUi = require('swagger-ui-express');
  const swaggerSpecs = require('./docs/swagger');
  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'AutoApplyPro API Documentation'
  }));
  
  logger.info('API documentation available at /api-docs');
}

// Add Clerk middleware for authentication
app.use(clerkMiddleware());

// HTTP request logging
app.use(httpLogger);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB with improved options and logging
mongoose.connect(process.env.MONGODB_URI, {
  // These options help with connection stability
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverApi: { version: '1', strict: true, deprecationErrors: true }
})
.then(() => {
  logger.info('Connected to MongoDB successfully');
  logger.info(`Database: ${mongoose.connection.name}`);
})
.catch(err => {
  logger.error('MongoDB connection error:', err);
  // Don't crash the server on initial connection failure
  // It will retry automatically
});

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  logger.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  logger.info('MongoDB reconnected');
});

// Routes with specific rate limiting
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resumes', uploadLimiter, resumeRoutes);
app.use('/api/resume-builder', resumeBuilderRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/ai', aiLimiter, aiRoutes);
app.use('/api/resume-ai', aiLimiter, resumeAIRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/jd-analyzer', aiLimiter, jdAnalyzerRoutes);
app.use('/api/job-tracker', jobTrackerRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/client-errors', clientErrorsRoutes);

// New enhanced feature routes
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/api-management', apiManagementRoutes);
app.use('/api/system-monitoring', systemMonitoringRoutes);
app.use('/api/developer-dashboard', developerDashboardRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Public API routes (uses API key authentication)
app.use('/api/public', publicApiRoutes);

// Client error logging endpoint
app.post('/api/client-errors', (req, res) => {
  try {
    const { error, url, userAgent, timestamp } = req.body;
    logger.error('Client-side error reported:', {
      error,
      url,
      userAgent,
      timestamp,
      ip: req.ip
    });
    res.status(200).json({ status: 'logged' });
  } catch (err) {
    logger.error('Error logging client error:', err);
    res.status(500).json({ error: 'Failed to log error' });
  }
});

// Basic route with health check and version info
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'AutoApply Pro API is running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Enhanced health check endpoint
app.get('/api/health', (req, res) => {
  const healthCheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    services: {
      mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
      },
      cpu: process.cpuUsage()
    }
  };
  
  // Log health check requests in development
  if (process.env.NODE_ENV === 'development') {
    logger.debug('Health check requested', healthCheck);
  }
  
  res.status(200).json(healthCheck);
});

// 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'not_found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler middleware
app.use(errorHandler);

// Process error handling with proper logging
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  });
  
  // Graceful shutdown
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', {
    reason: reason.toString(),
    promise: promise.toString(),
    timestamp: new Date().toISOString()
  });
  
  // Graceful shutdown
  process.exit(1);
});

// Graceful shutdown on SIGTERM
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  
  // Close MongoDB connection
  mongoose.connection.close(() => {
    logger.info('MongoDB connection closed');
    process.exit(0);
  });
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Initialize WebSocket service with server
notificationService.initialize(server);

// Start the server
server.listen(PORT, () => {
  logger.info(`Server started successfully`);
  logger.info(`Port: ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`API URL: http://localhost:${PORT}`);
  logger.info(`Health Check: http://localhost:${PORT}/api/health`);
  logger.info(`WebSocket server initialized`);
});

// Handle server shutdown gracefully
process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  
  server.close(() => {
    logger.info('HTTP server closed');
    
    mongoose.connection.close(() => {
      logger.info('MongoDB connection closed');
      process.exit(0);
    });
  });
});

// Export the app for Vercel
module.exports = app;
