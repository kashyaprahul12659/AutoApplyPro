/**
 * AutoApply Pro - Job Extractor Utility
 * 
 * Extracts job details from popular job sites like LinkedIn, Indeed, etc.
 * Used to auto-populate job tracker.
 */

/**
 * Extract job details from LinkedIn job page
 * @returns {Object} Job details or null if not found
 */
function extractLinkedInJobDetails() {
  try {
    // Check if we're on a LinkedIn job page
    if (!window.location.href.includes('linkedin.com/jobs/view/')) {
      return null;
    }
    
    // Extract job title
    const jobTitleElement = document.querySelector('.job-details-jobs-unified-top-card__job-title');
    const jobTitle = jobTitleElement ? jobTitleElement.textContent.trim() : '';
    
    // Extract company name
    const companyElement = document.querySelector('.job-details-jobs-unified-top-card__company-name');
    const company = companyElement ? companyElement.textContent.trim() : '';
    
    // Extract location
    const locationElement = document.querySelector('.job-details-jobs-unified-top-card__bullet');
    const location = locationElement ? locationElement.textContent.trim() : '';
    
    // Get job URL
    const jdUrl = window.location.href;
    
    // Check if we have minimum required data
    if (!jobTitle || !company) {
      return null;
    }
    
    return {
      jobTitle,
      company,
      location,
      jdUrl,
      source: 'linkedin'
    };
  } catch (error) {
    console.error('Error extracting LinkedIn job details:', error);
    return null;
  }
}

/**
 * Extract job details from Indeed job page
 * @returns {Object} Job details or null if not found
 */
function extractIndeedJobDetails() {
  try {
    // Check if we're on an Indeed job page
    if (!window.location.href.includes('indeed.com/viewjob')) {
      return null;
    }
    
    // Extract job title
    const jobTitleElement = document.querySelector('.jobsearch-JobInfoHeader-title');
    const jobTitle = jobTitleElement ? jobTitleElement.textContent.trim() : '';
    
    // Extract company name
    const companyElement = document.querySelector('[data-testid="inlineCompanyName"]');
    const company = companyElement ? companyElement.textContent.trim() : '';
    
    // Extract location
    const locationElement = document.querySelector('[data-testid="job-location"]');
    const location = locationElement ? locationElement.textContent.trim() : '';
    
    // Get job URL
    const jdUrl = window.location.href;
    
    // Check if we have minimum required data
    if (!jobTitle || !company) {
      return null;
    }
    
    return {
      jobTitle,
      company,
      location,
      jdUrl,
      source: 'indeed'
    };
  } catch (error) {
    console.error('Error extracting Indeed job details:', error);
    return null;
  }
}

/**
 * Extract job details from Glassdoor job page
 * @returns {Object} Job details or null if not found
 */
function extractGlassdoorJobDetails() {
  try {
    // Check if we're on a Glassdoor job page
    if (!window.location.href.includes('glassdoor.com/job-listing/')) {
      return null;
    }
    
    // Extract job title
    const jobTitleElement = document.querySelector('.job-title');
    const jobTitle = jobTitleElement ? jobTitleElement.textContent.trim() : '';
    
    // Extract company name
    const companyElement = document.querySelector('.employer-name');
    const company = companyElement ? companyElement.textContent.trim() : '';
    
    // Extract location
    const locationElement = document.querySelector('.location');
    const location = locationElement ? locationElement.textContent.trim() : '';
    
    // Get job URL
    const jdUrl = window.location.href;
    
    // Check if we have minimum required data
    if (!jobTitle || !company) {
      return null;
    }
    
    return {
      jobTitle,
      company,
      location,
      jdUrl,
      source: 'glassdoor'
    };
  } catch (error) {
    console.error('Error extracting Glassdoor job details:', error);
    return null;
  }
}

/**
 * Main function to extract job details from current page
 * @returns {Object} Job details or null if not found
 */
function extractJobDetails() {
  // Try LinkedIn first
  let details = extractLinkedInJobDetails();
  
  // If not found, try Indeed
  if (!details) {
    details = extractIndeedJobDetails();
  }
  
  // If still not found, try Glassdoor
  if (!details) {
    details = extractGlassdoorJobDetails();
  }
  
  return details;
}

// Export functions
window.AutoApplyJobExtractor = {
  extractJobDetails,
  extractLinkedInJobDetails,
  extractIndeedJobDetails,
  extractGlassdoorJobDetails
};
