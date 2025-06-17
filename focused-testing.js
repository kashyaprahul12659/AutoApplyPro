const { chromium } = require('playwright');

/**
 * Focused AutoApplyPro Authentication & Route Testing
 * This script focuses on fixing the critical issues preventing the app from loading
 */

class FocusedTester {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    console.log('🔍 Starting Focused Testing for Critical Issues...\n');
    
    this.browser = await chromium.launch({ 
      headless: false,
      slowMo: 2000
    });
    this.page = await this.browser.newPage();
    this.page.setDefaultTimeout(15000);
    
    // Capture console logs and errors for debugging
    this.page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      
      if (type === 'error') {
        console.log(`❌ Console Error: ${text}`);
      } else if (type === 'warn') {
        console.log(`⚠️  Console Warning: ${text}`);
      } else if (type === 'log' && text.includes('error')) {
        console.log(`📝 Console Log: ${text}`);
      }
    });
    
    this.page.on('pageerror', error => {
      console.log(`💥 Page Error: ${error.message}`);
    });

    this.page.on('response', response => {
      if (!response.ok() && response.status() !== 304) {
        console.log(`🌐 HTTP Error: ${response.status()} ${response.url()}`);
      }
    });
  }

  async testAuthentication() {
    console.log('🔐 Testing Authentication System...');
    
    try {
      // Navigate to home page
      console.log('   📍 Navigating to home page...');
      await this.page.goto('http://localhost:3000');
      await this.page.waitForTimeout(3000);
      
      // Check if page loads without critical errors
      const title = await this.page.title();
      console.log(`   📄 Page title: ${title}`);
      
      // Check for React app root
      const appRoot = await this.page.$('#root');
      if (!appRoot) {
        throw new Error('React app root not found');
      }
      console.log('   ✅ React app root found');
      
      // Check for any authentication-related elements
      await this.page.waitForTimeout(2000);
      const body = await this.page.textContent('body');
      
      if (body.includes('Cannot find module') || body.includes('Module not found')) {
        console.log('   ❌ Module import errors detected');
        return false;
      }
      
      // Try to navigate to login page
      console.log('   🔐 Testing login page...');
      await this.page.goto('http://localhost:3000/login');
      await this.page.waitForTimeout(3000);
      
      // Check if login page loads
      const loginPageBody = await this.page.textContent('body');
      if (loginPageBody.includes('Cannot find module')) {
        console.log('   ❌ Login page has module errors');
        return false;
      }
      
      console.log('   ✅ Login page loads without critical errors');
      
      // Try to navigate to dashboard
      console.log('   📊 Testing dashboard page...');
      await this.page.goto('http://localhost:3000/dashboard');
      await this.page.waitForTimeout(3000);
      
      const dashboardBody = await this.page.textContent('body');
      if (dashboardBody.includes('Cannot find module')) {
        console.log('   ❌ Dashboard page has module errors');
        return false;
      }
      
      console.log('   ✅ Main pages load without critical module errors');
      return true;
      
    } catch (error) {
      console.log(`   ❌ Authentication test failed: ${error.message}`);
      return false;
    }
  }

  async testAPIConnectivity() {
    console.log('🌐 Testing API Connectivity...');
    
    try {
      // Test health endpoint
      const response = await this.page.evaluate(async () => {
        try {
          const res = await fetch('http://localhost:5000/api/health');
          const data = await res.json();
          return { status: res.status, data };
        } catch (error) {
          return { error: error.message };
        }
      });
      
      if (response.error) {
        console.log(`   ❌ API connectivity failed: ${response.error}`);
        return false;
      }
      
      if (response.status === 200 && response.data.status === 'ok') {
        console.log('   ✅ API health check passed');
        console.log(`   📊 MongoDB: ${response.data.mongodb}`);
        return true;
      } else {
        console.log(`   ❌ API health check failed: ${response.status}`);
        return false;
      }
      
    } catch (error) {
      console.log(`   ❌ API test failed: ${error.message}`);
      return false;
    }
  }

  async testRouting() {
    console.log('🗺️  Testing Application Routing...');
    
    const routes = [
      '/',
      '/login', 
      '/register',
      '/dashboard'
    ];
    
    for (const route of routes) {
      try {
        console.log(`   📍 Testing route: ${route}`);
        await this.page.goto(`http://localhost:3000${route}`);
        await this.page.waitForTimeout(2000);
        
        const body = await this.page.textContent('body');
        if (body.includes('Cannot find module') || body.includes('Module not found')) {
          console.log(`   ❌ Route ${route} has module errors`);
          return false;
        }
        
        console.log(`   ✅ Route ${route} loads successfully`);
        
      } catch (error) {
        console.log(`   ❌ Route ${route} failed: ${error.message}`);
        return false;
      }
    }
    
    console.log('   ✅ All basic routes working');
    return true;
  }

  async debugModuleIssues() {
    console.log('🔧 Debugging Module Import Issues...');
    
    try {
      await this.page.goto('http://localhost:3000');
      await this.page.waitForTimeout(3000);
      
      // Get all console errors
      const errors = [];
      this.page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      // Wait a bit to collect errors
      await this.page.waitForTimeout(5000);
      
      console.log('   📝 Collected errors:');
      errors.forEach(error => {
        console.log(`      - ${error}`);
      });
      
      return errors;
      
    } catch (error) {
      console.log(`   ❌ Debug failed: ${error.message}`);
      return [];
    }
  }

  async runFocusedTests() {
    try {
      await this.initialize();
      
      console.log('🎯 FOCUSED TESTING STARTED\n');
      
      // Test 1: Module imports and basic loading
      const moduleErrors = await this.debugModuleIssues();
      
      // Test 2: Authentication system
      const authWorking = await this.testAuthentication();
      
      // Test 3: API connectivity
      const apiWorking = await this.testAPIConnectivity();
      
      // Test 4: Basic routing
      const routingWorking = await this.testRouting();
      
      console.log('\n🎯 FOCUSED TESTING RESULTS:');
      console.log(`   🔐 Authentication: ${authWorking ? '✅ WORKING' : '❌ FAILED'}`);
      console.log(`   🌐 API Connectivity: ${apiWorking ? '✅ WORKING' : '❌ FAILED'}`);
      console.log(`   🗺️  Routing: ${routingWorking ? '✅ WORKING' : '❌ FAILED'}`);
      console.log(`   🐛 Module Errors: ${moduleErrors.length} found`);
      
      if (moduleErrors.length > 0) {
        console.log('\n🔧 CRITICAL MODULE ISSUES TO FIX:');
        moduleErrors.forEach((error, index) => {
          console.log(`   ${index + 1}. ${error}`);
        });
      }
      
      const overallStatus = authWorking && apiWorking && routingWorking && moduleErrors.length === 0;
      console.log(`\n🎯 OVERALL STATUS: ${overallStatus ? '✅ READY FOR COMPREHENSIVE TESTING' : '❌ NEEDS FIXES'}`);
      
    } catch (error) {
      console.error('❌ Focused testing error:', error);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// Run focused testing
async function runFocusedTesting() {
  const tester = new FocusedTester();
  await tester.runFocusedTests();
}

if (require.main === module) {
  runFocusedTesting().catch(console.error);
}

module.exports = { FocusedTester, runFocusedTesting };
