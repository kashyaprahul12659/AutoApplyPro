/**
 * AutoApply Pro - Enhanced Job Extractor Utility
 * 
 * Extracts comprehensive job details from popular job sites like LinkedIn, Indeed, etc.
 * Similar to CareerFlow AI extension functionality.
 * Used to auto-populate job tracker with detailed information.
 */

/**
 * Extract comprehensive job details from LinkedIn job page
 * @returns {Object} Job details or null if not found
 */
function extractLinkedInJobDetails() {
  try {
    // Check if we're on a LinkedIn job page
    if (!window.location.href.includes('linkedin.com/jobs/view/')) {
      return null;
    }
    
    // Extract job title
    const jobTitleElement = document.querySelector('.job-details-jobs-unified-top-card__job-title, .jobs-unified-top-card__job-title');
    const jobTitle = jobTitleElement ? jobTitleElement.textContent.trim() : '';
    
    // Extract company name
    const companyElement = document.querySelector('.job-details-jobs-unified-top-card__company-name, .jobs-unified-top-card__company-name');
    const company = companyElement ? companyElement.textContent.trim() : '';
    
    // Extract location
    const locationElement = document.querySelector('.job-details-jobs-unified-top-card__bullet, .jobs-unified-top-card__bullet');
    const location = locationElement ? locationElement.textContent.trim() : '';
    
    // Extract job description
    const jobDescElement = document.querySelector('.jobs-description__content, .jobs-box__html-content');
    const jobDescription = jobDescElement ? jobDescElement.textContent.trim() : '';
    
    // Extract salary information
    let salaryRange = { min: null, max: null, currency: 'USD' };
    const salaryElement = document.querySelector('.jobs-unified-top-card__salary, .job-details-jobs-unified-top-card__salary');
    if (salaryElement) {
      const salaryText = salaryElement.textContent.trim();
      const salaryMatch = salaryText.match(/\$?([\d,]+)(?:\s*-\s*\$?([\d,]+))?/);
      if (salaryMatch) {
        salaryRange.min = parseInt(salaryMatch[1].replace(/,/g, ''));
        if (salaryMatch[2]) {
          salaryRange.max = parseInt(salaryMatch[2].replace(/,/g, ''));
        }
      }
    }
    
    // Extract employment type
    let employmentType = 'full-time';
    const typeElement = document.querySelector('.jobs-unified-top-card__job-insight, .job-details-jobs-unified-top-card__job-insight');
    if (typeElement) {
      const typeText = typeElement.textContent.toLowerCase();
      if (typeText.includes('part-time')) employmentType = 'part-time';
      else if (typeText.includes('contract')) employmentType = 'contract';
      else if (typeText.includes('temporary')) employmentType = 'temporary';
      else if (typeText.includes('internship')) employmentType = 'internship';
    }
    
    // Extract work mode (remote/onsite/hybrid)
    let workMode = 'onsite';
    const workModeText = (jobDescription + location).toLowerCase();
    if (workModeText.includes('remote')) workMode = 'remote';
    else if (workModeText.includes('hybrid')) workMode = 'hybrid';
    
    // Extract experience level
    let experienceLevel = 'mid';
    const expText = jobDescription.toLowerCase();
    if (expText.includes('entry level') || expText.includes('0-1 year') || expText.includes('graduate')) {
      experienceLevel = 'entry';
    } else if (expText.includes('junior') || expText.includes('1-3 year')) {
      experienceLevel = 'junior';
    } else if (expText.includes('senior') || expText.includes('5+ year') || expText.includes('7+ year')) {
      experienceLevel = 'senior';
    } else if (expText.includes('lead') || expText.includes('principal') || expText.includes('architect')) {
      experienceLevel = 'lead';
    } else if (expText.includes('director') || expText.includes('vp') || expText.includes('executive')) {
      experienceLevel = 'executive';
    }
    
    // Extract skills from job description
    const skillsText = jobDescription.toLowerCase();
    const commonSkills = [
      'javascript', 'python', 'java', 'react', 'node.js', 'sql', 'html', 'css',
      'aws', 'docker', 'kubernetes', 'git', 'linux', 'typescript', 'angular',
      'vue.js', 'mongodb', 'postgresql', 'redis', 'elasticsearch', 'jenkins',
      'terraform', 'ansible', 'microservices', 'restapi', 'graphql', 'agile',
      'scrum', 'devops', 'ci/cd', 'machine learning', 'ai', 'data science',
      'pandas', 'numpy', 'tensorflow', 'pytorch', 'spark', 'hadoop'
    ];
    
    const requiredSkills = commonSkills.filter(skill => 
      skillsText.includes(skill.toLowerCase())
    );
    
    // Get job URL and ID
    const jdUrl = window.location.href;
    const jobIdMatch = jdUrl.match(/\/jobs\/view\/(\d+)/);
    const jobId = jobIdMatch ? jobIdMatch[1] : '';
    
    // Check if we have minimum required data
    if (!jobTitle || !company) {
      return null;
    }
    
    return {
      jobTitle,
      company,
      location,
      jdUrl,
      jobDescription,
      salaryRange,
      employmentType,
      workMode,
      experienceLevel,
      requiredSkills,
      preferredSkills: [],
      jobSource: 'linkedin',
      jobId,
      source: 'linkedin' // Keep for backward compatibility
    };
  } catch (error) {
    console.error('Error extracting LinkedIn job details:', error);
    return null;
  }
}

/**
 * Extract comprehensive job details from Indeed job page
 * @returns {Object} Job details or null if not found
 */
function extractIndeedJobDetails() {
  try {
    // Check if we're on an Indeed job page
    if (!window.location.href.includes('indeed.com/viewjob')) {
      return null;
    }
    
    // Extract job title
    const jobTitleElement = document.querySelector('.jobsearch-JobInfoHeader-title, h1[data-testid="jobTitle"]');
    const jobTitle = jobTitleElement ? jobTitleElement.textContent.trim() : '';
    
    // Extract company name
    const companyElement = document.querySelector('[data-testid="inlineCompanyName"], .jobsearch-InlineCompanyName');
    const company = companyElement ? companyElement.textContent.trim() : '';
    
    // Extract location
    const locationElement = document.querySelector('[data-testid="job-location"], .jobsearch-JobInfoHeader-subtitle');
    const location = locationElement ? locationElement.textContent.trim() : '';
    
    // Extract job description
    const jobDescElement = document.querySelector('#jobDescriptionText, .jobsearch-jobDescriptionText');
    const jobDescription = jobDescElement ? jobDescElement.textContent.trim() : '';
    
    // Extract salary information
    let salaryRange = { min: null, max: null, currency: 'USD' };
    const salaryElement = document.querySelector('.jobsearch-JobMetadataHeader-item, [data-testid="salaryRange"]');
    if (salaryElement) {
      const salaryText = salaryElement.textContent.trim();
      const salaryMatch = salaryText.match(/\$?([\d,]+)(?:\s*-\s*\$?([\d,]+))?/);
      if (salaryMatch) {
        salaryRange.min = parseInt(salaryMatch[1].replace(/,/g, ''));
        if (salaryMatch[2]) {
          salaryRange.max = parseInt(salaryMatch[2].replace(/,/g, ''));
        }
      }
    }
    
    // Extract employment type
    let employmentType = 'full-time';
    const typeElements = document.querySelectorAll('.jobsearch-JobMetadataHeader-item, [data-testid="job-type"]');
    typeElements.forEach(el => {
      const typeText = el.textContent.toLowerCase();
      if (typeText.includes('part-time')) employmentType = 'part-time';
      else if (typeText.includes('contract')) employmentType = 'contract';
      else if (typeText.includes('temporary')) employmentType = 'temporary';
      else if (typeText.includes('internship')) employmentType = 'internship';
    });
    
    // Extract work mode
    let workMode = 'onsite';
    const workModeText = (jobDescription + location).toLowerCase();
    if (workModeText.includes('remote')) workMode = 'remote';
    else if (workModeText.includes('hybrid')) workMode = 'hybrid';
    
    // Extract experience level
    let experienceLevel = 'mid';
    const expText = jobDescription.toLowerCase();
    if (expText.includes('entry level') || expText.includes('0-1 year') || expText.includes('graduate')) {
      experienceLevel = 'entry';
    } else if (expText.includes('junior') || expText.includes('1-3 year')) {
      experienceLevel = 'junior';
    } else if (expText.includes('senior') || expText.includes('5+ year') || expText.includes('7+ year')) {
      experienceLevel = 'senior';
    } else if (expText.includes('lead') || expText.includes('principal')) {
      experienceLevel = 'lead';
    } else if (expText.includes('director') || expText.includes('vp')) {
      experienceLevel = 'executive';
    }
    
    // Extract skills from job description
    const skillsText = jobDescription.toLowerCase();
    const commonSkills = [
      'javascript', 'python', 'java', 'react', 'node.js', 'sql', 'html', 'css',
      'aws', 'docker', 'kubernetes', 'git', 'linux', 'typescript', 'angular',
      'vue.js', 'mongodb', 'postgresql', 'redis', 'elasticsearch', 'jenkins',
      'terraform', 'ansible', 'microservices', 'restapi', 'graphql', 'agile',
      'scrum', 'devops', 'ci/cd', 'machine learning', 'ai', 'data science',
      'pandas', 'numpy', 'tensorflow', 'pytorch', 'spark', 'hadoop'
    ];
    
    const requiredSkills = commonSkills.filter(skill => 
      skillsText.includes(skill.toLowerCase())
    );
    
    // Get job URL and ID
    const jdUrl = window.location.href;
    const jobIdMatch = jdUrl.match(/jk=([^&]+)/);
    const jobId = jobIdMatch ? jobIdMatch[1] : '';
    
    // Check if we have minimum required data
    if (!jobTitle || !company) {
      return null;
    }
    
    return {
      jobTitle,
      company,
      location,
      jdUrl,
      jobDescription,
      salaryRange,
      employmentType,
      workMode,
      experienceLevel,
      requiredSkills,
      preferredSkills: [],
      jobSource: 'indeed',
      jobId,
      source: 'indeed' // Keep for backward compatibility
    };
  } catch (error) {
    console.error('Error extracting Indeed job details:', error);
    return null;
  }
}

/**
 * Extract comprehensive job details from Glassdoor job page
 * @returns {Object} Job details or null if not found
 */
function extractGlassdoorJobDetails() {
  try {
    // Check if we're on a Glassdoor job page
    if (!window.location.href.includes('glassdoor.com/job-listing/') && 
        !window.location.href.includes('glassdoor.com/Jobs/')) {
      return null;
    }
    
    // Extract job title
    const jobTitleElement = document.querySelector('.job-title, [data-test="job-title"], .jobTitle');
    const jobTitle = jobTitleElement ? jobTitleElement.textContent.trim() : '';
    
    // Extract company name
    const companyElement = document.querySelector('.employer-name, [data-test="employer-name"], .companyName');
    const company = companyElement ? companyElement.textContent.trim() : '';
    
    // Extract location
    const locationElement = document.querySelector('.location, [data-test="job-location"], .jobLocation');
    const location = locationElement ? locationElement.textContent.trim() : '';
    
    // Extract job description
    const jobDescElement = document.querySelector('.jobDescriptionContent, [data-test="job-description"]');
    const jobDescription = jobDescElement ? jobDescElement.textContent.trim() : '';
    
    // Extract salary information
    let salaryRange = { min: null, max: null, currency: 'USD' };
    const salaryElement = document.querySelector('.salary, [data-test="salary"], .salaryRange');
    if (salaryElement) {
      const salaryText = salaryElement.textContent.trim();
      const salaryMatch = salaryText.match(/\$?([\d,]+)(?:\s*-\s*\$?([\d,]+))?/);
      if (salaryMatch) {
        salaryRange.min = parseInt(salaryMatch[1].replace(/,/g, ''));
        if (salaryMatch[2]) {
          salaryRange.max = parseInt(salaryMatch[2].replace(/,/g, ''));
        }
      }
    }
    
    // Extract other details similar to LinkedIn/Indeed
    let employmentType = 'full-time';
    let workMode = 'onsite';
    let experienceLevel = 'mid';
    
    const workModeText = (jobDescription + location).toLowerCase();
    if (workModeText.includes('remote')) workMode = 'remote';
    else if (workModeText.includes('hybrid')) workMode = 'hybrid';
    
    const expText = jobDescription.toLowerCase();
    if (expText.includes('entry level') || expText.includes('0-1 year')) {
      experienceLevel = 'entry';
    } else if (expText.includes('senior') || expText.includes('5+ year')) {
      experienceLevel = 'senior';
    }
    
    // Extract skills
    const skillsText = jobDescription.toLowerCase();
    const commonSkills = [
      'javascript', 'python', 'java', 'react', 'node.js', 'sql', 'html', 'css',
      'aws', 'docker', 'kubernetes', 'git', 'linux', 'typescript', 'angular',
      'vue.js', 'mongodb', 'postgresql', 'redis'
    ];
    
    const requiredSkills = commonSkills.filter(skill => 
      skillsText.includes(skill.toLowerCase())
    );
    
    // Get job URL and ID
    const jdUrl = window.location.href;
    const jobIdMatch = jdUrl.match(/jobListingId=(\d+)/);
    const jobId = jobIdMatch ? jobIdMatch[1] : '';
    
    // Check if we have minimum required data
    if (!jobTitle || !company) {
      return null;
    }
    
    return {
      jobTitle,
      company,
      location,
      jdUrl,
      jobDescription,
      salaryRange,
      employmentType,
      workMode,
      experienceLevel,
      requiredSkills,
      preferredSkills: [],
      jobSource: 'glassdoor',
      jobId,
      source: 'glassdoor' // Keep for backward compatibility
    };
  } catch (error) {
    console.error('Error extracting Glassdoor job details:', error);
    return null;
  }
}

/**
 * Extract job details from AngelList/Wellfound job page
 * @returns {Object} Job details or null if not found
 */
function extractAngelListJobDetails() {
  try {
    // Check if we're on AngelList/Wellfound
    if (!window.location.href.includes('angel.co/') && 
        !window.location.href.includes('wellfound.com/')) {
      return null;
    }
    
    // Extract job title
    const jobTitleElement = document.querySelector('[data-test="JobTitle"], .job-title, h1');
    const jobTitle = jobTitleElement ? jobTitleElement.textContent.trim() : '';
    
    // Extract company name
    const companyElement = document.querySelector('[data-test="CompanyName"], .company-name');
    const company = companyElement ? companyElement.textContent.trim() : '';
    
    // Extract location
    const locationElement = document.querySelector('[data-test="JobLocation"], .location');
    const location = locationElement ? locationElement.textContent.trim() : '';
    
    const jdUrl = window.location.href;
    
    if (!jobTitle || !company) {
      return null;
    }
    
    return {
      jobTitle,
      company,
      location,
      jdUrl,
      jobDescription: '',
      salaryRange: { min: null, max: null, currency: 'USD' },
      employmentType: 'full-time',
      workMode: 'onsite',
      experienceLevel: 'mid',
      requiredSkills: [],
      preferredSkills: [],
      jobSource: 'other',
      jobId: '',
      source: 'angellist'
    };
  } catch (error) {
    console.error('Error extracting AngelList job details:', error);
    return null;
  }
}

/**
 * Generic extractor for any job site not specifically supported
 * @returns {Object} Job details or null if not found
 */
function extractGenericJobDetails() {
  try {
    // Common selectors used across job sites
    const titleSelectors = [
      'h1', '.job-title', '.jobTitle', '[data-test*="title"]', '[class*="title"]',
      '.position-title', '.job-name', '.role-title'
    ];
    
    const companySelectors = [
      '.company-name', '.companyName', '[data-test*="company"]', '[class*="company"]',
      '.employer-name', '.organization', '.business-name'
    ];
    
    const locationSelectors = [
      '.location', '.jobLocation', '[data-test*="location"]', '[class*="location"]',
      '.job-location', '.workplace', '.address'
    ];
    
    // Try to find job title
    let jobTitle = '';
    for (const selector of titleSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim()) {
        jobTitle = element.textContent.trim();
        break;
      }
    }
    
    // Try to find company name
    let company = '';
    for (const selector of companySelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim()) {
        company = element.textContent.trim();
        break;
      }
    }
    
    // Try to find location
    let location = '';
    for (const selector of locationSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim()) {
        location = element.textContent.trim();
        break;
      }
    }
    
    // Check if we have minimum data
    if (!jobTitle || !company) {
      return null;
    }
    
    return {
      jobTitle,
      company,
      location,
      jdUrl: window.location.href,
      jobDescription: '',
      salaryRange: { min: null, max: null, currency: 'USD' },
      employmentType: 'full-time',
      workMode: 'onsite',
      experienceLevel: 'mid',
      requiredSkills: [],
      preferredSkills: [],
      jobSource: 'other',
      jobId: '',
      source: 'generic'
    };
  } catch (error) {
    console.error('Error extracting generic job details:', error);
    return null;
  }
}

/**
 * Main function to extract comprehensive job details from current page
 * Tries multiple extractors in order of preference
 * @returns {Object} Job details or null if not found
 */
function extractJobDetails() {
  const url = window.location.href.toLowerCase();
  
  // Try specific extractors first based on URL
  if (url.includes('linkedin.com')) {
    const details = extractLinkedInJobDetails();
    if (details) return details;
  }
  
  if (url.includes('indeed.com')) {
    const details = extractIndeedJobDetails();
    if (details) return details;
  }
  
  if (url.includes('glassdoor.com')) {
    const details = extractGlassdoorJobDetails();
    if (details) return details;
  }
  
  if (url.includes('angel.co') || url.includes('wellfound.com')) {
    const details = extractAngelListJobDetails();
    if (details) return details;
  }
  
  // If no specific extractor worked, try generic extraction
  const details = extractGenericJobDetails();
  if (details) return details;
  
  // If all else fails, return null
  return null;
}

/**
 * Enhanced job details extraction with AI-powered skill detection
 * @returns {Object} Enhanced job details
 */
function extractEnhancedJobDetails() {
  const basicDetails = extractJobDetails();
  
  if (!basicDetails) {
    return null;
  }
  
  // Add timestamp and additional metadata
  const enhancedDetails = {
    ...basicDetails,
    extractedAt: new Date().toISOString(),
    pageTitle: document.title,
    userAgent: navigator.userAgent,
    
    // Additional extracted information
    applicationDeadline: extractDeadline(),
    contactInfo: extractContactInfo(),
    benefits: extractBenefits(),
    requirements: extractRequirements()
  };
  
  return enhancedDetails;
}

/**
 * Extract application deadline from job posting
 * @returns {Date|null} Deadline date or null
 */
function extractDeadline() {
  const deadlineSelectors = [
    '.deadline', '.application-deadline', '[class*="deadline"]',
    '.closing-date', '.apply-by', '.expires'
  ];
  
  for (const selector of deadlineSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      const dateText = element.textContent.trim();
      const date = new Date(dateText);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
  }
  
  return null;
}

/**
 * Extract contact information from job posting
 * @returns {Object} Contact info object
 */
function extractContactInfo() {
  const contactInfo = {
    recruiterName: '',
    recruiterEmail: '',
    recruiterLinkedIn: ''
  };
  
  // Look for email addresses
  const emailMatch = document.body.textContent.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    contactInfo.recruiterEmail = emailMatch[0];
  }
  
  return contactInfo;
}

/**
 * Extract benefits from job posting
 * @returns {Array} Array of benefits
 */
function extractBenefits() {
  const benefitsText = document.body.textContent.toLowerCase();
  const commonBenefits = [
    'health insurance', 'dental insurance', 'vision insurance',
    '401k', 'retirement plan', 'paid time off', 'pto', 'vacation',
    'remote work', 'work from home', 'flexible hours', 'flexible schedule',
    'health and wellness', 'gym membership', 'professional development',
    'tuition reimbursement', 'stock options', 'equity', 'bonus'
  ];
  
  return commonBenefits.filter(benefit => benefitsText.includes(benefit));
}

/**
 * Extract job requirements from job posting
 * @returns {Array} Array of requirements
 */
function extractRequirements() {
  const requirementsText = document.body.textContent.toLowerCase();
  const commonRequirements = [
    'bachelor degree', 'master degree', 'phd', 'certification',
    'years of experience', 'programming experience', 'software development',
    'team leadership', 'project management', 'communication skills',
    'problem solving', 'analytical skills', 'technical skills'
  ];
  
  return commonRequirements.filter(req => requirementsText.includes(req));
}

// Export all functions for external use
window.AutoApplyJobExtractor = {
  extractJobDetails,
  extractEnhancedJobDetails,
  extractLinkedInJobDetails,
  extractIndeedJobDetails,
  extractGlassdoorJobDetails,
  extractAngelListJobDetails,
  extractGenericJobDetails,
  extractDeadline,
  extractContactInfo,
  extractBenefits,
  extractRequirements
};
