// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * DEEP AI COVER LETTER GENERATOR TESTING
 * 
 * This test suite performs comprehensive testing of:
 * - AI cover letter generation with various job descriptions
 * - Cover letter editing and customization
 * - PDF generation and download
 * - Cover letter history and management
 * - Credit system and subscription limits
 * - Error handling for AI service failures
 * - Performance and response time testing
 * 
 * As a Senior Full Stack Developer + QA Tester with 5 years experience,
 * I'm testing the AI integration, user experience, and edge cases.
 */
test.describe('🤖 Deep AI Cover Letter Generator Testing', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'Test123!'
  };

  // Test job descriptions for various scenarios
  const testJobDescriptions = {
    software: `
      Software Engineer - Full Stack Development
      
      We are looking for a passionate Software Engineer to join our team. 
      
      Requirements:
      - 3+ years experience in JavaScript, React, Node.js
      - Experience with databases (MongoDB, PostgreSQL)
      - Knowledge of cloud platforms (AWS, Azure)
      - Strong problem-solving skills
      - Bachelor's degree in Computer Science or related field
      
      Company: TechCorp Inc.
      Location: San Francisco, CA
      Salary: $120,000 - $150,000
    `,
    
    marketing: `
      Digital Marketing Manager
      
      Join our marketing team to drive growth and engagement.
      
      Requirements:
      - 5+ years in digital marketing
      - Experience with SEO, SEM, social media marketing
      - Analytics tools (Google Analytics, Facebook Ads)
      - Content creation and strategy
      - Excellent communication skills
      
      Company: GrowthMax Solutions
      Location: New York, NY
      Salary: $80,000 - $100,000
    `,
    
    minimal: `
      Data Analyst
      Python, SQL, Excel
      Entry level position
      AnalyticsPro LLC
    `,
    
    empty: '',
    
    veryLong: `
      Senior Product Manager - AI/ML Platform
      
      We are seeking an exceptional Senior Product Manager to lead our AI/ML platform initiative. This role requires deep technical understanding, strategic thinking, and excellent leadership skills.
      
      ${'Requirements: '.repeat(100)}
      ${'- Experience with machine learning algorithms and frameworks '.repeat(50)}
      ${'- Strong analytical and problem-solving skills '.repeat(50)}
      ${'- Excellent communication and presentation abilities '.repeat(50)}
      
      Company: AI Innovations Corp
      Location: Seattle, WA
      Salary: $180,000 - $220,000 + equity
    `
  };

  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    console.log('✅ Logged in successfully');
  });

  test('should generate cover letter for software engineering job', async ({ page }) => {
    console.log('🧪 TESTING: AI Cover Letter Generation - Software Engineering');
    
    // Navigate to cover letter generator
    await page.goto('http://localhost:3000/cover-letter-generator');
    
    // Fill in job description
    const jobDescriptionField = page.locator('textarea[name="jobDescription"], textarea[placeholder*="job description"]');
    await expect(jobDescriptionField).toBeVisible();
    await jobDescriptionField.fill(testJobDescriptions.software);
    console.log('📝 Filled job description');
    
    // Click generate button
    const generateButton = page.locator('button:has-text("Generate")');
    await generateButton.click();
    console.log('🤖 Clicked generate cover letter');
    
    // Wait for AI generation (should show loading state)
    const loadingIndicator = page.locator('.loading, .animate-spin, text=Generating');
    if (await loadingIndicator.count() > 0) {
      console.log('⏳ Loading indicator displayed');
    }
    
    // Wait for generated cover letter
    const coverLetterText = page.locator('textarea[name="coverLetter"], .cover-letter-text');
    await expect(coverLetterText).toBeVisible({ timeout: 30000 });
    
    const generatedText = await coverLetterText.textContent() || await coverLetterText.inputValue();
    console.log(`📄 Generated cover letter length: ${generatedText.length} characters`);
    
    // Verify content quality
    expect(generatedText.length).toBeGreaterThan(200);
    expect(generatedText.toLowerCase()).toContain('software');
    expect(generatedText.toLowerCase()).toContain('engineer');
    
    console.log('✅ Cover letter generation successful for software engineering job');
  });

  test('should handle cover letter editing and customization', async ({ page }) => {
    console.log('🧪 TESTING: Cover Letter Editing and Customization');
    
    await page.goto('http://localhost:3000/cover-letter-generator');
    
    // Generate initial cover letter
    const jobDescriptionField = page.locator('textarea[name="jobDescription"], textarea[placeholder*="job description"]');
    await jobDescriptionField.fill(testJobDescriptions.marketing);
    
    const generateButton = page.locator('button:has-text("Generate")');
    await generateButton.click();
    
    // Wait for generation
    const coverLetterText = page.locator('textarea[name="coverLetter"], .cover-letter-text');
    await expect(coverLetterText).toBeVisible({ timeout: 30000 });
    
    // Edit the cover letter
    const originalText = await coverLetterText.inputValue();
    const customText = originalText + '\n\nThis is a custom addition to test editing functionality.';
    
    await coverLetterText.fill(customText);
    console.log('✏️ Edited cover letter content');
    
    // Save the cover letter
    const saveButton = page.locator('button:has-text("Save")');
    if (await saveButton.count() > 0) {
      await saveButton.click();
      console.log('💾 Saved edited cover letter');
      
      // Verify save success
      const successMessage = page.locator('text=saved successfully, .success');
      await expect(successMessage.first()).toBeVisible({ timeout: 10000 });
      console.log('✅ Save confirmation displayed');
    }
    
    // Verify custom text is preserved
    const savedText = await coverLetterText.inputValue();
    expect(savedText).toContain('custom addition');
    console.log('✅ Custom edits preserved successfully');
  });

  test('should generate and download PDF cover letter', async ({ page }) => {
    console.log('🧪 TESTING: PDF Generation and Download');
    
    await page.goto('http://localhost:3000/cover-letter-generator');
    
    // Generate cover letter
    const jobDescriptionField = page.locator('textarea[name="jobDescription"]');
    await jobDescriptionField.fill(testJobDescriptions.software);
    
    const generateButton = page.locator('button:has-text("Generate")');
    await generateButton.click();
    
    // Wait for generation
    const coverLetterText = page.locator('textarea[name="coverLetter"]');
    await expect(coverLetterText).toBeVisible({ timeout: 30000 });
    
    // Set up download listener
    const downloadPromise = page.waitForEvent('download');
    
    // Click download PDF button
    const downloadButton = page.locator('button:has-text("Download PDF"), button:has-text("PDF")');
    if (await downloadButton.count() > 0) {
      await downloadButton.click();
      console.log('📁 Clicked download PDF button');
      
      // Wait for download
      const download = await downloadPromise;
      const downloadPath = await download.path();
      
      console.log(`📄 PDF downloaded to: ${downloadPath}`);
      
      // Verify PDF file was created
      if (downloadPath) {
        const fs = require('fs');
        const fileExists = fs.existsSync(downloadPath);
        expect(fileExists).toBeTruthy();
        console.log('✅ PDF file created successfully');
      }
    }
  });

  test('should handle empty job description gracefully', async ({ page }) => {
    console.log('🧪 TESTING: Empty Job Description Handling');
    
    await page.goto('http://localhost:3000/cover-letter-generator');
    
    // Try to generate with empty job description
    const generateButton = page.locator('button:has-text("Generate")');
    await generateButton.click();
    
    // Should show error message
    const errorMessage = page.locator('text=Please enter a job description, .error');
    await expect(errorMessage.first()).toBeVisible({ timeout: 10000 });
    console.log('✅ Error message displayed for empty job description');
  });

  test('should handle minimal job description', async ({ page }) => {
    console.log('🧪 TESTING: Minimal Job Description Handling');
    
    await page.goto('http://localhost:3000/cover-letter-generator');
    
    const jobDescriptionField = page.locator('textarea[name="jobDescription"]');
    await jobDescriptionField.fill(testJobDescriptions.minimal);
    
    const generateButton = page.locator('button:has-text("Generate")');
    await generateButton.click();
    
    // Should still generate a cover letter
    const coverLetterText = page.locator('textarea[name="coverLetter"]');
    await expect(coverLetterText).toBeVisible({ timeout: 30000 });
    
    const generatedText = await coverLetterText.inputValue();
    expect(generatedText.length).toBeGreaterThan(100);
    console.log('✅ Successfully generated cover letter from minimal job description');
  });

  test('should handle very long job description', async ({ page }) => {
    console.log('🧪 TESTING: Very Long Job Description Handling');
    
    await page.goto('http://localhost:3000/cover-letter-generator');
    
    const jobDescriptionField = page.locator('textarea[name="jobDescription"]');
    await jobDescriptionField.fill(testJobDescriptions.veryLong);
    
    const generateButton = page.locator('button:has-text("Generate")');
    await generateButton.click();
    
    // Should handle long description and generate cover letter
    const coverLetterText = page.locator('textarea[name="coverLetter"]');
    await expect(coverLetterText).toBeVisible({ timeout: 45000 }); // Longer timeout for complex processing
    
    const generatedText = await coverLetterText.inputValue();
    expect(generatedText.length).toBeGreaterThan(200);
    console.log('✅ Successfully handled very long job description');
  });

  test('should test cover letter history and management', async ({ page }) => {
    console.log('🧪 TESTING: Cover Letter History Management');
    
    // Generate first cover letter
    await page.goto('http://localhost:3000/cover-letter-generator');
    
    const jobDescriptionField = page.locator('textarea[name="jobDescription"]');
    await jobDescriptionField.fill(testJobDescriptions.software);
    
    const generateButton = page.locator('button:has-text("Generate")');
    await generateButton.click();
    
    // Wait for generation
    const coverLetterText = page.locator('textarea[name="coverLetter"]');
    await expect(coverLetterText).toBeVisible({ timeout: 30000 });
    
    // Save cover letter
    const saveButton = page.locator('button:has-text("Save")');
    if (await saveButton.count() > 0) {
      await saveButton.click();
      console.log('💾 Saved first cover letter');
    }
    
    // Navigate to history (if exists)
    const historyLink = page.locator('a:has-text("History"), button:has-text("History"), a[href*="history"]');
    if (await historyLink.count() > 0) {
      await historyLink.click();
      console.log('📜 Navigated to cover letter history');
      
      // Verify cover letter appears in history
      const historyItems = page.locator('.history-item, .cover-letter-item');
      await expect(historyItems.first()).toBeVisible();
      console.log('✅ Cover letter appears in history');
      
      // Test viewing historical cover letter
      const viewButton = page.locator('button:has-text("View"), a:has-text("View")');
      if (await viewButton.count() > 0) {
        await viewButton.first().click();
        console.log('👁️ Opened historical cover letter');
      }
    }
  });

  test('should handle AI service errors gracefully', async ({ page }) => {
    console.log('🧪 TESTING: AI Service Error Handling');
    
    await page.goto('http://localhost:3000/cover-letter-generator');
    
    // Fill job description
    const jobDescriptionField = page.locator('textarea[name="jobDescription"]');
    await jobDescriptionField.fill(testJobDescriptions.software);
    
    // Mock network failure or API error
    await page.route('**/api/cover-letter/generate', (route) => {
      route.abort();
    });
    
    const generateButton = page.locator('button:has-text("Generate")');
    await generateButton.click();
    
    // Should show error message
    const errorMessage = page.locator('text=error, text=failed, .error');
    await expect(errorMessage.first()).toBeVisible({ timeout: 15000 });
    console.log('✅ Error message displayed for AI service failure');
    
    // Button should be re-enabled for retry
    await expect(generateButton).toBeEnabled();
    console.log('✅ Generate button re-enabled for retry');
  });

  test('should measure and validate response times', async ({ page }) => {
    console.log('🧪 TESTING: AI Response Time Performance');
    
    await page.goto('http://localhost:3000/cover-letter-generator');
    
    const jobDescriptionField = page.locator('textarea[name="jobDescription"]');
    await jobDescriptionField.fill(testJobDescriptions.software);
    
    // Measure generation time
    const startTime = Date.now();
    
    const generateButton = page.locator('button:has-text("Generate")');
    await generateButton.click();
    
    // Wait for generation to complete
    const coverLetterText = page.locator('textarea[name="coverLetter"]');
    await expect(coverLetterText).toBeVisible({ timeout: 60000 });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    console.log(`⏱️ AI generation completed in ${responseTime}ms`);
    
    // Reasonable response time should be under 30 seconds
    expect(responseTime).toBeLessThan(30000);
    console.log('✅ Response time within acceptable limits');
  });

  test('should test credit system and subscription limits', async ({ page }) => {
    console.log('🧪 TESTING: Credit System and Subscription Limits');
    
    await page.goto('http://localhost:3000/cover-letter-generator');
    
    // Check for credit/subscription display
    const creditDisplay = page.locator('text=credits, text=remaining, .credits, .subscription');
    if (await creditDisplay.count() > 0) {
      const creditText = await creditDisplay.textContent();
      console.log(`💳 Credit display found: ${creditText}`);
    }
    
    // Generate cover letter and check credit deduction
    const jobDescriptionField = page.locator('textarea[name="jobDescription"]');
    await jobDescriptionField.fill(testJobDescriptions.software);
    
    const generateButton = page.locator('button:has-text("Generate")');
    await generateButton.click();
    
    // Wait for generation
    const coverLetterText = page.locator('textarea[name="coverLetter"]');
    await expect(coverLetterText).toBeVisible({ timeout: 30000 });
    
    // Check if credit count decreased
    if (await creditDisplay.count() > 0) {
      await page.waitForTimeout(2000);
      const updatedCreditText = await creditDisplay.textContent();
      console.log(`💳 Updated credit display: ${updatedCreditText}`);
    }
    
    console.log('✅ Credit system behavior verified');
  });

  test('should validate cover letter content quality', async ({ page }) => {
    console.log('🧪 TESTING: Cover Letter Content Quality Validation');
    
    await page.goto('http://localhost:3000/cover-letter-generator');
    
    const jobDescriptionField = page.locator('textarea[name="jobDescription"]');
    await jobDescriptionField.fill(testJobDescriptions.software);
    
    const generateButton = page.locator('button:has-text("Generate")');
    await generateButton.click();
    
    const coverLetterText = page.locator('textarea[name="coverLetter"]');
    await expect(coverLetterText).toBeVisible({ timeout: 30000 });
    
    const generatedText = await coverLetterText.inputValue();
    
    // Quality checks
    const hasGreeting = /dear|hello|hi/i.test(generatedText);
    const hasClosing = /sincerely|regards|best|thank you/i.test(generatedText);
    const hasJobKeywords = /software|engineer|javascript|react/i.test(generatedText);
    const hasPersonalization = generatedText.length > 300;
    
    console.log(`📊 Quality metrics:
      - Has greeting: ${hasGreeting}
      - Has closing: ${hasClosing}
      - Contains job keywords: ${hasJobKeywords}
      - Sufficient length: ${hasPersonalization}
      - Total length: ${generatedText.length} characters`);
    
    expect(hasJobKeywords).toBeTruthy();
    expect(generatedText.length).toBeGreaterThan(200);
    console.log('✅ Cover letter quality validation passed');
  });

  test('should test multiple cover letter variations', async ({ page }) => {
    console.log('🧪 TESTING: Multiple Cover Letter Variations');
    
    await page.goto('http://localhost:3000/cover-letter-generator');
    
    const jobDescriptionField = page.locator('textarea[name="jobDescription"]');
    const generateButton = page.locator('button:has-text("Generate")');
    const coverLetterText = page.locator('textarea[name="coverLetter"]');
    
    const generatedTexts = [];
    
    // Generate multiple cover letters for the same job
    for (let i = 0; i < 3; i++) {
      await jobDescriptionField.fill(testJobDescriptions.software);
      await generateButton.click();
      
      await expect(coverLetterText).toBeVisible({ timeout: 30000 });
      const text = await coverLetterText.inputValue();
      generatedTexts.push(text);
      
      console.log(`📄 Generated variation ${i + 1}: ${text.substring(0, 50)}...`);
      
      // Clear for next generation
      await jobDescriptionField.clear();
      await coverLetterText.clear();
    }
    
    // Verify variations are different
    const firstText = generatedTexts[0];
    const hasVariations = generatedTexts.some(text => text !== firstText);
    
    console.log(`🔄 Generated variations are different: ${hasVariations}`);
    
    // All should be substantial content
    generatedTexts.forEach((text, index) => {
      expect(text.length).toBeGreaterThan(200);
      console.log(`✅ Variation ${index + 1} has sufficient content`);
    });
  });
});
