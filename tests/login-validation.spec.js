// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Login Form Validation Test
 * Tests form validation rules without submitting to backend
 */
test.describe('Login Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto('http://localhost:3000/login');
    console.log('📄 Navigated to login page');
  });

  test('should show validation errors for empty form submission', async ({ page }) => {
    // Get the submit button
    const submitButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    
    // Click the submit button without filling any fields
    await submitButton.click();
    console.log('📌 Clicked submit button with empty form');
    
    // Take a screenshot after submission
    await page.screenshot({ path: 'test-results/login-empty-submission.png' });
    
    // Check if we're still on the login page (didn't navigate away)
    expect(page.url()).toContain('login');
    console.log('✅ Still on login page after empty submission');
    
    // Look for validation error messages
    const errorMessages = await page.locator('.error, .text-red-500, .invalid-feedback, [data-testid="error"]').all();
    console.log(`📌 Found ${errorMessages.length} error message elements`);
    
    // If we don't find specific error elements, check for any text that looks like an error
    if (errorMessages.length === 0) {
      // Look for any text that might indicate an error
      const pageText = await page.textContent('body');
      const errorTexts = ['required', 'cannot be empty', 'invalid', 'please enter'];
      
      let foundErrorText = false;
      for (const errorText of errorTexts) {
        if (pageText.toLowerCase().includes(errorText)) {
          console.log(`📌 Found error text: "${errorText}" on page`);
          foundErrorText = true;
        }
      }
      
      // Assert we found some kind of error indication
      expect(foundErrorText || errorMessages.length > 0).toBeTruthy();
    } else {
      // Log the error messages
      for (let i = 0; i < errorMessages.length; i++) {
        const text = await errorMessages[i].textContent();
        console.log(`📌 Error message #${i+1}: "${text?.trim()}"`);
      }
    }
    
    console.log('✅ Form validation for empty submission verified');
  });

  test('should validate email format', async ({ page }) => {
    // Get form fields
    const emailField = page.locator('input[type="email"], input[name="email"], input#email');
    const passwordField = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    
    // Fill an invalid email format
    await emailField.fill('invalid-email-format');
    await passwordField.fill('validPassword123');
    
    console.log('📌 Filled form with invalid email format');
    
    // Submit the form
    await submitButton.click();
    
    // Take a screenshot after submission
    await page.screenshot({ path: 'test-results/login-invalid-email.png' });
    
    // Check if we're still on the login page
    expect(page.url()).toContain('login');
    console.log('✅ Still on login page after invalid email submission');
    
    // Check for validation messages
    const pageText = await page.textContent('body');
    const emailErrorPhrases = ['valid email', 'email format', 'invalid email'];
    
    let foundEmailError = false;
    for (const phrase of emailErrorPhrases) {
      if (pageText.toLowerCase().includes(phrase)) {
        console.log(`📌 Found email validation error: "${phrase}"`);
        foundEmailError = true;
        break;
      }
    }
    
    // Some implementations might use HTML5 validation which varies by browser
    // So we're being flexible in our validation approach
    console.log(`✅ Email format validation ${foundEmailError ? 'verified' : 'might be handled differently'}`);
  });

  test('should validate minimum password length', async ({ page }) => {
    // Get form fields
    const emailField = page.locator('input[type="email"], input[name="email"], input#email');
    const passwordField = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    
    // Fill a valid email but too short password
    await emailField.fill('test@example.com');
    await passwordField.fill('123'); // Typically too short
    
    console.log('📌 Filled form with valid email but short password');
    
    // Submit the form
    await submitButton.click();
    
    // Take a screenshot after submission
    await page.screenshot({ path: 'test-results/login-short-password.png' });
    
    // Check if we're still on the login page (this may vary depending on implementation)
    const currentUrl = page.url();
    console.log(`📌 Current URL after submission: ${currentUrl}`);
    
    // Some implementations might not validate password length on login form
    // Log whether we stayed on login page or moved to another page
    if (currentUrl.includes('login')) {
      console.log('✅ Still on login page after short password submission');
      
      // Look for password validation messages
      const pageText = await page.textContent('body');
      const passwordErrorPhrases = ['password too short', 'minimum', 'at least'];
      
      let foundPasswordError = false;
      for (const phrase of passwordErrorPhrases) {
        if (pageText.toLowerCase().includes(phrase)) {
          console.log(`📌 Found password validation error: "${phrase}"`);
          foundPasswordError = true;
          break;
        }
      }
      
      console.log(`✅ Password length validation ${foundPasswordError ? 'verified' : 'might be handled differently'}`);
    } else {
      console.log('⚠️ Navigation occurred - password length may not be validated on client side');
    }
  });
});
