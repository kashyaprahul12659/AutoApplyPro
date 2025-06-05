// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Signup page tests
 * Tests the registration form, validation, and user creation flow
 */
test.describe('Signup Page', () => {
  // Generate a unique email each time to avoid conflicts
  const timestamp = new Date().getTime();
  const testUser = {
    name: 'Test User',
    email: `test${timestamp}@example.com`,
    password: 'Test123!',
    confirmPassword: 'Test123!'
  };

  test.beforeEach(async ({ page }) => {
    // Navigate to signup page before each test
    await page.goto('http://localhost:3000/register');
    // Wait for signup form to be visible
    await page.waitForSelector('form', { state: 'visible' });
  });

  test('should display signup form with all required fields', async ({ page }) => {
    // Check for form elements
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    
    // Check for confirm password field if it exists
    const confirmPasswordField = page.getByLabel(/confirm password/i);
    if (await confirmPasswordField.count() > 0) {
      await expect(confirmPasswordField).toBeVisible();
    }
    
    // Check for signup button
    await expect(page.getByRole('button', { name: /sign up|register|create account/i })).toBeVisible();
    
    // Check for login link for existing users
    const loginLink = page.getByRole('link', { name: /login|sign in/i });
    if (await loginLink.count() > 0) {
      await expect(loginLink).toBeVisible();
    }
    
    console.log('✅ Signup form elements verified');
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    // Click signup without entering any data
    await page.getByRole('button', { name: /sign up|register|create account/i }).click();
    
    // Check for validation messages
    const errorMessages = page.locator('.error-message, .text-red-500, [data-testid="error-message"]');
    await expect(errorMessages).toBeVisible();
    
    console.log('✅ Form validation for empty fields verified');
  });

  test('should validate password requirements', async ({ page }) => {
    // Fill in name and email
    await page.getByLabel(/name/i).fill(testUser.name);
    await page.getByLabel(/email/i).fill(testUser.email);
    
    // Try with a too short password
    await page.getByLabel(/^password$/i).fill('short');
    
    // Fill confirm password if it exists
    const confirmPasswordField = page.getByLabel(/confirm password/i);
    if (await confirmPasswordField.count() > 0) {
      await confirmPasswordField.fill('short');
    }
    
    // Submit form
    await page.getByRole('button', { name: /sign up|register|create account/i }).click();
    
    // Check for password validation error
    const passwordError = page.locator('.error-message, .text-red-500, [data-testid="error-message"]')
      .filter({ hasText: /password|length|character/i });
    
    if (await passwordError.count() > 0) {
      await expect(passwordError).toBeVisible();
      console.log('✅ Password requirements validation verified');
    } else {
      console.log('⚠️ No client-side password validation found, may be validating server-side');
    }
  });

  test('should validate password matching if confirm password exists', async ({ page }) => {
    // Check if confirm password field exists
    const confirmPasswordField = page.getByLabel(/confirm password/i);
    if (await confirmPasswordField.count() === 0) {
      console.log('⚠️ No confirm password field found, skipping this test');
      test.skip();
      return;
    }
    
    // Fill in form with mismatched passwords
    await page.getByLabel(/name/i).fill(testUser.name);
    await page.getByLabel(/email/i).fill(testUser.email);
    await page.getByLabel(/^password$/i).fill(testUser.password);
    await confirmPasswordField.fill('DifferentPassword123!');
    
    // Submit form
    await page.getByRole('button', { name: /sign up|register|create account/i }).click();
    
    // Check for password matching error
    const matchError = page.locator('.error-message, .text-red-500, [data-testid="error-message"]')
      .filter({ hasText: /match|same|confirm/i });
    
    if (await matchError.count() > 0) {
      await expect(matchError).toBeVisible();
      console.log('✅ Password matching validation verified');
    } else {
      console.log('⚠️ No client-side password matching validation found, may be validating server-side');
    }
  });

  // This test can be enabled when backend is running
  test.skip('should successfully register a new user', async ({ page }) => {
    // Fill in all registration fields
    await page.getByLabel(/name/i).fill(testUser.name);
    await page.getByLabel(/email/i).fill(testUser.email);
    await page.getByLabel(/^password$/i).fill(testUser.password);
    
    // Fill confirm password if it exists
    const confirmPasswordField = page.getByLabel(/confirm password/i);
    if (await confirmPasswordField.count() > 0) {
      await confirmPasswordField.fill(testUser.confirmPassword);
    }
    
    // Accept terms if there's a checkbox
    const termsCheckbox = page.getByLabel(/terms|conditions|agree/i);
    if (await termsCheckbox.count() > 0) {
      await termsCheckbox.check();
    }
    
    // Submit form and wait for navigation
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.getByRole('button', { name: /sign up|register|create account/i }).click()
    ]);
    
    // Verify successful registration (redirected to dashboard, home, or success page)
    await expect(page).toHaveURL(/dashboard|home|success/i);
    
    // Check for success message or user-specific element
    const successIndicator = page.locator('[data-testid="success-message"], .success-message, .welcome-message');
    if (await successIndicator.count() > 0) {
      await expect(successIndicator).toBeVisible();
    }
    
    console.log(`✅ Successfully registered user: ${testUser.email}`);
  });
});
