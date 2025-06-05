const AIService = require('../services/AIService');
const AnalyzerHistory = require('../models/AnalyzerHistory');
const User = require('../models/User');

/**
 * Analyze job description based on user profile and job description
 * @route   POST /api/ai/analyze-jd
 * @access  Private (Pro users only)
 */
exports.analyzeJobDescription = async (req, res) => {
  try {
    const { jobDescription } = req.body;
    
    // Validate input
    if (!jobDescription) {
      return res.status(400).json({
        success: false,
        error: 'Job description is required'
      });
    }
    
    if (jobDescription.length < 50) {
      return res.status(400).json({
        success: false,
        error: 'Job description is too short. Please provide a more detailed description.'
      });
    }
    
    // Check user's credits or pro status
    const user = await User.findById(req.user.id);
    
    if (!user.isPro && user.aiCredits <= 0) {
      return res.status(403).json({
        success: false,
        error: 'No AI credits remaining. Please upgrade to Pro for unlimited analysis.',
        requiresUpgrade: true
      });
    }
    
    // Generate analysis
    const analysis = await AIService.analyzeJobDescription(
      req.user,
      jobDescription
    );
    
    // Decrement AI credits if not a Pro user
    if (!user.isPro) {
      await User.findByIdAndUpdate(req.user.id, { $inc: { aiCredits: -1 } });
    }
    
    // Save the analysis to database
    const analyzerHistory = await AnalyzerHistory.create({
      user: req.user.id,
      jobTitle: analysis.jobTitle,
      matchScore: analysis.matchScore,
      matchedSkills: analysis.matchedSkills,
      missingSkills: analysis.missingSkills,
      suggestions: analysis.suggestions,
      descriptionSnippet: analysis.descriptionSnippet
    });
    
    res.status(201).json({
      success: true,
      data: analyzerHistory
    });
  } catch (error) {
    console.error('Error in job description analysis:', error);
    
    // Check for OpenAI-specific errors
    if (error.response && error.response.data) {
      return res.status(error.response.status || 500).json({
        success: false,
        error: error.response.data.error.message || 'Error analyzing job description'
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
};

/**
 * Get all analyzer history entries for a user
 * @route   GET /api/ai/analyzer-history
 * @access  Private
 */
exports.getAnalyzerHistory = async (req, res) => {
  try {
    const analyzerHistory = await AnalyzerHistory.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: analyzerHistory.length,
      data: analyzerHistory
    });
  } catch (error) {
    console.error('Error fetching analyzer history:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * Get a single analyzer history entry
 * @route   GET /api/ai/analyzer-history/:id
 * @access  Private
 */
exports.getAnalyzerHistoryItem = async (req, res) => {
  try {
    const analyzerHistoryItem = await AnalyzerHistory.findById(req.params.id);
    
    if (!analyzerHistoryItem) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found'
      });
    }
    
    // Check if user owns the analyzer history item
    if (analyzerHistoryItem.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this analysis'
      });
    }
    
    res.status(200).json({
      success: true,
      data: analyzerHistoryItem
    });
  } catch (error) {
    console.error('Error fetching analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * Delete an analyzer history entry
 * @route   DELETE /api/ai/analyzer-history/:id
 * @access  Private
 */
exports.deleteAnalyzerHistoryItem = async (req, res) => {
  try {
    const analyzerHistoryItem = await AnalyzerHistory.findById(req.params.id);
    
    if (!analyzerHistoryItem) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found'
      });
    }
    
    // Check if user owns the analyzer history item
    if (analyzerHistoryItem.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this analysis'
      });
    }
    
    await analyzerHistoryItem.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};
