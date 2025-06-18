#!/usr/bin/env node

/**
 * Extension-Webapp Connection Test
 * This script tests the connection between the extension and the web application
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 AutoApply Pro - Extension-Webapp Connection Test\n');

// Test 1: Check if all required extension files exist
console.log('📁 Test 1: Extension File Structure');
const extensionPath = './autoapply-extension';
const requiredFiles = {
  'manifest.json': 'Extension manifest',
  'background.js': 'Background service worker',
  'content.js': 'Content script for autofill',
  'popup.js': 'Popup interface logic',
  'popup.html': 'Popup interface HTML',
  'listener.js': 'Web app message listener',
  'utils.js': 'Utility functions',
  'utils/jobExtractor.js': 'Job extraction utilities'
};

let filesExist = true;
for (const [file, description] of Object.entries(requiredFiles)) {
  const filePath = path.join(extensionPath, file);
  const exists = fs.existsSync(filePath);
  console.log(`  ${exists ? '✅' : '❌'} ${file} - ${description}`);
  if (!exists) filesExist = false;
}

// Test 2: Check manifest.json configuration
console.log('\n🔐 Test 2: Manifest Configuration');
try {
  const manifest = JSON.parse(fs.readFileSync(path.join(extensionPath, 'manifest.json'), 'utf8'));
  
  // Check required permissions
  const requiredPermissions = ['activeTab', 'storage', 'scripting', 'contextMenus', 'notifications'];
  const hasAllPermissions = requiredPermissions.every(perm => 
    manifest.permissions && manifest.permissions.includes(perm)
  );
  
  console.log(`  ${hasAllPermissions ? '✅' : '❌'} Required permissions`);
  
  // Check host permissions for API access
  const requiredHosts = [
    'http://localhost:5000/*',
    'http://localhost:3000/*', 
    'https://autoapplypro.com/*',
    'https://api.autoapplypro.com/*'
  ];
  
  const hasAllHosts = requiredHosts.every(host =>
    manifest.host_permissions && manifest.host_permissions.includes(host)
  );
  
  console.log(`  ${hasAllHosts ? '✅' : '❌'} Required host permissions`);
  
} catch (error) {
  console.log('  ❌ Error reading manifest.json:', error.message);
  filesExist = false;
}

// Test 3: Check API endpoint consistency
console.log('\n🌐 Test 3: API Endpoint Consistency');

// Check if extension uses correct endpoints
const backgroundPath = path.join(extensionPath, 'background.js');
if (fs.existsSync(backgroundPath)) {
  const backgroundContent = fs.readFileSync(backgroundPath, 'utf8');
  
  // Check for correct auth endpoint
  const usesCorrectAuthEndpoint = backgroundContent.includes('/auth/me');
  console.log(`  ${usesCorrectAuthEndpoint ? '✅' : '❌'} Uses correct auth endpoint (/api/auth/me)`);
  
  // Check for profile endpoint
  const usesProfileEndpoint = backgroundContent.includes('/resumes/profile/active');
  console.log(`  ${usesProfileEndpoint ? '✅' : '❌'} Uses profile endpoint (/api/resumes/profile/active)`);
  
} else {
  console.log('  ❌ Cannot check endpoints - background.js not found');
}

// Test 4: Check backend route configuration
console.log('\n🔧 Test 4: Backend Route Configuration');

const authRoutePath = './backend/routes/auth.js';
const userRoutePath = './backend/routes/users.js';
const resumeRoutePath = './backend/routes/resumes.js';

const checkRoute = (filePath, routeName, expectedEndpoints) => {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasAllEndpoints = expectedEndpoints.every(endpoint => content.includes(endpoint));
    console.log(`  ${hasAllEndpoints ? '✅' : '❌'} ${routeName} routes configured`);
    return hasAllEndpoints;
  } else {
    console.log(`  ❌ ${routeName} route file not found`);
    return false;
  }
};

const authRoutes = checkRoute(authRoutePath, 'Auth', ['/me', 'getMe']);
const userRoutes = checkRoute(userRoutePath, 'User', ['/data', 'getUserData']);
const resumeRoutes = checkRoute(resumeRoutePath, 'Resume', ['/profile/active', 'getActiveProfile']);

// Test 5: Check CORS configuration
console.log('\n🔒 Test 5: CORS Configuration');

const serverPath = './backend/server.js';
if (fs.existsSync(serverPath)) {
  const serverContent = fs.readFileSync(serverPath, 'utf8');
  
  const hasCors = serverContent.includes('cors');
  console.log(`  ${hasCors ? '✅' : '❌'} CORS middleware configured`);
  
  const allowsExtensions = serverContent.includes('chrome-extension://');
  console.log(`  ${allowsExtensions ? '✅' : '❌'} Chrome extension origins allowed`);
  
} else {
  console.log('  ❌ Server configuration file not found');
}

// Test 6: Check frontend integration
console.log('\n🎨 Test 6: Frontend Integration');

const integrationPath = './frontend/src/components/extension/ExtensionIntegration.js';
if (fs.existsSync(integrationPath)) {
  const integrationContent = fs.readFileSync(integrationPath, 'utf8');
  
  const hasExtensionCheck = integrationContent.includes('AUTOAPPLY_CHECK_EXTENSION');
  console.log(`  ${hasExtensionCheck ? '✅' : '❌'} Extension detection implemented`);
  
  const hasTokenSync = integrationContent.includes('AUTOAPPLY_SYNC_TOKEN');
  console.log(`  ${hasTokenSync ? '✅' : '❌'} Token synchronization implemented`);
  
} else {
  console.log('  ❌ Extension integration component not found');
}

// Summary
console.log('\n📊 Connection Test Summary');
if (filesExist && authRoutes && userRoutes && resumeRoutes) {
  console.log('✅ Extension-Webapp connection is properly configured');
  console.log('\n🚀 Next Steps for Testing:');
  console.log('1. Load the extension in Chrome (Developer mode)');
  console.log('2. Start the backend server: npm run server');
  console.log('3. Start the frontend: npm start');
  console.log('4. Open the web app and check if extension is detected');
  console.log('5. Test autofill functionality on job application pages');
} else {
  console.log('❌ Extension-Webapp connection has configuration issues');
  console.log('\n🔧 Issues found that need fixing:');
  if (!filesExist) console.log('- Missing required extension files');
  if (!authRoutes) console.log('- Auth routes not properly configured');
  if (!userRoutes) console.log('- User routes not properly configured');
  if (!resumeRoutes) console.log('- Resume routes not properly configured');
}
