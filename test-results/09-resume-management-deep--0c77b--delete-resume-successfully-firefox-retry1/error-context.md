# Test info

- Name: 📄 Deep Resume Management Testing >> should delete resume successfully
- Location: C:\Users\POOJA\OneDrive\Documents\AutoApplyPro\tests\09-resume-management-deep.spec.js:244:3

# Error details

```
Error: locator.setInputFiles: Test timeout of 60000ms exceeded.
Call log:
  - waiting for locator('input[type="file"]')

    at C:\Users\POOJA\OneDrive\Documents\AutoApplyPro\tests\09-resume-management-deep.spec.js:250:5
```

# Page snapshot

```yaml
- navigation:
  - link "Auto Apply Pro":
    - /url: /
  - link "Go to homepage":
    - /url: /
    - text: Home
  - link "Sign in to your account":
    - /url: /login
    - text: Login
  - link "Create a new account":
    - /url: /register
    - text: Register
- main:
  - heading "Login to Your Account" [level=1]
  - text: Email Address
  - textbox "Email Address"
  - text: Password
  - textbox "Password"
  - button "Login"
  - paragraph:
    - text: Don't have an account?
    - link "Register here":
      - /url: /register
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
  150 |   });
  151 |
  152 |   test('should parse resume data correctly', async ({ page }) => {
  153 |     console.log('🧪 TESTING: Resume Data Parsing');
  154 |     
  155 |     // First upload a resume
  156 |     await page.goto('http://localhost:3000/dashboard');
  157 |     const fileInput = page.locator('input[type="file"]');
  158 |     await fileInput.setInputFiles(mockFiles.validPDF);
  159 |     
  160 |     const uploadButton = page.locator('button:has-text("Upload")').first();
  161 |     if (await uploadButton.count() > 0) {
  162 |       await uploadButton.click();
  163 |     }
  164 |     
  165 |     // Wait for upload and parsing
  166 |     await page.waitForTimeout(3000);
  167 |     
  168 |     // Look for parsed data modal or section
  169 |     const parseButton = page.locator('button:has-text("Parse"), button:has-text("View Data"), button:has-text("Edit")');
  170 |     if (await parseButton.count() > 0) {
  171 |       await parseButton.first().click();
  172 |       console.log('🔍 Opened parsed data view');
  173 |       
  174 |       // Check for parsed fields
  175 |       const nameField = page.locator('input[name="name"], input[id="name"]');
  176 |       const emailField = page.locator('input[name="email"], input[id="email"]');
  177 |       const phoneField = page.locator('input[name="phone"], input[id="phone"]');
  178 |       
  179 |       if (await nameField.count() > 0) {
  180 |         const nameValue = await nameField.inputValue();
  181 |         console.log(`📝 Parsed name: ${nameValue}`);
  182 |         expect(nameValue.length).toBeGreaterThan(0);
  183 |       }
  184 |       
  185 |       if (await emailField.count() > 0) {
  186 |         const emailValue = await emailField.inputValue();
  187 |         console.log(`📧 Parsed email: ${emailValue}`);
  188 |         expect(emailValue).toContain('@');
  189 |       }
  190 |       
  191 |       console.log('✅ Resume parsing verification completed');
  192 |     }
  193 |   });
  194 |
  195 |   test('should handle multiple resume management', async ({ page }) => {
  196 |     console.log('🧪 TESTING: Multiple Resume Management');
  197 |     
  198 |     await page.goto('http://localhost:3000/dashboard');
  199 |     
  200 |     // Upload first resume
  201 |     let fileInput = page.locator('input[type="file"]');
  202 |     await fileInput.setInputFiles(mockFiles.validPDF);
  203 |     
  204 |     let uploadButton = page.locator('button:has-text("Upload")').first();
  205 |     if (await uploadButton.count() > 0) {
  206 |       await uploadButton.click();
  207 |     }
  208 |     
  209 |     await page.waitForTimeout(2000);
  210 |     console.log('📄 Uploaded first resume');
  211 |     
  212 |     // Upload second resume (refresh file input)
  213 |     await page.reload();
  214 |     fileInput = page.locator('input[type="file"]');
  215 |     await fileInput.setInputFiles(mockFiles.validDOCX);
  216 |     
  217 |     uploadButton = page.locator('button:has-text("Upload")').first();
  218 |     if (await uploadButton.count() > 0) {
  219 |       await uploadButton.click();
  220 |     }
  221 |     
  222 |     await page.waitForTimeout(2000);
  223 |     console.log('📄 Uploaded second resume');
  224 |     
  225 |     // Check that both resumes appear in list
  226 |     const resumeItems = page.locator('.resume-item, [data-testid="resume-item"], .card');
  227 |     const resumeCount = await resumeItems.count();
  228 |     expect(resumeCount).toBeGreaterThanOrEqual(2);
  229 |     console.log(`📋 Found ${resumeCount} resumes in list`);
  230 |     
  231 |     // Test primary resume selection
  232 |     const primaryButton = page.locator('button:has-text("Primary"), button:has-text("Set Primary")');
  233 |     if (await primaryButton.count() > 0) {
  234 |       await primaryButton.first().click();
  235 |       console.log('⭐ Set resume as primary');
  236 |       
  237 |       // Verify primary indicator appears
  238 |       const primaryIndicator = page.locator('text=Primary, .primary-badge, [data-testid="primary-indicator"]');
  239 |       await expect(primaryIndicator.first()).toBeVisible();
  240 |       console.log('✅ Primary indicator displayed');
  241 |     }
  242 |   });
  243 |
  244 |   test('should delete resume successfully', async ({ page }) => {
  245 |     console.log('🧪 TESTING: Resume Deletion');
  246 |     
  247 |     // First upload a resume
  248 |     await page.goto('http://localhost:3000/dashboard');
  249 |     const fileInput = page.locator('input[type="file"]');
> 250 |     await fileInput.setInputFiles(mockFiles.validPDF);
      |     ^ Error: locator.setInputFiles: Test timeout of 60000ms exceeded.
  251 |     
  252 |     const uploadButton = page.locator('button:has-text("Upload")').first();
  253 |     if (await uploadButton.count() > 0) {
  254 |       await uploadButton.click();
  255 |     }
  256 |     
  257 |     await page.waitForTimeout(2000);
  258 |     
  259 |     // Find and click delete button
  260 |     const deleteButton = page.locator('button:has-text("Delete"), button[aria-label="Delete"], .delete-btn');
  261 |     if (await deleteButton.count() > 0) {
  262 |       await deleteButton.first().click();
  263 |       console.log('🗑️ Clicked delete button');
  264 |       
  265 |       // Handle confirmation dialog
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
```