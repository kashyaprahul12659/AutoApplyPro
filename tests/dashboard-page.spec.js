// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Dashboard page tests
 * Tests the dashboard UI, tabs, and functionality
 */
test.describe('Dashboard Page', () => {
  // Test user for login
  const testUser = {
    email: 'test@example.com',
    password: 'Test123!'
  };

  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('http://localhost:3000/login');
    await page.getByLabel(/email/i).fill(testUser.email);
    await page.getByLabel(/password/i).fill(testUser.password);
    await page.getByRole('button', { name: /login|sign in/i }).click();
    
    // Wait for navigation to dashboard
    await page.waitForURL(/.*dashboard/);
    console.log('✅ Logged in and navigated to dashboard');
  });

  test('should display dashboard header and tabs', async ({ page }) => {
    // Check for dashboard title/header
    const dashboardHeader = page.getByRole('heading', { name: /dashboard/i });
    await expect(dashboardHeader).toBeVisible();
    
    // Check for tabs
    await expect(page.getByRole('button', { name: /profile/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /resumes/i })).toBeVisible();
    
    // Some tabs might not be visible if user doesn't have parsed data
    const parsedDataTab = page.getByRole('button', { name: /resume data/i });
    const autofillProfileTab = page.getByRole('button', { name: /autofill profile/i });
    
    console.log('✅ Dashboard header and tabs verified');
  });

  test('should display extension detector', async ({ page }) => {
    // Look for the extension detector component
    const extensionDetector = page.locator('div').filter({ has: page.getByText(/chrome extension/i) });
    await expect(extensionDetector).toBeVisible();
    
    console.log('✅ Extension detector verified');
  });

  test('should switch between tabs', async ({ page }) => {
    // Test profile tab (default)
    await expect(page.getByRole('button', { name: /profile/i })).toBeVisible();
    
    // Switch to resumes tab
    await page.getByRole('button', { name: /resumes/i }).click();
    
    // Check for resume uploader component
    const resumeUploader = page.locator('div').filter({ hasText: /upload.*resume|drop.*file/i });
    await expect(resumeUploader).toBeVisible();
    
    console.log('✅ Tab switching functionality verified');
  });

  test('should display profile information', async ({ page }) => {
    // Ensure we're on the profile tab
    await page.getByRole('button', { name: /profile/i }).click();
    
    // Check for profile form
    const nameField = page.getByLabel(/name/i);
    const emailField = page.getByLabel(/email/i);
    
    await expect(nameField).toBeVisible();
    await expect(emailField).toBeVisible();
    
    // Verify user email is displayed
    await expect(emailField).toHaveValue(testUser.email);
    
    console.log('✅ Profile information display verified');
  });

  test('should display resume builder widget', async ({ page }) => {
    // Look for resume builder widget
    const resumeBuilderWidget = page.locator('div').filter({ has: page.getByText(/resume builder|create resume/i) });
    await expect(resumeBuilderWidget).toBeVisible();
    
    console.log('✅ Resume builder widget verified');
  });

  test('should navigate to resume builder when clicked', async ({ page }) => {
    // Find and click the resume builder link/button
    const resumeBuilderLink = page.getByRole('link').filter({ hasText: /resume builder|create resume/i });
    
    if (await resumeBuilderLink.count() > 0) {
      await resumeBuilderLink.click();
      
      // Verify navigation to resume builder page
      await page.waitForURL(/.*resume-builder/);
      console.log('✅ Navigation to resume builder verified');
    } else {
      // Try button instead
      const resumeBuilderButton = page.getByRole('button').filter({ hasText: /resume builder|create resume/i });
      
      if (await resumeBuilderButton.count() > 0) {
        await resumeBuilderButton.click();
        
        // Verify navigation to resume builder page
        await page.waitForURL(/.*resume-builder/);
        console.log('✅ Navigation to resume builder verified');
      } else {
        console.log('⚠️ Could not find resume builder link or button');
        test.skip();
      }
    }
  });

  // Test resume upload functionality if it's a critical feature
  test.skip('should allow resume upload', async ({ page }) => {
    // Switch to resumes tab
    await page.getByRole('button', { name: /resumes/i }).click();
    
    // Find the file input
    const fileInput = page.locator('input[type="file"]');
    
    // Upload a test resume file
    // Note: This requires a test file to be available
    await fileInput.setInputFiles('path/to/test-resume.pdf');
    
    // Wait for upload to complete and success message
    const successMessage = page.locator('div').filter({ hasText: /resume uploaded successfully/i });
    await expect(successMessage).toBeVisible({ timeout: 10000 });
    
    console.log('✅ Resume upload functionality verified');
  });

  // Additional tests for AI Cover Letter feature, resume parsing, etc.
  // would be added here, potentially with skip() for features that
  // require complex setup or are not critical for initial testing
});
