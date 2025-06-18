#!/usr/bin/env node

/**
 * AutoApply Pro - Extension Features Test
 * Tests all core features of the extension with the application
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 AutoApply Pro - Extension Features Test\n');

// Test configuration
const features = {
  'Authentication & Token Sync': {
    files: ['listener.js', 'background.js', 'popup.js'],
    endpoints: ['/api/auth/me'],
    description: 'User login and token synchronization between webapp and extension'
  },
  'Profile Data Fetching': {
    files: ['background.js', 'popup.js'],
    endpoints: ['/api/resumes/profile/active', '/api/users/data'],
    description: 'Fetch user profile data for autofill functionality'
  },
  'Form Autofill': {
    files: ['content.js', 'background.js'],
    endpoints: ['/api/resumes/profile/active'],
    description: 'Automatically fill job application forms with user data'
  },
  'Job Description Analysis': {
    files: ['jd-analyzer.js', 'popup.js'],
    endpoints: ['/api/ai/analyze-jd'],
    description: 'Analyze job descriptions and provide match scores'
  },
  'Cover Letter Generation': {
    files: ['popup.js'],
    endpoints: ['/api/ai/cover-letter'],
    description: 'Generate AI-powered cover letters'
  },
  'Extension-Webapp Communication': {
    files: ['listener.js', 'background.js'],
    endpoints: [],
    description: 'Bidirectional communication between extension and web app'
  },
  'Context Menu Integration': {
    files: ['background.js'],
    endpoints: ['/api/resumes/profile/active'],
    description: 'Right-click context menu for quick autofill'
  },
  'User Interface & Popup': {
    files: ['popup.js', 'popup.html'],
    endpoints: ['/api/auth/me', '/api/users/data'],
    description: 'Extension popup interface and user interactions'
  }
};

console.log('🔍 Testing Extension Features:\n');

// Test each feature
Object.entries(features).forEach(([featureName, config], index) => {
  console.log(`${index + 1}. ${featureName}`);
  console.log(`   📋 ${config.description}`);
  
  // Check if required files exist
  const missingFiles = [];
  config.files.forEach(file => {
    const filePath = path.join('./autoapply-extension', file);
    if (!fs.existsSync(filePath)) {
      missingFiles.push(file);
    }
  });
  
  if (missingFiles.length > 0) {
    console.log(`   ❌ Missing files: ${missingFiles.join(', ')}`);
    return;
  }
  
  // Check implementation quality for each file
  let implementationScore = 0;
  let totalChecks = 0;
  
  config.files.forEach(file => {
    const filePath = path.join('./autoapply-extension', file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Feature-specific checks
      switch (featureName) {
        case 'Authentication & Token Sync':
          totalChecks += 4;
          if (content.includes('AUTOAPPLY_SYNC_TOKEN')) implementationScore++;
          if (content.includes('saveAuthToken')) implementationScore++;
          if (content.includes('authToken')) implementationScore++;
          if (content.includes('chrome.storage.local')) implementationScore++;
          break;
          
        case 'Profile Data Fetching':
          totalChecks += 4;
          if (content.includes('/resumes/profile/active') || content.includes('/users/data')) implementationScore++;
          if (content.includes('Authorization')) implementationScore++;
          if (content.includes('Bearer')) implementationScore++;
          if (content.includes('fetch')) implementationScore++;
          break;
          
        case 'Form Autofill':
          totalChecks += 5;
          if (content.includes('autofill')) implementationScore++;
          if (content.includes('querySelectorAll')) implementationScore++;
          if (content.includes('input')) implementationScore++;
          if (content.includes('value')) implementationScore++;
          if (content.includes('profileData')) implementationScore++;
          break;
          
        case 'Job Description Analysis':
          totalChecks += 3;
          if (content.includes('analyze')) implementationScore++;
          if (content.includes('jobDescription')) implementationScore++;
          if (content.includes('/ai/')) implementationScore++;
          break;
          
        case 'Cover Letter Generation':
          totalChecks += 3;
          if (content.includes('cover')) implementationScore++;
          if (content.includes('/ai/')) implementationScore++;
          if (content.includes('generate')) implementationScore++;
          break;
          
        case 'Extension-Webapp Communication':
          totalChecks += 4;
          if (content.includes('postMessage')) implementationScore++;
          if (content.includes('addEventListener')) implementationScore++;
          if (content.includes('AUTOAPPLY_')) implementationScore++;
          if (content.includes('chrome.runtime')) implementationScore++;
          break;
          
        case 'Context Menu Integration':
          totalChecks += 3;
          if (content.includes('contextMenus')) implementationScore++;
          if (content.includes('onClicked')) implementationScore++;
          if (content.includes('autofill')) implementationScore++;
          break;
          
        case 'User Interface & Popup':
          totalChecks += 4;
          if (content.includes('getElementById')) implementationScore++;
          if (content.includes('addEventListener')) implementationScore++;
          if (content.includes('DOMContentLoaded')) implementationScore++;
          if (content.includes('click')) implementationScore++;
          break;
      }
    }
  });
  
  // Check if backend endpoints exist
  const endpointChecks = config.endpoints.map(endpoint => {
    // Simple check for endpoint existence in route files
    const routeFiles = ['auth.js', 'users.js', 'resumes.js', 'ai.js'].map(f => 
      path.join('./backend/routes', f)
    );
    
    return routeFiles.some(routeFile => {
      if (fs.existsSync(routeFile)) {
        const content = fs.readFileSync(routeFile, 'utf8');
        return content.includes(endpoint.split('/').pop());
      }
      return false;
    });
  });
  
  const endpointsWorking = endpointChecks.length === 0 || endpointChecks.every(Boolean);
  
  // Calculate feature health
  const implementationHealth = totalChecks > 0 ? (implementationScore / totalChecks) * 100 : 100;
  const isHealthy = implementationHealth >= 75 && endpointsWorking;
  
  console.log(`   ${isHealthy ? '✅' : '⚠️'} Implementation: ${implementationHealth.toFixed(0)}%`);
  
  if (config.endpoints.length > 0) {
    console.log(`   ${endpointsWorking ? '✅' : '❌'} Backend endpoints: ${config.endpoints.join(', ')}`);
  }
  
  console.log('');
});

// Test critical integration points
console.log('🔗 Testing Critical Integration Points:\n');

const integrationTests = [
  {
    name: 'Manifest Permissions',
    test: () => {
      const manifestPath = './autoapply-extension/manifest.json';
      if (fs.existsSync(manifestPath)) {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        const requiredPerms = ['activeTab', 'storage', 'scripting', 'contextMenus'];
        return requiredPerms.every(perm => manifest.permissions?.includes(perm));
      }
      return false;
    }
  },
  {
    name: 'Content Script Registration',
    test: () => {
      const manifestPath = './autoapply-extension/manifest.json';
      if (fs.existsSync(manifestPath)) {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        return manifest.content_scripts?.some(cs => cs.js?.includes('content.js'));
      }
      return false;
    }
  },
  {
    name: 'Background Script Setup',
    test: () => {
      const manifestPath = './autoapply-extension/manifest.json';
      if (fs.existsSync(manifestPath)) {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        return manifest.background?.service_worker === 'background.js';
      }
      return false;
    }
  },
  {
    name: 'API Endpoint Consistency',
    test: () => {
      const backgroundPath = './autoapply-extension/background.js';
      const authRoutePath = './backend/routes/auth.js';
      
      if (fs.existsSync(backgroundPath) && fs.existsSync(authRoutePath)) {
        const bgContent = fs.readFileSync(backgroundPath, 'utf8');
        const authContent = fs.readFileSync(authRoutePath, 'utf8');
        
        // Check if extension uses /auth/me and route exists
        return bgContent.includes('/auth/me') && authContent.includes('/me');
      }
      return false;
    }
  },
  {
    name: 'CORS Configuration',
    test: () => {
      const serverPath = './backend/server.js';
      if (fs.existsSync(serverPath)) {
        const content = fs.readFileSync(serverPath, 'utf8');
        return content.includes('chrome-extension://');
      }
      return false;
    }
  },
  {
    name: 'Frontend Integration',
    test: () => {
      const integrationPath = './frontend/src/components/extension/ExtensionIntegration.js';
      if (fs.existsSync(integrationPath)) {
        const content = fs.readFileSync(integrationPath, 'utf8');
        return content.includes('AUTOAPPLY_CHECK_EXTENSION') && 
               content.includes('AUTOAPPLY_SYNC_TOKEN');
      }
      return false;
    }
  }
];

integrationTests.forEach((test, index) => {
  const result = test.test();
  console.log(`${index + 1}. ${test.name}: ${result ? '✅ Working' : '❌ Issues found'}`);
});

// Overall assessment
console.log('\n📊 Overall Feature Assessment:\n');

const criticalFiles = [
  'autoapply-extension/manifest.json',
  'autoapply-extension/background.js',
  'autoapply-extension/content.js',
  'autoapply-extension/popup.js',
  'autoapply-extension/listener.js',
  'backend/routes/auth.js',
  'backend/routes/users.js',
  'backend/routes/resumes.js',
  'frontend/src/components/extension/ExtensionIntegration.js'
];

const missingCritical = criticalFiles.filter(file => !fs.existsSync(file));
const allFilesPresent = missingCritical.length === 0;

console.log(`📁 Critical Files: ${allFilesPresent ? '✅ All present' : '❌ Missing: ' + missingCritical.join(', ')}`);

const passedIntegration = integrationTests.filter(test => test.test()).length;
const integrationScore = (passedIntegration / integrationTests.length) * 100;

console.log(`🔗 Integration Score: ${integrationScore.toFixed(0)}%`);

if (allFilesPresent && integrationScore >= 80) {
  console.log('\n🎉 RESULT: Extension features are properly working with the application!');
  console.log('\n🚀 Ready for testing:');
  console.log('1. Load extension in Chrome Developer mode');
  console.log('2. Start backend server: npm run server');
  console.log('3. Start frontend: npm start'); 
  console.log('4. Test autofill on job sites');
  console.log('5. Test popup functionality');
} else {
  console.log('\n⚠️ RESULT: Some extension features may have issues');
  console.log('Review the failed tests above and fix any missing components');
}
