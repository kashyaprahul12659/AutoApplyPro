const { test, expect } = require('@playwright/test');

test.describe('User Authentication Flow', () => {  test('Should display login and register options on landing page', async ({ page }) => {
    // Navigate to the landing page
    await page.goto('http://localhost:3000');
    
    // Wait for the navigation to be visible (much more reliable than networkidle)
    await page.waitForSelector('nav', { timeout: 10000 });
      // Check for specific Login and Register links based on the actual Landing.js structure
    // Target the navigation login link specifically to avoid strict mode violations
    const loginLink = page.locator('nav a[href="/login"]').first();
    const registerLink = page.locator('nav a[href="/register"]').first();
    
    // Verify login link exists and is visible
    await expect(loginLink).toBeVisible({ timeout: 10000 });
    
    // Verify register link exists and is visible  
    await expect(registerLink).toBeVisible({ timeout: 10000 });
    
    // Verify the text content as well
    await expect(loginLink).toHaveText('Login');
    await expect(registerLink).toHaveText('Register');
    
    console.log('✅ Login and Register buttons found on landing page');
  });
  test('Should navigate to login page when clicking login', async ({ page }) => {
    // Navigate to the landing page
    await page.goto('http://localhost:3000');
    
    // Wait for the navigation to be visible
    await page.waitForSelector('nav', { timeout: 10000 });
      // Find and click the login link from navigation specifically
    const loginLink = page.locator('nav a[href="/login"]').first();
    await loginLink.click();
    
    // Wait for navigation and verify we're on the login page
    await page.waitForURL('**/login');
    
    // Check for email and password fields
    const emailField = page.locator('input[type="email"]').or(page.locator('input[name="email"]')).or(page.locator('[placeholder*="email" i]')).first();
    const passwordField = page.locator('input[type="password"]').or(page.locator('input[name="password"]')).or(page.locator('[placeholder*="password" i]')).first();
    
    await expect(emailField).toBeVisible();
    await expect(passwordField).toBeVisible();
    
    console.log('✅ Login page navigation and form fields verified');
  });
});
