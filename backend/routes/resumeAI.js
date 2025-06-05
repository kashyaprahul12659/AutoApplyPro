const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const resumeBuilderController = require('../controllers/resumeBuilderController');

// @route   POST api/ai/improve-resume-block
// @desc    Improve resume block with AI
// @access  Private
router.post('/improve-resume-block', auth, resumeBuilderController.improveResumeBlock);

module.exports = router;
