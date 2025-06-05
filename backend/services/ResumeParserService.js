const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const docxParser = require('docx-parser');
const Resume = require('../models/Resume');
const User = require('../models/User');

/**
 * Service to parse resume content and extract relevant information
 */
class ResumeParserService {
  /**
   * Parse a resume file and extract information
   * @param {string} filePath - Path to the resume file
   * @param {string} fileType - MIME type of the file
   * @returns {Promise<Object>} - Extracted resume data
   */
  static async parseResume(filePath, fileType) {
    try {
      let text = '';
      
      // Extract text based on file type
      if (fileType === 'application/pdf') {
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);
        text = pdfData.text;
      } else if (
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
        fileType === 'application/msword'
      ) {
        text = await new Promise((resolve, reject) => {
          docxParser.parseDocx(filePath, (error, output) => {
            if (error) reject(error);
            resolve(output);
          });
        });
      } else {
        throw new Error('Unsupported file format');
      }
      
      // Extract relevant information from text
      return this.extractInformation(text);
    } catch (error) {
      console.error('Error parsing resume:', error);
      throw error;
    }
  }
  
  /**
   * Extract structured information from resume text
   * @param {string} text - Raw text from resume
   * @returns {Object} - Structured resume data
   */
  static extractInformation(text) {
    // Initialize extracted data object
    const extractedData = {
      name: this.extractName(text),
      email: this.extractEmail(text),
      phone: this.extractPhone(text),
      education: this.extractEducation(text),
      experience: this.extractExperience(text),
      skills: this.extractSkills(text)
    };
    
    return extractedData;
  }
  
  /**
   * Process a newly uploaded resume
   * @param {string} resumeId - ID of the uploaded resume
   * @returns {Promise<Object>} - Parsed resume data
   */
  static async processResume(resumeId) {
    try {
      // Get resume information from database
      const resume = await Resume.findById(resumeId);
      if (!resume) {
        throw new Error('Resume not found');
      }
      
      // Parse resume and extract information
      const extractedData = await this.parseResume(resume.filePath, resume.fileType);
      
      // Update resume with extracted data
      resume.extractedData = extractedData;
      await resume.save();
      
      // Update user profile with extracted data
      await User.findByIdAndUpdate(resume.user, {
        $set: {
          'profileData.extractedFromResume': true,
          'profileData.name': extractedData.name || undefined,
          'profileData.email': extractedData.email || undefined,
          'profileData.phone': extractedData.phone || undefined,
          'profileData.education': extractedData.education || undefined,
          'profileData.experience': extractedData.experience || undefined,
          'profileData.skills': extractedData.skills || undefined
        }
      }, { new: true });
      
      return extractedData;
    } catch (error) {
      console.error('Error processing resume:', error);
      throw error;
    }
  }
  
  /**
   * Extract name from resume text
   * @param {string} text - Resume text
   * @returns {string} - Extracted name
   */
  static extractName(text) {
    // Basic name extraction (can be improved with NLP)
    const nameRegex = /([A-Z][a-z]+ [A-Z][a-z]+)/;
    const match = text.match(nameRegex);
    return match ? match[0] : '';
  }
  
  /**
   * Extract email from resume text
   * @param {string} text - Resume text
   * @returns {string} - Extracted email
   */
  static extractEmail(text) {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const match = text.match(emailRegex);
    return match ? match[0] : '';
  }
  
  /**
   * Extract phone number from resume text
   * @param {string} text - Resume text
   * @returns {string} - Extracted phone
   */
  static extractPhone(text) {
    const phoneRegex = /(\+?[0-9]{1,3}[-. ]?)?\(?[0-9]{3}\)?[-. ]?[0-9]{3}[-. ]?[0-9]{4}/;
    const match = text.match(phoneRegex);
    return match ? match[0] : '';
  }
  
  /**
   * Extract education details from resume text
   * @param {string} text - Resume text
   * @returns {Array} - Extracted education
   */
  static extractEducation(text) {
    const education = [];
    const educationSection = this.extractSection(text, 'education', 'experience');
    
    if (educationSection) {
      // Identify common degree keywords
      const degreeKeywords = [
        'Bachelor', 'Master', 'PhD', 'Doctorate', 'B.A', 'B.S', 'B.Sc', 'B.Tech', 
        'M.A', 'M.S', 'M.Sc', 'M.Tech', 'Associate', 'Certificate'
      ];
      
      // Simple pattern matching for education entries
      for (const degree of degreeKeywords) {
        const regex = new RegExp(`(${degree}[^\\n.]*(?:\\n|.)*?)(\\d{4})`, 'gi');
        let match;
        
        while ((match = regex.exec(educationSection)) !== null) {
          const degreeText = match[1].trim();
          const year = match[2];
          
          // Try to extract institution
          let institution = '';
          const instMatch = degreeText.match(/(?:at|from|in) ([\w\s]+)/i);
          if (instMatch) {
            institution = instMatch[1].trim();
          }
          
          education.push({
            degree: degreeText,
            institution: institution,
            year: year
          });
        }
      }
    }
    
    return education;
  }
  
  /**
   * Extract work experience from resume text
   * @param {string} text - Resume text
   * @returns {Array} - Extracted experience
   */
  static extractExperience(text) {
    const experience = [];
    const experienceSection = this.extractSection(text, 'experience', 'education|skills');
    
    if (experienceSection) {
      // Try to identify company-role patterns
      const lines = experienceSection.split('\n').filter(line => line.trim());
      
      let currentCompany = '';
      let currentRole = '';
      let currentDuration = '';
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Look for dates to identify job entries
        const dateRangeMatch = line.match(/(\w+ \d{4})\s*(?:-|to)\s*(\w+ \d{4}|Present)/i);
        if (dateRangeMatch) {
          currentDuration = dateRangeMatch[0];
          
          // If we found a duration and already have company info, add it
          if (currentCompany) {
            experience.push({
              company: currentCompany,
              role: currentRole || 'Not specified',
              duration: currentDuration
            });
            
            // Look for the next company name in the following line
            if (i + 1 < lines.length) {
              currentCompany = lines[i + 1].trim();
              currentRole = '';
            }
          }
        } 
        // If line has potential company indicators
        else if (line.match(/Inc\.|LLC|Ltd|Limited|Corporation|Corp|Company/i)) {
          currentCompany = line;
          
          // Try to find role in the next line
          if (i + 1 < lines.length) {
            currentRole = lines[i + 1].trim();
          }
        }
        // Check for common job titles to identify roles
        else if (line.match(/Manager|Developer|Engineer|Analyst|Director|Coordinator|Assistant|Officer|Lead|Supervisor|Specialist/i)) {
          currentRole = line;
        }
      }
    }
    
    return experience;
  }
  
  /**
   * Extract skills from resume text
   * @param {string} text - Resume text
   * @returns {Array} - Extracted skills
   */
  static extractSkills(text) {
    const skills = [];
    const skillsSection = this.extractSection(text, 'skills', 'education|experience|reference');
    
    if (skillsSection) {
      // Define common skill keywords to look for
      const skillKeywords = [
        'JavaScript', 'Python', 'Java', 'C\\+\\+', 'C#', 'Ruby', 'PHP', 'Go', 'Rust', 'Swift',
        'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Rails',
        'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Firebase', 'Redis', 'AWS', 'Azure', 'GCP',
        'Docker', 'Kubernetes', 'Jenkins', 'Git', 'REST', 'GraphQL', 'HTML', 'CSS', 'Sass',
        'Webpack', 'Babel', 'TypeScript', 'TensorFlow', 'PyTorch', 'Machine Learning', 'AI',
        'Data Analysis', 'SEO', 'UI/UX', 'Figma', 'Sketch', 'Photoshop', 'Illustrator', 
        'Project Management', 'Agile', 'Scrum', 'Kanban', 'Jira', 'Communication', 'Leadership'
      ];
      
      // Search for skills in the skills section
      for (const skill of skillKeywords) {
        const regex = new RegExp(`\\b${skill}\\b`, 'i');
        if (regex.test(skillsSection) || regex.test(text)) {
          skills.push(skill.replace('\\+\\+', '++'));
        }
      }
      
      // Look for bullet-point or comma-separated lists
      const bulletMatch = skillsSection.match(/[•●■\-]\s*([^•●■\-\n]+)/g);
      if (bulletMatch) {
        bulletMatch.forEach(bullet => {
          const cleanBullet = bullet.replace(/[•●■-]\s*/, '').trim();
          if (cleanBullet && !skills.includes(cleanBullet)) {
            skills.push(cleanBullet);
          }
        });
      }
      
      const commaMatch = skillsSection.match(/([^,]+,\s*)+[^,]+/g);
      if (commaMatch) {
        commaMatch.forEach(commaList => {
          commaList.split(',').forEach(item => {
            const cleanItem = item.trim();
            if (cleanItem && !skills.includes(cleanItem)) {
              skills.push(cleanItem);
            }
          });
        });
      }
    }
    
    return skills;
  }
  
  /**
   * Extract a section from resume text
   * @param {string} text - Resume text
   * @param {string} section - Section to extract (e.g., 'education')
   * @param {string} nextSection - Section that follows (optional)
   * @returns {string} - Extracted section text
   */
  static extractSection(text, section, nextSection) {
    // Create regex to find the section
    const sectionRegex = new RegExp(`\\b${section}\\b`, 'i');
    const sectionMatch = text.match(sectionRegex);
    
    if (!sectionMatch) {
      return '';
    }
    
    const sectionStart = sectionMatch.index;
    let sectionEnd = text.length;
    
    // Find the next section if provided
    if (nextSection) {
      const nextSectionRegex = new RegExp(`\\b(${nextSection})\\b`, 'i');
      const nextSectionMatch = text.slice(sectionStart).match(nextSectionRegex);
      
      if (nextSectionMatch) {
        sectionEnd = sectionStart + nextSectionMatch.index;
      }
    }
    
    return text.slice(sectionStart, sectionEnd).trim();
  }
}

module.exports = ResumeParserService;
