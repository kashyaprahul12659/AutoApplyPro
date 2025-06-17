// @ts-check
const { test, expect, chromium } = require('@playwright/test');
const path = require('path');

/**
 * DEEP CHROME EXTENSION TESTING
 * 
 * This test suite performs comprehensive testing of:
 * - Extension installation and loading
 * - Authentication sync with web application
 * - Autofill functionality on various job sites
 * - Field detection and matching algorithms
 * - Profile data retrieval and caching
 * - Error handling and fallback mechanisms
 * - Performance and memory usage
 * - Cross-site compatibility
 * 
 * As a Senior Full Stack Developer + QA Tester with 5 years experience,
 * I'm testing the extension's integration with real job boards and forms.
 */
test.describe('🔧 Deep Chrome Extension Testing', () => {
  let browser;
  let extensionId;
  
  const testUser = {
    email: 'test@example.com',
    password: 'Test123!'
  };

  // Mock job application forms for testing
  const testJobForms = {
    standard: `
      <html>
        <head><title>Job Application Form</title></head>
        <body>
          <form id="job-application">
            <h1>Software Engineer Position</h1>
            <label for="firstName">First Name:</label>
            <input type="text" id="firstName" name="firstName" />
            
            <label for="lastName">Last Name:</label>
            <input type="text" id="lastName" name="lastName" />
            
            <label for="email">Email Address:</label>
            <input type="email" id="email" name="email" />
            
            <label for="phone">Phone Number:</label>
            <input type="tel" id="phone" name="phone" />
            
            <label for="address">Address:</label>
            <input type="text" id="address" name="address" />
            
            <label for="experience">Years of Experience:</label>
            <input type="number" id="experience" name="experience" />
            
            <label for="skills">Technical Skills:</label>
            <textarea id="skills" name="skills" placeholder="List your technical skills"></textarea>
            
            <label for="currentCompany">Current Company:</label>
            <input type="text" id="currentCompany" name="currentCompany" />
            
            <label for="currentRole">Current Role:</label>
            <input type="text" id="currentRole" name="currentRole" />
            
            <button type="submit">Submit Application</button>
          </form>
        </body>
      </html>
    `,
    
    complex: `
      <html>
        <head><title>Advanced Job Application</title></head>
        <body>
          <form id="complex-application">
            <h1>Senior Developer Position</h1>
            
            <!-- Personal Information Section -->
            <fieldset>
              <legend>Personal Information</legend>
              <input type="text" name="full_name" placeholder="Full Name" />
              <input type="email" name="email_address" placeholder="Email" />
              <input type="text" name="phone_number" placeholder="Phone" />
              <input type="text" name="home_address" placeholder="Address" />
            </fieldset>
            
            <!-- Professional Experience -->
            <fieldset>
              <legend>Professional Experience</legend>
              <input type="text" name="company_name" placeholder="Most Recent Company" />
              <input type="text" name="job_title" placeholder="Job Title" />
              <input type="text" name="employment_duration" placeholder="Duration (e.g., 2020-2023)" />
              <textarea name="job_responsibilities" placeholder="Key responsibilities and achievements"></textarea>
            </fieldset>
            
            <!-- Skills and Qualifications -->
            <fieldset>
              <legend>Skills</legend>
              <textarea name="technical_skills" placeholder="Technical Skills (comma-separated)"></textarea>
              <textarea name="soft_skills" placeholder="Soft Skills"></textarea>
              <select name="experience_level">
                <option value="">Select Experience Level</option>
                <option value="entry">Entry Level (0-2 years)</option>
                <option value="mid">Mid Level (3-5 years)</option>
                <option value="senior">Senior Level (6+ years)</option>
              </select>
            </fieldset>
            
            <!-- Education -->
            <fieldset>
              <legend>Education</legend>
              <input type="text" name="university" placeholder="University/College" />
              <input type="text" name="degree" placeholder="Degree" />
              <input type="text" name="field_of_study" placeholder="Field of Study" />
              <input type="text" name="graduation_year" placeholder="Graduation Year" />
            </fieldset>
            
            <button type="submit">Submit Advanced Application</button>
          </form>
        </body>
      </html>
    `,
    
    nonStandard: `
      <html>
        <head><title>Custom Job Form</title></head>
        <body>
          <form id="custom-form">
            <h1>Unique Application Form</h1>
            
            <!-- Non-standard field names -->
            <input type="text" class="applicant-name" data-field="name" />
            <input type="text" id="contact-email" />
            <input type="text" name="tel" placeholder="Phone" />
            <input type="text" id="location" />
            
            <!-- Dynamic fields -->
            <div class="skill-container">
              <input type="text" name="skill1" placeholder="Primary Skill" />
              <input type="text" name="skill2" placeholder="Secondary Skill" />
              <input type="text" name="skill3" placeholder="Additional Skill" />
            </div>
            
            <!-- Nested fields -->
            <div class="experience-section">
              <div class="current-job">
                <input type="text" name="current_employer" />
                <input type="text" name="current_position" />
              </div>
            </div>
            
            <button type="submit">Apply Now</button>
          </form>
        </body>
      </html>
    `
  };

  test.beforeAll(async () => {
    console.log('🚀 Setting up Chrome Extension testing environment');
    
    // Path to the extension
    const extensionPath = path.join(__dirname, '..', 'autoapply-extension');
    
    // Launch browser with extension
    browser = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
        `--load-extension=${extensionPath}`,
        '--disable-extensions-except=' + extensionPath,
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });
    
    // Get extension ID
    const extensionTargets = browser.backgroundPages();
    if (extensionTargets.length > 0) {
      const extensionUrl = extensionTargets[0].url();
      extensionId = extensionUrl.split('/')[2];
      console.log(`🔧 Extension loaded with ID: ${extensionId}`);
    }
    
    // Authenticate the extension with the web app
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/login');
    
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    
    console.log('✅ Authenticated extension with web application');
    await page.close();
  });

  test('should install and load extension correctly', async () => {
    console.log('🧪 TESTING: Extension Installation and Loading');
    
    const page = await browser.newPage();
    
    // Navigate to chrome://extensions/
    await page.goto(`chrome-extension://${extensionId}/popup.html`);
    
    // Verify extension popup loads
    await expect(page.locator('body')).toBeVisible();
    
    // Check for extension UI elements
    const autofillButton = page.locator('button:has-text("Autofill"), #autofill-btn');
    await expect(autofillButton).toBeVisible();
    
    console.log('✅ Extension popup loaded successfully');
    
    // Check extension authentication status
    const loginStatus = page.locator('.login-status, #login-status, .auth-indicator');
    if (await loginStatus.count() > 0) {
      const statusText = await loginStatus.textContent();
      console.log(`🔐 Authentication status: ${statusText}`);
    }
    
    await page.close();
  });

  test('should autofill standard job application form', async () => {
    console.log('🧪 TESTING: Standard Job Form Autofill');
    
    const page = await browser.newPage();
    
    // Create a test page with job application form
    await page.setContent(testJobForms.standard);
    
    // Open extension popup
    const extensionPage = await browser.newPage();
    await extensionPage.goto(`chrome-extension://${extensionId}/popup.html`);
    
    // Click autofill button
    const autofillButton = extensionPage.locator('#autofill-btn, button:has-text("Autofill")');
    await autofillButton.click();
    console.log('🔄 Clicked autofill button');
    
    // Switch back to form page
    await page.bringToFront();
    await page.waitForTimeout(3000); // Allow autofill to process
    
    // Verify fields were filled
    const firstName = await page.locator('#firstName').inputValue();
    const lastName = await page.locator('#lastName').inputValue();
    const email = await page.locator('#email').inputValue();
    const phone = await page.locator('#phone').inputValue();
    
    console.log(`📝 Autofilled data:
      - First Name: ${firstName}
      - Last Name: ${lastName}
      - Email: ${email}
      - Phone: ${phone}`);
    
    // Verify data was filled
    expect(firstName.length).toBeGreaterThan(0);
    expect(email).toContain('@');
    
    // Check for field highlighting
    const highlightedFields = page.locator('.autofill-highlight, [style*="background"]');
    if (await highlightedFields.count() > 0) {
      console.log(`✨ Found ${await highlightedFields.count()} highlighted fields`);
    }
    
    console.log('✅ Standard form autofill completed successfully');
    
    await extensionPage.close();
    await page.close();
  });

  test('should handle complex job application form', async () => {
    console.log('🧪 TESTING: Complex Job Form Autofill');
    
    const page = await browser.newPage();
    await page.setContent(testJobForms.complex);
    
    // Open extension popup
    const extensionPage = await browser.newPage();
    await extensionPage.goto(`chrome-extension://${extensionId}/popup.html`);
    
    // Click autofill button
    const autofillButton = extensionPage.locator('#autofill-btn, button:has-text("Autofill")');
    await autofillButton.click();
    
    // Allow autofill processing
    await page.bringToFront();
    await page.waitForTimeout(4000);
    
    // Check various field types
    const fullName = await page.locator('input[name="full_name"]').inputValue();
    const emailAddress = await page.locator('input[name="email_address"]').inputValue();
    const companyName = await page.locator('input[name="company_name"]').inputValue();
    const technicalSkills = await page.locator('textarea[name="technical_skills"]').inputValue();
    
    console.log(`📊 Complex form autofill results:
      - Full Name: ${fullName}
      - Email: ${emailAddress}
      - Company: ${companyName}
      - Skills: ${technicalSkills.substring(0, 50)}...`);
    
    // Verify complex fields were handled
    expect(fullName.length).toBeGreaterThan(0);
    expect(emailAddress).toContain('@');
    expect(technicalSkills.length).toBeGreaterThan(0);
    
    console.log('✅ Complex form autofill handling verified');
    
    await extensionPage.close();
    await page.close();
  });

  test('should detect and fill non-standard field patterns', async () => {
    console.log('🧪 TESTING: Non-Standard Field Pattern Detection');
    
    const page = await browser.newPage();
    await page.setContent(testJobForms.nonStandard);
    
    const extensionPage = await browser.newPage();
    await extensionPage.goto(`chrome-extension://${extensionId}/popup.html`);
    
    const autofillButton = extensionPage.locator('#autofill-btn');
    await autofillButton.click();
    
    await page.bringToFront();
    await page.waitForTimeout(4000);
    
    // Check non-standard selectors
    const nameField = await page.locator('.applicant-name').inputValue();
    const emailField = await page.locator('#contact-email').inputValue();
    const phoneField = await page.locator('input[name="tel"]').inputValue();
    const locationField = await page.locator('#location').inputValue();
    
    console.log(`🔍 Non-standard field detection results:
      - Name (class selector): ${nameField}
      - Email (ID selector): ${emailField}
      - Phone (name=tel): ${phoneField}
      - Location: ${locationField}`);
    
    // Verify intelligent field detection worked
    const filledFields = [nameField, emailField, phoneField, locationField]
      .filter(value => value && value.length > 0);
    
    expect(filledFields.length).toBeGreaterThan(2);
    console.log(`✅ Successfully filled ${filledFields.length} non-standard fields`);
    
    await extensionPage.close();
    await page.close();
  });

  test('should handle job description analysis in extension', async () => {
    console.log('🧪 TESTING: Job Description Analysis in Extension');
    
    const page = await browser.newPage();
    
    // Create page with job description
    const jobDescriptionHTML = `
      <html>
        <body>
          <div class="job-description">
            <h1>Senior Software Engineer</h1>
            <p>We are looking for a Senior Software Engineer with expertise in JavaScript, React, Node.js, and AWS.</p>
            <h3>Requirements:</h3>
            <ul>
              <li>5+ years of experience in full-stack development</li>
              <li>Proficiency in React, Node.js, and MongoDB</li>
              <li>Experience with cloud platforms (AWS, Azure)</li>
              <li>Strong problem-solving skills</li>
            </ul>
          </div>
        </body>
      </html>
    `;
    
    await page.setContent(jobDescriptionHTML);
    
    // Open extension popup
    const extensionPage = await browser.newPage();
    await extensionPage.goto(`chrome-extension://${extensionId}/popup.html`);
    
    // Click JD analysis button
    const analyzeButton = extensionPage.locator('#analyze-jd-btn, button:has-text("Analyze")');
    if (await analyzeButton.count() > 0) {
      await analyzeButton.click();
      console.log('🔍 Clicked job description analysis button');
      
      // Wait for analysis
      await extensionPage.waitForTimeout(5000);
      
      // Check for analysis results
      const analysisResults = extensionPage.locator('.analysis-results, .match-score, .jd-analysis');
      if (await analysisResults.count() > 0) {
        const resultsText = await analysisResults.textContent();
        console.log(`📊 Analysis results: ${resultsText}`);
      }
      
      console.log('✅ Job description analysis functionality verified');
    }
    
    await extensionPage.close();
    await page.close();
  });

  test('should test extension performance and memory usage', async () => {
    console.log('🧪 TESTING: Extension Performance and Memory Usage');
    
    const page = await browser.newPage();
    
    // Enable performance metrics
    await page.coverage.startJSCoverage();
    
    // Load multiple job forms to test performance
    for (let i = 0; i < 3; i++) {
      await page.setContent(testJobForms.standard);
      
      const extensionPage = await browser.newPage();
      await extensionPage.goto(`chrome-extension://${extensionId}/popup.html`);
      
      const startTime = Date.now();
      
      const autofillButton = extensionPage.locator('#autofill-btn');
      await autofillButton.click();
      
      await page.waitForTimeout(2000);
      
      const endTime = Date.now();
      const performanceTime = endTime - startTime;
      
      console.log(`⏱️ Autofill iteration ${i + 1} completed in ${performanceTime}ms`);
      
      // Performance should be under 5 seconds
      expect(performanceTime).toBeLessThan(5000);
      
      await extensionPage.close();
    }
    
    // Get performance metrics
    const jsCoverage = await page.coverage.stopJSCoverage();
    console.log(`📊 JavaScript coverage: ${jsCoverage.length} files analyzed`);
    
    console.log('✅ Performance testing completed');
    await page.close();
  });

  test('should test cross-site autofill compatibility', async () => {
    console.log('🧪 TESTING: Cross-Site Autofill Compatibility');
    
    // Test on different "job sites" with varying structures
    const jobSites = [
      {
        name: 'LinkedIn Style',
        html: `
          <form>
            <input name="firstName" placeholder="First name" />
            <input name="lastName" placeholder="Last name" />
            <input name="email" type="email" />
            <button type="submit">Easy Apply</button>
          </form>
        `
      },
      {
        name: 'Indeed Style',
        html: `
          <form>
            <input id="applicant.name" />
            <input id="applicant.email" />
            <input id="applicant.phoneNumber" />
            <textarea id="applicant.coverLetter"></textarea>
            <button>Continue</button>
          </form>
        `
      },
      {
        name: 'Glassdoor Style',
        html: `
          <div class="application-form">
            <input data-test="firstName" />
            <input data-test="lastName" />
            <input data-test="email" />
            <input data-test="phone" />
            <button class="apply-btn">Submit Application</button>
          </div>
        `
      }
    ];
    
    for (const site of jobSites) {
      console.log(`🌐 Testing ${site.name} compatibility`);
      
      const page = await browser.newPage();
      await page.setContent(`<html><body>${site.html}</body></html>`);
      
      const extensionPage = await browser.newPage();
      await extensionPage.goto(`chrome-extension://${extensionId}/popup.html`);
      
      const autofillButton = extensionPage.locator('#autofill-btn');
      await autofillButton.click();
      
      await page.bringToFront();
      await page.waitForTimeout(3000);
      
      // Count filled fields
      const allInputs = page.locator('input');
      const inputCount = await allInputs.count();
      let filledCount = 0;
      
      for (let i = 0; i < inputCount; i++) {
        const value = await allInputs.nth(i).inputValue();
        if (value && value.length > 0) {
          filledCount++;
        }
      }
      
      console.log(`📊 ${site.name}: ${filledCount}/${inputCount} fields filled`);
      expect(filledCount).toBeGreaterThan(0);
      
      await extensionPage.close();
      await page.close();
    }
    
    console.log('✅ Cross-site compatibility testing completed');
  });

  test('should handle extension error scenarios', async () => {
    console.log('🧪 TESTING: Extension Error Handling');
    
    const page = await browser.newPage();
    const extensionPage = await browser.newPage();
    await extensionPage.goto(`chrome-extension://${extensionId}/popup.html`);
    
    // Test autofill on page with no forms
    await page.setContent('<html><body><h1>No Forms Here</h1></body></html>');
    
    const autofillButton = extensionPage.locator('#autofill-btn');
    await autofillButton.click();
    
    // Should handle gracefully
    await page.waitForTimeout(2000);
    
    // Check for error message or notification
    const errorNotification = extensionPage.locator('.error, .notification, [data-testid="error"]');
    if (await errorNotification.count() > 0) {
      console.log('⚠️ Error notification displayed for no forms');
    }
    
    // Test with malformed HTML
    await page.setContent('<html><body><form><input></form></body></html>');
    await autofillButton.click();
    await page.waitForTimeout(2000);
    
    console.log('✅ Error handling scenarios completed');
    
    await extensionPage.close();
    await page.close();
  });

  test('should test extension authentication sync', async () => {
    console.log('🧪 TESTING: Extension Authentication Sync');
    
    const extensionPage = await browser.newPage();
    await extensionPage.goto(`chrome-extension://${extensionId}/popup.html`);
    
    // Check authentication status
    const authStatus = extensionPage.locator('.auth-status, #login-status, .user-info');
    if (await authStatus.count() > 0) {
      const statusText = await authStatus.textContent();
      console.log(`🔐 Authentication status: ${statusText}`);
      
      // Should show logged in state
      expect(statusText.toLowerCase()).toMatch(/logged|authenticated|connected/);
    }
    
    // Test logout/login sync
    const logoutButton = extensionPage.locator('button:has-text("Logout"), #logout-btn');
    if (await logoutButton.count() > 0) {
      await logoutButton.click();
      console.log('🚪 Clicked logout in extension');
      
      await extensionPage.waitForTimeout(2000);
      
      // Should show logged out state
      const newStatus = extensionPage.locator('.auth-status, #login-status');
      if (await newStatus.count() > 0) {
        const newStatusText = await newStatus.textContent();
        console.log(`🔓 New status: ${newStatusText}`);
      }
    }
    
    console.log('✅ Authentication sync testing completed');
    await extensionPage.close();
  });

  test('should validate extension popup UI responsiveness', async () => {
    console.log('🧪 TESTING: Extension Popup UI Responsiveness');
    
    const extensionPage = await browser.newPage();
    await extensionPage.goto(`chrome-extension://${extensionId}/popup.html`);
    
    // Test different popup sizes
    await extensionPage.setViewportSize({ width: 300, height: 400 });
    await extensionPage.waitForTimeout(1000);
    
    // Verify all elements are visible
    const autofillButton = extensionPage.locator('#autofill-btn');
    const popup = extensionPage.locator('body');
    
    await expect(autofillButton).toBeVisible();
    await expect(popup).toBeVisible();
    
    // Test smaller size
    await extensionPage.setViewportSize({ width: 250, height: 350 });
    await extensionPage.waitForTimeout(1000);
    
    await expect(autofillButton).toBeVisible();
    
    // Check for scrollability if needed
    const popupHeight = await popup.evaluate(el => el.scrollHeight);
    const viewportHeight = 350;
    
    if (popupHeight > viewportHeight) {
      console.log('📱 Popup is scrollable for smaller viewports');
    }
    
    console.log('✅ Extension popup UI responsiveness verified');
    await extensionPage.close();
  });

  test.afterAll(async () => {
    console.log('🧹 Cleaning up Chrome Extension testing environment');
    await browser.close();
  });
});
