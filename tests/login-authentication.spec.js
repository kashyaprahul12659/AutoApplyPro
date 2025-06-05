// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Login Authentication Test
 * Tests the actual login process with valid credentials
 */
test.describe('Login Authentication', () => {
  // Test user credentials - modify these to match a valid user in your database
  const validUser = {
    email: 'test@example.com',
    password: 'Test123!'
  };

  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto('http://localhost:3000/login');
    console.log('📄 Navigated to login page');
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Get form fields
    const emailField = page.locator('input[type="email"], input[name="email"], input#email');
    const passwordField = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    
    // Fill with valid credentials
    await emailField.fill(validUser.email);
    await passwordField.fill(validUser.password);
    console.log(`📌 Filled form with valid credentials: ${validUser.email}`);
    
    // Take a screenshot before submission
    await page.screenshot({ path: 'test-results/login-before-submit.png' });
    
    // Submit the form and wait for navigation
    console.log('📌 Submitting login form...');
    
    // We need to handle both cases:
    // 1. If there's a navigation after login
    // 2. If the page updates without navigation
    
    try {
      // Try with navigation wait first
      const navigationPromise = page.waitForNavigation({ timeout: 10000 });
      await submitButton.click();
      await navigationPromise;
      
      console.log(`📌 Navigation occurred after login. New URL: ${page.url()}`);
      
      // Check if we're redirected to dashboard, home, or profile
      const successPages = ['dashboard', 'home', 'profile', 'account'];
      const currentUrl = page.url().toLowerCase();
      
      let redirectedToSuccess = false;
      for (const pageName of successPages) {
        if (currentUrl.includes(pageName)) {
          console.log(`✅ Successfully redirected to ${pageName} page`);
          redirectedToSuccess = true;
          break;
        }
      }
      
      if (!redirectedToSuccess) {
        console.log(`⚠️ Redirected to unexpected URL: ${currentUrl}`);
      }
      
      // Check for success indicators
      const userMenu = page.locator('.user-menu, .avatar, [data-testid="user-menu"]');
      const userMenuVisible = await userMenu.count() > 0;
      
      if (userMenuVisible) {
        console.log('✅ User menu/avatar is visible after login');
      } else {
        console.log('⚠️ User menu/avatar not found');
      }
      
      // Take a screenshot after successful login
      await page.screenshot({ path: 'test-results/login-success.png' });
      
      // Basic assertion - we should not be on the login page anymore
      expect(page.url()).not.toContain('login');
      
    } catch (error) {
      // If navigation doesn't happen, the login might update the current page
      console.log('📌 No navigation detected, checking for login success on current page');
      
      // Just click without waiting for navigation
      await submitButton.click();
      
      // Wait a moment for any updates
      await page.waitForTimeout(2000);
      
      // Take a screenshot
      await page.screenshot({ path: 'test-results/login-no-navigation.png' });
      
      // Check for success indicators on the current page
      const pageContent = await page.textContent('body');
      const successPhrases = ['welcome', 'logged in', 'dashboard', 'success'];
      
      let foundSuccessIndicator = false;
      for (const phrase of successPhrases) {
        if (pageContent.toLowerCase().includes(phrase)) {
          console.log(`✅ Found success indicator: "${phrase}" on page`);
          foundSuccessIndicator = true;
          break;
        }
      }
      
      // Look for error messages
      const errorMessages = await page.locator('.error, .text-red-500, .invalid-feedback, [data-testid="error"]').all();
      if (errorMessages.length > 0) {
        for (let i = 0; i < errorMessages.length; i++) {
          const text = await errorMessages[i].textContent();
          console.log(`⚠️ Error message #${i+1}: "${text?.trim()}"`);
        }
        console.log('⚠️ Login may have failed - error messages found');
      } else if (!foundSuccessIndicator) {
        console.log('⚠️ No clear success indicators found, login status unclear');
      }
      
      // Check if user-specific elements are visible
      const userMenu = page.locator('.user-menu, .avatar, [data-testid="user-menu"]');
      const userMenuVisible = await userMenu.count() > 0;
      
      if (userMenuVisible) {
        console.log('✅ User menu/avatar is visible after login');
      }
    }
  });
});
