# Test info

- Name: 📄 Deep Resume Management Testing >> should upload valid DOCX resume successfully
- Location: C:\Users\POOJA\OneDrive\Documents\AutoApplyPro\tests\09-resume-management-deep.spec.js:105:3

# Error details

```
Error: locator.setInputFiles: Test timeout of 60000ms exceeded.
Call log:
  - waiting for locator('input[type="file"]')

    at C:\Users\POOJA\OneDrive\Documents\AutoApplyPro\tests\09-resume-management-deep.spec.js:111:5
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
   11 |  * - Resume parsing and data extraction
   12 |  * - Multi-resume management (primary selection)
   13 |  * - Resume deletion and file cleanup
   14 |  * - Resume data editing and updating
   15 |  * - Error handling and edge cases
   16 |  * 
   17 |  * As a Senior Full Stack Developer + QA Tester with 5 years experience,
   18 |  * I'm testing every possible scenario and edge case.
   19 |  */
   20 | test.describe('📄 Deep Resume Management Testing', () => {
   21 |   // Test user credentials
   22 |   const testUser = {
   23 |     email: 'test@example.com',
   24 |     password: 'Test123!'
   25 |   };
   26 |
   27 |   // Mock resume files for testing
   28 |   const mockFiles = {
   29 |     validPDF: path.join(__dirname, 'mock-resume.pdf'),
   30 |     validDOCX: path.join(__dirname, 'mock-resume.docx'),
   31 |     invalidFile: path.join(__dirname, 'mock-resume.txt'),
   32 |     largePDF: path.join(__dirname, 'large-resume.pdf')
   33 |   };
   34 |   
   35 |   test.beforeAll(async () => {
   36 |     // Create mock files for testing
   37 |     
   38 |     // Valid minimal PDF
   39 |     const minimalPdf = '%PDF-1.0\n1 0 obj<</Type/Catalog/Pages 2 0 R>>\nendobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>\nendobj\n3 0 obj<</Type/Page/MediaBox[0 0 595 842]/Parent 2 0 R/Resources<<>>>>\nendobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000053 00000 n\n0000000102 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n178\n%%EOF\nJohn Doe\nSoftware Engineer\n123-456-7890\njohn@example.com\nSKILLS: JavaScript, React, Node.js, Python\nEDUCATION: B.S. Computer Science, MIT, 2020\nEXPERIENCE: Software Engineer at Google, 2020-2023';
   40 |     fs.writeFileSync(mockFiles.validPDF, minimalPdf);
   41 |     
   42 |     // Valid DOCX structure (minimal)
   43 |     const minimalDocx = 'PK\x03\x04\x14\x00\x00\x00\x08\x00\x00\x00!\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x13\x00\x00\x00[Content_Types].xml\x00\x00\x00John Smith\nData Scientist\nPhone: 555-123-4567\nEmail: john.smith@email.com\nSkills: Python, Machine Learning, SQL, TensorFlow\nEducation: M.S. Data Science, Stanford University, 2019\nExperience: Senior Data Scientist at Facebook, 2019-2023';
   44 |     fs.writeFileSync(mockFiles.validDOCX, minimalDocx);
   45 |     
   46 |     // Invalid file type
   47 |     fs.writeFileSync(mockFiles.invalidFile, 'This is not a valid resume file');
   48 |     
   49 |     // Large PDF (> 5MB)
   50 |     const largePdfContent = '%PDF-1.0\n' + 'A'.repeat(6 * 1024 * 1024); // 6MB file
   51 |     fs.writeFileSync(mockFiles.largePDF, largePdfContent);
   52 |     
   53 |     console.log('📄 Created all mock resume files for testing');
   54 |   });
   55 |
   56 |   test.beforeEach(async ({ page }) => {
   57 |     // Login before each test
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
> 111 |     await fileInput.setInputFiles(mockFiles.validDOCX);
      |     ^ Error: locator.setInputFiles: Test timeout of 60000ms exceeded.
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
```