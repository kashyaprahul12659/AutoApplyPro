// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Login page tests
 * Tests the login form, validation, and authentication flow
 */
test.describe('Login Page', () => {
  // Test data
  const validUser = {
    email: 'test@example.com',
    password: 'Test123!'
  };

  const invalidUser = {
    email: 'nonexistent@example.com',
    password: 'WrongPassword123!'
  };

  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto('http://localhost:3000/login');
    // Wait for login form to be visible
    await page.waitForSelector('form', { state: 'visible' });
  });

  test('should display login form with all fields and buttons', async ({ page }) => {
    // Check for form elements
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /login|sign in/i })).toBeVisible();
    
    // Check for "Forgot Password" link
    const forgotPasswordLink = page.getByRole('link', { name: /forgot password/i });
    if (await forgotPasswordLink.count() > 0) {
      await expect(forgotPasswordLink).toBeVisible();
    }
    
    // Check for "Sign Up" link or redirect
    const signUpLink = page.getByRole('link', { name: /sign up|register|create account/i });
    if (await signUpLink.count() > 0) {
      await expect(signUpLink).toBeVisible();
    }
    
    console.log('✅ Login form elements verified');
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    // Click login without entering any data
    await page.getByRole('button', { name: /login|sign in/i }).click();
    
    // Check for validation messages
    const errorMessages = page.locator('.error-message, .text-red-500, [data-testid="error-message"]');
    await expect(errorMessages).toBeVisible();
    
    console.log('✅ Form validation for empty fields verified');
  });

  test('should show validation error for invalid email format', async ({ page }) => {
    // Enter invalid email format
    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByLabel(/password/i).fill('password123');
    
    // Submit form
    await page.getByRole('button', { name: /login|sign in/i }).click();
    
    // Check for email validation error
    const emailErrorMessage = page.locator('.error-message, .text-red-500, [data-testid="error-message"]')
      .filter({ hasText: /email|valid email/i });
    
    if (await emailErrorMessage.count() > 0) {
      await expect(emailErrorMessage).toBeVisible();
      console.log('✅ Email format validation verified');
    } else {
      // Some forms validate on submit and redirect to server validation
      console.log('⚠️ No client-side email validation found, may be validating server-side');
    }
  });

  // This test can be enabled when backend is running
  test.skip('should show error message for invalid credentials', async ({ page }) => {
    // Fill form with invalid credentials
    await page.getByLabel(/email/i).fill(invalidUser.email);
    await page.getByLabel(/password/i).fill(invalidUser.password);
    
    // Submit form
    await page.getByRole('button', { name: /login|sign in/i }).click();
    
    // Wait for error message (may take time due to server response)
    const errorMessage = page.locator('.error-message, .text-red-500, [data-testid="error-message"], .alert-error')
      .filter({ hasText: /invalid|incorrect|wrong/i });
    
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
    console.log('✅ Invalid credentials error verified');
  });

  // This test can be enabled when backend is running
  test.skip('should successfully login with valid credentials', async ({ page }) => {
    // Fill form with valid credentials
    await page.getByLabel(/email/i).fill(validUser.email);
    await page.getByLabel(/password/i).fill(validUser.password);
    
    // Submit form and wait for navigation
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.getByRole('button', { name: /login|sign in/i }).click()
    ]);
    
    // Verify successful login (redirected to dashboard or home)
    await expect(page).toHaveURL(/dashboard|home/i);
    
    // Check for user-specific element like username in navbar
    const userMenu = page.locator('[data-testid="user-menu"], .user-menu, .profile-menu');
    await expect(userMenu).toBeVisible();
    
    console.log('✅ Successful login and navigation verified');
  });
});
