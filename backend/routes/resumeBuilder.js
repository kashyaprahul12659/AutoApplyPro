const express = require('express');
const router = express.Router();
const clerkAuth = require('../middleware/clerkAuth');
const resumeBuilderController = require('../controllers/resumeBuilderController');

// @route   POST api/resumes/create
// @desc    Create a new resume
// @access  Private
router.post('/create', clerkAuth, resumeBuilderController.createResume);

// @route   GET api/resumes/all
// @desc    Get all resumes for a user
// @access  Private
router.get('/all', clerkAuth, resumeBuilderController.getAllResumes);

// @route   GET api/resumes/:id
// @desc    Get resume by ID
// @access  Private
router.get('/:id', clerkAuth, resumeBuilderController.getResumeById);

// @route   PUT api/resumes/update/:id
// @desc    Update resume
// @access  Private
router.put('/update/:id', clerkAuth, resumeBuilderController.updateResume);

// @route   DELETE api/resumes/:id
// @desc    Delete resume
// @access  Private
router.delete('/:id', clerkAuth, resumeBuilderController.deleteResume);

// @route   POST api/resumes/duplicate/:id
// @desc    Duplicate an existing resume
// @access  Private
router.post('/duplicate/:id', clerkAuth, resumeBuilderController.duplicateResume);

module.exports = router;
