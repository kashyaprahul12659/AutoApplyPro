const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { clerkMiddleware } = require('@clerk/express');
const errorHandler = require('./middleware/errorHandler');

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

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://autoapplypro.com'],
  credentials: true,
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar']
}));

// Body parsing middleware with increased limit for resume uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add Clerk middleware for authentication
app.use(clerkMiddleware());

// Request logging in development mode
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  });
}

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB with improved options
mongoose.connect(process.env.MONGODB_URI, {
  // These options help with connection stability
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  // Don't crash the server on initial connection failure
  // It will retry automatically
});

// Handle MongoDB connection errors after initial connection
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Log when MongoDB connection is disconnected
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/resume-builder', resumeBuilderRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/resume-ai', resumeAIRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/jd-analyzer', jdAnalyzerRoutes);
app.use('/api/job-tracker', jobTrackerRoutes);

// Basic route with health check and version info
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'AutoApply Pro API is running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Dedicated health check endpoint for tests
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
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

// Process error handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Log to monitoring service if available
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Log to monitoring service if available
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API URL: http://localhost:${PORT}`);
});
