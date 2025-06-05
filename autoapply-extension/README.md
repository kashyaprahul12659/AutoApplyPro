# AutoApply Pro Chrome Extension

This Chrome extension integrates with the AutoApply Pro web application to provide autofill functionality for job application forms.

## Features

- Automatically fill job application forms with your resume data
- Uses intelligent field matching to identify form fields
- Highlights filled fields for user clarity
- Integrates with your AutoApply Pro account
- Works on most job application websites
- Keeps track of your application history
- Job description analyzer tool to match your resume with job requirements
- Subscription plan display with remaining credits

## UI/UX Improvements

- **Responsive Design**: Optimized for all viewport sizes (300px-400px width)
- **Helpful Tooltips**: Context-sensitive tooltips on all buttons and controls
- **Subscription Badge**: Shows your current plan status and credits
- **Status Indicators**: Clear visual feedback about profile status and operations
- **Improved Notifications**: Consistent, accessible toast notifications
- **Better Button Styles**: Enhanced styling with hover effects and transitions

## Installation Instructions

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" by toggling the switch in the top right corner
3. Click "Load unpacked" and select the `autoapply-extension` folder
4. The AutoApply Pro extension icon should now appear in your browser toolbar

## Usage

1. Log in to your AutoApply Pro account at `http://localhost:3000`
2. Make sure you have uploaded your resume and set a profile as active for autofill
3. Navigate to a job application form
4. Click the AutoApply Pro extension icon in your browser toolbar
5. Click "Autofill Now" to automatically fill the form with your resume data
6. Review the filled information and make any necessary adjustments
7. Submit the application form

## Context Menu

You can also right-click anywhere on a job application page and select "Autofill with AutoApply Pro" from the context menu to trigger the autofill functionality.

## Troubleshooting

- If fields aren't being filled, try clicking the extension icon and checking your profile status
- Make sure you are logged in to your AutoApply Pro account
- Ensure that you have set a profile as active for autofill in the dashboard
- Some websites with advanced form validation may require manual intervention

## Developer Information

### Extension Architecture

- **background.js**: Service worker for background tasks and communication
- **content.js**: Injected into web pages for form manipulation
- **popup.js/html**: UI for user interaction
- **manifest.json**: Extension configuration

### Environment Configuration

The extension automatically detects development or production environments:

- **Development**: Uses `http://localhost:5000/api` and `http://localhost:3000` endpoints
- **Production**: Uses `https://api.autoapplypro.com/api` and `https://autoapplypro.com` endpoints

### Building and Packaging

1. Generate icons (if needed):
   ```
   npm run generate-icons
   ```

2. Package the extension for Chrome Web Store submission:
   ```
   npm run package-extension
   ```
   This creates `autoapply-extension.zip` in the frontend/public directory

### Debugging

1. You can enable debug mode in the extension popup (only visible in development mode)
2. Debug logs will appear in the browser console for background, content, and popup scripts
3. Use Chrome's extension development tools by going to `chrome://extensions` and clicking "background page" or "inspect views"

### Release Process

See the `../EXTENSION_STORE_SETUP.md` file for complete instructions on submitting to the Chrome Web Store.

## Development

To modify this extension:

1. Make your changes to the source files
2. Save all files
3. Go to `chrome://extensions/` in Chrome
4. Find the AutoApply Pro extension and click the refresh icon
5. Test your changes

## Privacy

This extension only accesses form fields on the pages you visit for the purpose of filling them with your resume data. Your data is stored locally in your browser and is only sent to the AutoApply Pro server when you log in or request your profile data.

No data is collected about your browsing history or other activities.
