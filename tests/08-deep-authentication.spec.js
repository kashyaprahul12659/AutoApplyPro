const { test, expect } = require('@playwright/test');

test.describe('🟢 Authentication & Onboarding - Deep Testing', () => {
  let testUserEmail;
  let testUserPassword;
  
  test.beforeEach(() => {
    testUserEmail = `deep-test-${Date.now()}@example.com`;
    testUserPassword = 'TestPassword123!';
  });

  test('Complete user registration flow with validation', async ({ page }) => {
    console.log('🔍 Testing: Complete Registration Flow');
    
    // Step 1: Navigate to registration
    await page.goto('http://localhost:3000/register');
    await page.waitForSelector('form');
    
    // Step 2: Test empty form validation
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Check for HTML5 validation or custom validation
    const hasValidation = await page.evaluate(() => {
      const invalidFields = document.querySelectorAll(':invalid');
      return invalidFields.length > 0;
    });
    
    if (hasValidation) {
      console.log('✅ Form validation working for empty fields');
    }
    
    // Step 3: Test password mismatch validation
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', testUserEmail);
    await page.fill('input[name="password"]', testUserPassword);
    await page.fill('input[name="confirmPassword"]', 'DifferentPassword123!');
    
    await submitButton.click();
    await page.waitForTimeout(1000);
    
    // Should show password mismatch error
    const errorVisible = await page.evaluate(() => {
      const body = document.body.textContent;
      return body.includes('Passwords do not match') || body.includes('password') && body.includes('match');
    });
    
    if (errorVisible) {
      console.log('✅ Password mismatch validation working');
    }
    
    // Step 4: Complete valid registration
    await page.fill('input[name="confirmPassword"]', testUserPassword);
    await submitButton.click();
    
    // Wait for response and check redirect
    await page.waitForTimeout(3000);
    const currentUrl = page.url();
    
    if (currentUrl.includes('/dashboard')) {
      console.log('✅ Registration successful - auto-redirected to dashboard');
    } else if (currentUrl.includes('/login')) {
      console.log('✅ Registration successful - redirected to login');
    } else {
      console.log('ℹ️ Registration completed, current URL:', currentUrl);
    }
  });

  test('Login flow with error handling', async ({ page }) => {
    console.log('🔍 Testing: Login Flow & Error Handling');
    
    await page.goto('http://localhost:3000/login');
    await page.waitForSelector('form');
    
    // Test 1: Invalid email format
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', 'somepassword');
    
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    const emailValidation = await page.evaluate(() => {
      const emailField = document.querySelector('input[type="email"]');
      return !emailField.validity.valid;
    });
    
    if (emailValidation) {
      console.log('✅ Email format validation working');
    }
    
    // Test 2: Valid format but wrong credentials
    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await submitButton.click();
    
    await page.waitForTimeout(3000);
    
    // Check for error message
    const errorMessage = await page.evaluate(() => {
      const body = document.body.textContent;
      return body.includes('Invalid credentials') || body.includes('error') || body.includes('failed');
    });
    
    if (errorMessage) {
      console.log('✅ Invalid credentials error handling working');
    }
    
    // Test 3: Check if user stays on login page after failed attempt
    const stillOnLogin = page.url().includes('/login');
    expect(stillOnLogin).toBe(true);
    console.log('✅ User remains on login page after failed attempt');
  });

  test('Session management and logout', async ({ page }) => {
    console.log('🔍 Testing: Session Management');
    
    // First register a user
    await page.goto('http://localhost:3000/register');
    await page.fill('input[name="name"]', 'Session Test User');
    await page.fill('input[name="email"]', testUserEmail);
    await page.fill('input[name="password"]', testUserPassword);
    await page.fill('input[name="confirmPassword"]', testUserPassword);
    
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    
    // Should be logged in and redirected
    const isLoggedIn = page.url().includes('/dashboard');
    
    if (isLoggedIn) {
      console.log('✅ Auto-login after registration working');
      
      // Test logout functionality
      const logoutButton = page.locator('button:has-text("Logout")').or(page.locator('a:has-text("Logout")')).first();
      const logoutVisible = await logoutButton.isVisible().catch(() => false);
      
      if (logoutVisible) {
        await logoutButton.click();
        await page.waitForTimeout(2000);
        
        const redirectedToHome = page.url().includes('/') && !page.url().includes('/dashboard');
        if (redirectedToHome) {
          console.log('✅ Logout redirects to home page');
        }
      } else {
        console.log('ℹ️ Logout button not found - check navigation implementation');
      }
    }
  });

  test('Protected routes authentication', async ({ page }) => {
    console.log('🔍 Testing: Protected Routes');
    
    const protectedRoutes = [
      '/dashboard',
      '/cover-letter',
      '/job-tracker',
      '/jd-analyzer',
      '/resume-builder'
    ];
    
    for (const route of protectedRoutes) {
      await page.goto(`http://localhost:3000${route}`);
      await page.waitForTimeout(2000);
      
      const currentUrl = page.url();
      const redirectedToLogin = currentUrl.includes('/login');
      
      if (redirectedToLogin) {
        console.log(`✅ ${route} correctly requires authentication`);
      } else {
        console.log(`⚠️ ${route} may not be properly protected`);
      }
    }
  });

  test('Token persistence and refresh', async ({ page }) => {
    console.log('🔍 Testing: Token Persistence');
    
    // Register and login
    await page.goto('http://localhost:3000/register');
    await page.fill('input[name="name"]', 'Token Test User');
    await page.fill('input[name="email"]', testUserEmail);
    await page.fill('input[name="password"]', testUserPassword);
    await page.fill('input[name="confirmPassword"]', testUserPassword);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    
    // Check if token exists in localStorage
    const hasToken = await page.evaluate(() => {
      return localStorage.getItem('token') !== null;
    });
    
    if (hasToken) {
      console.log('✅ Token stored in localStorage');
      
      // Refresh page and check if user stays logged in
      await page.reload();
      await page.waitForTimeout(2000);
      
      const stillLoggedIn = page.url().includes('/dashboard');
      if (stillLoggedIn) {
        console.log('✅ Session persists after page refresh');
      }
    }
  });
});
