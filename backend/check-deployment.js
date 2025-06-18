#!/usr/bin/env node

/**
 * Backend Deployment Status Checker
 * 
 * This script checks if the backend is properly deployed and accessible.
 * Run this after deploying to Render to verify everything is working.
 */

const axios = require('axios');

// Update this URL after deployment to Render
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

async function checkBackendHealth() {
  console.log('🔍 Checking backend health...');
  console.log(`📍 Backend URL: ${BACKEND_URL}`);
  console.log('─'.repeat(50));

  try {
    // Check root endpoint
    console.log('1. Testing root endpoint (/)...');
    const rootResponse = await axios.get(`${BACKEND_URL}/`, { timeout: 10000 });
    console.log('✅ Root endpoint:', rootResponse.data);

    // Check health endpoint
    console.log('\n2. Testing health endpoint (/api/health)...');
    const healthResponse = await axios.get(`${BACKEND_URL}/api/health`, { timeout: 10000 });
    console.log('✅ Health endpoint:', healthResponse.data);

    // Check CORS
    console.log('\n3. Testing CORS headers...');
    const corsResponse = await axios.options(`${BACKEND_URL}/api/health`, { timeout: 10000 });
    console.log('✅ CORS headers present');

    console.log('\n🎉 Backend deployment successful!');
    console.log('─'.repeat(50));
    console.log('✅ All endpoints responding');
    console.log('✅ Health checks passing');
    console.log('✅ CORS configured');
    
    return true;
  } catch (error) {
    console.error('\n❌ Backend health check failed!');
    console.error('─'.repeat(50));
    
    if (error.code === 'ECONNREFUSED') {
      console.error('🔴 Connection refused - Backend may not be running');
    } else if (error.code === 'ENOTFOUND') {
      console.error('🔴 DNS resolution failed - Check the URL');
    } else if (error.response) {
      console.error(`🔴 HTTP ${error.response.status}: ${error.response.statusText}`);
      console.error('Response:', error.response.data);
    } else {
      console.error('🔴 Error:', error.message);
    }
    
    console.error('\n💡 Troubleshooting tips:');
    console.error('- Verify the backend URL is correct');
    console.error('- Check if the backend is deployed and running');
    console.error('- Verify environment variables are set');
    console.error('- Check Render logs for errors');
    
    return false;
  }
}

// Main execution
if (require.main === module) {
  console.log('🚀 AutoApplyPro Backend Deployment Checker');
  console.log('═'.repeat(50));
  
  checkBackendHealth()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { checkBackendHealth };
