const JobApplication = require('../models/JobApplication');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Resume = require('../models/Resume');

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
 * @desc    Add new job application with enhanced data
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
      // Basic job information
      jobTitle,
      company,
      location,
      jdUrl,
      status,
      
      // Enhanced job details (new fields)
      jobDescription,
      salaryRange,
      employmentType,
      workMode,
      experienceLevel,
      requiredSkills,
      preferredSkills,
      jobSource,
      jobId,
      
      // Application tracking
      applicationDate,
      deadlineDate,
      followUpDate,
      
      // Contact information
      recruiterInfo,
      
      // Existing fields
      linkedCoverLetterId,
      linkedAnalyzerResultId,
      notes,
      color
    } = req.body;

    // Create new job application with enhanced data
    const jobApplicationData = {
      userId: req.user.id,
      jobTitle,
      company,
      location,
      jdUrl,
      status: status || 'interested',
      
      // Enhanced fields with defaults
      jobDescription: jobDescription || '',
      salaryRange: salaryRange || { min: null, max: null, currency: 'USD' },
      employmentType: employmentType || 'full-time',
      workMode: workMode || 'onsite',
      experienceLevel: experienceLevel || 'mid',
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
      preferredSkills: Array.isArray(preferredSkills) ? preferredSkills : [],
      jobSource: jobSource || 'other',
      jobId: jobId || '',
      
      // Date fields
      applicationDate: applicationDate ? new Date(applicationDate) : null,
      deadlineDate: deadlineDate ? new Date(deadlineDate) : null,
      followUpDate: followUpDate ? new Date(followUpDate) : null,
      
      // Contact info with defaults
      recruiterInfo: {
        name: recruiterInfo?.name || '',
        email: recruiterInfo?.email || '',
        linkedin: recruiterInfo?.linkedin || ''
      },
      
      // Existing fields
      linkedCoverLetterId: linkedCoverLetterId || null,
      linkedAnalyzerResultId: linkedAnalyzerResultId || null,
      notes: notes || '',
      color: color || '',
      lastStatusUpdate: Date.now()
    };

    const newJobApplication = new JobApplication(jobApplicationData);
    const jobApplication = await newJobApplication.save();

    // Log the job tracking activity
    console.log(`Job application added: ${jobTitle} at ${company} by user ${req.user.id}`);

    return res.status(201).json({
      success: true,
      data: jobApplication,
      message: 'Job application added successfully to tracker'
    });
  } catch (error) {
    console.error('Error adding job application:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
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

/**
 * @desc    Generate custom resume based on job application requirements
 * @route   POST /api/job-tracker/:id/generate-resume
 * @access  Private
 */
exports.generateCustomResume = async (req, res) => {
  try {
    const jobApplicationId = req.params.id;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(jobApplicationId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid job application ID'
      });
    }

    // Find the job application
    const jobApplication = await JobApplication.findOne({
      _id: jobApplicationId,
      userId: req.user.id
    });

    if (!jobApplication) {
      return res.status(404).json({
        success: false,
        error: 'Job application not found'
      });
    }

    // Get user's base resume/profile data
    
    const user = await User.findById(req.user.id);
    if (!user || !user.profileData) {
      return res.status(400).json({
        success: false,
        error: 'User profile data not found. Please complete your profile first.'
      });
    }

    // Get user's primary resume or use profile data
    let baseResumeData = user.profileData;
    const primaryResume = await Resume.findOne({ 
      userId: req.user.id, 
      isPrimary: true 
    });
    
    if (primaryResume && primaryResume.parsedData) {
      baseResumeData = primaryResume.parsedData;
    }

    // Generate custom resume content based on job requirements
    const customResumeData = {
      ...baseResumeData,
      
      // Enhanced objective/summary tailored to the job
      objective: generateTailoredObjective(baseResumeData, jobApplication),
      
      // Reorder and highlight relevant skills
      skills: prioritizeSkills(baseResumeData.skills || [], jobApplication.requiredSkills || []),
      
      // Emphasize relevant experience
      experience: enhanceRelevantExperience(baseResumeData.experience || [], jobApplication),
      
      // Add job-specific metadata
      tailoredFor: {
        jobTitle: jobApplication.jobTitle,
        company: jobApplication.company,
        jobId: jobApplication._id,
        generatedAt: new Date()
      }
    };

    // Create new resume record
    const customResume = new Resume({
      userId: req.user.id,
      name: `${jobApplication.jobTitle} - ${jobApplication.company}`,
      content: '', // Could store formatted resume content
      parsedData: customResumeData,
      isPrimary: false,
      isCustomGenerated: true,
      basedOnJobId: jobApplication._id
    });

    await customResume.save();

    // Update job application with custom resume reference
    jobApplication.customResumeGenerated = true;
    jobApplication.customResumeId = customResume._id;
    await jobApplication.save();

    return res.status(201).json({
      success: true,
      data: {
        resumeId: customResume._id,
        resumeData: customResumeData,
        jobApplication: jobApplication
      },
      message: 'Custom resume generated successfully based on job requirements'
    });

  } catch (error) {
    console.error('Error generating custom resume:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Helper function to generate tailored objective/summary
 */
function generateTailoredObjective(profileData, jobApplication) {
  const baseObjective = profileData.objective || profileData.summary || '';
  const jobTitle = jobApplication.jobTitle;
  const company = jobApplication.company;
  const requiredSkills = jobApplication.requiredSkills || [];
  
  // If no base objective, create one
  if (!baseObjective) {
    return `Experienced professional seeking ${jobTitle} position at ${company}. Skilled in ${requiredSkills.slice(0, 3).join(', ')} with a passion for delivering high-quality results.`;
  }
  
  // Enhance existing objective with job-specific terms
  let tailoredObjective = baseObjective;
  
  // Add job title if not already mentioned
  if (!tailoredObjective.toLowerCase().includes(jobTitle.toLowerCase())) {
    tailoredObjective = `${tailoredObjective} Specifically interested in ${jobTitle} roles.`;
  }
  
  return tailoredObjective;
}

/**
 * Helper function to prioritize skills based on job requirements
 */
function prioritizeSkills(userSkills, requiredSkills) {
  if (!Array.isArray(userSkills)) return [];
  
  const matchingSkills = [];
  const otherSkills = [];
  
  userSkills.forEach(skill => {
    const skillLower = skill.toLowerCase();
    const isRequired = requiredSkills.some(reqSkill => 
      reqSkill.toLowerCase().includes(skillLower) || 
      skillLower.includes(reqSkill.toLowerCase())
    );
    
    if (isRequired) {
      matchingSkills.push(skill);
    } else {
      otherSkills.push(skill);
    }
  });
  
  // Return matching skills first, then others
  return [...matchingSkills, ...otherSkills];
}

/**
 * Helper function to enhance relevant experience
 */
function enhanceRelevantExperience(userExperience, jobApplication) {
  if (!Array.isArray(userExperience)) return [];
  
  const requiredSkills = jobApplication.requiredSkills || [];
  const jobDescription = jobApplication.jobDescription || '';
  
  return userExperience.map(exp => {
    // Check if this experience is relevant to the job
    const expText = `${exp.role} ${exp.description || ''}`.toLowerCase();
    const isRelevant = requiredSkills.some(skill => 
      expText.includes(skill.toLowerCase())
    );
    
    return {
      ...exp,
      relevanceScore: isRelevant ? 1 : 0.5, // Could be used for sorting
      isHighlighted: isRelevant
    };
  }).sort((a, b) => b.relevanceScore - a.relevanceScore); // Sort by relevance
}

/**
 * @desc    Get custom resume for a job application
 * @route   GET /api/job-tracker/:id/custom-resume
 * @access  Private
 */
exports.getCustomResume = async (req, res) => {
  try {
    const jobApplicationId = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(jobApplicationId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid job application ID'
      });
    }

    const jobApplication = await JobApplication.findOne({
      _id: jobApplicationId,
      userId: req.user.id
    }).populate('customResumeId');

    if (!jobApplication) {
      return res.status(404).json({
        success: false,
        error: 'Job application not found'
      });
    }

    if (!jobApplication.customResumeGenerated || !jobApplication.customResumeId) {
      return res.status(404).json({
        success: false,
        error: 'No custom resume generated for this job application'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        resume: jobApplication.customResumeId,
        jobApplication: jobApplication
      }
    });
  } catch (error) {
    console.error('Error fetching custom resume:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
