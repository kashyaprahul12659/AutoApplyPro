const express = require('express');
const router = express.Router();
const { 
  uploadResume, 
  getResumes, 
  getResume, 
  deleteResume, 
  setPrimaryResume,
  parseResume,
  getParsedData,
  updateParsedData,
  setProfileActive,
  getActiveProfile,
  upload
} = require('../controllers/resumeController');
const clerkAuth = require('../middleware/clerkAuth'); // Use Clerk auth instead

// @route   POST /api/resumes
// @desc    Upload a resume
// @access  Private
router.post('/', clerkAuth, (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
    next();
  });
}, uploadResume);

// @route   GET /api/resumes
// @desc    Get all user resumes
// @access  Private
router.get('/', clerkAuth, getResumes);

// @route   GET /api/resumes/parsed-data
// @desc    Get parsed resume data
// @access  Private
router.get('/parsed-data', clerkAuth, getParsedData);

// @route   PUT /api/resumes/parsed-data
// @desc    Update parsed resume data
// @access  Private
router.put('/parsed-data', clerkAuth, updateParsedData);

// @route   GET /api/resumes/:id
// @desc    Get single resume
// @access  Private
router.get('/:id', clerkAuth, getResume);

// @route   DELETE /api/resumes/:id
// @desc    Delete resume
// @access  Private
router.delete('/:id', clerkAuth, deleteResume);

// @route   PUT /api/resumes/:id/primary
// @desc    Set resume as primary
// @access  Private
router.put('/:id/primary', clerkAuth, setPrimaryResume);

// @route   POST /api/resumes/:id/parse
// @desc    Parse resume and extract data
// @access  Private
router.post('/:id/parse', clerkAuth, parseResume);

// @route   POST /api/resumes/profile/set-active
// @desc    Set profile as active for autofill
// @access  Private
router.post('/profile/set-active', clerkAuth, setProfileActive);

// @route   GET /api/resumes/profile/active
// @desc    Get active profile data for autofill
// @access  Private
router.get('/profile/active', clerkAuth, getActiveProfile);

module.exports = router;
