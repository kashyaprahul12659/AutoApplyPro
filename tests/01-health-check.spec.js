const { test, expect } = require('@playwright/test');

test.describe('Application Health Checks', () => {
  test('Frontend server should be accessible', async ({ page }) => {    // Navigate to the frontend
    await page.goto('http://localhost:3000');
    
    // Wait for page to load and check if it's accessible
    await expect(page).toHaveTitle(/AutoApply Pro|React App/);
    
    // Check if the page loads without critical errors
    const pageErrors = [];
    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });
    
    // Wait a moment for any errors to surface
    await page.waitForTimeout(2000);
    
    if (pageErrors.length > 0) {
      console.log('Page errors found:', pageErrors);
      throw new Error(`Page has ${pageErrors.length} JavaScript errors`);
    }
  });

  test('Backend API health endpoint should respond', async ({ request }) => {
    // Test backend health endpoint
    const response = await request.get('http://localhost:5000/api/health');
    expect(response.status()).toBe(200);
      const responseBody = await response.json();
    expect(responseBody).toHaveProperty('status', 'ok');
  });
});
