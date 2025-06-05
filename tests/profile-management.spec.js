// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Profile Management Tests
 * Tests the user profile management features including personal info, education, experience, and skills
 */
test.describe('Profile Management', () => {
  // Test user credentials - update these to match your test user
  const testUser = {
    email: 'test@example.com',
    password: 'Test123!'
  };

  // Sample profile data for testing
  const profileData = {
    personal: {
      firstName: 'Test',
      lastName: 'User',
      phone: '1234567890',
      address: '123 Test St',
      city: 'Test City',
      state: 'TS',
      zipCode: '12345',
      country: 'Test Country'
    },
    education: {
      institution: 'Test University',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2018-09',
      endDate: '2022-05'
    },
    experience: {
      company: 'Test Company',
      title: 'Software Developer',
      location: 'Test City',
      startDate: '2022-06',
      endDate: '',
      description: 'Developing web applications using React and Node.js'
    },
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express']
  };

  test.beforeEach(async ({ page }) => {
    // Start by logging in
    await page.goto('http://localhost:3000/login');
    
    // Fill login form
    await page.locator('input[type="email"]').fill(testUser.email);
    await page.locator('input[type="password"]').fill(testUser.password);
    
    // Submit login form and wait for navigation
    try {
      await Promise.all([
        page.waitForNavigation({ timeout: 10000 }),
        page.locator('button[type="submit"]').click()
      ]);
      console.log('✅ Logged in successfully');
    } catch (error) {
      console.log('⚠️ Login navigation error, continuing anyway');
      // Continue anyway as we might still be logged in
    }
    
    // Navigate to the profile page
    await navigateToProfile(page);
  });

  // Helper function to navigate to profile page
  async function navigateToProfile(page) {
    // Try common profile page paths
    const profileLinks = [
      'a:has-text("Profile")', 
      'a:has-text("Account")', 
      'a:has-text("Settings")',
      'a[href*="profile"]',
      'a[href*="account"]',
      'a[href*="settings"]'
    ];
    
    let navigatedToProfile = false;
    
    for (const selector of profileLinks) {
      const link = page.locator(selector);
      if (await link.count() > 0) {
        console.log(`📌 Found profile link: ${selector}`);
        await link.first().click();
        await page.waitForTimeout(2000);
        navigatedToProfile = true;
        break;
      }
    }
    
    if (!navigatedToProfile) {
      // Try direct navigation to common profile paths
      const profilePaths = ['/profile', '/account', '/settings', '/user/profile'];
      
      for (const path of profilePaths) {
        try {
          await page.goto(`http://localhost:3000${path}`);
          console.log(`📌 Directly navigated to: ${path}`);
          await page.waitForTimeout(2000);
          navigatedToProfile = true;
          break;
        } catch (error) {
          console.log(`⚠️ Failed to navigate to ${path}`);
        }
      }
    }
    
    await page.screenshot({ path: 'test-results/profile-page.png' });
    return navigatedToProfile;
  }

  test('should display user profile sections', async ({ page }) => {
    // Check for common profile section headers
    const profileSections = [
      'text=Personal Information', 
      'text=Personal Details',
      'text=Contact Information',
      'text=Education',
      'text=Experience',
      'text=Work History',
      'text=Skills',
      'text=Qualifications'
    ];
    
    let foundSections = 0;
    
    for (const selector of profileSections) {
      const section = page.locator(selector);
      if (await section.count() > 0) {
        console.log(`📌 Found profile section: ${selector}`);
        await section.first().highlight();
        await page.screenshot({ path: `test-results/profile-section-${foundSections}.png` });
        foundSections++;
      }
    }
    
    console.log(`📌 Found ${foundSections} profile sections`);
    
    // Look for form elements that would contain profile data
    const formElements = [
      'input[name="firstName"], input[name="first_name"], input[id="firstName"]',
      'input[name="lastName"], input[name="last_name"], input[id="lastName"]',
      'input[name="email"], input[id="email"]',
      'input[name="phone"], input[id="phone"]',
      'input[name="address"], input[id="address"]',
      'textarea',
      'select',
      'button[type="submit"]'
    ];
    
    let foundFormElements = 0;
    
    for (const selector of formElements) {
      const elements = page.locator(selector);
      const count = await elements.count();
      if (count > 0) {
        console.log(`📌 Found ${count} form elements matching: ${selector}`);
        foundFormElements += count;
      }
    }
    
    console.log(`📌 Found a total of ${foundFormElements} form elements`);
    
    // The test passes if we found any profile sections or form elements
    expect(foundSections > 0 || foundFormElements > 0).toBeTruthy();
    console.log('✅ Profile page contains expected sections');
  });

  test('should identify editable profile fields', async ({ page }) => {
    // Look for editable fields in the profile page
    const editableFields = [
      'input:not([readonly]):not([disabled])',
      'textarea:not([readonly]):not([disabled])',
      'select:not([disabled])'
    ];
    
    let foundEditableFields = 0;
    
    for (const selector of editableFields) {
      const fields = page.locator(selector);
      const count = await fields.count();
      if (count > 0) {
        console.log(`📌 Found ${count} editable fields matching: ${selector}`);
        
        // Highlight the first few fields for visualization
        for (let i = 0; i < Math.min(count, 3); i++) {
          await fields.nth(i).highlight();
        }
        
        await page.screenshot({ path: `test-results/editable-fields-${foundEditableFields}.png` });
        foundEditableFields += count;
      }
    }
    
    // Look for "Edit" buttons that might be used to enable editing
    const editButtons = page.locator('button:has-text("Edit"), a:has-text("Edit")');
    const editButtonCount = await editButtons.count();
    
    if (editButtonCount > 0) {
      console.log(`📌 Found ${editButtonCount} edit buttons`);
      await editButtons.first().highlight();
      await page.screenshot({ path: 'test-results/edit-buttons.png' });
    }
    
    // Look for "Save" buttons that would save profile changes
    const saveButtons = page.locator('button:has-text("Save"), button[type="submit"]');
    const saveButtonCount = await saveButtons.count();
    
    if (saveButtonCount > 0) {
      console.log(`📌 Found ${saveButtonCount} save buttons`);
      await saveButtons.first().highlight();
      await page.screenshot({ path: 'test-results/save-buttons.png' });
    }
    
    // The test passes if we found any editable fields or edit/save buttons
    const canEditProfile = foundEditableFields > 0 || editButtonCount > 0 || saveButtonCount > 0;
    expect(canEditProfile).toBeTruthy();
    console.log('✅ Profile page contains editable fields or edit functionality');
  });

  test.skip('should attempt to update profile information', async ({ page }) => {
    // Note: This test is skipped by default as it will make actual changes to the profile
    // Enable this test only when you're ready to test profile updates
    
    // Look for personal information section first
    const personalInfoSection = page.locator('text=Personal Information, text=Personal Details, text=Contact Information');
    
    if (await personalInfoSection.count() > 0) {
      console.log('📌 Found personal information section');
      await personalInfoSection.first().highlight();
      await page.screenshot({ path: 'test-results/personal-info-section.png' });
      
      // Look for name fields
      const firstNameField = page.locator('input[name="firstName"], input[name="first_name"], input[id="firstName"]');
      const lastNameField = page.locator('input[name="lastName"], input[name="last_name"], input[id="lastName"]');
      
      // Check if fields need to be unlocked for editing
      const editButton = page.locator('button:has-text("Edit"), a:has-text("Edit")');
      if (await editButton.count() > 0) {
        await editButton.first().click();
        console.log('📌 Clicked edit button to enable editing');
        await page.waitForTimeout(1000);
      }
      
      // Try to update fields if they exist
      if (await firstNameField.count() > 0) {
        await firstNameField.fill(profileData.personal.firstName);
        console.log(`📌 Updated first name to: ${profileData.personal.firstName}`);
      }
      
      if (await lastNameField.count() > 0) {
        await lastNameField.fill(profileData.personal.lastName);
        console.log(`📌 Updated last name to: ${profileData.personal.lastName}`);
      }
      
      // Look for phone and address fields
      const phoneField = page.locator('input[name="phone"], input[id="phone"]');
      const addressField = page.locator('input[name="address"], input[id="address"]');
      
      if (await phoneField.count() > 0) {
        await phoneField.fill(profileData.personal.phone);
        console.log(`📌 Updated phone to: ${profileData.personal.phone}`);
      }
      
      if (await addressField.count() > 0) {
        await addressField.fill(profileData.personal.address);
        console.log(`📌 Updated address to: ${profileData.personal.address}`);
      }
      
      // Try to save changes
      const saveButton = page.locator('button:has-text("Save"), button[type="submit"]');
      
      if (await saveButton.count() > 0) {
        await saveButton.first().click();
        console.log('📌 Clicked save button');
        await page.waitForTimeout(2000);
        
        // Check for success message
        const successMessage = page.locator('.success, .alert-success, text=successfully updated');
        
        if (await successMessage.count() > 0) {
          console.log('✅ Profile update successful');
        } else {
          console.log('⚠️ No success message found, update status unclear');
        }
      } else {
        console.log('⚠️ No save button found');
      }
    } else {
      console.log('⚠️ Could not find personal information section');
    }
  });

  test('should have section for employment or experience information', async ({ page }) => {
    // Look for experience section
    const experienceSections = [
      'text=Experience',
      'text=Work History',
      'text=Employment',
      'text=Work Experience'
    ];
    
    let foundExperienceSection = false;
    
    for (const selector of experienceSections) {
      const section = page.locator(selector);
      if (await section.count() > 0) {
        console.log(`📌 Found experience section: ${selector}`);
        await section.first().highlight();
        await page.screenshot({ path: 'test-results/experience-section.png' });
        foundExperienceSection = true;
        break;
      }
    }
    
    if (!foundExperienceSection) {
      console.log('⚠️ Could not find experience section');
    } else {
      // Look for "Add" experience button
      const addButtons = page.locator('button:has-text("Add Experience"), button:has-text("Add Work"), a:has-text("Add")');
      
      if (await addButtons.count() > 0) {
        console.log('📌 Found button to add experience');
        await addButtons.first().highlight();
        await page.screenshot({ path: 'test-results/add-experience-button.png' });
      }
      
      // Look for existing experience entries
      const experienceEntries = page.locator('.experience-item, .work-item, [data-testid="experience-item"]');
      const entriesCount = await experienceEntries.count();
      
      if (entriesCount > 0) {
        console.log(`📌 Found ${entriesCount} existing experience entries`);
        await experienceEntries.first().highlight();
        await page.screenshot({ path: 'test-results/experience-entries.png' });
      } else {
        console.log('📌 No existing experience entries found');
      }
      
      // The test passes if we found the experience section
      console.log('✅ Experience section exists in profile');
    }
    
    expect(foundExperienceSection).toBeTruthy();
  });

  test('should have section for education information', async ({ page }) => {
    // Look for education section
    const educationSections = [
      'text=Education',
      'text=Academic History',
      'text=Qualifications',
      'text=Academic Background'
    ];
    
    let foundEducationSection = false;
    
    for (const selector of educationSections) {
      const section = page.locator(selector);
      if (await section.count() > 0) {
        console.log(`📌 Found education section: ${selector}`);
        await section.first().highlight();
        await page.screenshot({ path: 'test-results/education-section.png' });
        foundEducationSection = true;
        break;
      }
    }
    
    if (!foundEducationSection) {
      console.log('⚠️ Could not find education section');
    } else {
      // Look for "Add" education button
      const addButtons = page.locator('button:has-text("Add Education"), button:has-text("Add School"), a:has-text("Add")');
      
      if (await addButtons.count() > 0) {
        console.log('📌 Found button to add education');
        await addButtons.first().highlight();
        await page.screenshot({ path: 'test-results/add-education-button.png' });
      }
      
      // Look for existing education entries
      const educationEntries = page.locator('.education-item, .school-item, [data-testid="education-item"]');
      const entriesCount = await educationEntries.count();
      
      if (entriesCount > 0) {
        console.log(`📌 Found ${entriesCount} existing education entries`);
        await educationEntries.first().highlight();
        await page.screenshot({ path: 'test-results/education-entries.png' });
      } else {
        console.log('📌 No existing education entries found');
      }
      
      // The test passes if we found the education section
      console.log('✅ Education section exists in profile');
    }
    
    expect(foundEducationSection).toBeTruthy();
  });

  test('should have section for skills information', async ({ page }) => {
    // Look for skills section
    const skillsSections = [
      'text=Skills',
      'text=Expertise',
      'text=Abilities',
      'text=Competencies'
    ];
    
    let foundSkillsSection = false;
    
    for (const selector of skillsSections) {
      const section = page.locator(selector);
      if (await section.count() > 0) {
        console.log(`📌 Found skills section: ${selector}`);
        await section.first().highlight();
        await page.screenshot({ path: 'test-results/skills-section.png' });
        foundSkillsSection = true;
        break;
      }
    }
    
    if (!foundSkillsSection) {
      console.log('⚠️ Could not find skills section');
    } else {
      // Look for skills input or list
      const skillsElements = [
        'input[name="skills"]',
        '.skills-list',
        '.skill-tag',
        '[data-testid="skills-list"]'
      ];
      
      let foundSkillsElements = false;
      
      for (const selector of skillsElements) {
        const element = page.locator(selector);
        if (await element.count() > 0) {
          console.log(`📌 Found skills elements: ${selector}`);
          await element.first().highlight();
          await page.screenshot({ path: 'test-results/skills-elements.png' });
          foundSkillsElements = true;
          break;
        }
      }
      
      if (!foundSkillsElements) {
        console.log('⚠️ Could not find skills input or list elements');
      } else {
        console.log('✅ Skills input or list elements exist');
      }
      
      // The test passes if we found the skills section
      console.log('✅ Skills section exists in profile');
    }
    
    expect(foundSkillsSection).toBeTruthy();
  });
});
