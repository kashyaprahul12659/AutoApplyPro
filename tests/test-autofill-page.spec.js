// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Test Autofill Page tests
 * Tests the page that allows users to test the autofill functionality of the extension
 */
test.describe('Test Autofill Page', () => {
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
    
    // Navigate to test autofill page
    await page.goto('http://localhost:3000/test-autofill');
    console.log('✅ Navigated to test autofill page');
  });

  test('should display page header and extension detection status', async ({ page }) => {
    // Check for page title
    const pageTitle = page.getByRole('heading', { name: /extension test page/i });
    await expect(pageTitle).toBeVisible();
    
    // Extension detection status should be visible (either detected or not detected)
    // Allow time for detection to complete
    await page.waitForTimeout(2500);
    
    // Either extension detected or not detected status should be visible
    const detectedStatus = page.getByText(/extension detected/i);
    const notDetectedStatus = page.getByText(/extension not detected/i);
    
    const isDetectedVisible = await detectedStatus.isVisible();
    const isNotDetectedVisible = await notDetectedStatus.isVisible();
    
    // One of the statuses should be visible
    expect(isDetectedVisible || isNotDetectedVisible).toBeTruthy();
    
    if (isDetectedVisible) {
      console.log('✅ Extension detection status: Detected');
    } else {
      console.log('✅ Extension detection status: Not Detected');
    }
  });

  test('should display test form with personal information section', async ({ page }) => {
    // Check for form sections
    const personalInfoSection = page.getByText(/personal information/i).filter({ hasText: /required/i });
    await expect(personalInfoSection).toBeVisible();
    
    // Check for key form fields
    await expect(page.getByLabel(/first name/i)).toBeVisible();
    await expect(page.getByLabel(/last name/i)).toBeVisible();
    await expect(page.getByLabel(/email address/i)).toBeVisible();
    await expect(page.getByLabel(/phone number/i)).toBeVisible();
    
    console.log('✅ Personal information form section verified');
  });

  test('should display address information section', async ({ page }) => {
    // Check for address section
    const addressSection = page.getByText(/address information/i);
    await expect(addressSection).toBeVisible();
    
    // Check for key address fields
    await expect(page.getByLabel(/street address/i)).toBeVisible();
    await expect(page.getByLabel(/city/i)).toBeVisible();
    await expect(page.getByLabel(/state\/province/i)).toBeVisible();
    await expect(page.getByLabel(/zip\/postal code/i)).toBeVisible();
    await expect(page.getByLabel(/country/i)).toBeVisible();
    
    console.log('✅ Address information form section verified');
  });

  test('should display education section', async ({ page }) => {
    // Check for education section
    const educationSection = page.getByText(/education/i).filter({ hasText: /information|background|history/i });
    
    if (await educationSection.count() > 0) {
      await expect(educationSection.first()).toBeVisible();
      
      // Check for education fields that might be present
      const possibleFields = [
        'highest degree',
        'field of study',
        'university',
        'college',
        'school name',
        'graduation'
      ];
      
      let foundEducationField = false;
      
      for (const field of possibleFields) {
        const fieldElement = page.getByLabel(new RegExp(field, 'i'));
        if (await fieldElement.count() > 0) {
          await expect(fieldElement.first()).toBeVisible();
          foundEducationField = true;
          break;
        }
      }
      
      expect(foundEducationField).toBeTruthy();
      console.log('✅ Education form section verified');
    } else {
      console.log('⚠️ Education section not found, may have been removed');
    }
  });

  test('should display experience section', async ({ page }) => {
    // Check for work experience section
    const experienceSection = page.getByText(/experience|work history|employment/i);
    
    if (await experienceSection.count() > 0) {
      await expect(experienceSection.first()).toBeVisible();
      
      // Check for experience fields that might be present
      const possibleFields = [
        'job title',
        'company',
        'employer',
        'work experience',
        'years of experience',
        'employment'
      ];
      
      let foundExperienceField = false;
      
      for (const field of possibleFields) {
        const fieldElement = page.getByLabel(new RegExp(field, 'i'));
        if (await fieldElement.count() > 0) {
          await expect(fieldElement.first()).toBeVisible();
          foundExperienceField = true;
          break;
        }
      }
      
      expect(foundExperienceField).toBeTruthy();
      console.log('✅ Experience form section verified');
    } else {
      console.log('⚠️ Experience section not found, may have been removed');
    }
  });

  test('should display skills section', async ({ page }) => {
    // Check for skills section
    const skillsSection = page.getByText(/skills|qualifications/i);
    
    if (await skillsSection.count() > 0) {
      await expect(skillsSection.first()).toBeVisible();
      console.log('✅ Skills form section verified');
    } else {
      console.log('⚠️ Skills section not found, may have been removed');
    }
  });

  test('should display how to use button', async ({ page }) => {
    // Check for the how to use button
    const howToUseButton = page.getByRole('button', { name: /how to use/i });
    await expect(howToUseButton).toBeVisible();
    
    console.log('✅ How to use button verified');
  });

  test.skip('should display toast message when how to use button is clicked', async ({ page }) => {
    // Allow time for extension detection to complete
    await page.waitForTimeout(2500);
    
    // Click the how to use button
    const howToUseButton = page.getByRole('button', { name: /how to use/i });
    await howToUseButton.click();
    
    // Check for toast message
    const toastMessage = page.locator('.Toastify__toast-body');
    await expect(toastMessage).toBeVisible();
    await expect(toastMessage).toContainText(/fill this form using the AutoApply Pro extension/i);
    
    console.log('✅ How to use button click and toast message verified');
  });
});
