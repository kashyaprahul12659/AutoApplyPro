const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const resumeBuilderController = require('../controllers/resumeBuilderController');

// @route   POST api/resumes/create
// @desc    Create a new resume
// @access  Private
router.post('/create', auth, resumeBuilderController.createResume);

// @route   GET api/resumes/all
// @desc    Get all resumes for a user
// @access  Private
router.get('/all', auth, resumeBuilderController.getAllResumes);

// @route   GET api/resumes/:id
// @desc    Get resume by ID
// @access  Private
router.get('/:id', auth, resumeBuilderController.getResumeById);

// @route   PUT api/resumes/update/:id
// @desc    Update resume
// @access  Private
router.put('/update/:id', auth, resumeBuilderController.updateResume);

// @route   DELETE api/resumes/:id
// @desc    Delete resume
// @access  Private
router.delete('/:id', auth, resumeBuilderController.deleteResume);

// @route   POST api/resumes/duplicate/:id
// @desc    Duplicate an existing resume
// @access  Private
router.post('/duplicate/:id', auth, resumeBuilderController.duplicateResume);

module.exports = router;
