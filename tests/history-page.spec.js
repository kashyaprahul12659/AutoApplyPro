// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * History Page tests
 * Tests the application history functionality
 */
test.describe('History Page', () => {
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
    
    // Navigate to history page
    await page.goto('http://localhost:3000/history');
    console.log('✅ Navigated to history page');
  });

  test('should display page header', async ({ page }) => {
    // Check for page title
    const pageTitle = page.getByRole('heading', { name: /application history/i });
    await expect(pageTitle).toBeVisible();
    
    console.log('✅ Page header verified');
  });

  test('should handle empty history state', async ({ page }) => {
    // Wait for loading to complete
    await page.waitForSelector('.animate-spin', { state: 'detached' });
    
    // Check if there are any history items
    const historyTable = page.locator('table');
    const emptyState = page.getByText(/no application history/i);
    
    if (await historyTable.count() === 0) {
      // Should show empty state
      await expect(emptyState).toBeVisible();
      console.log('✅ Empty state message displayed when no history exists');
    } else {
      console.log('⚠️ History items exist, skipping empty state test');
    }
  });

  test('should display history items if they exist', async ({ page }) => {
    // Wait for loading to complete
    await page.waitForSelector('.animate-spin', { state: 'detached' });
    
    // Check if there are any history items
    const historyTable = page.locator('table');
    
    if (await historyTable.count() > 0) {
      // Table headers should be visible
      const headers = historyTable.locator('th');
      await expect(headers.nth(0)).toContainText(/job details/i);
      await expect(headers.nth(1)).toContainText(/status/i);
      await expect(headers.nth(2)).toContainText(/date/i);
      await expect(headers.nth(3)).toContainText(/actions/i);
      
      // At least one history item row should be visible
      const rows = historyTable.locator('tbody tr');
      await expect(rows.first()).toBeVisible();
      
      // Each row should have job details, status, date, and delete button
      const firstRow = rows.first();
      await expect(firstRow.locator('td').nth(0)).toBeVisible(); // Job details
      await expect(firstRow.locator('td').nth(1)).toBeVisible(); // Status
      await expect(firstRow.locator('td').nth(2)).toBeVisible(); // Date
      await expect(firstRow.locator('button').filter({ hasText: /delete/i })).toBeVisible();
      
      console.log('✅ History items display verified');
    } else {
      console.log('⚠️ No history items found, skipping history items test');
    }
  });

  test('should handle pagination if multiple pages exist', async ({ page }) => {
    // Wait for loading to complete
    await page.waitForSelector('.animate-spin', { state: 'detached' });
    
    // Check if pagination exists
    const pagination = page.locator('nav[aria-label="Pagination"]');
    
    if (await pagination.count() > 0) {
      // Pagination should show current page status
      const pageStatus = page.getByText(/showing/i).filter({ hasText: /of.*results/i });
      await expect(pageStatus).toBeVisible();
      
      // Previous button should be disabled on first page
      const prevButton = pagination.locator('button').first();
      await expect(prevButton).toHaveClass(/cursor-not-allowed/);
      
      // If there's more than one page, check next button functionality
      const pageButtons = pagination.locator('button').filter({ hasText: /^[0-9]+$/ });
      
      if (await pageButtons.count() > 1) {
        // Click on second page
        await pageButtons.nth(1).click();
        
        // Previous button should now be enabled
        await expect(prevButton).not.toHaveClass(/cursor-not-allowed/);
        
        console.log('✅ Pagination functionality verified');
      } else {
        console.log('⚠️ Only one page exists, skipping pagination navigation test');
      }
    } else {
      console.log('⚠️ No pagination found, not enough history items');
    }
  });

  test.skip('should delete history item', async ({ page }) => {
    // This test is skipped by default as it modifies data
    // Implement if needed for comprehensive testing
    
    // Wait for loading to complete
    await page.waitForSelector('.animate-spin', { state: 'detached' });
    
    // Check if there are any history items
    const historyTable = page.locator('table');
    
    if (await historyTable.count() > 0) {
      // Get current number of rows
      const rows = historyTable.locator('tbody tr');
      const initialCount = await rows.count();
      
      // Set up dialog handler to accept confirmation
      page.on('dialog', dialog => dialog.accept());
      
      // Click delete on first item
      await rows.first().locator('button').filter({ hasText: /delete/i }).click();
      
      // Wait for success toast
      await page.waitForSelector('.Toastify__toast-body', { hasText: /deleted successfully/i });
      
      // Verify row was removed
      await expect(historyTable.locator('tbody tr')).toHaveCount(initialCount - 1);
      
      console.log('✅ History item deletion verified');
    } else {
      console.log('⚠️ No history items found, skipping deletion test');
    }
  });
});
