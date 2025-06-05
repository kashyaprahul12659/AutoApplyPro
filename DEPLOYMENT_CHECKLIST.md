# AutoApply Pro Deployment Checklist

This document provides a comprehensive checklist for deploying AutoApply Pro to production. Follow these steps carefully to ensure a smooth rollout.

## Prerequisites

- [ ] All code changes committed to repository
- [ ] Final QA testing completed
- [ ] API endpoints configured for production

## Backend Deployment

### Environment Configuration

- [ ] Set production environment variables:
  - `NODE_ENV=production`
  - `JWT_SECRET` (use a strong, unique value)
  - `MONGODB_URI` (production MongoDB connection string)
  - `OPENAI_API_KEY` (for AI features)
  - `CORS_ORIGIN` (set to production domain)

### Database Setup

- [ ] Create production MongoDB database
- [ ] Set up database indexes for performance:
  ```
  db.users.createIndex({ email: 1 }, { unique: true })
  db.resumes.createIndex({ userId: 1 })
  db.coverletters.createIndex({ userId: 1 })
  db.autofillHistory.createIndex({ userId: 1 })
  ```
- [ ] Verify MongoDB connection from deployment environment

### Backend Deployment Steps

1. [ ] Run tests: `npm test`
2. [ ] Build backend: `npm run build`
3. [ ] Deploy to production server
4. [ ] Verify API endpoints are accessible
5. [ ] Check server logs for any startup errors

## Frontend Deployment

### Environment Configuration

- [ ] Update `.env.production` with production API URL
- [ ] Set correct `REACT_APP_VERSION=1.3.5`
- [ ] Configure production analytics keys (if applicable)

### Frontend Deployment Steps

1. [ ] Run tests: `npm test`
2. [ ] Build frontend: `npm run build`
3. [ ] Deploy build artifacts to production hosting
4. [ ] Verify all static assets are loading correctly
5. [ ] Test all routes and deep links

## Chrome Extension Deployment

### Preparation

- [ ] Update manifest.json with correct production version (1.3.5)
- [ ] Ensure all API endpoints point to production
- [ ] Verify all icons are properly generated

### Build and Packaging

1. [ ] Run: `npm run generate-icons` (if needed)
2. [ ] Package extension: `npm run package-extension`
3. [ ] Verify the ZIP file is created successfully in `frontend/public/autoapply-extension.zip`

### Chrome Web Store Submission

1. [ ] Log in to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. [ ] Upload the extension ZIP file
3. [ ] Fill in all store metadata (see EXTENSION_STORE_SETUP.md)
4. [ ] Upload screenshots and promotional images
5. [ ] Set pricing to "Free"
6. [ ] Submit for review

## Post-Deployment Verification

### Functionality Testing

- [ ] Test user signup/login
- [ ] Test resume upload and parsing
- [ ] Test cover letter generation
- [ ] Test JD analysis
- [ ] Test Chrome extension installation and autofill
- [ ] Verify all authenticated API endpoints work with production tokens

### Performance Testing

- [ ] Check frontend load time
- [ ] Verify API response times
- [ ] Test with multiple concurrent users

### Security Verification

- [ ] Ensure all API endpoints require proper authentication
- [ ] Verify CORS settings are properly configured
- [ ] Check for any exposed secrets or API keys
- [ ] Verify proper HTTPS configuration

## Rollback Plan

In case of critical issues:

1. Revert to previous version of backend
2. Revert to previous version of frontend
3. For Chrome extension, disable the item in Chrome Web Store

## Contact Information

**Development Team:**
- Lead Developer: [Your Name]
- Email: [Your Email]

**DevOps:**
- DevOps Engineer: [DevOps Name]
- Email: [DevOps Email]

---

Last Updated: May 25, 2025
