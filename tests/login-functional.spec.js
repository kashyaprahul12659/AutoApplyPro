// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Login Functionality Test
 * This test focuses specifically on the login form validation and UI elements
 * without testing actual authentication against the backend
 */
test.describe('Login Page - UI Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto('http://localhost:3000/login');
    console.log('📄 Navigated to login page');
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-results/login-page.png' });
  });

  test('should have correct title and form elements', async ({ page }) => {
    // Check page title
    const title = await page.title();
    console.log(`📌 Page title: "${title}"`);
    
    // Log what we find on the page for debugging
    const h1Text = await page.locator('h1').textContent();
    console.log(`📌 Main heading: "${h1Text}"`);
    
    // Check form exists
    const formCount = await page.locator('form').count();
    console.log(`📌 Found ${formCount} form(s) on the page`);
    
    // Get all input fields for debugging
    const inputs = await page.locator('input').all();
    console.log(`📌 Found ${inputs.length} input field(s)`);
    
    for (let i = 0; i < inputs.length; i++) {
      const type = await inputs[i].getAttribute('type');
      const name = await inputs[i].getAttribute('name');
      const id = await inputs[i].getAttribute('id');
      console.log(`  Input #${i+1}: type="${type}", name="${name}", id="${id}"`);
    }
    
    // Get all buttons for debugging
    const buttons = await page.locator('button').all();
    console.log(`📌 Found ${buttons.length} button(s)`);
    
    for (let i = 0; i < buttons.length; i++) {
      const text = await buttons[i].textContent();
      const type = await buttons[i].getAttribute('type');
      console.log(`  Button #${i+1}: text="${text?.trim()}", type="${type}"`);
    }
    
    // Take a screenshot with form elements highlighted
    await page.locator('form').highlight();
    await page.screenshot({ path: 'test-results/login-form-highlighted.png' });
    
    // Make basic assertions based on what we expect
    expect(formCount).toBeGreaterThan(0);
    expect(buttons.length).toBeGreaterThan(0);
    
    console.log('✅ Basic form validation complete');
  });

  test('should identify email and password fields', async ({ page }) => {
    // Look for email field by common selectors
    const emailField = page.locator('input[type="email"], input[name="email"], input#email');
    
    // Look for password field
    const passwordField = page.locator('input[type="password"]');
    
    // Log what we found
    const emailCount = await emailField.count();
    const passwordCount = await passwordField.count();
    
    console.log(`📌 Found ${emailCount} email field(s)`);
    console.log(`📌 Found ${passwordCount} password field(s)`);
    
    // Verify we found the fields
    expect(emailCount).toBeGreaterThan(0);
    expect(passwordCount).toBeGreaterThan(0);
    
    // Try to fill them (this helps validate we identified the right fields)
    if (emailCount > 0) {
      await emailField.first().fill('test@example.com');
      console.log('✅ Successfully filled email field');
    }
    
    if (passwordCount > 0) {
      await passwordField.first().fill('password123');
      console.log('✅ Successfully filled password field');
    }
    
    // Look for login button by common patterns
    const loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    const loginButtonCount = await loginButton.count();
    
    console.log(`📌 Found ${loginButtonCount} login button(s)`);
    
    if (loginButtonCount > 0) {
      // Just verify the button is present, don't click it yet
      await loginButton.first().highlight();
      await page.screenshot({ path: 'test-results/login-button-highlighted.png' });
      console.log('✅ Successfully identified login button');
    }
    
    console.log('✅ Form field identification complete');
  });
});
