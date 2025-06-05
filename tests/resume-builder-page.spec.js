// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Resume Builder Page tests
 * Tests the resume builder page UI and functionality
 */
test.describe('Resume Builder Page', () => {
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
    
    // Navigate to resume builder page
    await page.goto('http://localhost:3000/resume-builder-page');
    console.log('✅ Navigated to resume builder page');
  });

  test('should display page header and create button', async ({ page }) => {
    // Check for page title
    const pageTitle = page.getByRole('heading', { name: /my resumes/i });
    await expect(pageTitle).toBeVisible();
    
    // Check for create new resume button
    const createButton = page.getByRole('button', { name: /create new resume/i });
    await expect(createButton).toBeVisible();
    
    console.log('✅ Page header and create button verified');
  });

  test('should navigate to editor when create button is clicked', async ({ page }) => {
    // Click create new resume button
    const createButton = page.getByRole('button', { name: /create new resume/i });
    await createButton.click();
    
    // Verify navigation to resume editor
    await page.waitForURL(/.*resume-builder$/);
    
    console.log('✅ Navigation to resume editor verified');
  });

  test('should display empty state if no resumes exist', async ({ page }) => {
    // Check if there are any resumes listed
    const resumeCards = page.locator('.grid > div');
    const emptyState = page.getByText(/no resumes found/i);
    
    if (await resumeCards.count() === 0) {
      // Verify empty state is shown
      await expect(emptyState).toBeVisible();
      console.log('✅ Empty state display verified');
    } else {
      console.log('⚠️ User already has resumes, skipping empty state test');
    }
  });

  test('should display resume cards if resumes exist', async ({ page }) => {
    // Check if there are any resumes
    const resumeCards = page.locator('.grid > div');
    
    if (await resumeCards.count() > 0) {
      // Verify resume title is displayed
      const resumeTitle = resumeCards.first().locator('h3');
      await expect(resumeTitle).toBeVisible();
      
      // Verify date is displayed
      const dateText = resumeCards.first().getByText(/updated/i);
      await expect(dateText).toBeVisible();
      
      // Verify action buttons are present
      const editButton = resumeCards.first().locator('button[title="Edit Resume"]');
      const duplicateButton = resumeCards.first().locator('button[title="Duplicate Resume"]');
      const deleteButton = resumeCards.first().locator('button[title="Delete Resume"]');
      
      await expect(editButton).toBeVisible();
      await expect(duplicateButton).toBeVisible();
      await expect(deleteButton).toBeVisible();
      
      console.log('✅ Resume card elements verified');
    } else {
      console.log('⚠️ No resumes found, skipping resume card test');
      // Create a resume to continue testing
      const createButton = page.getByRole('button', { name: /create new resume/i });
      await createButton.click();
      
      // Wait for navigation to editor
      await page.waitForURL(/.*resume-builder$/);
      
      // Wait for editor to load
      await page.waitForSelector('input[placeholder="Resume Title"]');
      
      // Enter a title
      await page.locator('input[placeholder="Resume Title"]').fill('Test Resume');
      
      // Save resume (implementation depends on the actual UI)
      const saveButton = page.getByRole('button', { name: /save|create|done/i });
      if (await saveButton.count() > 0) {
        await saveButton.click();
        
        // Wait to be redirected back to resume list
        await page.waitForURL(/.*resume-builder-page/);
        console.log('✅ Created a test resume for further testing');
      } else {
        console.log('⚠️ Could not find save button, skipping resume creation');
      }
    }
  });

  test('should navigate to editor when edit button is clicked', async ({ page }) => {
    // Check if there are any resumes
    const resumeCards = page.locator('.grid > div');
    
    if (await resumeCards.count() > 0) {
      // Click edit button on first resume
      const editButton = resumeCards.first().locator('button[title="Edit Resume"]');
      await editButton.click();
      
      // Verify navigation to resume editor with ID
      await page.waitForURL(/.*resume-builder\/.*$/);
      
      console.log('✅ Navigation to resume editor for editing verified');
    } else {
      console.log('⚠️ No resumes found, skipping edit test');
      test.skip();
    }
  });

  test.skip('should duplicate a resume when duplicate button is clicked', async ({ page }) => {
    // This test is skipped by default as it modifies data
    // Implement if needed for comprehensive testing
    
    // Check if there are any resumes
    const resumeCards = page.locator('.grid > div');
    
    if (await resumeCards.count() > 0) {
      // Get initial count of resumes
      const initialCount = await resumeCards.count();
      
      // Click duplicate button on first resume
      const duplicateButton = resumeCards.first().locator('button[title="Duplicate Resume"]');
      await duplicateButton.click();
      
      // Wait for success message
      await page.waitForSelector('.Toastify__toast-body', { hasText: /duplicated successfully/i });
      
      // Verify a new resume was added
      await expect(page.locator('.grid > div')).toHaveCount(initialCount + 1);
      
      console.log('✅ Resume duplication verified');
    } else {
      console.log('⚠️ No resumes found, skipping duplication test');
      test.skip();
    }
  });

  test.skip('should delete a resume when delete button is clicked', async ({ page }) => {
    // This test is skipped by default as it modifies data
    // Implement if needed for comprehensive testing
    
    // Check if there are any resumes
    const resumeCards = page.locator('.grid > div');
    
    if (await resumeCards.count() > 0) {
      // Get initial count of resumes
      const initialCount = await resumeCards.count();
      
      // Mock the confirmation dialog to return true
      page.on('dialog', dialog => dialog.accept());
      
      // Click delete button on first resume
      const deleteButton = resumeCards.first().locator('button[title="Delete Resume"]');
      await deleteButton.click();
      
      // Wait for success message
      await page.waitForSelector('.Toastify__toast-body', { hasText: /deleted successfully/i });
      
      // Verify a resume was removed
      await expect(page.locator('.grid > div')).toHaveCount(initialCount - 1);
      
      console.log('✅ Resume deletion verified');
    } else {
      console.log('⚠️ No resumes found, skipping deletion test');
      test.skip();
    }
  });
});
