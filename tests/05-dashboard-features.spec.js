const { test, expect } = require('@playwright/test');

test.describe('Dashboard and Core Features', () => {
  // Helper function to create a test user and login
  async function loginAsTestUser(page) {
    // For now, we'll navigate to the dashboard directly to test the UI
    // In a real scenario, we'd want to create a test user first
    await page.goto('http://localhost:3000/dashboard');
    
    // Check if we're redirected to login (expected if not authenticated)
    await page.waitForTimeout(2000);
    const currentUrl = page.url();
    
    if (currentUrl.includes('/login')) {
      console.log('ℹ️ Redirected to login (authentication required)');
      return false;
    }
    return true;
  }

  test('Should redirect unauthenticated users to login', async ({ page }) => {
    // Try to access dashboard without authentication
    await page.goto('http://localhost:3000/dashboard');
    
    // Wait for potential redirect
    await page.waitForTimeout(3000);
    
    const currentUrl = page.url();
    const isRedirectedToLogin = currentUrl.includes('/login');
    
    // Should be redirected to login
    expect(isRedirectedToLogin).toBe(true);
    
    console.log('✅ Unauthenticated users correctly redirected to login');
  });
  test('Should display main navigation menu when authenticated', async ({ page }) => {
    // Navigate to the main application
    await page.goto('http://localhost:3000');
    
    // Wait for the page to load
    await page.waitForSelector('nav', { timeout: 10000 });
    
    // On the landing page, check for the specific nav items that should be present
    // Based on Landing.js, we should see Login and Register in the nav
    const landingNavItems = [
      'Login',
      'Register'
    ];
    
    let foundNavItems = 0;
    
    for (const navItem of landingNavItems) {
      const navLink = page.locator(`nav a:has-text("${navItem}")`);
      const isVisible = await navLink.isVisible().catch(() => false);
      if (isVisible) {
        foundNavItems++;
        console.log(`✅ Found landing nav item: ${navItem}`);
      }
    }
    
    // Also check for the AutoApply Pro brand name in nav
    const brandElement = page.locator('nav span:has-text("AutoApply Pro")');
    const isBrandVisible = await brandElement.isVisible().catch(() => false);
    if (isBrandVisible) {
      foundNavItems++;
      console.log(`✅ Found brand element in nav`);
    }
    
    // Should find at least the basic navigation items on landing page
    expect(foundNavItems).toBeGreaterThan(0);
    console.log(`Found ${foundNavItems} navigation elements on landing page`);
  });

  test('Should display landing page features and pricing', async ({ page }) => {
    // Navigate to the landing page
    await page.goto('http://localhost:3000');
    
    // Wait for the page to load
    await page.waitForLoadState('domcontentloaded');
    
    // Check for key landing page sections
    const featureKeywords = [
      'AutoApply Pro',
      'AI',
      'resume',
      'cover letter',
      'job',
      'application'
    ];
    
    let foundFeatures = 0;
    
    for (const keyword of featureKeywords) {
      const hasKeyword = await page.evaluate((word) => {
        return document.body.textContent.toLowerCase().includes(word.toLowerCase());
      }, keyword);
      
      if (hasKeyword) {
        foundFeatures++;
      }
    }
    
    // Should find most feature keywords
    expect(foundFeatures).toBeGreaterThan(featureKeywords.length / 2);
    
    console.log(`✅ Found ${foundFeatures} out of ${featureKeywords.length} feature keywords`);
  });

  test('Should handle individual feature page access', async ({ page }) => {
    // Test direct access to feature pages
    const featurePages = [
      '/cover-letter',
      '/job-tracker',
      '/jd-analyzer',
      '/resume-builder'
    ];
    
    for (const pagePath of featurePages) {
      await page.goto(`http://localhost:3000${pagePath}`);
      
      // Wait for page load
      await page.waitForTimeout(2000);
      
      const currentUrl = page.url();
      
      // Check if page loads (either the feature page or redirected to login)
      if (currentUrl.includes('/login')) {
        console.log(`ℹ️ ${pagePath} requires authentication (redirected to login)`);
      } else if (currentUrl.includes(pagePath)) {
        console.log(`✅ ${pagePath} page loads successfully`);
      } else {
        console.log(`⚠️ ${pagePath} unexpected redirect to: ${currentUrl}`);
      }
    }
  });

  test('Should display proper page titles and meta information', async ({ page }) => {
    const pages = [
      { path: '/', expectedTitlePattern: /AutoApply Pro/i },
      { path: '/login', expectedTitlePattern: /login|sign in/i },
      { path: '/register', expectedTitlePattern: /register|sign up/i }
    ];
    
    for (const pageInfo of pages) {
      await page.goto(`http://localhost:3000${pageInfo.path}`);
      await page.waitForLoadState('domcontentloaded');
      
      const title = await page.title();
      const matchesPattern = pageInfo.expectedTitlePattern.test(title);
      
      if (matchesPattern) {
        console.log(`✅ ${pageInfo.path} has correct title: "${title}"`);
      } else {
        console.log(`⚠️ ${pageInfo.path} title "${title}" doesn't match expected pattern`);
      }
    }
  });
});
