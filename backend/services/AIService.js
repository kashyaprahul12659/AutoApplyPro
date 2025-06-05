const axios = require('axios');
const User = require('../models/User');

/**
 * Service for handling AI-related operations like cover letter generation
 */
class AIService {
  /**
   * Analyze job description against user profile to determine skill match
   * @param {Object} user - User object containing profile data
   * @param {String} jobDescription - Job description text
   * @returns {Object} Analysis results including match score, matched skills, missing skills, and suggestions
   */
  static async analyzeJobDescription(user, jobDescription) {
    try {
      // Get OpenAI API key
      const openaiApiKey = process.env.OPENAI_API_KEY;
      
      if (!openaiApiKey) {
        throw new Error('OpenAI API key is not configured.');
      }

      // Get user profile data
      const userProfile = await User.findById(user._id).select('profileData');
      
      if (!userProfile || !userProfile.profileData) {
        throw new Error('User profile data not found.');
      }

      // Extract relevant user information
      const { name, skills = [], education = [], experience = [] } = userProfile.profileData;
      
      // Create the experience text
      const experienceText = experience.map(exp => 
        `${exp.role} at ${exp.company}, ${exp.duration}`
      ).join('\n');
      
      // Create the education text
      const educationText = education.map(edu => 
        `${edu.degree} from ${edu.institution}, ${edu.year}`
      ).join('\n');
      
      // Create skills text
      const skillsText = Array.isArray(skills) ? skills.join(', ') : '';
      
      // Create the analysis prompt
      const prompt = `
      I want you to analyze this job description against my resume and provide me with the following:
      1. A match score (percentage) based on how well my skills and experience match the job requirements
      2. A list of my skills and experiences that match the job requirements
      3. A list of skills or qualifications that I'm missing for this job
      4. Suggested bullet points I could add to my resume to make it more appealing for this role
      
      Job Description:
      ${jobDescription}
      
      My Resume:
      Name: ${name}
      Skills: ${skillsText}
      
      Experience:
      ${experienceText}
      
      Education:
      ${educationText}
      
      Format your response as follows:
      {{
        "matchScore": 75,
        "matchedSkills": ["skill1", "skill2", "skill3"],
        "missingSkills": ["skill4", "skill5"],
        "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
        "jobTitle": "Extracted Job Title"
      }}
      
      Return ONLY the JSON with no additional text, markdown, or explanation.
      `;
      
      // Call OpenAI API
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an expert resume analyzer and job coach who helps candidates match their skills to job descriptions.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          response_format: { type: "json_object" }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiApiKey}`
          }
        }
      );
      
      // Parse the response
      const analysisText = response.data.choices[0].message.content.trim();
      const analysis = JSON.parse(analysisText);
      
      // Ensure analysis has all required fields
      return {
        matchScore: analysis.matchScore || 0,
        matchedSkills: analysis.matchedSkills || [],
        missingSkills: analysis.missingSkills || [],
        suggestions: analysis.suggestions || [],
        jobTitle: analysis.jobTitle || 'Job Position',
        descriptionSnippet: jobDescription.substring(0, 200) + '...'
      };
    } catch (error) {
      console.error('Error analyzing job description:', error);
      throw error;
    }
  }

  /**
   * Generate a cover letter based on user profile and job description
   * @param {Object} user - User object containing profile data
   * @param {String} jobDescription - Job description text
   * @param {String} jobRole - Selected job role
   * @returns {Object} Generated cover letter and extracted metadata
   */
  static async generateCoverLetter(user, jobDescription, jobRole) {
    try {
      // In a production environment, you'd use your own OpenAI API key
      const openaiApiKey = process.env.OPENAI_API_KEY;
      
      if (!openaiApiKey) {
        throw new Error('OpenAI API key is not configured.');
      }

      // Get user profile data
      const userProfile = await User.findById(user._id).select('profileData');
      
      if (!userProfile || !userProfile.profileData) {
        throw new Error('User profile data not found.');
      }

      // Extract relevant user information
      const { name, skills, education, experience } = userProfile.profileData;
      
      // Prepare prompt for OpenAI
      const prompt = this.preparePrompt(
        name,
        skills,
        education,
        experience,
        jobDescription,
        jobRole
      );
      
      // Call OpenAI API
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a professional cover letter writer with expertise in helping job seekers craft compelling cover letters.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiApiKey}`
          }
        }
      );
      
      // Extract the generated cover letter
      const coverLetter = response.data.choices[0].message.content.trim();
      
      // Extract job title and keywords
      const keywords = await this.extractKeywords(jobDescription, jobRole);
      
      return {
        coverLetter,
        jobTitle: jobRole,
        keywords,
        descriptionSnippet: jobDescription.substring(0, 200) + '...'
      };
    } catch (error) {
      console.error('Error generating cover letter:', error);
      throw error;
    }
  }
  
  /**
   * Prepare prompt for the AI model
   */
  static preparePrompt(name, skills, education, experience, jobDescription, jobRole) {
    const skillsText = Array.isArray(skills) ? skills.join(', ') : '';
    
    // Format education
    let educationText = '';
    if (Array.isArray(education) && education.length > 0) {
      educationText = education.map(edu => 
        `${edu.degree} from ${edu.institution}, ${edu.year}`
      ).join('; ');
    }
    
    // Format experience
    let experienceText = '';
    if (Array.isArray(experience) && experience.length > 0) {
      experienceText = experience.map(exp => 
        `${exp.role} at ${exp.company}, ${exp.duration}`
      ).join('; ');
    }
    
    return `
Create a professional cover letter for ${name} applying for a ${jobRole} position.

Candidate Profile:
- Skills: ${skillsText}
- Education: ${educationText}
- Experience: ${experienceText}

Job Description:
${jobDescription}

Please write a tailored cover letter that:
1. Starts with a professional greeting
2. Includes an engaging introduction stating the position being applied for
3. Highlights relevant skills and experiences that match the job requirements
4. Demonstrates understanding of the company's needs
5. Includes a compelling conclusion with a call to action
6. Ends with a professional sign-off
7. Is about 300-400 words
8. Uses a professional, confident tone
9. Specifically addresses how the candidate's background matches the job requirements
10. Avoids generic content and focuses on specific relevant experience

Return ONLY the cover letter text with no additional commentary.
`;
  }
  
  /**
   * Extract keywords and job title from job description
   */
  static async extractKeywords(jobDescription, jobRole) {
    try {
      // In a production app, you might use OpenAI or another NLP service to extract keywords
      // For simplicity, we'll use a basic approach here
      const commonKeywords = [
        'communication', 'leadership', 'teamwork', 'problem-solving',
        'analytical', 'detail-oriented', 'organized', 'project management',
        'javascript', 'react', 'node', 'express', 'mongodb', 'database',
        'frontend', 'backend', 'fullstack', 'development', 'software',
        'engineering', 'design', 'testing', 'deployment', 'agile',
        'scrum', 'git', 'github', 'ci/cd', 'cloud', 'aws', 'azure',
        'google cloud', 'docker', 'kubernetes', 'microservices'
      ];
      
      // Extract keywords that appear in the job description
      const keywords = commonKeywords.filter(keyword => 
        jobDescription.toLowerCase().includes(keyword.toLowerCase())
      );
      
      // Add job role keywords
      const roleKeywords = jobRole.toLowerCase().split(' ');
      
      // Combine and remove duplicates
      return [...new Set([...keywords, ...roleKeywords])];
    } catch (error) {
      console.error('Error extracting keywords:', error);
      return [];
    }
  }
}

module.exports = AIService;
