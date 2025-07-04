/**
 * API Connectivity Verification Script
 * 
 * This script verifies connectivity between the frontend and backend API.
 * It checks all essential API endpoints and reports their status.
 * 
 * Usage:
 * node verify-connectivity.js
 */

const https = require('https');
const http = require('http');

// Configuration
const API_BASE_URL = 'https://autoapplypro-backend-d14947a17c9b.herokuapp.com';
const ENDPOINTS = [
  { path: '/api/health', name: 'Health Check' },
  { path: '/api/dashboard/stats', name: 'Dashboard Statistics' },
  { path: '/api/applications', name: 'Job Applications' },
  { path: '/api/jobs', name: 'Job Listings' },
  { path: '/api/resume', name: 'Resume Data' },
  { path: '/api/auth/status', name: 'Auth Status' }
];

// Color formatting for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

/**
 * Make an HTTP request to the specified URL
 * @param {string} url - The URL to request
 * @returns {Promise<Object>} - Response object with status and data
 */
function makeRequest(url) {
  return new Promise((resolve) => {
    console.log(`${colors.blue}Testing endpoint:${colors.reset} ${url}`);
    
    // Determine if http or https based on URL
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          // Try to parse as JSON if possible
          const jsonData = data.length > 0 ? JSON.parse(data) : {};
          resolve({ 
            status: res.statusCode, 
            statusMessage: res.statusMessage,
            data: jsonData
          });
        } catch (e) {
          // Return as text if not valid JSON
          resolve({ 
            status: res.statusCode, 
            statusMessage: res.statusMessage,
            data: data 
          });
        }
      });
    });
    
    req.on('error', (error) => {
      resolve({ 
        status: 0, 
        statusMessage: 'Connection Failed',
        error: error.message 
      });
    });
    
    // Set a timeout of 5 seconds
    req.setTimeout(5000, () => {
      req.abort();
      resolve({ 
        status: 0, 
        statusMessage: 'Timeout',
        error: 'Request timed out after 5 seconds' 
      });
    });
  });
}

/**
 * Format and display the response status
 * @param {string} name - Endpoint name
 * @param {Object} response - Response from makeRequest
 */
function displayStatus(name, response) {
  let statusColor = colors.red;
  let status = 'FAIL';
  
  if (response.status >= 200 && response.status < 300) {
    statusColor = colors.green;
    status = 'SUCCESS';
  } else if (response.status >= 300 && response.status < 500) {
    statusColor = colors.yellow;
    status = 'REDIRECT/CLIENT ERROR';
  }
  
  console.log(`${colors.cyan}${name}:${colors.reset} ${statusColor}${status}${colors.reset} (${response.status} ${response.statusMessage || ''})`);
  
  if (response.error) {
    console.log(`  Error: ${response.error}`);
  } else {
    // Show a preview of the data if available
    const dataStr = JSON.stringify(response.data).substring(0, 100);
    console.log(`  Response: ${dataStr}${dataStr.length >= 100 ? '...' : ''}`);
  }
  console.log('');
}

/**
 * Main function to verify all endpoints
 */
async function verifyConnectivity() {
  console.log(`\n${colors.cyan}=== AutoApplyPro API Connectivity Test ====${colors.reset}\n`);
  console.log(`${colors.cyan}Backend URL:${colors.reset} ${API_BASE_URL}\n`);
  
  let successes = 0;
  
  for (const endpoint of ENDPOINTS) {
    const url = `${API_BASE_URL}${endpoint.path}`;
    const response = await makeRequest(url);
    displayStatus(endpoint.name, response);
    
    if (response.status >= 200 && response.status < 300) {
      successes++;
    }
  }
  
  // Summary
  console.log(`${colors.cyan}=== Summary ====${colors.reset}`);
  console.log(`${colors.cyan}Total Endpoints:${colors.reset} ${ENDPOINTS.length}`);
  console.log(`${colors.cyan}Successful:${colors.reset} ${colors.green}${successes}${colors.reset}`);
  console.log(`${colors.cyan}Failed:${colors.reset} ${colors.red}${ENDPOINTS.length - successes}${colors.reset}\n`);
  
  if (successes === ENDPOINTS.length) {
    console.log(`${colors.green}All endpoints are accessible! API connectivity looks good.${colors.reset}\n`);
  } else if (successes === 0) {
    console.log(`${colors.red}No endpoints are accessible. Please check your internet connection and API URL.${colors.reset}\n`);
  } else {
    console.log(`${colors.yellow}Some endpoints are not accessible. There may be issues with specific API features.${colors.reset}\n`);
  }
}

// Execute the verification
verifyConnectivity();
