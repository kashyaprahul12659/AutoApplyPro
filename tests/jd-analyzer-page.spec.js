// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * JD Analyzer Page tests
 * Tests the job description analyzer functionality and history
 */
test.describe('JD Analyzer Page', () => {
  // Test user for login
  const testUser = {
    email: 'test@example.com',
    password: 'Test123!'
  };

  // Sample job description for testing
  const sampleJobDescription = `
    Frontend Developer
    
    Requirements:
    - 3+ years of experience with React.js
    - Proficiency in JavaScript, HTML, and CSS
    - Experience with responsive design
    - Knowledge of modern frontend tools and libraries
    
    Responsibilities:
    - Develop user interfaces for web applications
    - Collaborate with backend developers
    - Optimize applications for maximum speed
    - Debug and troubleshoot issues
  `;

  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('http://localhost:3000/login');
    await page.getByLabel(/email/i).fill(testUser.email);
    await page.getByLabel(/password/i).fill(testUser.password);
    await page.getByRole('button', { name: /login|sign in/i }).click();
    
    // Wait for navigation to dashboard
    await page.waitForURL(/.*dashboard/);
    
    // Navigate to JD analyzer page
    await page.goto('http://localhost:3000/jd-analyzer');
    console.log('✅ Navigated to JD analyzer page');
  });

  test('should display page header and tabs', async ({ page }) => {
    // Check for page title
    const pageTitle = page.getByRole('heading', { name: /JD Skill Analyzer/i });
    await expect(pageTitle).toBeVisible();
    
    // Check for info message
    const infoMessage = page.getByText(/This tool analyzes your resume/i);
    await expect(infoMessage).toBeVisible();
    
    // Check for tabs
    await expect(page.getByRole('button', { name: /analyzer/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /history|analysis history/i })).toBeVisible();
    
    console.log('✅ Page header and tabs verified');
  });

  test('should display AI credits status', async ({ page }) => {
    // Check for either Pro badge or credits indicator
    const proLabel = page.getByText(/pro/i).filter({ hasText: /^Pro$/ });
    const creditsLabel = page.getByText(/credits left/i);
    
    const hasProLabel = await proLabel.count() > 0;
    const hasCreditsLabel = await creditsLabel.count() > 0;
    
    // User should have either Pro status or a credits counter
    expect(hasProLabel || hasCreditsLabel).toBeTruthy();
    
    if (hasProLabel) {
      console.log('✅ Pro status badge verified');
    } else {
      console.log('✅ AI credits counter verified');
    }
  });

  test('should display the JD analyzer form', async ({ page }) => {
    // Ensure we're on the analyzer tab
    await page.getByRole('button', { name: /analyzer/i }).click();
    
    // Check for form fields
    const jobTitleField = page.getByLabel(/job title/i);
    const jobDescriptionField = page.getByLabel(/job description/i);
    
    await expect(jobTitleField).toBeVisible();
    await expect(jobDescriptionField).toBeVisible();
    
    // Check for analyze button
    const analyzeButton = page.getByRole('button', { name: /analyze|submit/i });
    await expect(analyzeButton).toBeVisible();
    
    console.log('✅ JD analyzer form verified');
  });

  test('should display validation errors for empty fields', async ({ page }) => {
    // Ensure we're on the analyzer tab
    await page.getByRole('button', { name: /analyzer/i }).click();
    
    // Click analyze without filling any fields
    const analyzeButton = page.getByRole('button', { name: /analyze|submit/i });
    await analyzeButton.click();
    
    // Check for validation errors
    const errorMessages = page.locator('.error-message, .text-red-500, [data-testid="error-message"]');
    
    // There should be at least one error message
    expect(await errorMessages.count()).toBeGreaterThan(0);
    
    console.log('✅ Form validation for empty fields verified');
  });

  test('should switch to history tab and display analysis history', async ({ page }) => {
    // Click on history tab
    await page.getByRole('button', { name: /history|analysis history/i }).click();
    
    // Check if there's either a list of analyses or an empty state message
    const historyContainer = page.locator('[data-testid="analysis-history"], .analysis-history');
    await expect(historyContainer).toBeVisible();
    
    const analysisItems = historyContainer.locator('.analysis-item');
    const emptyStateMessage = historyContainer.getByText(/no analysis|no history|haven't analyzed/i);
    
    const analysisCount = await analysisItems.count();
    
    if (analysisCount > 0) {
      console.log(`✅ Found ${analysisCount} analyses in history`);
    } else {
      // If no analyses, check for empty state message
      const hasEmptyMessage = await emptyStateMessage.count() > 0;
      expect(hasEmptyMessage).toBeTruthy();
      console.log('✅ Empty state message displayed when no analyses exist');
    }
  });

  test.skip('should perform job description analysis', async ({ page }) => {
    // This test is skipped by default as it makes API calls to AI services
    // Implement if needed for comprehensive testing
    
    // Ensure we're on the analyzer tab
    await page.getByRole('button', { name: /analyzer/i }).click();
    
    // Fill in form fields
    await page.getByLabel(/job title/i).fill('Frontend Developer');
    await page.getByLabel(/job description/i).fill(sampleJobDescription);
    
    // Click analyze button
    const analyzeButton = page.getByRole('button', { name: /analyze|submit/i });
    await analyzeButton.click();
    
    // Wait for analysis to complete (may take time)
    const loadingIndicator = page.locator('.loading, .spinner');
    if (await loadingIndicator.count() > 0) {
      await loadingIndicator.waitFor({ state: 'hidden', timeout: 60000 });
    }
    
    // Check for analysis results
    const resultsSection = page.locator('[data-testid="analysis-results"], .analysis-results');
    await expect(resultsSection).toBeVisible();
    
    // Verify key components of results
    const matchScore = resultsSection.locator('.match-score, [data-testid="match-score"]');
    const skillsMatched = resultsSection.locator('.matched-skills, [data-testid="matched-skills"]');
    const skillsGap = resultsSection.locator('.missing-skills, [data-testid="missing-skills"]');
    
    await expect(matchScore).toBeVisible();
    await expect(skillsMatched).toBeVisible();
    await expect(skillsGap).toBeVisible();
    
    console.log('✅ JD analysis functionality verified');
  });

  test('should allow viewing a past analysis from history', async ({ page }) => {
    // Go to history tab
    await page.getByRole('button', { name: /history|analysis history/i }).click();
    
    // Check if there are any analyses
    const analysisItems = page.locator('.analysis-item');
    
    if (await analysisItems.count() > 0) {
      // Click on the first analysis
      await analysisItems.first().click();
      
      // Verify we're shown the analysis details
      const resultsSection = page.locator('[data-testid="analysis-results"], .analysis-results');
      await expect(resultsSection).toBeVisible();
      
      console.log('✅ Viewing analysis from history verified');
    } else {
      console.log('⚠️ No analyses in history, skipping view test');
      test.skip();
    }
  });

  test.skip('should allow deleting an analysis from history', async ({ page }) => {
    // This test is skipped by default as it modifies data
    // Implement if needed for comprehensive testing
    
    // Go to history tab
    await page.getByRole('button', { name: /history|analysis history/i }).click();
    
    // Check if there are any analyses
    const analysisItems = page.locator('.analysis-item');
    
    if (await analysisItems.count() > 0) {
      // Count before deletion
      const initialCount = await analysisItems.count();
      
      // Find and click delete button on first item
      const deleteButton = analysisItems.first().locator('button').filter({ hasText: /delete|remove/i });
      
      // Handle confirmation dialog
      page.on('dialog', dialog => dialog.accept());
      
      // Click delete
      await deleteButton.click();
      
      // Wait for deletion to complete
      await page.waitForSelector('.Toastify__toast-body', { hasText: /deleted|removed successfully/i });
      
      // Verify item was removed
      await expect(page.locator('.analysis-item')).toHaveCount(initialCount - 1);
      
      console.log('✅ Deleting analysis verified');
    } else {
      console.log('⚠️ No analyses in history, skipping delete test');
      test.skip();
    }
  });

  test('should display upgrade to Pro section for free users', async ({ page }) => {
    // Check if user has Pro status
    const proLabel = page.getByText(/pro/i).filter({ hasText: /^Pro$/ });
    
    if (await proLabel.count() === 0) {
      // User is on free plan, should see upgrade section
      const upgradeSection = page.getByText(/upgrade to pro/i).filter({ hasText: /^Upgrade to Pro$/ });
      await expect(upgradeSection).toBeVisible();
      
      // Check for upgrade button
      const upgradeButton = page.getByRole('button', { name: /upgrade to pro/i });
      await expect(upgradeButton).toBeVisible();
      
      console.log('✅ Upgrade to Pro section verified for free users');
    } else {
      console.log('⚠️ User already has Pro status, skipping upgrade section test');
    }
  });
});
