# Test info

- Name: 📄 Deep Resume Management Testing >> should handle multiple resume management
- Location: C:\Users\POOJA\OneDrive\Documents\AutoApplyPro\tests\09-resume-management-deep.spec.js:195:3

# Error details

```
Error: locator.setInputFiles: Test timeout of 60000ms exceeded.
Call log:
  - waiting for locator('input[type="file"]')

    at C:\Users\POOJA\OneDrive\Documents\AutoApplyPro\tests\09-resume-management-deep.spec.js:202:5
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
  - textbox "Resume Title": My Resume
  - button "Save Resume":
    - img
    - text: Save Resume
  - button "Export PDF":
    - img
    - text: Export PDF
  - heading "Target Role (Optional)" [level=3]
  - textbox "e.g. Software Engineer, Product Manager"
  - paragraph: Providing a target role helps AI tailor content specifically to that position
  - heading "Resume Sections" [level=3]
  - heading "summary" [level=4]
  - button "↑"
  - button "↓"
  - button "Remove Section":
    - img
  - textbox "Write a professional summary that highlights your qualifications, experience, and career goals...": kkkkkkkkkkkkkkk
  - button "Improve with AI":
    - img
    - text: Improve with AI
  - paragraph: "Tips:"
  - list:
    - listitem: Keep your summary concise (3-5 sentences)
    - listitem: Focus on your most relevant skills and experiences
    - listitem: Tailor it to your target role
    - listitem: Include quantifiable achievements when possible
  - heading "skills" [level=4]
  - button "↑"
  - button "↓"
  - button "Remove Section":
    - img
  - text: Add your skills below
  - textbox "Add a skill..."
  - button:
    - img
  - button "Suggest skills based on Job Description":
    - img
    - text: Suggest skills based on Job Description
  - paragraph: "Tips:"
  - list:
    - listitem: Include a mix of technical and soft skills
    - listitem: Add industry-specific skills relevant to your target role
    - listitem: List skills in order of relevance or proficiency
  - heading "experience" [level=4]
  - button "↑"
  - button "↓"
  - button "Remove Section":
    - img
  - text: No work experience added yet
  - button "Add Experience":
    - img
    - text: Add Experience
  - paragraph: "Tips:"
  - list:
    - listitem: Start with your most recent experience
    - listitem: Use bullet points and action verbs
    - listitem: Include measurable achievements and results
    - listitem: Focus on responsibilities relevant to your target role
  - heading "education" [level=4]
  - button "↑"
  - button "↓"
  - button "Remove Section":
    - img
  - text: No education added yet
  - button "Add Education":
    - img
    - text: Add Education
  - paragraph: "Tips:"
  - list:
    - listitem: List your most recent or highest education first
    - listitem: Include relevant coursework if it relates to your target role
    - listitem: Only include GPA if it's impressive (typically 3.5+)
    - listitem: Consider including honors, scholarships, or relevant extracurricular activities
  - heading "project" [level=4]
  - button "↑"
  - button "↓"
  - button "Remove Section":
    - img
  - text: No projects added yet
  - button "Add Project":
    - img
    - text: Add Project
  - paragraph: "Tips:"
  - list:
    - listitem: Focus on projects relevant to your target role
    - listitem: Highlight your technical skills and problem-solving abilities
    - listitem: Quantify results and impact when possible
    - listitem: Include links to GitHub repositories or live demos when available
  - heading "certification" [level=4]
  - button "↑"
  - button "↓"
  - button "Remove Section":
    - img
  - text: No certifications added yet
  - button "Add Certification":
    - img
    - text: Add Certification
  - paragraph: "Tips:"
  - list:
    - listitem: Include certifications relevant to your target role
    - listitem: List your most prestigious or in-demand certifications first
    - listitem: Add credential URLs when available for verification
    - listitem: Include expiration dates if the certification requires renewal
  - heading "Add Sections" [level=3]
  - button "summary (Added)" [disabled]
  - button "skills (Added)" [disabled]
  - button "experience (Added)" [disabled]
  - button "education (Added)" [disabled]
  - button "project (Added)" [disabled]
  - button "certification (Added)" [disabled]
  - heading "Resume Preview" [level=3]
  - heading "John Doe" [level=1]
  - text: San Francisco, CA|(555) 123-4567|johndoe@example.com
  - heading "Professional Summary" [level=2]
  - paragraph: kkkkkkkkkkkkkkk
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
- img
- text: Please add some content to improve
- button "close"
- progressbar "notification timer"
- img
- text: Please add some content to improve
- button "close"
- progressbar "notification timer"
```

# Test source

```ts
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
> 202 |     await fileInput.setInputFiles(mockFiles.validPDF);
      |     ^ Error: locator.setInputFiles: Test timeout of 60000ms exceeded.
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
```