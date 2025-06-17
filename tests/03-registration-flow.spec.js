const { test, expect } = require('@playwright/test');

test.describe('User Registration Flow', () => {
  test('Should display registration form with required fields', async ({ page }) => {
    // Navigate to the register page
    await page.goto('http://localhost:3000/register');
    
    // Wait for the page to load
    await page.waitForSelector('form', { timeout: 10000 });
    
    // Check for required registration fields
    const nameField = page.locator('input[name="name"]').or(page.locator('input[type="text"]')).or(page.locator('[placeholder*="name" i]')).first();
    const emailField = page.locator('input[name="email"]').or(page.locator('input[type="email"]')).first();
    const passwordField = page.locator('input[name="password"]').or(page.locator('input[type="password"]')).first();
    const submitButton = page.locator('button[type="submit"]').or(page.locator('button:has-text("Register")')).or(page.locator('button:has-text("Sign Up")')).first();
    
    // Verify all fields are visible
    await expect(nameField).toBeVisible();
    await expect(emailField).toBeVisible();
    await expect(passwordField).toBeVisible();
    await expect(submitButton).toBeVisible();
    
    console.log('✅ Registration form fields verified');
  });

  test('Should show validation errors for empty form submission', async ({ page }) => {
    // Navigate to the register page
    await page.goto('http://localhost:3000/register');
    
    // Wait for the page to load
    await page.waitForSelector('form', { timeout: 10000 });
    
    // Try to submit the form without filling any fields
    const submitButton = page.locator('button[type="submit"]').or(page.locator('button:has-text("Register")')).or(page.locator('button:has-text("Sign Up")')).first();
    await submitButton.click();
    
    // Wait a moment for validation to trigger
    await page.waitForTimeout(1000);
    
    // Check for validation errors (could be browser validation or custom validation)
    const hasValidationErrors = await page.evaluate(() => {
      // Check for HTML5 validation
      const invalidFields = document.querySelectorAll(':invalid');
      if (invalidFields.length > 0) return true;
      
      // Check for custom error messages
      const errorMessages = document.querySelectorAll('.error, .text-red-500, .text-red-600, [class*="error"]');
      if (errorMessages.length > 0) return true;
      
      // Check for toast notifications
      const toasts = document.querySelectorAll('[class*="toast"], [class*="alert"]');
      return toasts.length > 0;
    });
    
    // Should have some form of validation
    expect(hasValidationErrors).toBe(true);
    
    console.log('✅ Form validation working correctly');
  });

  test('Should attempt registration with valid data', async ({ page }) => {
    // Navigate to the register page
    await page.goto('http://localhost:3000/register');
    
    // Wait for the page to load
    await page.waitForSelector('form', { timeout: 10000 });
    
    // Fill out the registration form with test data
    const testEmail = `testuser${Date.now()}@example.com`;
    const testName = 'Test User';
    const testPassword = 'TestPassword123!';
    
    const nameField = page.locator('input[name="name"]').or(page.locator('input[type="text"]')).or(page.locator('[placeholder*="name" i]')).first();
    const emailField = page.locator('input[name="email"]').or(page.locator('input[type="email"]')).first();
    const passwordField = page.locator('input[name="password"]').or(page.locator('input[type="password"]')).first();
    
    await nameField.fill(testName);
    await emailField.fill(testEmail);
    await passwordField.fill(testPassword);
    
    // Submit the form
    const submitButton = page.locator('button[type="submit"]').or(page.locator('button:has-text("Register")')).or(page.locator('button:has-text("Sign Up")')).first();
    await submitButton.click();
    
    // Wait for the response (either success redirect or error message)
    await page.waitForTimeout(3000);
    
    // Check if we were redirected (success) or if there's an error message
    const currentUrl = page.url();
    const isOnRegisterPage = currentUrl.includes('/register');
    
    if (!isOnRegisterPage) {
      // Successfully redirected
      console.log('✅ Registration successful - redirected to:', currentUrl);
    } else {
      // Still on register page, check for error messages
      const errorMessage = await page.evaluate(() => {
        const errorElements = document.querySelectorAll('.error, .text-red-500, .text-red-600, [class*="error"]');
        return errorElements.length > 0 ? errorElements[0].textContent : null;
      });
      
      if (errorMessage) {
        console.log('ℹ️ Registration returned error:', errorMessage);
      } else {
        console.log('ℹ️ Registration form submitted, checking response...');
      }
    }
  });
});
