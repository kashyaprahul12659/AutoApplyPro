const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const JDAnalysisResult = require('../models/JDAnalysisResult');
const User = require('../models/User');
const Resume = require('../models/Resume');

// @route   POST /api/jd-analyzer/analyze
// @desc    Analyze job description against user's resume
// @access  Private
router.post('/analyze', auth, async (req, res) => {
  try {
    const { jobDescription } = req.body;
    
    if (!jobDescription || jobDescription.length < 100) {
      return res.status(400).json({
        success: false,
        error: 'Job description is too short or missing'
      });
    }
    
    // Get user's active profile
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Check if user has an active profile
    const activeResume = await Resume.findOne({ 
      user: req.user.id,
      isActive: true
    });
    
    if (!activeResume || !activeResume.parsedData) {
      return res.status(404).json({
        success: false,
        error: 'No active resume profile found'
      });
    }
    
    const resumeData = activeResume.parsedData;
    
    // Extract user skills from resume
    const userSkills = resumeData.skills || [];
    
    // Extract skills from job description
    const jobSkills = extractSkillsFromJobDescription(jobDescription);
    
    // Compare skills and calculate match score
    const { matchedSkills, missingSkills, matchScore } = compareSkills(userSkills, jobSkills);
    
    // Generate suggestions
    const suggestions = generateSuggestions(matchedSkills, missingSkills, jobDescription);
    
    // Create analysis result object
    const analysisResult = {
      jobDescription: jobDescription,
      matchedSkills,
      missingSkills,
      matchScore,
      suggestions
    };
    
    // Return the analysis result
    return res.status(200).json({
      success: true,
      data: analysisResult
    });
    
  } catch (error) {
    console.error('Error analyzing job description:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/jd-analyzer/save
// @desc    Save job description analysis results
// @access  Private
router.post('/save', auth, async (req, res) => {
  try {
    const { 
      jobTitle, 
      jobDescription, 
      matchScore, 
      matchedSkills, 
      missingSkills, 
      suggestions,
      sourceUrl
    } = req.body;
    
    // Validate required fields
    if (!jobTitle || !jobDescription || matchScore === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }
    
    // Create new JD analysis result
    const jdAnalysisResult = new JDAnalysisResult({
      user: req.user.id,
      jobTitle,
      jobDescription,
      matchScore,
      matchedSkills,
      missingSkills,
      suggestions,
      sourceUrl
    });
    
    // Save to database
    await jdAnalysisResult.save();
    
    return res.status(200).json({
      success: true,
      data: jdAnalysisResult
    });
    
  } catch (error) {
    console.error('Error saving analysis result:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/jd-analyzer/history
// @desc    Get user's JD analysis history
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const analysisResults = await JDAnalysisResult.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      count: analysisResults.length,
      data: analysisResults
    });
    
  } catch (error) {
    console.error('Error fetching analysis history:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Helper function to extract skills from job description
function extractSkillsFromJobDescription(jobDescription) {
  // Common technical skills to look for
  const commonSkills = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'C#', 'Ruby',
    'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'AWS', 'Azure', 'GCP',
    'Docker', 'Kubernetes', 'HTML', 'CSS', 'TypeScript', 'Angular', 'Vue.js',
    'Django', 'Flask', 'Spring', 'Express', 'REST API', 'GraphQL', 'Git',
    'CI/CD', 'Jenkins', 'Agile', 'Scrum', 'Jira', 'TDD', 'BDD', 'DevOps',
    'Linux', 'Windows', 'MacOS', 'iOS', 'Android', 'Swift', 'Kotlin',
    'PHP', 'Laravel', 'Symfony', 'WordPress', 'SEO', 'SEM', 'UI/UX',
    'Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator',
    'Product Management', 'Data Analysis', 'Machine Learning', 'AI',
    'NLP', 'Computer Vision', 'Data Science', 'Big Data', 'Hadoop',
    'Spark', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'R',
    'Communication', 'Leadership', 'Teamwork', 'Problem Solving',
    'Critical Thinking', 'Time Management', 'Project Management'
  ];
  
  // Extract skills from job description
  const skills = [];
  const jobDescLower = jobDescription.toLowerCase();
  
  for (const skill of commonSkills) {
    const skillLower = skill.toLowerCase();
    if (jobDescLower.includes(skillLower)) {
      skills.push(skill);
    }
  }
  
  return skills;
}

// Helper function to compare skills and calculate match score
function compareSkills(userSkills, jobSkills) {
  const matchedSkills = [];
  const missingSkills = [];
  
  // Check which skills match and which are missing
  for (const skill of jobSkills) {
    const skillLower = skill.toLowerCase();
    const found = userSkills.some(userSkill => userSkill.toLowerCase() === skillLower);
    
    if (found) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }
  
  // Calculate match score
  let matchScore = 0;
  if (jobSkills.length > 0) {
    matchScore = Math.round((matchedSkills.length / jobSkills.length) * 100);
  }
  
  return {
    matchedSkills,
    missingSkills,
    matchScore
  };
}

// Helper function to generate suggestions based on analysis
function generateSuggestions(matchedSkills, missingSkills, jobDescription) {
  const suggestions = [];
  
  // Add basic suggestions
  if (matchedSkills.length > 0) {
    suggestions.push(`Highlight your experience with ${matchedSkills.slice(0, 3).join(', ')} in your resume and cover letter.`);
  }
  
  if (missingSkills.length > 0) {
    suggestions.push(`Consider adding ${missingSkills.slice(0, 3).join(', ')} to your skill set through courses or projects.`);
  }
  
  // Add tailored suggestions based on match score
  if (missingSkills.length > 3) {
    suggestions.push(`Customize your resume to specifically address the requirements for ${missingSkills.slice(0, 3).join(', ')}.`);
  }
  
  if (jobDescription.toLowerCase().includes('team') || 
      jobDescription.toLowerCase().includes('collaborat')) {
    suggestions.push('Emphasize your teamwork and collaboration skills in your application.');
  }
  
  if (jobDescription.toLowerCase().includes('leader') || 
      jobDescription.toLowerCase().includes('manage')) {
    suggestions.push('Highlight any leadership or management experience in your resume.');
  }
  
  if (jobDescription.toLowerCase().includes('problem solv') || 
      jobDescription.toLowerCase().includes('challenges')) {
    suggestions.push('Include examples of problem-solving abilities in your cover letter.');
  }
  
  return suggestions;
}

module.exports = router;
