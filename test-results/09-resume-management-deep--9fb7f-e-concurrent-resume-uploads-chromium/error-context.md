# Test info

- Name: 📄 Deep Resume Management Testing >> should handle concurrent resume uploads
- Location: C:\Users\POOJA\OneDrive\Documents\AutoApplyPro\tests\09-resume-management-deep.spec.js:357:3

# Error details

```
Error: locator.setInputFiles: Test timeout of 60000ms exceeded.
Call log:
  - waiting for locator('input[type="file"]')

    at C:\Users\POOJA\OneDrive\Documents\AutoApplyPro\tests\09-resume-management-deep.spec.js:366:5
```

# Page snapshot

```yaml
- navigation:
  - link "Auto Apply Pro":
    - /url: /
  - link "Go to homepage":
    - /url: /
    - text: Home
  - link "View your dashboard":
    - /url: /dashboard
    - text: Dashboard
  - link "View your application history":
    - /url: /history
    - text: History
  - link "Track your job applications":
    - /url: /job-tracker
    - text: Job Tracker
  - link "Build and manage your resumes":
    - /url: /resumes
    - text: Resume Builder
  - text: AI Tools Free - 0 credits left
  - button "See what's new":
    - img
  - button "Sign out of your account": Logout
- main:
  - heading "Dashboard" [level=1]
  - button "Profile"
  - button "Resumes"
  - img
  - heading "AutoApply Pro Extension Not Detected" [level=3]
  - paragraph: The AutoApply Pro Chrome extension is not installed. Install it to autofill job applications with your profile data.
  - link "Download Extension":
    - /url: /autoapply-extension.zip
    - img
    - text: Download Extension
  - button "Installation Instructions":
    - img
    - text: Installation Instructions
  - heading "Resume Builder" [level=2]:
    - img
    - text: Resume Builder
  - img
  - heading "No resumes yet" [level=3]
  - paragraph: Create your first resume to tailor for job applications
  - button "Create Resume":
    - img
    - text: Create Resume
  - heading "Your Profile" [level=2]
  - text: Full Name
  - textbox "Full Name": Test User
  - text: Email Address
  - textbox "Email Address": test@example.com
  - button "Update Profile"
  - img
  - heading "No resume uploaded" [level=3]
  - paragraph: You haven't uploaded a resume yet. Upload your resume to use the auto-fill feature.
  - button "Upload Resume"
- contentinfo:
  - link "Auto Apply Pro":
    - /url: /
  - paragraph: Simplify your job application process with automated form filling based on your resume data.
  - heading "Quick Links" [level=3]
  - list:
    - listitem:
      - link "Home":
        - /url: /
    - listitem:
      - link "Dashboard":
        - /url: /dashboard
    - listitem:
      - link "Application History":
        - /url: /history
  - heading "Contact" [level=3]
  - paragraph:
    - text: Have questions or feedback?
    - link "support@autoapplypro.com":
      - /url: mailto:support@autoapplypro.com
  - paragraph: © 2025 AutoApply Pro. All rights reserved.
  - paragraph: v1.3.5
- button "Share your feedback":
  - img
```

# Test source

```ts
  266 |       const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes"), button:has-text("Delete")');
  267 |       if (await confirmButton.count() > 0) {
  268 |         await confirmButton.click();
  269 |         console.log('✅ Confirmed deletion');
  270 |       }
  271 |       
  272 |       // Verify resume is removed
  273 |       await expect(page.locator('text=deleted successfully', { timeout: 5000 })).toBeVisible();
  274 |       console.log('✅ Deletion confirmation message displayed');
  275 |     }
  276 |   });
  277 |
  278 |   test('should validate resume upload progress indicator', async ({ page }) => {
  279 |     console.log('🧪 TESTING: Upload Progress Indicator');
  280 |     
  281 |     await page.goto('http://localhost:3000/dashboard');
  282 |     
  283 |     // Start upload
  284 |     const fileInput = page.locator('input[type="file"]');
  285 |     await fileInput.setInputFiles(mockFiles.validPDF);
  286 |     
  287 |     const uploadButton = page.locator('button:has-text("Upload")').first();
  288 |     if (await uploadButton.count() > 0) {
  289 |       await uploadButton.click();
  290 |     }
  291 |     
  292 |     // Check for progress indicator
  293 |     const progressBar = page.locator('.progress, [role="progressbar"], .bg-primary');
  294 |     const spinner = page.locator('.animate-spin, .loading, .spinner');
  295 |     
  296 |     if (await progressBar.count() > 0) {
  297 |       console.log('📊 Progress bar found');
  298 |       await page.screenshot({ path: 'test-results/upload-progress.png' });
  299 |     }
  300 |     
  301 |     if (await spinner.count() > 0) {
  302 |       console.log('🔄 Loading spinner found');
  303 |     }
  304 |     
  305 |     // Wait for completion
  306 |     await expect(page.locator('text=uploaded successfully', { timeout: 10000 })).toBeVisible();
  307 |     console.log('✅ Upload progress testing completed');
  308 |   });
  309 |
  310 |   test('should handle resume data editing', async ({ page }) => {
  311 |     console.log('🧪 TESTING: Resume Data Editing');
  312 |     
  313 |     // Upload resume first
  314 |     await page.goto('http://localhost:3000/dashboard');
  315 |     const fileInput = page.locator('input[type="file"]');
  316 |     await fileInput.setInputFiles(mockFiles.validPDF);
  317 |     
  318 |     const uploadButton = page.locator('button:has-text("Upload")').first();
  319 |     if (await uploadButton.count() > 0) {
  320 |       await uploadButton.click();
  321 |     }
  322 |     
  323 |     await page.waitForTimeout(3000);
  324 |     
  325 |     // Look for edit/view data button
  326 |     const editButton = page.locator('button:has-text("Edit"), button:has-text("View Data"), button:has-text("Parsed Data")');
  327 |     if (await editButton.count() > 0) {
  328 |       await editButton.first().click();
  329 |       console.log('✏️ Opened resume data editor');
  330 |       
  331 |       // Test editing fields
  332 |       const nameField = page.locator('input[name="name"], input[id="name"]');
  333 |       if (await nameField.count() > 0) {
  334 |         await nameField.fill('Updated Test Name');
  335 |         console.log('📝 Updated name field');
  336 |       }
  337 |       
  338 |       const phoneField = page.locator('input[name="phone"], input[id="phone"]');
  339 |       if (await phoneField.count() > 0) {
  340 |         await phoneField.fill('555-999-8888');
  341 |         console.log('📞 Updated phone field');
  342 |       }
  343 |       
  344 |       // Save changes
  345 |       const saveButton = page.locator('button:has-text("Save"), button[type="submit"]');
  346 |       if (await saveButton.count() > 0) {
  347 |         await saveButton.click();
  348 |         console.log('💾 Saved changes');
  349 |         
  350 |         // Verify save success
  351 |         await expect(page.locator('text=updated successfully, text=saved successfully', { timeout: 5000 })).toBeVisible();
  352 |         console.log('✅ Save confirmation displayed');
  353 |       }
  354 |     }
  355 |   });
  356 |
  357 |   test('should handle concurrent resume uploads', async ({ page }) => {
  358 |     console.log('🧪 TESTING: Concurrent Upload Handling');
  359 |     
  360 |     await page.goto('http://localhost:3000/dashboard');
  361 |     
  362 |     // Test rapid successive uploads
  363 |     const fileInput = page.locator('input[type="file"]');
  364 |     
  365 |     // First upload
> 366 |     await fileInput.setInputFiles(mockFiles.validPDF);
      |     ^ Error: locator.setInputFiles: Test timeout of 60000ms exceeded.
  367 |     const uploadButton1 = page.locator('button:has-text("Upload")').first();
  368 |     if (await uploadButton1.count() > 0) {
  369 |       await uploadButton1.click();
  370 |       console.log('📄 Started first upload');
  371 |     }
  372 |     
  373 |     // Wait briefly then try second upload
  374 |     await page.waitForTimeout(500);
  375 |     
  376 |     // Check if upload button is disabled during processing
  377 |     const uploadButton2 = page.locator('button:has-text("Upload")').first();
  378 |     if (await uploadButton2.count() > 0) {
  379 |       const isDisabled = await uploadButton2.isDisabled();
  380 |       if (isDisabled) {
  381 |         console.log('✅ Upload button correctly disabled during processing');
  382 |       }
  383 |     }
  384 |     
  385 |     // Wait for first upload to complete
  386 |     await expect(page.locator('text=uploaded successfully', { timeout: 10000 })).toBeVisible();
  387 |     console.log('✅ Concurrent upload handling verified');
  388 |   });
  389 |
  390 |   test('should display resume file metadata correctly', async ({ page }) => {
  391 |     console.log('🧪 TESTING: Resume Metadata Display');
  392 |     
  393 |     await page.goto('http://localhost:3000/dashboard');
  394 |     
  395 |     // Upload resume
  396 |     const fileInput = page.locator('input[type="file"]');
  397 |     await fileInput.setInputFiles(mockFiles.validPDF);
  398 |     
  399 |     const uploadButton = page.locator('button:has-text("Upload")').first();
  400 |     if (await uploadButton.count() > 0) {
  401 |       await uploadButton.click();
  402 |     }
  403 |     
  404 |     await page.waitForTimeout(3000);
  405 |     
  406 |     // Check for file metadata display
  407 |     const resumeContainer = page.locator('.resume-item, .card').first();
  408 |     const containerText = await resumeContainer.textContent();
  409 |     
  410 |     // Should show file name
  411 |     expect(containerText).toContain('mock-resume');
  412 |     console.log('📄 File name displayed correctly');
  413 |     
  414 |     // Should show file size or type
  415 |     if (containerText.includes('PDF') || containerText.includes('MB') || containerText.includes('KB')) {
  416 |       console.log('📊 File metadata (size/type) displayed');
  417 |     }
  418 |     
  419 |     // Should show upload date/time
  420 |     if (containerText.includes('ago') || containerText.includes('2024') || containerText.includes('Updated')) {
  421 |       console.log('📅 Upload timestamp displayed');
  422 |     }
  423 |     
  424 |     console.log('✅ Resume metadata display verification completed');
  425 |   });
  426 |
  427 |   test.afterAll(async () => {
  428 |     // Clean up mock files
  429 |     Object.values(mockFiles).forEach(filePath => {
  430 |       if (fs.existsSync(filePath)) {
  431 |         fs.unlinkSync(filePath);
  432 |       }
  433 |     });
  434 |     console.log('🧹 Cleaned up mock resume files');
  435 |   });
  436 | });
  437 |
```