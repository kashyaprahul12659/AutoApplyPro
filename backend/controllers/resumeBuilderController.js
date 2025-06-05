const ResumeBuilder = require('../models/ResumeBuilder');
const mongoose = require('mongoose');
const OpenAI = require('openai');
const config = require('config');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || config.get('openaiApiKey')
});

// @route   POST api/resumes/create
// @desc    Create a new resume
// @access  Private
exports.createResume = async (req, res) => {
  try {
    const { title, blocks, templateId } = req.body;
    
    // Validate input
    if (!title || !blocks || !Array.isArray(blocks)) {
      return res.status(400).json({ error: 'Invalid resume data' });
    }
    
    // Process blocks - ensure order property is set
    const processedBlocks = blocks.map((block, index) => ({
      ...block,
      order: block.order || index
    }));
    
    // Create new resume
    const resume = new ResumeBuilder({
      userId: req.user.id,
      title,
      blocks: processedBlocks,
      templateId: templateId || 'classic'
    });
    
    await resume.save();
    
    res.status(201).json({
      success: true,
      data: resume
    });
  } catch (error) {
    console.error('Error creating resume:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @route   GET api/resumes/all
// @desc    Get all resumes for a user
// @access  Private
exports.getAllResumes = async (req, res) => {
  try {
    const resumes = await ResumeBuilder.find({ userId: req.user.id })
      .sort({ updatedAt: -1 });
    
    res.json({
      success: true,
      count: resumes.length,
      data: resumes
    });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @route   GET api/resumes/:id
// @desc    Get resume by ID
// @access  Private
exports.getResumeById = async (req, res) => {
  try {
    const resume = await ResumeBuilder.findById(req.params.id);
    
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    // Check user
    if (resume.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to access this resume' });
    }
    
    res.json({
      success: true,
      data: resume
    });
  } catch (error) {
    console.error('Error fetching resume:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
};

// @route   PUT api/resumes/update/:id
// @desc    Update resume
// @access  Private
exports.updateResume = async (req, res) => {
  try {
    const { title, blocks, templateId } = req.body;
    
    // Validate input
    if ((!title && !blocks && !templateId) || (blocks && !Array.isArray(blocks))) {
      return res.status(400).json({ error: 'Invalid resume data' });
    }
    
    // Find resume
    let resume = await ResumeBuilder.findById(req.params.id);
    
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    // Check user
    if (resume.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this resume' });
    }
    
    // Process blocks if provided
    let updateData = {};
    if (title) updateData.title = title;
    if (templateId) updateData.templateId = templateId;
    
    if (blocks) {
      // Ensure order property is set
      const processedBlocks = blocks.map((block, index) => ({
        ...block,
        order: block.order || index
      }));
      updateData.blocks = processedBlocks;
    }
    
    // Update resume
    resume = await ResumeBuilder.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );
    
    res.json({
      success: true,
      data: resume
    });
  } catch (error) {
    console.error('Error updating resume:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
};

// @route   DELETE api/resumes/:id
// @desc    Delete resume
// @access  Private
exports.deleteResume = async (req, res) => {
  try {
    const resume = await ResumeBuilder.findById(req.params.id);
    
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    // Check user
    if (resume.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this resume' });
    }
    
    await ResumeBuilder.deleteOne({ _id: resume._id });
    
    res.json({
      success: true,
      message: 'Resume deleted'
    });
  } catch (error) {
    console.error('Error deleting resume:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
};

// @route   POST api/ai/improve-resume-block
// @desc    Improve resume block with AI
// @access  Private
exports.improveResumeBlock = async (req, res) => {
  try {
    const { blockType, content, targetRole } = req.body;
    
    if (!blockType || !content) {
      return res.status(400).json({ error: 'Block type and content are required' });
    }
    
    let prompt = '';
    let systemMessage = '';
    
    // Configure system message based on block type
    switch(blockType) {
      case 'summary':
        systemMessage = 'You are an expert resume writer. Improve the following professional summary to be concise, impactful, and achievement-oriented. Focus on quantifiable results and key skills.';
        if (targetRole) {
          systemMessage += ` Tailor it for a ${targetRole} position.`;
        }
        break;
        
      case 'experience':
        systemMessage = 'You are an expert resume writer. Improve the following job description to be concise, impactful, and achievement-oriented. Use strong action verbs and focus on quantifiable results.';
        if (targetRole) {
          systemMessage += ` Highlight skills and achievements relevant to a ${targetRole} position.`;
        }
        break;
        
      case 'skills':
        systemMessage = 'You are an expert resume writer. Based on the following skills list, suggest a more comprehensive and well-organized set of skills.';
        if (targetRole) {
          systemMessage += ` Focus on skills most relevant to a ${targetRole} position.`;
        }
        prompt = `Current skills: ${content}\n\nSuggested improved skills (return as a comma-separated list):`;
        break;
        
      default:
        systemMessage = 'You are an expert resume writer. Improve the following resume content to be more professional, concise, and impactful.';
    }
    
    if (!prompt) {
      prompt = `Original content:\n${content}\n\nImproved version:`;
    }
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.7
    });
    
    const improvedContent = response.choices[0].message.content.trim();
    
    res.json({
      success: true,
      data: {
        original: content,
        improved: improvedContent
      }
    });
  } catch (error) {
    console.error('Error improving resume block:', error);
    
    // Check if it's an OpenAI API error
    if (error.status && error.error) {
      return res.status(error.status || 500).json({ 
        error: 'AI processing error', 
        details: error.error
      });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
};

// @route   POST api/resumes/duplicate/:id
// @desc    Duplicate an existing resume
// @access  Private
exports.duplicateResume = async (req, res) => {
  try {
    const originalResume = await ResumeBuilder.findById(req.params.id);
    
    if (!originalResume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    // Check user
    if (originalResume.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to duplicate this resume' });
    }
    
    // Create new resume with same data
    const newResume = new ResumeBuilder({
      userId: req.user.id,
      title: `${originalResume.title} (Copy)`,
      blocks: originalResume.blocks,
      templateId: originalResume.templateId
    });
    
    await newResume.save();
    
    res.status(201).json({
      success: true,
      data: newResume
    });
  } catch (error) {
    console.error('Error duplicating resume:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
};
