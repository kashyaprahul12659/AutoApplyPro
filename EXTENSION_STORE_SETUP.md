# AutoApply Pro Chrome Extension - Store Submission Guide

This document provides instructions for submitting the AutoApply Pro Chrome Extension to the Chrome Web Store.

## Store Metadata

### Basic Information

| Field | Content |
|-------|---------|
| **Extension Name** | AutoApply Pro |
| **Short Name** | AutoApply |
| **Summary** | Apply to jobs 10x faster with smart auto-filling, AI cover letters, and resume-job matching. |
| **Extension Type** | Productivity |
| **Category** | Productivity |
| **Language** | English |

### Detailed Description

```
AutoApply Pro streamlines your job application process, helping you apply to more jobs in less time.

FEATURES:
• Smart Form Auto-Fill: Automatically fill job applications using your stored resume data
• AI Cover Letter Generator: Create customized cover letters for each job in seconds
• JD Skill Analyzer: Compare your resume against job descriptions to see skill matches
• Application History: Track all your job applications in one place

HOW IT WORKS:
1. Create a free account and upload your resume
2. Install the Chrome Extension
3. Navigate to any job application form
4. Click the AutoApply icon and watch as the extension fills in fields automatically
5. Generate custom cover letters for each application
6. Analyze job descriptions to improve your match rate

PRIVACY & SECURITY:
• Your data is securely stored and never sold
• Extension only activates when you click the button
• No passive tracking or data collection

Try the FREE plan with 3 AI-powered cover letters, or upgrade to PRO for unlimited access to all features.
```

## Store Assets

### Screenshots (1280x800)

Prepare at least 3 screenshots showcasing:
1. Form auto-filling in action
2. Cover letter generation
3. JD analysis with match score

Save these screenshots in PNG format in `autoapply-extension/screenshots/`.

### Promotional Images

| Asset | Dimensions | Location |
|-------|------------|----------|
| Small Promo Tile | 440x280 | `autoapply-extension/promo/small.png` |
| Large Promo Tile | 920x680 | `autoapply-extension/promo/large.png` |
| Marquee Promo Tile | 1400x560 | `autoapply-extension/promo/marquee.png` |

## Submission Instructions

### 1. Generate Icons

The extension needs icons in multiple sizes:
- 16x16 px
- 48x48 px
- 128x128 px

These should be placed in the `icons` folder. For best results:
- Use a simple, recognizable design
- Include appropriate padding
- Ensure they look good on both light and dark backgrounds

### 2. Package the Extension

Run the packaging script to create a ZIP file:

```bash
cd autoapply-extension
npm install  # If you haven't already
node package-extension.js
```

This will create `autoapply-extension.zip` in the `frontend/public` directory.

### 3. Upload to Chrome Web Store

1. Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. Sign in with your Google account
3. Click "New Item" and upload the ZIP file
4. Fill in the store listing information using the metadata above
5. Upload all screenshots and promotional images
6. Set the distribution to "Public" (or "Private" for testing)
7. Set pricing to "Free"

### 4. Privacy and Permissions

#### Required Permissions Explanation

When submitting, you'll need to explain why the extension needs each permission:

| Permission | Justification |
|------------|---------------|
| `activeTab` | Required to access the current tab's content to fill in form fields |
| `storage` | Needed to store user preferences and login state |
| `scripting` | Required to inject scripts that auto-fill forms on job sites |
| `host_permissions` | Needed to communicate with the AutoApply Pro backend API |

#### Privacy Policy

1. Link to your privacy policy in the submission form
2. Use the URL: `https://autoapplypro.netlify.app/privacy`
3. Ensure your privacy policy covers:
   - What data is collected
   - How data is used
   - Data security measures
   - User data deletion options

## Compliance Checklist

Ensure your extension meets these requirements before submission:

- [x] Extension only activates form filling when the user clicks the extension button
- [x] No passive data collection in the background
- [x] All permissions are properly justified
- [x] Privacy policy is comprehensive and accessible
- [x] Extension does not modify, intercept, or collect sensitive form data
- [x] UI elements are responsive and accessible
- [x] All text is properly localized (currently English only)
- [x] Extension description is accurate and doesn't make unrealistic claims

## Post-Submission

After submission, the Chrome Web Store team will review your extension, which typically takes 2-3 business days. You may receive feedback requiring changes before approval.

Once approved, you can share the Chrome Web Store link with users and add it to your website.
