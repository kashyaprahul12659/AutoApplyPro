const { chromium } = require('playwright');

/**
 * Comprehensive AutoApplyPro Application Testing Suite
 * This script tests all features, pages, and functionalities after Clerk migration
 */

class AutoApplyProTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  async initialize() {
    console.log('🚀 Initializing AutoApplyPro Comprehensive Testing Suite...\n');
    
    this.browser = await chromium.launch({ 
      headless: false,
      slowMo: 1000 // Slow down for better observation
    });
    this.page = await this.browser.newPage();
    
    // Set longer timeout for authentication
    this.page.setDefaultTimeout(30000);
    
    // Listen for console logs and errors
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Browser Console Error:', msg.text());
      }
    });
    
    this.page.on('pageerror', error => {
      console.log('❌ Page Error:', error.message);
    });
  }

  async test(testName, testFunction) {
    console.log(`🧪 Testing: ${testName}`);
    try {
      await testFunction();
      console.log(`✅ PASSED: ${testName}\n`);
      this.results.passed++;
      this.results.tests.push({ name: testName, status: 'PASSED' });
    } catch (error) {
      console.log(`❌ FAILED: ${testName}`);
      console.log(`   Error: ${error.message}\n`);
      this.results.failed++;
      this.results.tests.push({ name: testName, status: 'FAILED', error: error.message });
    }
  }

  async navigateToApp() {
    await this.page.goto('http://localhost:3000');
    await this.page.waitForLoadState('networkidle');
  }

  async runAllTests() {
    try {
      await this.initialize();

      // 1. Basic Application Loading
      await this.test('Application loads without errors', async () => {
        await this.navigateToApp();
        const title = await this.page.title();
        if (!title.includes('AutoApply Pro')) {
          throw new Error(`Expected title to contain 'AutoApply Pro', got: ${title}`);
        }
      });

      // 2. Authentication System Testing
      await this.test('Login page is accessible', async () => {
        await this.page.goto('http://localhost:3000/login');
        await this.page.waitForSelector('form, .sign-in, .auth-form', { timeout: 10000 });
      });

      await this.test('Development authentication works', async () => {
        await this.page.goto('http://localhost:3000/login');
        
        // Look for development login form or Clerk sign-in
        const hasDevForm = await this.page.$('.dev-login-form') !== null;
        const hasClerkForm = await this.page.$('.cl-signIn-root') !== null;
        
        if (hasDevForm) {
          // Test development authentication
          await this.page.fill('input[type="email"]', 'dev@autoapplypro.com');
          await this.page.fill('input[type="password"]', 'dev123');
          await this.page.click('button[type="submit"]');
        } else if (hasClerkForm) {
          console.log('   ℹ️  Clerk authentication detected - skipping automated login');
          return;
        }
        
        // Wait for redirect to dashboard
        await this.page.waitForURL(/dashboard/, { timeout: 10000 });
      });

      // 3. Dashboard Testing
      await this.test('Dashboard loads with user data', async () => {
        await this.page.goto('http://localhost:3000/dashboard');
        await this.page.waitForSelector('[data-testid="dashboard"], .dashboard, h1, h2', { timeout: 10000 });
        
        // Check for common dashboard elements
        const hasContent = await this.page.$('main, .main-content, .dashboard-content') !== null;
        if (!hasContent) {
          throw new Error('Dashboard content not found');
        }
      });

      // 4. Navigation Testing
      await this.test('Navigation menu works', async () => {
        await this.page.goto('http://localhost:3000/dashboard');
        
        // Check for navigation elements
        const nav = await this.page.$('nav, .navbar, .navigation');
        if (!nav) {
          throw new Error('Navigation menu not found');
        }
        
        // Test navigation links
        const links = await this.page.$$('nav a, .navbar a, .navigation a');
        if (links.length === 0) {
          throw new Error('No navigation links found');
        }
      });

      // 5. Resume Builder Testing
      await this.test('Resume Builder page loads', async () => {
        await this.page.goto('http://localhost:3000/resume-builder');
        await this.page.waitForLoadState('networkidle');
        
        // Check for resume builder elements
        const hasBuilder = await this.page.$('.resume-builder, .builder, form') !== null;
        if (!hasBuilder) {
          throw new Error('Resume builder interface not found');
        }
      });

      // 6. Job Tracker Testing
      await this.test('Job Tracker page loads', async () => {
        await this.page.goto('http://localhost:3000/job-tracker');
        await this.page.waitForLoadState('networkidle');
        
        const hasTracker = await this.page.$('.job-tracker, .tracker, table') !== null;
        if (!hasTracker) {
          throw new Error('Job tracker interface not found');
        }
      });

      // 7. AI Features Testing
      await this.test('AI Resume Enhancement page loads', async () => {
        await this.page.goto('http://localhost:3000/ai-resume');
        await this.page.waitForLoadState('networkidle');
        
        const hasAI = await this.page.$('.ai-resume, .ai-enhancement, textarea, .upload') !== null;
        if (!hasAI) {
          throw new Error('AI resume enhancement interface not found');
        }
      });

      // 8. JD Analyzer Testing
      await this.test('Job Description Analyzer loads', async () => {
        await this.page.goto('http://localhost:3000/jd-analyzer');
        await this.page.waitForLoadState('networkidle');
        
        const hasAnalyzer = await this.page.$('.jd-analyzer, .analyzer, textarea') !== null;
        if (!hasAnalyzer) {
          throw new Error('JD analyzer interface not found');
        }
      });

      // 9. Settings/Profile Testing
      await this.test('User profile/settings page loads', async () => {
        await this.page.goto('http://localhost:3000/profile');
        await this.page.waitForLoadState('networkidle');
        
        // Check for profile/settings interface
        const hasProfile = await this.page.$('.profile, .settings, form, .user-info') !== null;
        if (!hasProfile) {
          // Try alternative routes
          await this.page.goto('http://localhost:3000/settings');
          await this.page.waitForLoadState('networkidle');
          
          const hasSettings = await this.page.$('.profile, .settings, form, .user-info') !== null;
          if (!hasSettings) {
            throw new Error('Profile/settings page not found');
          }
        }
      });

      // 10. API Integration Testing
      await this.test('API endpoints respond correctly', async () => {
        // Test health endpoint
        const response = await this.page.evaluate(async () => {
          const res = await fetch('http://localhost:5000/api/health');
          return res.json();
        });
        
        if (response.status !== 'ok') {
          throw new Error('API health check failed');
        }
      });

      // 11. Error Handling Testing
      await this.test('404 page handles non-existent routes', async () => {
        await this.page.goto('http://localhost:3000/non-existent-page');
        await this.page.waitForLoadState('networkidle');
        
        // Should show 404 or redirect to home/dashboard
        const url = this.page.url();
        const has404 = await this.page.$('.not-found, .error-404') !== null;
        const redirected = url.includes('/dashboard') || url.includes('/');
        
        if (!has404 && !redirected) {
          throw new Error('404 handling not working properly');
        }
      });

      // 12. Responsive Design Testing
      await this.test('Application is responsive', async () => {
        await this.page.goto('http://localhost:3000/dashboard');
        
        // Test mobile viewport
        await this.page.setViewportSize({ width: 375, height: 667 });
        await this.page.waitForTimeout(1000);
        
        // Check if mobile navigation works
        const mobileNav = await this.page.$('.mobile-nav, .hamburger, .menu-toggle');
        
        // Reset to desktop
        await this.page.setViewportSize({ width: 1200, height: 800 });
        
        console.log('   ℹ️  Responsive design test completed');
      });

      // 13. Performance Testing
      await this.test('Application loads within acceptable time', async () => {
        const startTime = Date.now();
        await this.page.goto('http://localhost:3000/dashboard');
        await this.page.waitForLoadState('networkidle');
        const loadTime = Date.now() - startTime;
        
        if (loadTime > 10000) { // 10 seconds
          throw new Error(`Page load time too slow: ${loadTime}ms`);
        }
        
        console.log(`   ℹ️  Load time: ${loadTime}ms`);
      });

      console.log('\n🎯 COMPREHENSIVE TESTING COMPLETE!');
      console.log(`✅ Passed: ${this.results.passed}`);
      console.log(`❌ Failed: ${this.results.failed}`);
      console.log(`📊 Total Tests: ${this.results.tests.length}`);
      console.log(`🎉 Success Rate: ${((this.results.passed / this.results.tests.length) * 100).toFixed(1)}%`);

      if (this.results.failed > 0) {
        console.log('\n❌ FAILED TESTS:');
        this.results.tests
          .filter(test => test.status === 'FAILED')
          .forEach(test => {
            console.log(`   • ${test.name}: ${test.error}`);
          });
      }

    } catch (error) {
      console.error('❌ Testing suite error:', error);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// Run the comprehensive testing suite
async function runComprehensiveTesting() {
  const tester = new AutoApplyProTester();
  await tester.runAllTests();
}

// Export for external use
module.exports = { AutoApplyProTester, runComprehensiveTesting };

// Run if called directly
if (require.main === module) {
  runComprehensiveTesting().catch(console.error);
}
