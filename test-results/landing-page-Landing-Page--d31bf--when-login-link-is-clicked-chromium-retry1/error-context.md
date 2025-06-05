# Test info

- Name: Landing Page >> should navigate to login page when login link is clicked
- Location: C:\Users\POOJA\AutoApplyPro\tests\landing-page.spec.js:42:3

# Error details

```
Error: page.goto: Test ended.
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

    at C:\Users\POOJA\AutoApplyPro\tests\landing-page.spec.js:10:16
```

# Test source

```ts
   1 | // @ts-check
   2 | const { test, expect } = require('@playwright/test');
   3 |
   4 | /**
   5 |  * Landing page tests to verify basic navigation and UI elements
   6 |  */
   7 | test.describe('Landing Page', () => {
   8 |   test.beforeEach(async ({ page }) => {
   9 |     // Go to the landing page before each test
> 10 |     await page.goto('http://localhost:3000/');
     |                ^ Error: page.goto: Test ended.
  11 |   });
  12 |
  13 |   test('should display the correct title', async ({ page }) => {
  14 |     // Verify page title contains the app name
  15 |     await expect(page).toHaveTitle(/AutoApply Pro/);
  16 |     console.log('✅ Page title verified');
  17 |   });
  18 |
  19 |   test('should display main navigation elements', async ({ page }) => {
  20 |     // Check for header/navbar
  21 |     const navbar = page.locator('nav');
  22 |     await expect(navbar).toBeVisible();
  23 |
  24 |     // Check for basic navigation links
  25 |     await expect(page.getByRole('link', { name: /login/i })).toBeVisible();
  26 |     await expect(page.getByRole('link', { name: /register/i })).toBeVisible();
  27 |     await expect(page.getByRole('link', { name: /chrome extension/i })).toBeVisible();
  28 |     console.log('✅ Navigation elements verified');
  29 |   });
  30 |
  31 |   test('should display the hero section', async ({ page }) => {
  32 |     // Check for main hero/banner section
  33 |     const heroSection = page.locator('section');
  34 |     await expect(heroSection).toBeVisible();
  35 |     
  36 |     // Check for heading in the hero section
  37 |     const heading = heroSection.locator('h1');
  38 |     await expect(heading).toBeVisible();
  39 |     console.log('✅ Hero section verified');
  40 |   });
  41 |
  42 |   test('should navigate to login page when login link is clicked', async ({ page }) => {
  43 |     // Click on login link
  44 |     await page.getByRole('link', { name: /login/i }).click();
  45 |     
  46 |     // Verify URL changed to login page
  47 |     await expect(page).toHaveURL(/.*login/);
  48 |     console.log('✅ Navigation to login page verified');
  49 |   });
  50 |
  51 |   test('should navigate to signup page when signup link is clicked', async ({ page }) => {
  52 |     // Click on signup link
  53 |     await page.getByRole('link', { name: /register/i }).click();
  54 |     
  55 |     // Verify URL changed to signup page
  56 |     await expect(page).toHaveURL(/.*register/);
  57 |     console.log('✅ Navigation to signup page verified');
  58 |   });
  59 | });
  60 |
```