// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Cover Letter Page tests
 * Tests the cover letter generator, history, and editor functionality
 */
test.describe('Cover Letter Page', () => {
  // Test user for login
  const testUser = {
    email: 'test@example.com',
    password: 'Test123!'
  };

  // Sample job description for testing
  const sampleJobDescription = `
    Software Engineer - Frontend
    
    Requirements:
    - 3+ years experience with React
    - Strong JavaScript skills
    - Experience with modern frontend tools
    - Good communication skills
    
    Responsibilities:
    - Develop user-facing features
    - Optimize applications for performance
    - Collaborate with cross-functional teams
  `;

  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('http://localhost:3000/login');
    await page.getByLabel(/email/i).fill(testUser.email);
    await page.getByLabel(/password/i).fill(testUser.password);
    await page.getByRole('button', { name: /login|sign in/i }).click();
    
    // Wait for navigation to dashboard
    await page.waitForURL(/.*dashboard/);
    
    // Navigate to cover letter page
    await page.goto('http://localhost:3000/cover-letter');
    console.log('✅ Navigated to cover letter page');
  });

  test('should display page header and tabs', async ({ page }) => {
    // Check for page title
    const pageTitle = page.getByRole('heading', { name: /AI Cover Letter Generator/i });
    await expect(pageTitle).toBeVisible();
    
    // Check for description text
    const description = page.getByText(/Create personalized cover letters/i);
    await expect(description).toBeVisible();
    
    // Check for tabs
    await expect(page.getByRole('button', { name: /generate/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /history/i })).toBeVisible();
    
    // Editor tab is only shown if a cover letter is active
    const editorTab = page.getByRole('button', { name: /editor/i });
    
    console.log('✅ Page header and tabs verified');
  });

  test('should display the cover letter generator form', async ({ page }) => {
    // Ensure we're on the generate tab
    await page.getByRole('button', { name: /generate/i }).click();
    
    // Check for form fields
    const jobTitleField = page.getByLabel(/job title/i);
    const companyNameField = page.getByLabel(/company name/i);
    const jobDescriptionField = page.getByLabel(/job description/i);
    
    await expect(jobTitleField).toBeVisible();
    await expect(companyNameField).toBeVisible();
    await expect(jobDescriptionField).toBeVisible();
    
    // Check for generate button
    const generateButton = page.getByRole('button', { name: /generate|create/i });
    await expect(generateButton).toBeVisible();
    
    console.log('✅ Cover letter generator form verified');
  });

  test('should display validation errors for empty fields', async ({ page }) => {
    // Ensure we're on the generate tab
    await page.getByRole('button', { name: /generate/i }).click();
    
    // Click generate without filling any fields
    const generateButton = page.getByRole('button', { name: /generate|create/i });
    await generateButton.click();
    
    // Check for validation errors
    const errorMessages = page.locator('.error-message, .text-red-500, [data-testid="error-message"]');
    
    // There should be at least one error message
    expect(await errorMessages.count()).toBeGreaterThan(0);
    
    console.log('✅ Form validation for empty fields verified');
  });

  test('should switch to history tab and display cover letter history', async ({ page }) => {
    // Click on history tab
    await page.getByRole('button', { name: /history/i }).click();
    
    // Check if there are any cover letters in history
    const historyContainer = page.locator('[data-testid="cover-letter-history"], .cover-letter-history');
    await expect(historyContainer).toBeVisible();
    
    // Check if there's either a list of cover letters or an empty state message
    const coverLetterItems = historyContainer.locator('.cover-letter-item');
    const emptyStateMessage = historyContainer.getByText(/no cover letters/i);
    
    const coverLetterCount = await coverLetterItems.count();
    
    if (coverLetterCount > 0) {
      console.log(`✅ Found ${coverLetterCount} cover letters in history`);
    } else {
      await expect(emptyStateMessage).toBeVisible();
      console.log('✅ Empty state message displayed when no cover letters exist');
    }
  });

  test.skip('should generate a cover letter', async ({ page }) => {
    // This test is skipped by default as it makes API calls to AI services
    // Implement if needed for comprehensive testing
    
    // Ensure we're on the generate tab
    await page.getByRole('button', { name: /generate/i }).click();
    
    // Fill in form fields
    await page.getByLabel(/job title/i).fill('Software Engineer');
    await page.getByLabel(/company name/i).fill('Tech Corp');
    await page.getByLabel(/job description/i).fill(sampleJobDescription);
    
    // Click generate button
    const generateButton = page.getByRole('button', { name: /generate|create/i });
    await generateButton.click();
    
    // Wait for generation to complete (may take time)
    await page.waitForSelector('.Toastify__toast-body', { 
      hasText: /generated successfully/i,
      timeout: 30000
    });
    
    // Verify we're redirected to editor tab
    await expect(page.getByRole('button', { name: /editor/i })).toBeVisible();
    
    // Check that generated content is visible
    const editorContent = page.locator('.cover-letter-editor-content, [data-testid="editor-content"]');
    await expect(editorContent).toBeVisible();
    await expect(editorContent).toContainText(/Dear Hiring Manager/i);
    
    console.log('✅ Cover letter generation verified');
  });

  test('should allow viewing a cover letter from history', async ({ page }) => {
    // Go to history tab
    await page.getByRole('button', { name: /history/i }).click();
    
    // Check if there are any cover letters
    const coverLetterItems = page.locator('.cover-letter-item');
    
    if (await coverLetterItems.count() > 0) {
      // Click on the first cover letter
      await coverLetterItems.first().click();
      
      // Verify the editor tab is now visible and active
      const editorTab = page.getByRole('button', { name: /editor/i });
      await expect(editorTab).toBeVisible();
      
      // Verify editor content is visible
      const editorContent = page.locator('.cover-letter-editor-content, [data-testid="editor-content"]');
      await expect(editorContent).toBeVisible();
      
      console.log('✅ Viewing cover letter from history verified');
    } else {
      console.log('⚠️ No cover letters in history, skipping view test');
      test.skip();
    }
  });

  test.skip('should allow editing a cover letter', async ({ page }) => {
    // This test is skipped by default as it modifies data
    // Implement if needed for comprehensive testing
    
    // Go to history tab
    await page.getByRole('button', { name: /history/i }).click();
    
    // Check if there are any cover letters
    const coverLetterItems = page.locator('.cover-letter-item');
    
    if (await coverLetterItems.count() > 0) {
      // Click on the first cover letter
      await coverLetterItems.first().click();
      
      // Verify we're on the editor tab
      await expect(page.getByRole('button', { name: /editor/i })).toBeVisible();
      
      // Find the editor and make changes
      const editorContent = page.locator('.cover-letter-editor-content, [data-testid="editor-content"]');
      
      // This will depend on the actual editor implementation
      // For a contenteditable element:
      if (await editorContent.getAttribute('contenteditable') === 'true') {
        await editorContent.click();
        await editorContent.fill('This is an edited cover letter.');
      } 
      // For a textarea:
      else {
        const textarea = page.locator('textarea');
        if (await textarea.count() > 0) {
          await textarea.fill('This is an edited cover letter.');
        }
      }
      
      // Save changes
      const saveButton = page.getByRole('button', { name: /save|update/i });
      await saveButton.click();
      
      // Wait for success message
      await page.waitForSelector('.Toastify__toast-body', { hasText: /updated successfully/i });
      
      console.log('✅ Editing cover letter verified');
    } else {
      console.log('⚠️ No cover letters in history, skipping edit test');
      test.skip();
    }
  });

  test.skip('should allow deleting a cover letter', async ({ page }) => {
    // This test is skipped by default as it modifies data
    // Implement if needed for comprehensive testing
    
    // Go to history tab
    await page.getByRole('button', { name: /history/i }).click();
    
    // Check if there are any cover letters
    const coverLetterItems = page.locator('.cover-letter-item');
    
    if (await coverLetterItems.count() > 0) {
      // Count before deletion
      const initialCount = await coverLetterItems.count();
      
      // Find and click delete button on first item
      const deleteButton = coverLetterItems.first().locator('button').filter({ hasText: /delete|remove/i });
      
      // Handle confirmation dialog
      page.on('dialog', dialog => dialog.accept());
      
      // Click delete
      await deleteButton.click();
      
      // Wait for success message
      await page.waitForSelector('.Toastify__toast-body', { hasText: /deleted successfully/i });
      
      // Verify item was removed
      await expect(page.locator('.cover-letter-item')).toHaveCount(initialCount - 1);
      
      console.log('✅ Deleting cover letter verified');
    } else {
      console.log('⚠️ No cover letters in history, skipping delete test');
      test.skip();
    }
  });
});
