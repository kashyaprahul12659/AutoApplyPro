const { test, expect } = require('@playwright/test');

test.describe('Authentication Tests', () => {
  // Test user credentials (use test-only credentials)
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'Test123!'
  };

  test('should allow user to sign up', async ({ page }) => {
    await page.goto('/signup');
    
    // Fill the signup form
    await page.getByLabel(/name/i).fill(testUser.name);
    await page.getByLabel(/email/i).fill(testUser.email);
    await page.getByLabel(/password/i).fill(testUser.password);
    
    // Submit the form and wait for navigation
    await Promise.all([
      page.waitForNavigation(),
      page.getByRole('button', { name: /sign up/i }).click()
    ]);
    
    // Verify that the user is redirected to the dashboard or home page after signup
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Verify that a success message is shown
    await expect(page.getByText(/account created/i)).toBeVisible();
  });

  test('should allow user to login', async ({ page }) => {
    await page.goto('/login');
    
    // Fill the login form
    await page.getByLabel(/email/i).fill(testUser.email);
    await page.getByLabel(/password/i).fill(testUser.password);
    
    // Submit the form and wait for navigation
    await Promise.all([
      page.waitForNavigation(),
      page.getByRole('button', { name: /login/i }).click()
    ]);
    
    // Verify that the user is redirected to the dashboard after login
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Verify that the user name is displayed in the dashboard
    await expect(page.getByText(testUser.name)).toBeVisible();
  });

  test('should show error for invalid login', async ({ page }) => {
    await page.goto('/login');
    
    // Fill the login form with invalid credentials
    await page.getByLabel(/email/i).fill('invalid@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    
    // Submit the form
    await page.getByRole('button', { name: /login/i }).click();
    
    // Verify that an error message is shown
    await expect(page.getByText(/invalid credentials/i)).toBeVisible();
    
    // Verify URL hasn't changed (still on login page)
    await expect(page).toHaveURL(/.*login/);
  });

  test('should allow user to logout', async ({ page }) => {
    // First login
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(testUser.email);
    await page.getByLabel(/password/i).fill(testUser.password);
    
    await Promise.all([
      page.waitForNavigation(),
      page.getByRole('button', { name: /login/i }).click()
    ]);
    
    // Find and click logout button/link
    await page.getByRole('button', { name: /logout/i }).click();
    
    // Verify that the user is redirected to the login page or home page
    await expect(page).toHaveURL(/^\/$|login/);
    
    // Verify login button is visible again
    await expect(page.getByRole('link', { name: /login/i })).toBeVisible();
  });
});
