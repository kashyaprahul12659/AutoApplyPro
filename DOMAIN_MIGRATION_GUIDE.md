# Domain Migration Guide: autoapplypro.com → autoapplypro.tech

## Overview
This document outlines the migration from `autoapplypro.com` to `autoapplypro.tech` domain.

## Environment Variables Required

### Backend (.env)
```bash
# Core URLs
FRONTEND_URL=https://autoapplypro.tech
API_BASE_URL=https://api.autoapplypro.tech

# CORS Configuration
CORS_ORIGIN=https://autoapplypro.tech,https://www.autoapplypro.tech,http://localhost:3000

# Admin Configuration
ADMIN_EMAILS=admin@autoapplypro.tech,dev@autoapplypro.tech

# Email Configuration (update if using custom SMTP)
FROM_EMAIL=noreply@autoapplypro.tech
SUPPORT_EMAIL=support@autoapplypro.tech
```

### Frontend (.env)
```bash
# API Configuration
REACT_APP_API_URL=https://api.autoapplypro.tech
REACT_APP_BASE_URL=https://autoapplypro.tech

# Extension ID (if changed)
REACT_APP_EXTENSION_ID=your-new-extension-id
```

### Extension
- Update `manifest.json` with new domain permissions
- Update `background.js` and `content.js` API endpoints
- Re-package and submit to Chrome Web Store

## DNS Configuration Required

### Main Domain (autoapplypro.tech)
- **A Record**: Point to your frontend hosting IP
- **CNAME**: www.autoapplypro.tech → autoapplypro.tech

### API Subdomain (api.autoapplypro.tech)
- **A Record** or **CNAME**: Point to your backend server

### Email Subdomain (optional)
- **MX Records**: For email handling
- **SPF/DKIM**: For email authentication

## Deployment Checklist

### 1. Frontend Deployment
- [ ] Update environment variables
- [ ] Deploy to production
- [ ] Verify HTTPS works
- [ ] Test all routes and legal pages

### 2. Backend Deployment
- [ ] Update environment variables
- [ ] Update CORS settings
- [ ] Deploy to production
- [ ] Test API endpoints

### 3. Extension Update
- [ ] Update manifest.json permissions
- [ ] Update API endpoints in code
- [ ] Test extension functionality
- [ ] Submit to Chrome Web Store

### 4. Legal Pages
- [ ] Privacy Policy accessible at /privacy-policy
- [ ] Terms of Service accessible at /terms-of-service
- [ ] Refund Policy accessible at /refund-policy
- [ ] All legal pages properly linked in footer

### 5. Post-Migration
- [ ] Update any external service integrations
- [ ] Update social media links
- [ ] Update documentation
- [ ] Set up redirects from old domain (if applicable)

## Testing Commands

### Test Frontend
```bash
cd frontend
npm start
# Visit http://localhost:3000 and test all pages
```

### Test Backend
```bash
cd backend
npm start
# Test API endpoints with new domain configuration
```

### Test Extension
1. Load unpacked extension in Chrome
2. Test on job sites
3. Verify API communication
4. Test all features

## Legal Pages Created

1. **Privacy Policy** (`/src/pages/PrivacyPolicy.js`)
   - Comprehensive privacy information
   - GDPR compliant
   - Contact: privacy@autoapplypro.tech

2. **Terms of Service** (`/src/pages/TermsOfService.js`)
   - Service usage terms
   - User responsibilities
   - Contact: legal@autoapplypro.tech

3. **Refund Policy** (`/src/pages/RefundPolicy.js`)
   - 7-day money-back guarantee
   - Refund procedures
   - Contact: support@autoapplypro.tech

## Files Updated

### Frontend
- `src/App.js` - Added legal routes, updated canonical URL
- `src/components/layout/Footer.js` - Updated email and added legal links
- `src/components/ErrorBoundary.js` - Updated support email
- `src/components/auth/DevLoginForm.js` - Updated dev email

### Backend
- `server.js` - Updated CORS origins
- `validateEnvironment.js` - Updated example URLs
- `middleware/adminAuth.js` - Updated admin emails
- `docs/swagger.js` - Updated contact info and URLs
- `services/emailSMSService.js` - Updated support email
- `.env.example` - Updated all domain references
- `middleware/clerkAuth.js` - Updated dev email
- `controllers/apiController.js` - Updated API examples

### Extension (already done in previous tasks)
- `manifest.json` - Updated domain permissions
- `background.js` - Updated API endpoints
- All relevant files updated for new domain

## Contact Information
- **Support**: support@autoapplypro.tech
- **Legal**: legal@autoapplypro.tech
- **Privacy**: privacy@autoapplypro.tech
- **Admin**: admin@autoapplypro.tech
