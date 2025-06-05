const JobApplication = require('../models/JobApplication');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

/**
 * @desc    Get all job applications for a user
 * @route   GET /api/job-tracker/all
 * @access  Private
 */
exports.getAllJobApplications = async (req, res) => {
  try {
    const jobApplications = await JobApplication.find({ userId: req.user.id })
      .sort({ updatedAt: -1 })
      .populate('linkedCoverLetterId', 'jobTitle')
      .populate('linkedAnalyzerResultId', 'jobTitle matchScore');

    return res.status(200).json({
      success: true,
      count: jobApplications.length,
      data: jobApplications
    });
  } catch (error) {
    console.error('Error fetching job applications:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

/**
 * @desc    Add new job application
 * @route   POST /api/job-tracker/add
 * @access  Private
 */
exports.addJobApplication = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const {
      jobTitle,
      company,
      location,
      jdUrl,
      status,
      linkedCoverLetterId,
      linkedAnalyzerResultId,
      notes,
      color
    } = req.body;

    // Create new job application
    const newJobApplication = new JobApplication({
      userId: req.user.id,
      jobTitle,
      company,
      location,
      jdUrl,
      status: status || 'interested',
      linkedCoverLetterId: linkedCoverLetterId || null,
      linkedAnalyzerResultId: linkedAnalyzerResultId || null,
      notes,
      color,
      lastStatusUpdate: Date.now()
    });

    const jobApplication = await newJobApplication.save();

    return res.status(201).json({
      success: true,
      data: jobApplication
    });
  } catch (error) {
    console.error('Error adding job application:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

/**
 * @desc    Update job application status
 * @route   PUT /api/job-tracker/update-status/:id
 * @access  Private
 */
exports.updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['interested', 'applied', 'interview', 'offer', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status value'
      });
    }

    let jobApplication = await JobApplication.findById(req.params.id);

    // Check if job application exists
    if (!jobApplication) {
      return res.status(404).json({
        success: false,
        error: 'Job application not found'
      });
    }

    // Check if user owns the job application
    if (jobApplication.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this job application'
      });
    }

    // Update the job application
    jobApplication = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        lastStatusUpdate: Date.now()
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      data: jobApplication
    });
  } catch (error) {
    console.error('Error updating job status:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format'
      });
    }
    
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

/**
 * @desc    Update job application details
 * @route   PUT /api/job-tracker/:id
 * @access  Private
 */
exports.updateJobApplication = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const {
      jobTitle,
      company,
      location,
      jdUrl,
      status,
      linkedCoverLetterId,
      linkedAnalyzerResultId,
      notes,
      color
    } = req.body;

    let jobApplication = await JobApplication.findById(req.params.id);

    // Check if job application exists
    if (!jobApplication) {
      return res.status(404).json({
        success: false,
        error: 'Job application not found'
      });
    }

    // Check if user owns the job application
    if (jobApplication.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this job application'
      });
    }

    // Check if status is changing
    const statusChanged = status && status !== jobApplication.status;

    // Prepare update object
    const updateData = {
      jobTitle: jobTitle || jobApplication.jobTitle,
      company: company || jobApplication.company,
      location: location !== undefined ? location : jobApplication.location,
      jdUrl: jdUrl !== undefined ? jdUrl : jobApplication.jdUrl,
      status: status || jobApplication.status,
      linkedCoverLetterId: linkedCoverLetterId !== undefined ? linkedCoverLetterId : jobApplication.linkedCoverLetterId,
      linkedAnalyzerResultId: linkedAnalyzerResultId !== undefined ? linkedAnalyzerResultId : jobApplication.linkedAnalyzerResultId,
      notes: notes !== undefined ? notes : jobApplication.notes,
      color: color !== undefined ? color : jobApplication.color
    };

    // If status changed, update lastStatusUpdate
    if (statusChanged) {
      updateData.lastStatusUpdate = Date.now();
    }

    // Update the job application
    jobApplication = await JobApplication.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      data: jobApplication
    });
  } catch (error) {
    console.error('Error updating job application:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format'
      });
    }
    
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

/**
 * @desc    Delete job application
 * @route   DELETE /api/job-tracker/:id
 * @access  Private
 */
exports.deleteJobApplication = async (req, res) => {
  try {
    const jobApplication = await JobApplication.findById(req.params.id);

    // Check if job application exists
    if (!jobApplication) {
      return res.status(404).json({
        success: false,
        error: 'Job application not found'
      });
    }

    // Check if user owns the job application
    if (jobApplication.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this job application'
      });
    }

    await jobApplication.remove();

    return res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting job application:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format'
      });
    }
    
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
