const { test, expect } = require('@playwright/test');

test.describe('Homepage Tests', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    
    // Check if the page title contains the app name
    const title = await page.title();
    expect(title).toContain('AutoApply Pro');
    
    // Check for main navigation elements
    await expect(page.getByRole('link', { name: /login/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /sign up/i })).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    
    // Click on login link and verify navigation
    await page.getByRole('link', { name: /login/i }).click();
    
    // Check URL has changed to login page
    await expect(page).toHaveURL(/.*login/);
    
    // Check login form elements are visible
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.goto('/');
    
    // Click on signup link and verify navigation
    await page.getByRole('link', { name: /sign up/i }).click();
    
    // Check URL has changed to signup page
    await expect(page).toHaveURL(/.*signup/);
    
    // Check signup form elements are visible
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible();
  });
});
