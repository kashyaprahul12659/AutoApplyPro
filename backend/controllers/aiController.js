const AIService = require('../services/AIService');
const CoverLetter = require('../models/CoverLetter');
const User = require('../models/User');

/**
 * Generate a cover letter based on user profile and job description
 * @route   POST /api/ai/cover-letter
 * @access  Private
 */
exports.generateCoverLetter = async (req, res) => {
  try {
    const { jobDescription, jobRole } = req.body;
    
    // Validate inputs
    if (!jobDescription || !jobRole) {
      return res.status(400).json({
        success: false,
        error: 'Job description and job role are required'
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
        error: 'No AI credits remaining. Please upgrade to Pro for unlimited cover letters.',
        requiresUpgrade: true
      });
    }
    
    // Generate cover letter
    const generatedData = await AIService.generateCoverLetter(
      req.user,
      jobDescription,
      jobRole
    );
    
    // Decrement AI credits if not a Pro user
    if (!user.isPro) {
      await User.findByIdAndUpdate(req.user.id, { $inc: { aiCredits: -1 } });
    }
    
    // Save the cover letter to database
    const coverLetter = await CoverLetter.create({
      user: req.user.id,
      jobTitle: generatedData.jobTitle,
      descriptionSnippet: generatedData.descriptionSnippet,
      letterText: generatedData.coverLetter,
      keywords: generatedData.keywords
    });
    
    res.status(201).json({
      success: true,
      data: coverLetter
    });
  } catch (error) {
    console.error('Error in cover letter generation:', error);
    
    // Check for OpenAI-specific errors
    if (error.response && error.response.data) {
      return res.status(error.response.status || 500).json({
        success: false,
        error: error.response.data.error.message || 'Error generating cover letter'
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
};

/**
 * Get all cover letters for a user
 * @route   GET /api/ai/cover-letters
 * @access  Private
 */
exports.getCoverLetters = async (req, res) => {
  try {
    const coverLetters = await CoverLetter.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: coverLetters.length,
      data: coverLetters
    });
  } catch (error) {
    console.error('Error fetching cover letters:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * Get a single cover letter
 * @route   GET /api/ai/cover-letters/:id
 * @access  Private
 */
exports.getCoverLetter = async (req, res) => {
  try {
    const coverLetter = await CoverLetter.findById(req.params.id);
    
    if (!coverLetter) {
      return res.status(404).json({
        success: false,
        error: 'Cover letter not found'
      });
    }
    
    // Check if user owns the cover letter
    if (coverLetter.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this cover letter'
      });
    }
    
    res.status(200).json({
      success: true,
      data: coverLetter
    });
  } catch (error) {
    console.error('Error fetching cover letter:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * Update a cover letter
 * @route   PUT /api/ai/cover-letters/:id
 * @access  Private
 */
exports.updateCoverLetter = async (req, res) => {
  try {
    const { letterText, jobTitle } = req.body;
    
    if (!letterText) {
      return res.status(400).json({
        success: false,
        error: 'Letter text is required'
      });
    }
    
    let coverLetter = await CoverLetter.findById(req.params.id);
    
    if (!coverLetter) {
      return res.status(404).json({
        success: false,
        error: 'Cover letter not found'
      });
    }
    
    // Check if user owns the cover letter
    if (coverLetter.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this cover letter'
      });
    }
    
    coverLetter = await CoverLetter.findByIdAndUpdate(
      req.params.id,
      { 
        letterText,
        ...(jobTitle && { jobTitle })
      },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      data: coverLetter
    });
  } catch (error) {
    console.error('Error updating cover letter:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * Delete a cover letter
 * @route   DELETE /api/ai/cover-letters/:id
 * @access  Private
 */
exports.deleteCoverLetter = async (req, res) => {
  try {
    const coverLetter = await CoverLetter.findById(req.params.id);
    
    if (!coverLetter) {
      return res.status(404).json({
        success: false,
        error: 'Cover letter not found'
      });
    }
    
    // Check if user owns the cover letter
    if (coverLetter.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this cover letter'
      });
    }
    
    await coverLetter.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting cover letter:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};
