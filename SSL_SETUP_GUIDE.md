# SSL Certificate Setup Guide for AutoApplyPro

## Current Issue
- Custom Clerk domain `clerk.autoapplypro.tech` has SSL certificate issues
- Frontend is deployed on Netlify at `autoapplypro.tech`
- SSL certificate available from Namecheap
- Domain managed through Dot Tech

## Solution Steps

### 1. Netlify SSL Configuration
1. Login to Netlify Dashboard: https://app.netlify.com
2. Select AutoApplyPro site
3. Go to Domain management → HTTPS
4. Upload SSL certificate from Namecheap:
   - Certificate file (.crt)
   - Private key (.key)
   - Certificate chain (if provided)

### 2. DNS Configuration for Clerk Subdomain
In Dot Tech DNS settings, add:
```
Type: CNAME
Name: clerk
Value: clerk.clerk.com (verify with Clerk dashboard)
TTL: 300
```

### 3. Clerk Dashboard Configuration
1. Go to Clerk Dashboard: https://dashboard.clerk.com
2. Select production app
3. Add custom domain: clerk.autoapplypro.tech
4. Complete verification process

### 4. Verification
After setup, verify:
- https://autoapplypro.tech loads without errors
- https://clerk.autoapplypro.tech responds properly
- Authentication works without SSL errors

## Current Configuration
- Main domain: autoapplypro.tech ✅
- Clerk domain: clerk.autoapplypro.tech ⚠️ (SSL issue)
- Backend: autoapplypro-backend-d14947a17c9b.herokuapp.com ✅

## Temporary Workaround
If SSL setup takes time, can temporarily use development Clerk key until SSL is configured.
