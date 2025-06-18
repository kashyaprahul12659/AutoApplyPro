/**
 * Enhanced Job Details Extractor
 * Extracts comprehensive job information from various job boards
 * Similar to CareerFlow AI functionality
 */

class JobDetailsExtractor {
  constructor() {
    // Common job board selectors
    this.jobBoardSelectors = {
      linkedin: {
        title: [
          '.job-details-jobs-unified-top-card__job-title h1',
          '.jobs-unified-top-card__job-title',
          '.job-title',
          'h1[data-test-id="job-title"]'
        ],
        company: [
          '.job-details-jobs-unified-top-card__company-name a',
          '.jobs-unified-top-card__company-name',
          '.company-name',
          'a[data-test-id="job-poster-name"]'
        ],
        location: [
          '.job-details-jobs-unified-top-card__bullet',
          '.jobs-unified-top-card__bullet',
          '.job-location'
        ],
        description: [
          '#job-details',
          '.job-view-layout .jobs-description__content',
          '.jobs-box__html-content'
        ],
        requirements: [
          '.job-criteria-list',
          '.job-details-preferences-and-skills'
        ],
        salary: [
          '.salary-main-rail',
          '.job-details-salary',
          '.compensation-insights'
        ]
      },
      indeed: {
        title: [
          'h1[data-testid="jobsearch-JobInfoHeader-title"]',
          '.jobsearch-JobInfoHeader-title',
          'h1.icl-u-xs-mb--xs'
        ],
        company: [
          'a[data-testid="inlineHeader-companyName"]',
          '.icl-u-lg-mr--sm',
          'span.company'
        ],
        location: [
          'div[data-testid="inlineHeader-companyLocation"]',
          '.jobsearch-InlineCompanyRating + div',
          '.icl-u-xs-mt--xs'
        ],
        description: [
          '#jobDescriptionText',
          '.jobsearch-jobDescriptionText',
          '.job-description'
        ],
        salary: [
          '.icl-u-xs-mr--xs .attribute_snippet',
          '.salary-snippet'
        ]
      },
      glassdoor: {
        title: [
          'h1[data-test="job-title"]',
          '.job-title'
        ],
        company: [
          'div[data-test="employer-name"] a',
          '.employer-name'
        ],
        location: [
          'div[data-test="job-location"]',
          '.location'
        ],
        description: [
          'div[data-test="jobDescriptionContainer"]',
          '.job-description-content'
        ]
      },
      generic: {
        title: [
          'h1',
          '[class*="job-title"]',
          '[class*="position"]',
          '[data-testid*="title"]',
          '[id*="title"]'
        ],
        company: [
          '[class*="company"]',
          '[class*="employer"]',
          '[data-testid*="company"]',
          '[id*="company"]'
        ],
        location: [
          '[class*="location"]',
          '[class*="address"]',
          '[data-testid*="location"]',
          '[id*="location"]'
        ],
        description: [
          '[class*="description"]',
          '[class*="content"]',
          '[data-testid*="description"]',
          '[id*="description"]'
        ]
      }
    };

    // Salary pattern matching
    this.salaryPatterns = [
      /\$?([\d,]+)\s*-\s*\$?([\d,]+)\s*(k|K)?\s*(per|\/)\s*(year|annual|yr)/i,
      /\$?([\d,]+)\s*(k|K)?\s*-\s*\$?([\d,]+)\s*(k|K)?\s*$/i,
      /\$?([\d,]+)\s*(k|K)?\s*(per|\/)\s*(year|annual|yr|hour|hr)/i,
      /salary:\s*\$?([\d,]+)\s*-?\s*\$?([\d,]+)?/i
    ];

    // Experience level patterns
    this.experiencePatterns = [
      /(\d+)\+?\s*-?\s*(\d+)?\s*years?\s*(of\s*)?experience/i,
      /entry.level|junior|graduate|intern/i,
      /senior|lead|principal|staff/i,
      /mid.level|intermediate/i
    ];

    // Job type patterns
    this.jobTypePatterns = [
      /full.?time|permanent/i,
      /part.?time/i,
      /contract|contractor|consulting/i,
      /internship|intern/i,
      /freelance|temporary|temp/i
    ];

    // Work mode patterns
    this.workModePatterns = [
      /remote|work.from.home|wfh/i,
      /on.?site|office|in.person/i,
      /hybrid/i
    ];
  }

  /**
   * Extract comprehensive job details from current page
   * @returns {Object} Job details object
   */
  extractJobDetails() {
    const url = window.location.href;
    const domain = this.getDomainFromUrl(url);
    const jobBoard = this.identifyJobBoard(domain);
    
    console.log(`[JobDetailsExtractor] Extracting from ${jobBoard} (${domain})`);
    
    const selectors = this.jobBoardSelectors[jobBoard] || this.jobBoardSelectors.generic;
    
    const jobDetails = {
      // Basic information
      jobTitle: this.extractWithSelectors(selectors.title),
      company: this.extractWithSelectors(selectors.company),
      location: this.extractWithSelectors(selectors.location),
      jdUrl: url,
      jobBoard: jobBoard,
      
      // Enhanced information
      jobDescription: this.extractJobDescription(selectors.description),
      requirements: this.extractRequirements(),
      salary: this.extractSalary(),
      jobType: this.extractJobType(),
      workMode: this.extractWorkMode(),
      experience: this.extractExperience(),
      
      // Metadata
      extractedAt: new Date().toISOString(),
      pageTitle: document.title
    };

    // Clean and validate extracted data
    this.cleanJobDetails(jobDetails);
    
    console.log('[JobDetailsExtractor] Extracted details:', jobDetails);
    return jobDetails;
  }

  /**
   * Extract text using multiple selectors
   * @param {Array} selectors Array of CSS selectors to try
   * @returns {String} Extracted text or empty string
   */
  extractWithSelectors(selectors) {
    if (!selectors) return '';
    
    for (const selector of selectors) {
      try {
        const element = document.querySelector(selector);
        if (element) {
          const text = element.textContent?.trim();
          if (text && text.length > 0) {
            return text;
          }
        }
      } catch (error) {
        console.warn(`[JobDetailsExtractor] Error with selector ${selector}:`, error);
      }
    }
    return '';
  }

  /**
   * Extract job description with intelligent content detection
   * @param {Array} selectors Description selectors
   * @returns {String} Job description
   */
  extractJobDescription(selectors) {
    // Try specific selectors first
    let description = this.extractWithSelectors(selectors);
    
    // If no description found with specific selectors, try generic approach
    if (!description || description.length < 100) {
      // Look for large text blocks that might contain job description
      const textBlocks = Array.from(document.querySelectorAll('div, section, article, p'))
        .map(el => ({
          element: el,
          text: el.textContent?.trim() || '',
          wordCount: (el.textContent?.trim() || '').split(/\s+/).length
        }))
        .filter(block => block.wordCount > 50 && block.wordCount < 2000)
        .sort((a, b) => b.wordCount - a.wordCount);

      if (textBlocks.length > 0) {
        description = textBlocks[0].text;
      }
    }
    
    // Limit description length
    if (description.length > 5000) {
      description = description.substring(0, 5000) + '...';
    }
    
    return description;
  }

  /**
   * Extract job requirements and skills
   * @returns {Array} Array of requirements/skills
   */
  extractRequirements() {
    const requirements = [];
    const skillKeywords = [
      'react', 'vue', 'angular', 'javascript', 'typescript', 'python', 'java', 'node.js',
      'html', 'css', 'sql', 'mongodb', 'postgresql', 'aws', 'azure', 'docker', 'kubernetes',
      'git', 'agile', 'scrum', 'bachelor', 'master', 'degree', 'certification'
    ];
    
    // Look for requirement lists
    const listElements = document.querySelectorAll('ul li, ol li');
    listElements.forEach(li => {
      const text = li.textContent?.trim();
      if (text && text.length > 10 && text.length < 200) {
        // Check if it looks like a requirement
        if (text.toLowerCase().includes('experience') || 
            text.toLowerCase().includes('skill') ||
            text.toLowerCase().includes('knowledge') ||
            text.toLowerCase().includes('proficiency') ||
            skillKeywords.some(skill => text.toLowerCase().includes(skill))) {
          requirements.push(text);
        }
      }
    });
    
    return requirements.slice(0, 20); // Limit to 20 requirements
  }

  /**
   * Extract salary information
   * @returns {Object} Salary object with min, max, currency, period
   */
  extractSalary() {
    const pageText = document.body.textContent || '';
    const salary = {
      min: null,
      max: null,
      currency: 'USD',
      period: 'yearly'
    };
    
    for (const pattern of this.salaryPatterns) {
      const match = pageText.match(pattern);
      if (match) {
        let min = match[1] ? parseInt(match[1].replace(/,/g, '')) : null;
        let max = match[2] ? parseInt(match[2].replace(/,/g, '')) : null;
        
        // Handle 'k' suffix
        if ((match[3] && match[3].toLowerCase() === 'k') || 
            (match[4] && match[4].toLowerCase() === 'k')) {
          if (min) min *= 1000;
          if (max) max *= 1000;
        }
        
        // Determine period
        if (match[5] && (match[5].includes('hour') || match[5].includes('hr'))) {
          salary.period = 'hourly';
        }
        
        salary.min = min;
        salary.max = max;
        break;
      }
    }
    
    return salary.min || salary.max ? salary : null;
  }

  /**
   * Extract job type (full-time, part-time, etc.)
   * @returns {String} Job type
   */
  extractJobType() {
    const pageText = document.body.textContent?.toLowerCase() || '';
    
    for (const pattern of this.jobTypePatterns) {
      if (pattern.test(pageText)) {
        if (/full.?time|permanent/.test(pageText)) return 'full-time';
        if (/part.?time/.test(pageText)) return 'part-time';
        if (/contract|contractor|consulting/.test(pageText)) return 'contract';
        if (/internship|intern/.test(pageText)) return 'internship';
        if (/freelance|temporary|temp/.test(pageText)) return 'freelance';
      }
    }
    
    return 'full-time'; // Default
  }

  /**
   * Extract work mode (remote, onsite, hybrid)
   * @returns {String} Work mode
   */
  extractWorkMode() {
    const pageText = document.body.textContent?.toLowerCase() || '';
    
    if (/remote|work.from.home|wfh/.test(pageText)) return 'remote';
    if (/hybrid/.test(pageText)) return 'hybrid';
    return 'onsite'; // Default
  }

  /**
   * Extract experience level
   * @returns {String} Experience level
   */
  extractExperience() {
    const pageText = document.body.textContent || '';
    
    for (const pattern of this.experiencePatterns) {
      const match = pageText.match(pattern);
      if (match) {
        if (/entry.level|junior|graduate|intern/.test(match[0])) {
          return 'Entry level';
        } else if (/senior|lead|principal|staff/.test(match[0])) {
          return 'Senior level';
        } else if (match[1]) {
          return `${match[1]}${match[2] ? '-' + match[2] : '+'} years`;
        }
      }
    }
    
    return '';
  }

  /**
   * Identify job board from domain
   * @param {String} domain Website domain
   * @returns {String} Job board identifier
   */
  identifyJobBoard(domain) {
    if (domain.includes('linkedin.com')) return 'linkedin';
    if (domain.includes('indeed.com')) return 'indeed';
    if (domain.includes('glassdoor.com')) return 'glassdoor';
    if (domain.includes('monster.com')) return 'monster';
    if (domain.includes('ziprecruiter.com')) return 'ziprecruiter';
    if (domain.includes('careerbuilder.com')) return 'careerbuilder';
    return 'generic';
  }

  /**
   * Get domain from URL
   * @param {String} url Full URL
   * @returns {String} Domain
   */
  getDomainFromUrl(url) {
    try {
      return new URL(url).hostname;
    } catch {
      return '';
    }
  }

  /**
   * Clean and validate job details
   * @param {Object} jobDetails Job details object to clean
   */
  cleanJobDetails(jobDetails) {
    // Clean job title
    if (jobDetails.jobTitle) {
      jobDetails.jobTitle = jobDetails.jobTitle
        .replace(/\s+/g, ' ')
        .replace(/[^\w\s\-()]/g, '')
        .trim();
    }
    
    // Clean company name
    if (jobDetails.company) {
      jobDetails.company = jobDetails.company
        .replace(/\s+/g, ' ')
        .replace(/[^\w\s\-()&.]/g, '')
        .trim();
    }
    
    // Clean location
    if (jobDetails.location) {
      jobDetails.location = jobDetails.location
        .replace(/\s+/g, ' ')
        .trim();
    }
    
    // Validate required fields
    if (!jobDetails.jobTitle || jobDetails.jobTitle.length < 2) {
      jobDetails.jobTitle = 'Unknown Position';
    }
    
    if (!jobDetails.company || jobDetails.company.length < 2) {
      jobDetails.company = 'Unknown Company';
    }
  }

  /**
   * Check if current page appears to be a job posting
   * @returns {Boolean} True if appears to be job posting
   */
  isJobPostingPage() {
    const url = window.location.href.toLowerCase();
    const title = document.title.toLowerCase();
    const content = document.body.textContent?.toLowerCase() || '';
    
    // URL patterns that suggest job posting
    const jobUrlPatterns = [
      /\/job[s]?\//,
      /\/career[s]?\//,
      /\/position[s]?\//,
      /\/opening[s]?\//,
      /\/vacancies/,
      /\/opportunities/,
      /job-?id/,
      /position-?id/
    ];
    
    // Content patterns that suggest job posting
    const jobContentPatterns = [
      /job description/,
      /apply now/,
      /responsibilities/,
      /requirements/,
      /qualifications/,
      /experience required/,
      /salary/,
      /benefits/
    ];
    
    // Check URL
    const hasJobUrl = jobUrlPatterns.some(pattern => pattern.test(url));
    
    // Check title and content
    const hasJobContent = jobContentPatterns.some(pattern => 
      pattern.test(title) || pattern.test(content)
    );
    
    return hasJobUrl || hasJobContent;
  }
}

// Make available globally
window.JobDetailsExtractor = JobDetailsExtractor;

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = JobDetailsExtractor;
}
