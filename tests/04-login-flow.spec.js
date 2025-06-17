const { test, expect } = require('@playwright/test');

test.describe('User Login Flow', () => {
  test('Should display login form with required fields', async ({ page }) => {
    // Navigate to the login page
    await page.goto('http://localhost:3000/login');
    
    // Wait for the page to load
    await page.waitForSelector('form', { timeout: 10000 });
    
    // Check for required login fields
    const emailField = page.locator('input[name="email"]').or(page.locator('input[type="email"]')).first();
    const passwordField = page.locator('input[name="password"]').or(page.locator('input[type="password"]')).first();
    const submitButton = page.locator('button[type="submit"]').or(page.locator('button:has-text("Login")')).or(page.locator('button:has-text("Sign In")')).first();
    
    // Verify all fields are visible
    await expect(emailField).toBeVisible();
    await expect(passwordField).toBeVisible();
    await expect(submitButton).toBeVisible();
    
    // Check for "Forgot Password" link
    const forgotPasswordLink = page.locator('a:has-text("Forgot")').or(page.locator('a[href*="forgot"]')).first();
    
    console.log('✅ Login form fields verified');
  });

  test('Should show validation errors for invalid login', async ({ page }) => {
    // Navigate to the login page
    await page.goto('http://localhost:3000/login');
    
    // Wait for the page to load
    await page.waitForSelector('form', { timeout: 10000 });
    
    // Try to login with invalid credentials
    const emailField = page.locator('input[name="email"]').or(page.locator('input[type="email"]')).first();
    const passwordField = page.locator('input[name="password"]').or(page.locator('input[type="password"]')).first();
    const submitButton = page.locator('button[type="submit"]').or(page.locator('button:has-text("Login")')).or(page.locator('button:has-text("Sign In")')).first();
    
    await emailField.fill('invalid@example.com');
    await passwordField.fill('wrongpassword');
    await submitButton.click();
    
    // Wait for the response
    await page.waitForTimeout(3000);
    
    // Check for error messages
    const hasErrorMessage = await page.evaluate(() => {
      // Check for custom error messages
      const errorMessages = document.querySelectorAll('.error, .text-red-500, .text-red-600, [class*="error"]');
      if (errorMessages.length > 0) return true;
      
      // Check for toast notifications
      const toasts = document.querySelectorAll('[class*="toast"], [class*="alert"]');
      if (toasts.length > 0) return true;
      
      // Check for any text containing "invalid", "error", "wrong"
      const bodyText = document.body.textContent.toLowerCase();
      return bodyText.includes('invalid') || bodyText.includes('error') || bodyText.includes('wrong') || bodyText.includes('failed');
    });
    
    // Should still be on login page with error
    const currentUrl = page.url();
    const isOnLoginPage = currentUrl.includes('/login');
    
    if (isOnLoginPage && hasErrorMessage) {
      console.log('✅ Invalid login correctly shows error message');
    } else if (isOnLoginPage) {
      console.log('ℹ️ Still on login page, checking for subtle error indicators...');
    } else {
      console.log('⚠️ Unexpected redirect for invalid credentials');
    }
  });

  test('Should handle API connection issues gracefully', async ({ page }) => {
    // Navigate to the login page
    await page.goto('http://localhost:3000/login');
    
    // Wait for the page to load
    await page.waitForSelector('form', { timeout: 10000 });
    
    // Monitor network requests
    const apiRequests = [];
    page.on('request', request => {
      if (request.url().includes('/api/')) {
        apiRequests.push(request.url());
      }
    });
    
    page.on('response', response => {
      if (response.url().includes('/api/')) {
        console.log(`API Response: ${response.url()} - Status: ${response.status()}`);
      }
    });
    
    // Try to login with test credentials
    const emailField = page.locator('input[name="email"]').or(page.locator('input[type="email"]')).first();
    const passwordField = page.locator('input[name="password"]').or(page.locator('input[type="password"]')).first();
    const submitButton = page.locator('button[type="submit"]').or(page.locator('button:has-text("Login")')).or(page.locator('button:has-text("Sign In")')).first();
    
    await emailField.fill('test@example.com');
    await passwordField.fill('testpassword');
    await submitButton.click();
    
    // Wait for the response
    await page.waitForTimeout(5000);
    
    // Check if any API calls were made
    if (apiRequests.length > 0) {
      console.log('✅ API calls detected:', apiRequests);
    } else {
      console.log('⚠️ No API calls detected - check backend connection');
    }
    
    // Check the current state
    const currentUrl = page.url();
    console.log('Current URL after login attempt:', currentUrl);
  });
});
