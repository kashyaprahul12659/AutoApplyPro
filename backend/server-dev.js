const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://autoapplypro.netlify.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Basic logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check routes
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

// Mock API endpoints that your frontend is calling
app.get('/api/resumes/all', (req, res) => {
  res.json({
    status: 'success',
    data: [],
    message: 'No resumes found. Upload your first resume to get started!'
  });
});

app.get('/api/history/cover-letters', (req, res) => {
  res.json({
    status: 'success',
    data: [],
    message: 'No cover letters found. Generate your first cover letter!'
  });
});

app.get('/api/history/analyses', (req, res) => {
  res.json({
    status: 'success',
    data: [],
    message: 'No job analyses found. Analyze your first job description!'
  });
});

app.get('/api/jobs/tracker', (req, res) => {
  res.json({
    status: 'success',
    data: [],
    message: 'No tracked jobs found. Start tracking your job applications!'
  });
});

app.get('/api/users/profile', (req, res) => {
  res.json({
    status: 'success',
    data: {
      id: 'dev-user-001',
      email: 'developer@autoapplypro.com',
      firstName: 'Developer',
      lastName: 'User',
      subscription: 'free',
      createdAt: new Date().toISOString(),
      isVerified: true
    }
  });
});

app.get('/api/analytics/dashboard', (req, res) => {
  res.json({
    status: 'success',
    data: {
      totalResumes: 0,
      totalCoverLetters: 0,
      totalAnalyses: 0,
      totalJobs: 0,
      recentActivity: []
    }
  });
});

// Resume upload endpoint
app.post('/api/resumes/upload', (req, res) => {
  res.json({
    status: 'success',
    message: 'Resume upload functionality coming soon!',
    data: {
      id: 'mock-resume-001',
      filename: 'resume.pdf',
      uploadedAt: new Date().toISOString()
    }
  });
});

// Cover letter generation endpoint
app.post('/api/ai/cover-letter', (req, res) => {
  res.json({
    status: 'success',
    message: 'Cover letter generation functionality coming soon!',
    data: {
      content: 'Your AI-generated cover letter will appear here once the OpenAI integration is configured.',
      timestamp: new Date().toISOString()
    }
  });
});

// Job description analysis endpoint
app.post('/api/analyzer/analyze', (req, res) => {
  res.json({
    status: 'success',
    message: 'Job description analysis functionality coming soon!',
    data: {
      score: 85,
      feedback: 'Job analysis will appear here once the AI integration is configured.',
      recommendations: [
        'Add more relevant keywords',
        'Highlight specific achievements',
        'Include quantifiable results'
      ],
      timestamp: new Date().toISOString()
    }
  });
});

// Job tracker endpoints
app.post('/api/jobs/tracker', (req, res) => {
  const { title, company, status = 'applied' } = req.body;
  res.json({
    status: 'success',
    message: 'Job added to tracker successfully!',
    data: {
      id: 'job-' + Date.now(),
      title: title || 'Sample Job',
      company: company || 'Sample Company',
      status,
      appliedDate: new Date().toISOString()
    }
  });
});

app.put('/api/jobs/tracker/:id', (req, res) => {
  res.json({
    status: 'success',
    message: 'Job updated successfully!',
    data: { id: req.params.id, ...req.body, updatedAt: new Date().toISOString() }
  });
});

app.delete('/api/jobs/tracker/:id', (req, res) => {
  res.json({
    status: 'success',
    message: 'Job removed from tracker successfully!'
  });
});

// Authentication endpoints (development mode)
app.post('/api/auth/dev-login', (req, res) => {
  res.json({
    status: 'success',
    message: 'Development login successful',
    user: {
      id: 'dev-user-001',
      email: 'developer@autoapplypro.com',
      firstName: 'Developer',
      lastName: 'User'
    },
    token: 'dev-token-12345'
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({
    status: 'success',
    message: 'Logged out successfully'
  });
});

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.path} not found`,
    availableRoutes: [
      'GET /api/health',
      'GET /api/resumes/all',
      'POST /api/resumes/upload',
      'GET /api/history/cover-letters',
      'GET /api/history/analyses',
      'POST /api/ai/cover-letter',
      'POST /api/analyzer/analyze',
      'GET /api/jobs/tracker',
      'POST /api/jobs/tracker',
      'GET /api/users/profile',
      'GET /api/analytics/dashboard'
    ]
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 AutoApply Pro API Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 API available at: http://localhost:${PORT}/api/`);
  console.log(`📱 Frontend URL: http://localhost:3000`);
  console.log('✅ Development server ready!');
});

module.exports = app;
