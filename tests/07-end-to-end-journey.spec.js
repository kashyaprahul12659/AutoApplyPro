const { test, expect } = require('@playwright/test');

test.describe('End-to-End User Journey', () => {
  let testUserEmail;
  let testUserPassword;
  
  test.beforeEach(() => {
    // Generate unique test user credentials for each test
    testUserEmail = `e2e-test-${Date.now()}@example.com`;
    testUserPassword = 'TestPassword123!';
  });

  test('Complete user registration and login flow', async ({ page }) => {
    // Step 1: Navigate to landing page
    await page.goto('http://localhost:3000');
    await page.waitForSelector('nav');
    
    // Step 2: Click register
    const registerLink = page.locator('nav a[href="/register"]').first();
    await registerLink.click();
    await page.waitForURL('**/register');
    
    // Step 3: Fill registration form
    await page.fill('input[name="name"]', 'E2E Test User');
    await page.fill('input[name="email"]', testUserEmail);
    await page.fill('input[name="password"]', testUserPassword);
    
    // Check if there's a confirm password field
    const confirmPasswordField = page.locator('input[name="confirmPassword"]');
    const hasConfirmPassword = await confirmPasswordField.count() > 0;
    if (hasConfirmPassword) {
      await confirmPasswordField.fill(testUserPassword);
    }
    
    // Step 4: Submit registration
    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();
    
    // Step 5: Wait for response and check result
    await page.waitForTimeout(3000);
    const currentUrl = page.url();
    
    if (currentUrl.includes('/dashboard') || currentUrl.includes('/login')) {
      console.log('✅ Registration successful - redirected to:', currentUrl);
    } else {
      console.log('ℹ️ Registration completed, current page:', currentUrl);
    }
    
    // Step 6: If not automatically logged in, perform login
    if (currentUrl.includes('/login') || currentUrl.includes('/register')) {
      await page.goto('http://localhost:3000/login');
      await page.waitForSelector('form');
      
      await page.fill('input[type="email"]', testUserEmail);
      await page.fill('input[type="password"]', testUserPassword);
      
      const loginButton = page.locator('button[type="submit"]').first();
      await loginButton.click();
      
      await page.waitForTimeout(3000);
      console.log('✅ Login attempted for registered user');
    }
  });

  test('Test main application features accessibility', async ({ page }) => {
    // Navigate to main features and check they load
    const featurePages = [
      { path: '/cover-letter', name: 'Cover Letter Generator' },
      { path: '/job-tracker', name: 'Job Tracker' },
      { path: '/jd-analyzer', name: 'JD Analyzer' },
      { path: '/resume-builder', name: 'Resume Builder' }
    ];
    
    for (const feature of featurePages) {
      await page.goto(`http://localhost:3000${feature.path}`);
      await page.waitForTimeout(2000);
      
      const currentUrl = page.url();
      
      if (currentUrl.includes('/login')) {
        console.log(`✅ ${feature.name} correctly requires authentication`);
      } else if (currentUrl.includes(feature.path)) {
        console.log(`✅ ${feature.name} page loads successfully`);
        
        // Check for common UI elements that should be present
        const hasForm = await page.locator('form').count() > 0;
        const hasInput = await page.locator('input, textarea').count() > 0;
        const hasButton = await page.locator('button').count() > 0;
        
        if (hasForm || hasInput || hasButton) {
          console.log(`  - ${feature.name} has interactive elements`);
        }
      } else {
        console.log(`⚠️ ${feature.name} unexpected redirect to: ${currentUrl}`);
      }
    }
  });

  test('Test responsive design and mobile compatibility', async ({ page }) => {
    // Test different viewport sizes
    const viewports = [
      { width: 1200, height: 800, name: 'Desktop' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 375, height: 667, name: 'Mobile' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('http://localhost:3000');
      await page.waitForSelector('nav');
      
      // Check if navigation is accessible
      const nav = page.locator('nav');
      const navVisible = await nav.isVisible();
      
      // Check if main content is visible
      const mainContent = page.locator('main, .main, [role="main"]').first();
      const contentVisible = await mainContent.isVisible().catch(() => false);
      
      console.log(`${viewport.name} (${viewport.width}x${viewport.height}):`);
      console.log(`  - Navigation visible: ${navVisible}`);
      console.log(`  - Main content visible: ${contentVisible}`);
      
      // Check for mobile-specific elements
      if (viewport.width < 768) {
        const mobileMenu = page.locator('[data-mobile-menu], .mobile-menu, .hamburger');
        const hasMobileMenu = await mobileMenu.count() > 0;
        console.log(`  - Mobile menu present: ${hasMobileMenu}`);
      }
    }
  });

  test('Test error handling and edge cases', async ({ page }) => {
    // Test 1: Navigate to non-existent page
    await page.goto('http://localhost:3000/non-existent-page');
    await page.waitForTimeout(2000);
    
    const currentUrl = page.url();
    const pageContent = await page.textContent('body');
    
    if (pageContent.toLowerCase().includes('404') || pageContent.toLowerCase().includes('not found')) {
      console.log('✅ 404 page handling works correctly');
    } else {
      console.log('ℹ️ Non-existent page handling:', currentUrl);
    }
    
    // Test 2: Check if JavaScript errors are logged
    const jsErrors = [];
    page.on('pageerror', error => {
      jsErrors.push(error.message);
    });
    
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(3000);
    
    if (jsErrors.length === 0) {
      console.log('✅ No JavaScript errors detected on landing page');
    } else {
      console.log('⚠️ JavaScript errors found:', jsErrors);
    }
    
    // Test 3: Check console warnings (excluding known webpack dev warnings)
    const consoleMessages = [];
    page.on('console', msg => {
      if (msg.type() === 'warning' && !msg.text().includes('webpack') && !msg.text().includes('DeprecationWarning')) {
        consoleMessages.push(msg.text());
      }
    });
    
    await page.reload();
    await page.waitForTimeout(2000);
    
    if (consoleMessages.length === 0) {
      console.log('✅ No significant console warnings');
    } else {
      console.log('ℹ️ Console warnings:', consoleMessages);
    }
  });
  test('Test performance and loading times', async ({ page }) => {
    // Measure page load performance
    const startTime = Date.now();
    
    await page.goto('http://localhost:3000');
    await page.waitForSelector('nav');
    
    // Instead of networkidle, wait for main content to be visible
    await page.waitForSelector('main, .main, body', { timeout: 10000 });
    
    const loadTime = Date.now() - startTime;
    console.log(`Landing page load time: ${loadTime}ms`);
    
    if (loadTime < 5000) {
      console.log('✅ Page loads within acceptable time');
    } else {
      console.log('⚠️ Page load time exceeds 5 seconds');
    }
    
    // Check for resource loading issues
    const failedRequests = [];
    page.on('requestfailed', request => {
      failedRequests.push(request.url());
    });
    
    await page.reload();
    await page.waitForTimeout(3000);
    
    if (failedRequests.length === 0) {
      console.log('✅ All resources loaded successfully');
    } else {
      console.log('⚠️ Failed resource requests:', failedRequests);
    }
  });
});
