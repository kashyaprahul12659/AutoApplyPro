const express = require('express');
const router = express.Router();
const clerkAuth = require('../middleware/clerkAuth');
const resumeBuilderController = require('../controllers/resumeBuilderController');

// @route   POST api/ai/improve-resume-block
// @desc    Improve resume block with AI
// @access  Private
router.post('/improve-resume-block', clerkAuth, resumeBuilderController.improveResumeBlock);

module.exports = router;
