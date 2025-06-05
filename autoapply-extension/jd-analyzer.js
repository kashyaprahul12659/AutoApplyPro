// AutoApply Pro - JD Analyzer Integration
// This script provides integration with the JD Analyzer feature

/**
 * Extract job description text from the current page
 * @returns {string} The extracted job description
 */
function extractJobDescription() {
  // Look for common job description containers
  const possibleSelectors = [
    'div.job-description',
    'div.description',
    'div[data-automation="jobDescriptionText"]',
    'div#job-description',
    'div.jobsearch-jobDescriptionText',
    'div[class*="description"]',
    'section[class*="description"]',
    'div[id*="description"]',
    'section[id*="description"]',
    // Common containers on popular job sites
    'div[class*="job-description"]',
    'div[id*="job-description"]'
  ];

  // Try each selector
  for (const selector of possibleSelectors) {
    const element = document.querySelector(selector);
    if (element && element.textContent.trim().length > 50) {
      return element.textContent.trim();
    }
  }

  // If specific selectors fail, try to find the largest text block on the page
  // that might contain a job description (at least 100 words)
  const paragraphs = document.querySelectorAll('p');
  let longestText = '';
  
  paragraphs.forEach(p => {
    const text = p.textContent.trim();
    if (text.split(/\s+/).length > 100 && text.length > longestText.length) {
      longestText = text;
    }
  });

  if (longestText) {
    return longestText;
  }

  // As a last resort, get all text from the main content area
  const mainContent = document.querySelector('main') || document.querySelector('article') || document.body;
  return mainContent.textContent.trim().substring(0, 5000); // Limit to 5000 chars
}

/**
 * Send job description to backend for analysis
 * @param {string} jobDescription - The job description text
 * @param {string} authToken - The user's auth token
 * @returns {Promise} Promise resolving to the analysis results
 */
async function analyzeJobDescription(jobDescription, authToken) {
  try {
    const response = await fetch('http://localhost:5000/api/jd-analyzer/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ jobDescription })
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing job description:', error);
    throw error;
  }
}

/**
 * Create a popup to display analysis results
 * @param {Object} results - The analysis results
 */
function showAnalysisResults(results) {
  // Create popup container
  const popup = document.createElement('div');
  popup.className = 'autoapply-analysis-popup';
  popup.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 350px;
    max-height: 600px;
    overflow-y: auto;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 9999;
    padding: 16px;
    font-family: Arial, sans-serif;
  `;

  // Create popup content
  const content = document.createElement('div');
  
  // Header
  content.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
      <h2 style="margin: 0; color: #4a6cf7; font-size: 18px;">AutoApply Pro: JD Analysis</h2>
      <button id="autoapply-close" style="background: none; border: none; cursor: pointer; font-size: 20px;">×</button>
    </div>
    <div style="margin-bottom: 12px;">
      <div style="font-weight: bold; margin-bottom: 4px;">Match Score:</div>
      <div style="height: 20px; background: #f0f0f0; border-radius: 10px; overflow: hidden;">
        <div style="height: 100%; width: ${results.matchScore}%; background: ${getScoreColor(results.matchScore)}; border-radius: 10px;"></div>
      </div>
      <div style="text-align: right; font-size: 14px; margin-top: 4px;">${results.matchScore}%</div>
    </div>
    <div style="margin-bottom: 12px;">
      <div style="font-weight: bold; margin-bottom: 4px;">Matched Skills:</div>
      <div style="display: flex; flex-wrap: wrap; gap: 4px;">
        ${results.matchedSkills.map(skill => `
          <span style="background: #e6f7ff; color: #0066cc; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${skill}</span>
        `).join('')}
      </div>
    </div>
    <div style="margin-bottom: 12px;">
      <div style="font-weight: bold; margin-bottom: 4px;">Missing Skills:</div>
      <div style="display: flex; flex-wrap: wrap; gap: 4px;">
        ${results.missingSkills.map(skill => `
          <span style="background: #fff1f0; color: #cf1322; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${skill}</span>
        `).join('')}
      </div>
    </div>
    <div style="margin-bottom: 12px;">
      <div style="font-weight: bold; margin-bottom: 4px;">Recommendations:</div>
      <ul style="margin-top: 0; padding-left: 20px;">
        ${results.suggestions.map(suggestion => `<li style="margin-bottom: 4px; font-size: 14px;">${suggestion}</li>`).join('')}
      </ul>
    </div>
    <div style="display: flex; justify-content: center; margin-top: 16px;">
      <button id="autoapply-save" style="background: #4a6cf7; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Save Analysis</button>
    </div>
  `;

  // Append content to popup
  popup.appendChild(content);
  
  // Append popup to body
  document.body.appendChild(popup);
  
  // Add event listeners
  document.getElementById('autoapply-close').addEventListener('click', () => {
    popup.remove();
  });
  
  document.getElementById('autoapply-save').addEventListener('click', async () => {
    try {
      // Get auth token
      const { token } = await new Promise(resolve => {
        chrome.runtime.sendMessage({ action: 'getAuthToken' }, resolve);
      });
      
      if (!token) {
        alert('Please log in to save this analysis');
        return;
      }
      
      // Save analysis
      const response = await fetch('http://localhost:5000/api/jd-analyzer/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          jobTitle: document.title.replace(' - Job Description', '').substring(0, 100),
          jobDescription: results.jobDescription,
          matchScore: results.matchScore,
          matchedSkills: results.matchedSkills,
          missingSkills: results.missingSkills,
          suggestions: results.suggestions,
          sourceUrl: window.location.href
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save analysis');
      }
      
      alert('Analysis saved successfully!');
    } catch (error) {
      console.error('Error saving analysis:', error);
      alert('Failed to save analysis. Please try again.');
    }
  });
}

/**
 * Get color based on score percentage
 * @param {number} score - The match score percentage
 * @returns {string} The color code
 */
function getScoreColor(score) {
  if (score >= 80) return '#52c41a'; // Green
  if (score >= 60) return '#faad14'; // Yellow
  return '#f5222d'; // Red
}

// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'analyzeJobDescription') {
    const jobDescription = extractJobDescription();
    sendResponse({ success: true, jobDescription });
  }
});

// Export functions for use in the popup
window.autoapplyJdAnalyzer = {
  extractJobDescription,
  analyzeJobDescription,
  showAnalysisResults
};
