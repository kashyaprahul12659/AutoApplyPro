const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const clerkAuth = require('../middleware/clerkAuth');
const jobTrackerController = require('../controllers/jobTrackerController');

// @route   GET api/job-tracker/all
// @desc    Get all job applications for a user
// @access  Private
router.get('/all', clerkAuth, jobTrackerController.getAllJobApplications);

// @route   POST api/job-tracker/add
// @desc    Add a new job application
// @access  Private
router.post(
  '/add',
  [
    clerkAuth,
    [
      check('jobTitle', 'Job title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty()
    ]
  ],
  jobTrackerController.addJobApplication
);

// @route   PUT api/job-tracker/update-status/:id
// @desc    Update job application status
// @access  Private
router.put('/update-status/:id', clerkAuth, jobTrackerController.updateJobStatus);

// @route   PUT api/job-tracker/:id
// @desc    Update job application details
// @access  Private
router.put(
  '/:id',
  [
    clerkAuth,
    [
      check('jobTitle', 'Job title is required').optional().not().isEmpty(),
      check('company', 'Company is required').optional().not().isEmpty(),
      check('status', 'Status must be valid').optional().isIn(['interested', 'applied', 'interview', 'offer', 'rejected'])
    ]
  ],
  jobTrackerController.updateJobApplication
);

// @route   DELETE api/job-tracker/:id
// @desc    Delete job application
// @access  Private
router.delete('/:id', clerkAuth, jobTrackerController.deleteJobApplication);

// @route   POST api/job-tracker/:id/generate-resume
// @desc    Generate custom resume based on job requirements
// @access  Private
router.post('/:id/generate-resume', clerkAuth, jobTrackerController.generateCustomResume);

// @route   GET api/job-tracker/:id/custom-resume
// @desc    Get custom resume for job application
// @access  Private
router.get('/:id/custom-resume', clerkAuth, jobTrackerController.getCustomResume);

module.exports = router;
