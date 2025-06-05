const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Resume = require('../models/Resume');
const User = require('../models/User');
const ResumeParserService = require('../services/ResumeParserService');

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, process.env.FILE_UPLOAD_PATH);
  },
  filename: function(req, file, cb) {
    // Create unique filename with original extension
    cb(null, `${req.user.id}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Check file type
const fileFilter = (req, file, cb) => {
  // Allow pdf, doc, docx files
  const filetypes = /pdf|doc|docx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Please upload only PDF or Word documents!'), false);
  }
};

// Initialize upload middleware
exports.upload = multer({
  storage: storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) },
  fileFilter: fileFilter
}).single('resume');

// @desc    Upload resume
// @route   POST /api/resumes
// @access  Private
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'Please upload a file' 
      });
    }

    // Check if upload directory exists, create if not
    const uploadDir = process.env.FILE_UPLOAD_PATH;
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Check if any primary resume exists for this user
    const hasPrimaryResume = await Resume.exists({ 
      user: req.user.id,
      isPrimary: true 
    });

    // Create resume in database
    const resume = await Resume.create({
      user: req.user.id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      // If this is the user's first resume, mark it as primary
      isPrimary: !hasPrimaryResume
    });

    // Link resume to user profile
    await User.findByIdAndUpdate(req.user.id, {
      $set: {
        latestResume: {
          resumeId: resume._id,
          filename: resume.originalName,
          uploadDate: resume.uploadedAt
        }
      }
    });
    
    // Process resume in the background to extract data
    try {
      // We don't await this to allow the response to return quickly
      ResumeParserService.processResume(resume._id)
        .then(extractedData => {
          console.log('Resume parsed successfully:', resume.originalName);
        })
        .catch(err => {
          console.error('Error parsing resume:', err);
        });
    } catch (err) {
      console.error('Error initiating resume parsing:', err);
      // We don't throw here since this is background processing
    }

    res.status(201).json({
      success: true,
      data: resume,
      message: `Resume '${req.file.originalname}' uploaded successfully`
    });
  } catch (err) {
    console.error('Resume upload error:', err);
    
    // Check if the error is related to file size
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: `File size too large. Maximum size is ${(parseInt(process.env.MAX_FILE_SIZE) / (1024 * 1024)).toFixed(1)}MB`
      });
    }
    
    // Check if there was a file system error
    if (err.code === 'ENOENT' || err.code === 'EACCES') {
      return res.status(500).json({
        success: false,
        error: 'Error accessing file system. Please try again later.'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to upload resume. Please try again.'
    });
  }
};

// @desc    Get all user resumes
// @route   GET /api/resumes
// @access  Private
exports.getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id }).sort({ uploadedAt: -1 });

    res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Parse resume and extract data
// @route   POST /api/resumes/:id/parse
// @access  Private
exports.parseResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    // Make sure user owns the resume
    if (resume.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to parse this resume'
      });
    }

    // Parse the resume
    const extractedData = await ResumeParserService.processResume(resume._id);

    res.status(200).json({
      success: true,
      data: extractedData
    });
  } catch (err) {
    console.error('Resume parsing error:', err);
    res.status(500).json({
      success: false,
      error: 'Error parsing resume. Please try again.'
    });
  }
};

// @desc    Get parsed resume data for user
// @route   GET /api/resumes/parsed-data
// @access  Private
exports.getParsedData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.profileData || !user.profileData.extractedFromResume) {
      return res.status(404).json({
        success: false,
        error: 'No parsed resume data found'
      });
    }

    res.status(200).json({
      success: true,
      data: user.profileData
    });
  } catch (err) {
    console.error('Error fetching parsed data:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update parsed resume data
// @route   PUT /api/resumes/parsed-data
// @access  Private
exports.updateParsedData = async (req, res) => {
  try {
    const { name, email, phone, education, experience, skills } = req.body;

    // Update user's profile data
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          'profileData.name': name,
          'profileData.email': email,
          'profileData.phone': phone,
          'profileData.education': education,
          'profileData.experience': experience,
          'profileData.skills': skills,
          'profileData.lastUpdated': Date.now(),
          'profileData.extractedFromResume': true
        }
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: user.profileData
    });
  } catch (err) {
    console.error('Error updating parsed data:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single resume
// @route   GET /api/resumes/:id
// @access  Private
exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    // Make sure user owns the resume
    if (resume.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this resume'
      });
    }

    res.status(200).json({
      success: true,
      data: resume
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
// @access  Private
exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    // Make sure user owns the resume
    if (resume.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this resume'
      });
    }

    // Delete file from server
    fs.unlink(resume.filePath, async (err) => {
      if (err) {
        console.error(err);
      }

      // Delete from database
      await resume.deleteOne();

      // If this was the primary resume and user has other resumes, make the most recent one primary
      if (resume.isPrimary) {
        const mostRecentResume = await Resume.findOne({ user: req.user.id }).sort({ uploadedAt: -1 });
        if (mostRecentResume) {
          mostRecentResume.isPrimary = true;
          await mostRecentResume.save();
        }
      }

      res.status(200).json({
        success: true,
        data: {}
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Set a resume as primary
// @route   PUT /api/resumes/:id/primary
// @access  Private
exports.setPrimaryResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    // Make sure user owns the resume
    if (resume.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to modify this resume'
      });
    }

    // Remove primary flag from all user's resumes
    await Resume.updateMany(
      { user: req.user.id },
      { isPrimary: false }
    );

    // Set this resume as primary
    resume.isPrimary = true;
    await resume.save();

    res.status(200).json({
      success: true,
      data: resume
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Set profile as active for autofill
// @route   POST /api/resumes/profile/set-active
// @access  Private
exports.setProfileActive = async (req, res) => {
  try {
    // Update the user's profile data to set isActive to true
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          'profileData.isActive': true,
          'profileData.lastUpdated': Date.now()
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user.profileData
    });
  } catch (err) {
    console.error('Error setting profile as active:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get active profile data for autofill
// @route   GET /api/resumes/profile/active
// @access  Private
exports.getActiveProfile = async (req, res) => {
  try {
    // Find the user and get their profile data
    const user = await User.findById(req.user.id).select('profileData');
    
    if (!user || !user.profileData) {
      return res.status(404).json({
        success: false,
        error: 'No profile data found'
      });
    }
    
    // Check if profile is marked as active
    if (!user.profileData.isActive) {
      return res.status(404).json({
        success: false,
        error: 'No active profile found. Please set a profile as active in the dashboard.'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user.profileData
    });
  } catch (err) {
    console.error('Error fetching active profile:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
