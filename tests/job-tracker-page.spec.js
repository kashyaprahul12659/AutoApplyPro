// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Job Tracker Page tests
 * Tests the job application tracking functionality
 */
test.describe('Job Tracker Page', () => {
  // Test user for login
  const testUser = {
    email: 'test@example.com',
    password: 'Test123!'
  };

  // Sample job data for testing
  const sampleJob = {
    company: 'Test Company',
    position: 'Software Engineer',
    location: 'Remote',
    salary: '$100,000',
    notes: 'This is a test job entry'
  };

  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('http://localhost:3000/login');
    await page.getByLabel(/email/i).fill(testUser.email);
    await page.getByLabel(/password/i).fill(testUser.password);
    await page.getByRole('button', { name: /login|sign in/i }).click();
    
    // Wait for navigation to dashboard
    await page.waitForURL(/.*dashboard/);
    
    // Navigate to job tracker page
    await page.goto('http://localhost:3000/job-tracker');
    console.log('✅ Navigated to job tracker page');
  });

  test('should display page header and action buttons', async ({ page }) => {
    // Check for page title
    const pageTitle = page.getByRole('heading', { name: /job application tracker/i });
    await expect(pageTitle).toBeVisible();
    
    // Check for add job button
    const addButton = page.getByRole('button', { name: /add job/i });
    await expect(addButton).toBeVisible();
    
    // Check for refresh button
    const refreshButton = page.getByRole('button', { name: /refresh/i });
    await expect(refreshButton).toBeVisible();
    
    console.log('✅ Page header and action buttons verified');
  });

  test('should display kanban board with status columns', async ({ page }) => {
    // Wait for loading to complete
    await page.waitForSelector('[class*="animate-spin"]', { state: 'detached' });
    
    // Check for all status columns
    const columns = [
      'Interested',
      'Applied',
      'Interview',
      'Offer',
      'Rejected'
    ];
    
    for (const column of columns) {
      const columnHeader = page.getByText(column).first();
      await expect(columnHeader).toBeVisible();
      console.log(`✅ Column "${column}" verified`);
    }
  });

  test('should display empty state if no jobs exist', async ({ page }) => {
    // Wait for loading to complete
    await page.waitForSelector('[class*="animate-spin"]', { state: 'detached' });
    
    // Check if there are any job cards
    const emptyState = page.getByText(/no jobs tracked yet/i);
    
    if (await emptyState.count() > 0) {
      // Should show empty state message
      await expect(emptyState).toBeVisible();
      
      // Should show action button
      const actionButton = page.getByRole('button', { name: /add your first job/i });
      await expect(actionButton).toBeVisible();
      
      console.log('✅ Empty state message displayed when no jobs exist');
    } else {
      console.log('⚠️ Jobs already exist, skipping empty state test');
    }
  });

  test('should display add job modal when button is clicked', async ({ page }) => {
    // Click add job button
    const addButton = page.getByRole('button', { name: /add job/i });
    await addButton.click();
    
    // Check that modal appears
    const modal = page.locator('.modal, [role="dialog"]').filter({ hasText: /add job/i });
    await expect(modal).toBeVisible();
    
    // Check for form fields
    await expect(page.getByLabel(/company/i)).toBeVisible();
    await expect(page.getByLabel(/position|job title/i)).toBeVisible();
    await expect(page.getByLabel(/location/i)).toBeVisible();
    
    // Check for close button
    const closeButton = modal.locator('button').filter({ hasText: /cancel|close/i });
    await expect(closeButton).toBeVisible();
    
    // Check for submit button
    const submitButton = modal.locator('button').filter({ hasText: /save|submit|add/i });
    await expect(submitButton).toBeVisible();
    
    console.log('✅ Add job modal functionality verified');
    
    // Close the modal to clean up
    await closeButton.click();
  });

  test.skip('should add a new job', async ({ page }) => {
    // This test is skipped by default as it modifies data
    // Implement if needed for comprehensive testing
    
    // Click add job button
    const addButton = page.getByRole('button', { name: /add job/i });
    await addButton.click();
    
    // Wait for modal to appear
    const modal = page.locator('.modal, [role="dialog"]').filter({ hasText: /add job/i });
    await expect(modal).toBeVisible();
    
    // Fill out form
    await page.getByLabel(/company/i).fill(sampleJob.company);
    await page.getByLabel(/position|job title/i).fill(sampleJob.position);
    await page.getByLabel(/location/i).fill(sampleJob.location);
    
    // Fill optional fields if they exist
    const salaryField = page.getByLabel(/salary/i);
    if (await salaryField.count() > 0) {
      await salaryField.fill(sampleJob.salary);
    }
    
    const notesField = page.getByLabel(/notes/i);
    if (await notesField.count() > 0) {
      await notesField.fill(sampleJob.notes);
    }
    
    // Submit form
    const submitButton = modal.locator('button').filter({ hasText: /save|submit|add/i });
    await submitButton.click();
    
    // Wait for success message or modal to close
    await page.waitForSelector('.modal, [role="dialog"]', { state: 'detached' });
    
    // Check that job was added to Interested column (default status)
    const interestedColumn = page.getByText('Interested').first().locator('xpath=ancestor::div[contains(@class, "rounded-lg")]');
    const jobCard = interestedColumn.getByText(sampleJob.company);
    await expect(jobCard).toBeVisible();
    
    console.log('✅ Adding new job verified');
  });

  test('should refresh the job list when refresh button is clicked', async ({ page }) => {
    // Click refresh button
    const refreshButton = page.getByRole('button', { name: /refresh/i });
    await refreshButton.click();
    
    // Verify refresh animation is shown (spin animation)
    const spinningIcon = refreshButton.locator('[class*="animate-spin"]');
    await expect(spinningIcon).toBeVisible();
    
    // Wait for refresh to complete
    await page.waitForTimeout(600); // Slightly longer than the timeout in the component
    
    console.log('✅ Refresh functionality verified');
  });

  test.skip('should allow job card interactions', async ({ page }) => {
    // This test is complex and requires existing job data
    // It's skipped by default but can be enabled for more comprehensive testing
    
    // Wait for loading to complete
    await page.waitForSelector('[class*="animate-spin"]', { state: 'detached' });
    
    // Check if any job cards exist
    const jobCards = page.locator('.draggable, [class*="draggable"]');
    
    if (await jobCards.count() > 0) {
      // Click on first job card to show details
      await jobCards.first().click();
      
      // Check for job details modal or expanded view
      const detailsView = page.locator('.modal, [role="dialog"], .job-details');
      await expect(detailsView).toBeVisible();
      
      // Close details view
      const closeButton = detailsView.locator('button').filter({ hasText: /close/i });
      if (await closeButton.count() > 0) {
        await closeButton.click();
      }
      
      console.log('✅ Job card interaction verified');
    } else {
      console.log('⚠️ No job cards found, skipping job card interaction test');
    }
  });
});
