const History = require('../models/History');
const Resume = require('../models/Resume');

// @desc    Create new history entry
// @route   POST /api/history
// @access  Private
exports.createHistory = async (req, res) => {
  try {
    const { resumeId, applicationUrl, websiteName, jobTitle, company, status, fieldsAutofilled } = req.body;

    // Check if the resume exists and belongs to the user
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    if (resume.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to use this resume'
      });
    }

    // Create history entry
    const history = await History.create({
      user: req.user.id,
      resume: resumeId,
      applicationUrl,
      websiteName,
      jobTitle,
      company,
      status,
      fieldsAutofilled
    });

    res.status(201).json({
      success: true,
      data: history
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get all user history entries
// @route   GET /api/history
// @access  Private
exports.getHistory = async (req, res) => {
  try {
    const history = await History.find({ user: req.user.id })
      .sort({ timestamp: -1 })
      .populate('resume', 'originalName');

    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single history entry
// @route   GET /api/history/:id
// @access  Private
exports.getHistoryItem = async (req, res) => {
  try {
    const history = await History.findById(req.params.id).populate('resume');

    if (!history) {
      return res.status(404).json({
        success: false,
        error: 'History entry not found'
      });
    }

    // Make sure user owns the history entry
    if (history.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this history entry'
      });
    }

    res.status(200).json({
      success: true,
      data: history
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Delete history entry
// @route   DELETE /api/history/:id
// @access  Private
exports.deleteHistory = async (req, res) => {
  try {
    const history = await History.findById(req.params.id);

    if (!history) {
      return res.status(404).json({
        success: false,
        error: 'History entry not found'
      });
    }

    // Make sure user owns the history entry
    if (history.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this history entry'
      });
    }

    await history.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
