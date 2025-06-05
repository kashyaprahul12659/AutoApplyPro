# Test info

- Name: Landing Page >> should display main navigation elements
- Location: C:\Users\POOJA\AutoApplyPro\tests\landing-page.spec.js:19:3

# Error details

```
Error: expect.toBeVisible: Error: strict mode violation: getByRole('link', { name: /login/i }) resolved to 2 elements:
    1) <a href="/login" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Login</a> aka getByRole('navigation').getByRole('link', { name: 'Login' })
    2) <a href="/login" class="text-gray-400 hover:text-white transition-colors">Login</a> aka locator('footer').getByRole('link', { name: 'Login' })

Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for getByRole('link', { name: /login/i })

    at C:\Users\POOJA\AutoApplyPro\tests\landing-page.spec.js:25:62
```

# Page snapshot

```yaml
- main:
  - navigation:
    - text: AutoApply Pro
    - link "Login":
      - /url: /login
    - link "Register":
      - /url: /register
    - link "Chrome Extension":
      - /url: https://chrome.google.com/webstore
      - img
      - text: Chrome Extension
  - heading "Apply to jobs 10x faster with AI" [level=1]
  - paragraph: Smart Autofill, AI Cover Letters, Resume Matching
  - link "Get the Chrome Extension":
    - /url: https://chrome.google.com/webstore
    - img
    - text: Get the Chrome Extension
  - link "Create Free Account":
    - /url: /register
  - img "AutoApply Pro Demo"
  - heading "Powerful Features" [level=2]
  - paragraph: Everything you need to streamline your job application process
  - img
  - heading "Smart Resume Parser" [level=3]
  - paragraph: Automatically extracts data from your resume to fill out job applications with a single click.
  - img
  - heading "AI Cover Letter Generator" [level=3]
  - paragraph: Create tailored cover letters in seconds using AI that matches your skills to the job description.
  - img
  - heading "JD Skill Analyzer" [level=3]
  - paragraph: Analyze job descriptions against your resume to find skill gaps and improve your match rate.
  - img
  - heading "Pro Plan Access" [level=3]
  - paragraph: Unlock unlimited AI features, analytics, and premium support with our affordable Pro plan.
  - heading "What Our Users Say" [level=2]
  - paragraph: Join thousands of job seekers who've streamlined their application process
  - img
  - img
  - img
  - img
  - img
  - blockquote: "\"AutoApply Pro saved me countless hours during my job search. The AI cover letter generator helped me personalize each application without spending hours rewriting.\""
  - text: SJ
  - paragraph: Sarah Johnson
  - paragraph: Software Engineer, Hired at Google
  - img
  - img
  - img
  - img
  - img
  - blockquote: "\"The JD Skill Analyzer was a game-changer for me. It helped me identify the exact skills I needed to highlight in my applications, resulting in a significant increase in interview calls.\""
  - text: MP
  - paragraph: Michael Patel
  - paragraph: Data Analyst, Hired at Microsoft
  - heading "Simple, Transparent Pricing" [level=2]
  - paragraph: Choose the plan that's right for you
  - heading "Free" [level=3]
  - paragraph: Get started with basic features
  - paragraph: $0/month
  - list:
    - listitem:
      - img
      - text: Resume Profile Storage
    - listitem:
      - img
      - text: 3 AI Cover Letters
    - listitem:
      - img
      - text: 3 JD Analyses
    - listitem:
      - img
      - text: Chrome Extension Access
    - listitem: ✕ Unlimited AI Features
    - listitem: ✕ Premium Support
  - link "Get Started":
    - /url: /register
  - text: POPULAR
  - heading "Pro" [level=3]
  - paragraph: Everything you need to succeed
  - paragraph: ₹299/month
  - list:
    - listitem:
      - img
      - text: Resume Profile Storage
    - listitem:
      - img
      - strong: Unlimited
      - text: AI Cover Letters
    - listitem:
      - img
      - strong: Unlimited
      - text: JD Analyses
    - listitem:
      - img
      - text: Chrome Extension Access
    - listitem:
      - img
      - strong: Unlimited
      - text: AI Features
    - listitem:
      - img
      - text: Premium Support
  - link "Upgrade in App":
    - /url: /login
  - heading "Ready to transform your job application process?" [level=2]
  - paragraph: Join thousands of job seekers who are landing interviews faster with AutoApply Pro.
  - link "Get the Chrome Extension":
    - /url: https://chrome.google.com/webstore
    - img
    - text: Get the Chrome Extension
  - link "Create Free Account":
    - /url: /register
  - heading "AutoApply Pro" [level=3]
  - paragraph: Streamlining your job application process with AI-powered tools.
  - link:
    - /url: mailto:contact@autoapplypro.com
    - img
  - link:
    - /url: https://linkedin.com
    - img
  - link:
    - /url: https://github.com
    - img
  - heading "Links" [level=4]
  - list:
    - listitem:
      - link "Home":
        - /url: /
    - listitem:
      - link "Login":
        - /url: /login
    - listitem:
      - link "Register":
        - /url: /register
    - listitem:
      - link "Chrome Extension":
        - /url: https://chrome.google.com/webstore
  - heading "Legal" [level=4]
  - list:
    - listitem:
      - link "Privacy Policy":
        - /url: /privacy
    - listitem:
      - link "Terms of Service":
        - /url: /terms
    - listitem:
      - link "Contact Us":
        - /url: /contact
  - paragraph: © 2025 AutoApply Pro. All rights reserved.
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
  10 |     await page.goto('http://localhost:3000/');
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
> 25 |     await expect(page.getByRole('link', { name: /login/i })).toBeVisible();
     |                                                              ^ Error: expect.toBeVisible: Error: strict mode violation: getByRole('link', { name: /login/i }) resolved to 2 elements:
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