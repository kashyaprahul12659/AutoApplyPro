# Test info

- Name: 📄 Deep Resume Management Testing >> should parse resume data correctly
- Location: C:\Users\POOJA\OneDrive\Documents\AutoApplyPro\tests\09-resume-management-deep.spec.js:152:3

# Error details

```
Error: locator.setInputFiles: Target page, context or browser has been closed
Call log:
  - waiting for locator('input[type="file"]')

    at C:\Users\POOJA\OneDrive\Documents\AutoApplyPro\tests\09-resume-management-deep.spec.js:158:5
```

# Test source

```ts
   58 |     await page.goto('http://localhost:3000/login');
   59 |     await page.fill('input[name="email"]', testUser.email);
   60 |     await page.fill('input[name="password"]', testUser.password);
   61 |     await page.click('button[type="submit"]');
   62 |     await page.waitForURL('**/dashboard');
   63 |     console.log('✅ Logged in successfully');
   64 |   });
   65 |
   66 |   test('should upload valid PDF resume successfully', async ({ page }) => {
   67 |     console.log('🧪 TESTING: Valid PDF Upload');
   68 |     
   69 |     // Navigate to dashboard with resume upload
   70 |     await page.goto('http://localhost:3000/dashboard');
   71 |     
   72 |     // Find file input (may be hidden)
   73 |     const fileInput = page.locator('input[type="file"]');
   74 |     await expect(fileInput).toBeAttached();
   75 |     
   76 |     // Upload the PDF file
   77 |     await fileInput.setInputFiles(mockFiles.validPDF);
   78 |     console.log('📄 Set PDF file for upload');
   79 |     
   80 |     // Look for upload button or auto-submit
   81 |     const uploadButton = page.locator('button:has-text("Upload"), button[type="submit"]').first();
   82 |     if (await uploadButton.count() > 0) {
   83 |       await uploadButton.click();
   84 |       console.log('🔄 Clicked upload button');
   85 |     }
   86 |     
   87 |     // Wait for upload completion
   88 |     await expect(page.locator('text=uploaded successfully', { timeout: 10000 })).toBeVisible();
   89 |     console.log('✅ Upload success message displayed');
   90 |     
   91 |     // Verify resume appears in list
   92 |     const resumeList = page.locator('.resume-item, [data-testid="resume-item"], .card');
   93 |     await expect(resumeList.first()).toBeVisible();
   94 |     
   95 |     // Check for parsed data modal or notification
   96 |     const parseModal = page.locator('.modal, [role="dialog"]');
   97 |     if (await parseModal.count() > 0) {
   98 |       console.log('📊 Resume parsing modal appeared');
   99 |       await page.screenshot({ path: 'test-results/resume-parsing-modal.png' });
  100 |     }
  101 |     
  102 |     console.log('✅ PDF upload test completed successfully');
  103 |   });
  104 |
  105 |   test('should upload valid DOCX resume successfully', async ({ page }) => {
  106 |     console.log('🧪 TESTING: Valid DOCX Upload');
  107 |     
  108 |     await page.goto('http://localhost:3000/dashboard');
  109 |     
  110 |     const fileInput = page.locator('input[type="file"]');
  111 |     await fileInput.setInputFiles(mockFiles.validDOCX);
  112 |     console.log('📄 Set DOCX file for upload');
  113 |     
  114 |     const uploadButton = page.locator('button:has-text("Upload"), button[type="submit"]').first();
  115 |     if (await uploadButton.count() > 0) {
  116 |       await uploadButton.click();
  117 |     }
  118 |     
  119 |     // Wait for upload success
  120 |     await expect(page.locator('text=uploaded successfully', { timeout: 10000 })).toBeVisible();
  121 |     console.log('✅ DOCX upload completed successfully');
  122 |   });
  123 |
  124 |   test('should reject invalid file types', async ({ page }) => {
  125 |     console.log('🧪 TESTING: Invalid File Type Rejection');
  126 |     
  127 |     await page.goto('http://localhost:3000/dashboard');
  128 |     
  129 |     const fileInput = page.locator('input[type="file"]');
  130 |     await fileInput.setInputFiles(mockFiles.invalidFile);
  131 |     console.log('📄 Attempted to upload invalid file type');
  132 |     
  133 |     // Should show error message
  134 |     await expect(page.locator('text=PDF or Word document', { timeout: 5000 })).toBeVisible();
  135 |     console.log('✅ Error message for invalid file type displayed');
  136 |   });
  137 |
  138 |   test('should reject files larger than 5MB', async ({ page }) => {
  139 |     console.log('🧪 TESTING: Large File Rejection');
  140 |     
  141 |     await page.goto('http://localhost:3000/dashboard');
  142 |     
  143 |     const fileInput = page.locator('input[type="file"]');
  144 |     await fileInput.setInputFiles(mockFiles.largePDF);
  145 |     console.log('📄 Attempted to upload large file (>5MB)');
  146 |     
  147 |     // Should show file size error
  148 |     await expect(page.locator('text=less than 5MB', { timeout: 5000 })).toBeVisible();
  149 |     console.log('✅ File size error message displayed');
  150 |   });
  151 |
  152 |   test('should parse resume data correctly', async ({ page }) => {
  153 |     console.log('🧪 TESTING: Resume Data Parsing');
  154 |     
  155 |     // First upload a resume
  156 |     await page.goto('http://localhost:3000/dashboard');
  157 |     const fileInput = page.locator('input[type="file"]');
> 158 |     await fileInput.setInputFiles(mockFiles.validPDF);
      |     ^ Error: locator.setInputFiles: Target page, context or browser has been closed
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
  250 |     await fileInput.setInputFiles(mockFiles.validPDF);
  251 |     
  252 |     const uploadButton = page.locator('button:has-text("Upload")').first();
  253 |     if (await uploadButton.count() > 0) {
  254 |       await uploadButton.click();
  255 |     }
  256 |     
  257 |     await page.waitForTimeout(2000);
  258 |     
```