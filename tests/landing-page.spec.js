// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Landing page tests to verify basic navigation and UI elements
 */
test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the landing page before each test
    await page.goto('http://localhost:3000/');
  });

  test('should display the correct title', async ({ page }) => {
    // Verify page title contains the app name
    await expect(page).toHaveTitle(/AutoApply Pro/);
    console.log('✅ Page title verified');
  });

  test('should display main navigation elements', async ({ page }) => {
    // Check for header/navbar
    const navbar = page.locator('nav');
    await expect(navbar).toBeVisible();

    // Check for basic navigation links
    await expect(page.getByRole('link', { name: /login/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /register/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /chrome extension/i })).toBeVisible();
    console.log('✅ Navigation elements verified');
  });

  test('should display the hero section', async ({ page }) => {
    // Check for main hero/banner section
    const heroSection = page.locator('section');
    await expect(heroSection).toBeVisible();
    
    // Check for heading in the hero section
    const heading = heroSection.locator('h1');
    await expect(heading).toBeVisible();
    console.log('✅ Hero section verified');
  });

  test('should navigate to login page when login link is clicked', async ({ page }) => {
    // Click on login link
    await page.getByRole('link', { name: /login/i }).click();
    
    // Verify URL changed to login page
    await expect(page).toHaveURL(/.*login/);
    console.log('✅ Navigation to login page verified');
  });

  test('should navigate to signup page when signup link is clicked', async ({ page }) => {
    // Click on signup link
    await page.getByRole('link', { name: /register/i }).click();
    
    // Verify URL changed to signup page
    await expect(page).toHaveURL(/.*register/);
    console.log('✅ Navigation to signup page verified');
  });
});
