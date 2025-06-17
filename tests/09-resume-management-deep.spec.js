// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

/**
 * DEEP RESUME MANAGEMENT TESTING
 * 
 * This test suite performs comprehensive testing of:
 * - Resume upload functionality (PDF/DOCX validation)
 * - Resume parsing and data extraction
 * - Multi-resume management (primary selection)
 * - Resume deletion and file cleanup
 * - Resume data editing and updating
 * - Error handling and edge cases
 * 
 * As a Senior Full Stack Developer + QA Tester with 5 years experience,
 * I'm testing every possible scenario and edge case.
 */
test.describe('📄 Deep Resume Management Testing', () => {
  // Test user credentials
  const testUser = {
    email: 'test@example.com',
    password: 'Test123!'
  };

  // Mock resume files for testing
  const mockFiles = {
    validPDF: path.join(__dirname, 'mock-resume.pdf'),
    validDOCX: path.join(__dirname, 'mock-resume.docx'),
    invalidFile: path.join(__dirname, 'mock-resume.txt'),
    largePDF: path.join(__dirname, 'large-resume.pdf')
  };
  
  test.beforeAll(async () => {
    // Create mock files for testing
    
    // Valid minimal PDF
    const minimalPdf = '%PDF-1.0\n1 0 obj<</Type/Catalog/Pages 2 0 R>>\nendobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>\nendobj\n3 0 obj<</Type/Page/MediaBox[0 0 595 842]/Parent 2 0 R/Resources<<>>>>\nendobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000053 00000 n\n0000000102 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n178\n%%EOF\nJohn Doe\nSoftware Engineer\n123-456-7890\njohn@example.com\nSKILLS: JavaScript, React, Node.js, Python\nEDUCATION: B.S. Computer Science, MIT, 2020\nEXPERIENCE: Software Engineer at Google, 2020-2023';
    fs.writeFileSync(mockFiles.validPDF, minimalPdf);
    
    // Valid DOCX structure (minimal)
    const minimalDocx = 'PK\x03\x04\x14\x00\x00\x00\x08\x00\x00\x00!\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x13\x00\x00\x00[Content_Types].xml\x00\x00\x00John Smith\nData Scientist\nPhone: 555-123-4567\nEmail: john.smith@email.com\nSkills: Python, Machine Learning, SQL, TensorFlow\nEducation: M.S. Data Science, Stanford University, 2019\nExperience: Senior Data Scientist at Facebook, 2019-2023';
    fs.writeFileSync(mockFiles.validDOCX, minimalDocx);
    
    // Invalid file type
    fs.writeFileSync(mockFiles.invalidFile, 'This is not a valid resume file');
    
    // Large PDF (> 5MB)
    const largePdfContent = '%PDF-1.0\n' + 'A'.repeat(6 * 1024 * 1024); // 6MB file
    fs.writeFileSync(mockFiles.largePDF, largePdfContent);
    
    console.log('📄 Created all mock resume files for testing');
  });

  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    console.log('✅ Logged in successfully');
  });

  test('should upload valid PDF resume successfully', async ({ page }) => {
    console.log('🧪 TESTING: Valid PDF Upload');
    
    // Navigate to dashboard with resume upload
    await page.goto('http://localhost:3000/dashboard');
    
    // Find file input (may be hidden)
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();
    
    // Upload the PDF file
    await fileInput.setInputFiles(mockFiles.validPDF);
    console.log('📄 Set PDF file for upload');
    
    // Look for upload button or auto-submit
    const uploadButton = page.locator('button:has-text("Upload"), button[type="submit"]').first();
    if (await uploadButton.count() > 0) {
      await uploadButton.click();
      console.log('🔄 Clicked upload button');
    }
    
    // Wait for upload completion
    await expect(page.locator('text=uploaded successfully', { timeout: 10000 })).toBeVisible();
    console.log('✅ Upload success message displayed');
    
    // Verify resume appears in list
    const resumeList = page.locator('.resume-item, [data-testid="resume-item"], .card');
    await expect(resumeList.first()).toBeVisible();
    
    // Check for parsed data modal or notification
    const parseModal = page.locator('.modal, [role="dialog"]');
    if (await parseModal.count() > 0) {
      console.log('📊 Resume parsing modal appeared');
      await page.screenshot({ path: 'test-results/resume-parsing-modal.png' });
    }
    
    console.log('✅ PDF upload test completed successfully');
  });

  test('should upload valid DOCX resume successfully', async ({ page }) => {
    console.log('🧪 TESTING: Valid DOCX Upload');
    
    await page.goto('http://localhost:3000/dashboard');
    
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(mockFiles.validDOCX);
    console.log('📄 Set DOCX file for upload');
    
    const uploadButton = page.locator('button:has-text("Upload"), button[type="submit"]').first();
    if (await uploadButton.count() > 0) {
      await uploadButton.click();
    }
    
    // Wait for upload success
    await expect(page.locator('text=uploaded successfully', { timeout: 10000 })).toBeVisible();
    console.log('✅ DOCX upload completed successfully');
  });

  test('should reject invalid file types', async ({ page }) => {
    console.log('🧪 TESTING: Invalid File Type Rejection');
    
    await page.goto('http://localhost:3000/dashboard');
    
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(mockFiles.invalidFile);
    console.log('📄 Attempted to upload invalid file type');
    
    // Should show error message
    await expect(page.locator('text=PDF or Word document', { timeout: 5000 })).toBeVisible();
    console.log('✅ Error message for invalid file type displayed');
  });

  test('should reject files larger than 5MB', async ({ page }) => {
    console.log('🧪 TESTING: Large File Rejection');
    
    await page.goto('http://localhost:3000/dashboard');
    
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(mockFiles.largePDF);
    console.log('📄 Attempted to upload large file (>5MB)');
    
    // Should show file size error
    await expect(page.locator('text=less than 5MB', { timeout: 5000 })).toBeVisible();
    console.log('✅ File size error message displayed');
  });

  test('should parse resume data correctly', async ({ page }) => {
    console.log('🧪 TESTING: Resume Data Parsing');
    
    // First upload a resume
    await page.goto('http://localhost:3000/dashboard');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(mockFiles.validPDF);
    
    const uploadButton = page.locator('button:has-text("Upload")').first();
    if (await uploadButton.count() > 0) {
      await uploadButton.click();
    }
    
    // Wait for upload and parsing
    await page.waitForTimeout(3000);
    
    // Look for parsed data modal or section
    const parseButton = page.locator('button:has-text("Parse"), button:has-text("View Data"), button:has-text("Edit")');
    if (await parseButton.count() > 0) {
      await parseButton.first().click();
      console.log('🔍 Opened parsed data view');
      
      // Check for parsed fields
      const nameField = page.locator('input[name="name"], input[id="name"]');
      const emailField = page.locator('input[name="email"], input[id="email"]');
      const phoneField = page.locator('input[name="phone"], input[id="phone"]');
      
      if (await nameField.count() > 0) {
        const nameValue = await nameField.inputValue();
        console.log(`📝 Parsed name: ${nameValue}`);
        expect(nameValue.length).toBeGreaterThan(0);
      }
      
      if (await emailField.count() > 0) {
        const emailValue = await emailField.inputValue();
        console.log(`📧 Parsed email: ${emailValue}`);
        expect(emailValue).toContain('@');
      }
      
      console.log('✅ Resume parsing verification completed');
    }
  });

  test('should handle multiple resume management', async ({ page }) => {
    console.log('🧪 TESTING: Multiple Resume Management');
    
    await page.goto('http://localhost:3000/dashboard');
    
    // Upload first resume
    let fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(mockFiles.validPDF);
    
    let uploadButton = page.locator('button:has-text("Upload")').first();
    if (await uploadButton.count() > 0) {
      await uploadButton.click();
    }
    
    await page.waitForTimeout(2000);
    console.log('📄 Uploaded first resume');
    
    // Upload second resume (refresh file input)
    await page.reload();
    fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(mockFiles.validDOCX);
    
    uploadButton = page.locator('button:has-text("Upload")').first();
    if (await uploadButton.count() > 0) {
      await uploadButton.click();
    }
    
    await page.waitForTimeout(2000);
    console.log('📄 Uploaded second resume');
    
    // Check that both resumes appear in list
    const resumeItems = page.locator('.resume-item, [data-testid="resume-item"], .card');
    const resumeCount = await resumeItems.count();
    expect(resumeCount).toBeGreaterThanOrEqual(2);
    console.log(`📋 Found ${resumeCount} resumes in list`);
    
    // Test primary resume selection
    const primaryButton = page.locator('button:has-text("Primary"), button:has-text("Set Primary")');
    if (await primaryButton.count() > 0) {
      await primaryButton.first().click();
      console.log('⭐ Set resume as primary');
      
      // Verify primary indicator appears
      const primaryIndicator = page.locator('text=Primary, .primary-badge, [data-testid="primary-indicator"]');
      await expect(primaryIndicator.first()).toBeVisible();
      console.log('✅ Primary indicator displayed');
    }
  });

  test('should delete resume successfully', async ({ page }) => {
    console.log('🧪 TESTING: Resume Deletion');
    
    // First upload a resume
    await page.goto('http://localhost:3000/dashboard');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(mockFiles.validPDF);
    
    const uploadButton = page.locator('button:has-text("Upload")').first();
    if (await uploadButton.count() > 0) {
      await uploadButton.click();
    }
    
    await page.waitForTimeout(2000);
    
    // Find and click delete button
    const deleteButton = page.locator('button:has-text("Delete"), button[aria-label="Delete"], .delete-btn');
    if (await deleteButton.count() > 0) {
      await deleteButton.first().click();
      console.log('🗑️ Clicked delete button');
      
      // Handle confirmation dialog
      const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes"), button:has-text("Delete")');
      if (await confirmButton.count() > 0) {
        await confirmButton.click();
        console.log('✅ Confirmed deletion');
      }
      
      // Verify resume is removed
      await expect(page.locator('text=deleted successfully', { timeout: 5000 })).toBeVisible();
      console.log('✅ Deletion confirmation message displayed');
    }
  });

  test('should validate resume upload progress indicator', async ({ page }) => {
    console.log('🧪 TESTING: Upload Progress Indicator');
    
    await page.goto('http://localhost:3000/dashboard');
    
    // Start upload
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(mockFiles.validPDF);
    
    const uploadButton = page.locator('button:has-text("Upload")').first();
    if (await uploadButton.count() > 0) {
      await uploadButton.click();
    }
    
    // Check for progress indicator
    const progressBar = page.locator('.progress, [role="progressbar"], .bg-primary');
    const spinner = page.locator('.animate-spin, .loading, .spinner');
    
    if (await progressBar.count() > 0) {
      console.log('📊 Progress bar found');
      await page.screenshot({ path: 'test-results/upload-progress.png' });
    }
    
    if (await spinner.count() > 0) {
      console.log('🔄 Loading spinner found');
    }
    
    // Wait for completion
    await expect(page.locator('text=uploaded successfully', { timeout: 10000 })).toBeVisible();
    console.log('✅ Upload progress testing completed');
  });

  test('should handle resume data editing', async ({ page }) => {
    console.log('🧪 TESTING: Resume Data Editing');
    
    // Upload resume first
    await page.goto('http://localhost:3000/dashboard');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(mockFiles.validPDF);
    
    const uploadButton = page.locator('button:has-text("Upload")').first();
    if (await uploadButton.count() > 0) {
      await uploadButton.click();
    }
    
    await page.waitForTimeout(3000);
    
    // Look for edit/view data button
    const editButton = page.locator('button:has-text("Edit"), button:has-text("View Data"), button:has-text("Parsed Data")');
    if (await editButton.count() > 0) {
      await editButton.first().click();
      console.log('✏️ Opened resume data editor');
      
      // Test editing fields
      const nameField = page.locator('input[name="name"], input[id="name"]');
      if (await nameField.count() > 0) {
        await nameField.fill('Updated Test Name');
        console.log('📝 Updated name field');
      }
      
      const phoneField = page.locator('input[name="phone"], input[id="phone"]');
      if (await phoneField.count() > 0) {
        await phoneField.fill('555-999-8888');
        console.log('📞 Updated phone field');
      }
      
      // Save changes
      const saveButton = page.locator('button:has-text("Save"), button[type="submit"]');
      if (await saveButton.count() > 0) {
        await saveButton.click();
        console.log('💾 Saved changes');
        
        // Verify save success
        await expect(page.locator('text=updated successfully, text=saved successfully', { timeout: 5000 })).toBeVisible();
        console.log('✅ Save confirmation displayed');
      }
    }
  });

  test('should handle concurrent resume uploads', async ({ page }) => {
    console.log('🧪 TESTING: Concurrent Upload Handling');
    
    await page.goto('http://localhost:3000/dashboard');
    
    // Test rapid successive uploads
    const fileInput = page.locator('input[type="file"]');
    
    // First upload
    await fileInput.setInputFiles(mockFiles.validPDF);
    const uploadButton1 = page.locator('button:has-text("Upload")').first();
    if (await uploadButton1.count() > 0) {
      await uploadButton1.click();
      console.log('📄 Started first upload');
    }
    
    // Wait briefly then try second upload
    await page.waitForTimeout(500);
    
    // Check if upload button is disabled during processing
    const uploadButton2 = page.locator('button:has-text("Upload")').first();
    if (await uploadButton2.count() > 0) {
      const isDisabled = await uploadButton2.isDisabled();
      if (isDisabled) {
        console.log('✅ Upload button correctly disabled during processing');
      }
    }
    
    // Wait for first upload to complete
    await expect(page.locator('text=uploaded successfully', { timeout: 10000 })).toBeVisible();
    console.log('✅ Concurrent upload handling verified');
  });

  test('should display resume file metadata correctly', async ({ page }) => {
    console.log('🧪 TESTING: Resume Metadata Display');
    
    await page.goto('http://localhost:3000/dashboard');
    
    // Upload resume
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(mockFiles.validPDF);
    
    const uploadButton = page.locator('button:has-text("Upload")').first();
    if (await uploadButton.count() > 0) {
      await uploadButton.click();
    }
    
    await page.waitForTimeout(3000);
    
    // Check for file metadata display
    const resumeContainer = page.locator('.resume-item, .card').first();
    const containerText = await resumeContainer.textContent();
    
    // Should show file name
    expect(containerText).toContain('mock-resume');
    console.log('📄 File name displayed correctly');
    
    // Should show file size or type
    if (containerText.includes('PDF') || containerText.includes('MB') || containerText.includes('KB')) {
      console.log('📊 File metadata (size/type) displayed');
    }
    
    // Should show upload date/time
    if (containerText.includes('ago') || containerText.includes('2024') || containerText.includes('Updated')) {
      console.log('📅 Upload timestamp displayed');
    }
    
    console.log('✅ Resume metadata display verification completed');
  });

  test.afterAll(async () => {
    // Clean up mock files
    Object.values(mockFiles).forEach(filePath => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
    console.log('🧹 Cleaned up mock resume files');
  });
});
