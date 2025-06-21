const { analyticsService } = require('../services/analyticsService');
const JobApplication = require('../models/JobApplication');
const Resume = require('../models/Resume');
const User = require('../models/User');
const logger = require('../utils/logger');
const cache = require('../utils/cache');

/**
 * Dashboard Controller
 * Handles dashboard-specific data and analytics with real-time updates
 */

// @desc    Get user's dashboard data
// @route   GET /api/dashboard
// @access  Private
exports.getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    logger.info('Dashboard data requested', { userId });

    // Get fresh data for real-time experience
    const [user, applications, resumes] = await Promise.all([
      User.findById(userId),
      JobApplication.find({ user: userId }).sort({ createdAt: -1 }),
      Resume.find({ user: userId }).sort({ createdAt: -1 })
    ]);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate real-time statistics
    const currentDate = new Date();
    const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    const stats = {
      totalApplications: applications.length,
      thisMonth: applications.filter(app => new Date(app.createdAt) >= currentMonth).length,
      interviews: applications.filter(app => app.status === 'interview').length,
      responseRate: applications.length > 0 
        ? Math.round((applications.filter(app => app.status !== 'applied').length / applications.length) * 100)
        : 0,
      timesSaved: Math.round(applications.length * 0.5), // Estimate 30 min saved per application
      profileViews: user.analytics?.profileViews || 0
    };

    // Get recent activity
    const recentActivity = (user.activities || [])
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10)
      .map(activity => ({
        id: activity._id,
        type: activity.activityType,
        description: formatActivityDescription(activity),
        timestamp: activity.timestamp,
        metadata: activity.metadata
      }));

    const dashboardData = {
      stats,
      recentActivity,
      applications: applications.slice(0, 5), // Recent 5 applications
      resumes: resumes.slice(0, 3), // Recent 3 resumes
      user: {
        name: user.name || user.fullName || 'User',
        email: user.email,
        plan: user.subscription?.plan || 'free',
        credits: user.aiCredits || 0
      }
    };

    // Cache for 2 minutes only for real-time feel
    await cache.set(`dashboard_data_${userId}`, dashboardData, 120);

    res.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    logger.error('Dashboard data error', { 
      error: error.message, 
      userId: req.user?.id 
    });
    next(error);
  }
};

// Helper function to format activity descriptions
function formatActivityDescription(activity) {
  const activityDescriptions = {
    'login': 'Logged into AutoApply Pro',
    'logout': 'Logged out',
    'resume_upload': 'Uploaded a new resume',
    'cover_letter_generate': 'Generated a cover letter',
    'job_apply': 'Applied to a job',
    'profile_update': 'Updated profile information',
    'jd_analysis': 'Analyzed a job description',
    'resume_analysis': 'Analyzed resume',
    'page_view': `Viewed ${activity.metadata?.page || 'page'}`,
    'feature_use': `Used ${activity.metadata?.feature || 'feature'}`,
    'search': `Searched for "${activity.metadata?.query || 'content'}"`
  };

  return activityDescriptions[activity.activityType] || 'Unknown activity';
}

// @desc    Get user's recent activity for dashboard
// @route   GET /api/dashboard/activity
// @access  Private
exports.getRecentActivity = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { limit = 10 } = req.query;

    logger.info('Recent activity requested', { userId, limit });

    // Get recent applications
    const recentApplications = await JobApplication.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('company position status createdAt');

    // Get recent resumes
    const recentResumes = await Resume.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('filename createdAt');

    // Combine and sort by date
    const activities = [
      ...recentApplications.map(app => ({
        type: 'application',
        title: `Applied to ${app.position} at ${app.company}`,
        subtitle: `Status: ${app.status}`,
        date: app.createdAt,
        icon: 'briefcase'
      })),
      ...recentResumes.map(resume => ({
        type: 'resume',
        title: `Uploaded resume: ${resume.filename}`,
        subtitle: 'Resume uploaded',
        date: resume.createdAt,
        icon: 'document'
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, parseInt(limit));

    res.json({
      success: true,
      data: activities
    });

  } catch (error) {
    logger.error('Get recent activity error', { 
      error: error.message, 
      userId: req.user?.id 
    });
    next(error);
  }
};

// @desc    Refresh dashboard cache
// @route   POST /api/dashboard/refresh
// @access  Private
exports.refreshDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    logger.info('Dashboard refresh requested', { userId });

    // Clear user's dashboard cache
    const cacheKey = `dashboard_data_${userId}`;
    await cache.del(cacheKey);
    
    // Also clear related caches
    await Promise.all([
      cache.del(`user_analytics_${userId}_30d`),
      cache.del(`user_session_${userId}`)
    ]);

    res.json({
      success: true,
      message: 'Dashboard data refreshed successfully'
    });

  } catch (error) {
    logger.error('Refresh dashboard error', { 
      error: error.message, 
      userId: req.user?.id 
    });
    next(error);
  }
};

module.exports = {
  getDashboard,
  getRecentActivity,
  refreshDashboard
};
