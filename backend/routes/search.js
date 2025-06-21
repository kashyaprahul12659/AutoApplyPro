const express = require('express');
const router = express.Router();
const { requireAuth } = require('@clerk/express');
const { apiLimiter } = require('../middleware/rateLimiter');
const User = require('../models/User');
const Resume = require('../models/Resume');
const JobApplication = require('../models/JobApplication');
const { logger } = require('../utils/logger');

// Apply authentication to all search routes
router.use(requireAuth());

// Apply rate limiting
router.use(apiLimiter);

/**
 * Global search endpoint
 * Searches across jobs, resumes, and user data
 */
router.get('/', async (req, res) => {
  try {
    const { q, limit = 10, type } = req.query;
    const userId = req.auth.userId;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const searchQuery = q.trim();
    const searchLimit = Math.min(parseInt(limit), 50);
    const results = [];

    // Search in job applications if no specific type or type is 'job'
    if (!type || type === 'job') {
      try {
        const jobResults = await JobApplication.find({
          userId,
          $or: [
            { jobTitle: { $regex: searchQuery, $options: 'i' } },
            { company: { $regex: searchQuery, $options: 'i' } },
            { location: { $regex: searchQuery, $options: 'i' } },
            { notes: { $regex: searchQuery, $options: 'i' } }
          ]
        })
        .limit(searchLimit / 2)
        .select('jobTitle company location status dateApplied')
        .lean();

        jobResults.forEach(job => {
          results.push({
            _id: job._id,
            type: 'job',
            title: job.jobTitle,
            company: job.company,
            description: `${job.company} - ${job.location}`,
            location: job.location,
            url: `/job-tracker#${job._id}`
          });
        });
      } catch (error) {
        logger.error('Error searching jobs:', error);
      }
    }

    // Search in resumes if no specific type or type is 'resume'
    if (!type || type === 'resume') {
      try {
        const resumeResults = await Resume.find({
          userId,
          $or: [
            { filename: { $regex: searchQuery, $options: 'i' } },
            { 'parsedData.personalInfo.name': { $regex: searchQuery, $options: 'i' } },
            { 'parsedData.experience.company': { $regex: searchQuery, $options: 'i' } },
            { 'parsedData.experience.position': { $regex: searchQuery, $options: 'i' } },
            { 'parsedData.skills': { $in: [new RegExp(searchQuery, 'i')] } }
          ]
        })
        .limit(searchLimit / 2)
        .select('filename parsedData.personalInfo.name isPrimary uploadDate')
        .lean();

        resumeResults.forEach(resume => {
          results.push({
            _id: resume._id,
            type: 'resume',
            title: resume.filename,
            name: resume.parsedData?.personalInfo?.name || 'Unknown',
            description: `Resume - ${resume.isPrimary ? 'Primary' : 'Secondary'}`,
            url: `/dashboard#resumes`
          });
        });
      } catch (error) {
        logger.error('Error searching resumes:', error);
      }
    }

    // Search in user analytics/dashboard data if type is 'analytics'
    if (!type || type === 'analytics') {
      const analyticsResults = [
        {
          _id: 'dashboard',
          type: 'analytics',
          title: 'Dashboard Overview',
          description: 'View your application statistics and recent activity',
          url: '/dashboard'
        },
        {
          _id: 'job-tracker',
          type: 'analytics',
          title: 'Job Application Tracker',
          description: 'Manage and track your job applications',
          url: '/job-tracker'
        },
        {
          _id: 'analytics',
          type: 'analytics',
          title: 'Analytics & Reports',
          description: 'Detailed insights into your job search progress',
          url: '/analytics'
        }
      ].filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

      results.push(...analyticsResults);
    }

    // Sort results by relevance (exact matches first, then partial matches)
    results.sort((a, b) => {
      const aTitle = (a.title || '').toLowerCase();
      const bTitle = (b.title || '').toLowerCase();
      const query = searchQuery.toLowerCase();

      if (aTitle === query && bTitle !== query) return -1;
      if (bTitle === query && aTitle !== query) return 1;
      if (aTitle.startsWith(query) && !bTitle.startsWith(query)) return -1;
      if (bTitle.startsWith(query) && !aTitle.startsWith(query)) return 1;
      
      return 0;
    });

    res.json({
      success: true,
      data: results.slice(0, searchLimit),
      meta: {
        query: searchQuery,
        totalResults: results.length,
        limit: searchLimit
      }
    });

  } catch (error) {
    logger.error('Error performing search:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to perform search'
    });
  }
});

/**
 * Search suggestions endpoint
 * Provides search suggestions based on user data
 */
router.get('/suggestions', async (req, res) => {
  try {
    const userId = req.auth.userId;
    const suggestions = [];

    // Get recent job titles and companies from user's applications
    const recentJobs = await JobApplication.find({ userId })
      .sort({ dateApplied: -1 })
      .limit(5)
      .select('jobTitle company')
      .lean();

    recentJobs.forEach(job => {
      if (job.jobTitle) suggestions.push(job.jobTitle);
      if (job.company) suggestions.push(job.company);
    });

    // Get common search terms
    const commonTerms = [
      'Software Engineer',
      'Data Scientist',
      'Product Manager',
      'Frontend Developer',
      'Backend Developer',
      'Full Stack Developer',
      'DevOps Engineer',
      'UX Designer',
      'Marketing Manager',
      'Sales Representative'
    ];

    suggestions.push(...commonTerms);

    // Remove duplicates and limit to 10
    const uniqueSuggestions = [...new Set(suggestions)].slice(0, 10);

    res.json({
      success: true,
      data: uniqueSuggestions
    });

  } catch (error) {
    logger.error('Error getting search suggestions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get search suggestions'
    });
  }
});

module.exports = router;
