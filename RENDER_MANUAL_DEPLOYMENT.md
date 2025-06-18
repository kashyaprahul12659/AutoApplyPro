# Render Manual Deployment Guide for AutoApplyPro Backend

Since the Render CLI has issues, we'll deploy manually through the Render web interface.

## Prerequisites
- GitHub repository pushed with latest changes ✅
- Backend code ready in `backend/` directory ✅
- `render.yaml` configuration file created ✅

## Step-by-Step Deployment

### 1. Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up/Sign in with GitHub account
3. Connect your GitHub account

### 2. Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `AutoApplyPro`
3. Configure the following settings:

#### Basic Settings:
- **Name**: `autoapplypro-backend`
- **Environment**: `Node`
- **Region**: `Oregon (US West)` or closest to your users
- **Branch**: `main`
- **Root Directory**: `backend`

#### Build & Deploy Settings:
- **Build Command**: `npm install`
- **Start Command**: `npm start`

#### Advanced Settings:
- **Plan**: `Free` (for testing) or `Starter` (for production)
- **Node Version**: `18` (or latest LTS)
- **Auto-Deploy**: `Yes`

### 3. Environment Variables
Add these environment variables in Render dashboard:

#### Required Variables:
```
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://autoapplypro.netlify.app
CORS_ORIGIN=https://autoapplypro.netlify.app
```

#### Database & Services:
```
MONGODB_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
```

#### AI Services:
```
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key (optional)
```

#### Payment Gateway:
```
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

#### Email Service:
```
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
```

#### Security Keys (Generate random strings):
```
JWT_SECRET=your_random_jwt_secret
SESSION_SECRET=your_random_session_secret
ENCRYPTION_KEY=your_random_encryption_key
```

### 4. Domain Configuration
After deployment:
1. Note your Render URL (e.g., `https://autoapplypro-backend.onrender.com`)
2. Update frontend API URL to point to this URL
3. Configure custom domain `api.autoapplypro.tech` (optional)

### 5. SSL Certificate
- Render automatically provides SSL certificates
- Custom domains require DNS configuration

### 6. Health Checks
- Render automatically monitors your service
- Endpoint: `GET /health` or `GET /`

## Post-Deployment Steps

### 1. Test Backend
```bash
curl https://your-render-url.onrender.com/health
```

### 2. Update Frontend API URLs
Update frontend environment variables to use production backend URL.

### 3. Test Full Integration
- Test authentication flow
- Test API endpoints
- Test file uploads
- Test payment integration

### 4. Monitor Logs
- Use Render dashboard to view logs
- Monitor performance and errors

## Troubleshooting

### Common Issues:
1. **Build Failures**: Check build logs in Render dashboard
2. **Environment Variables**: Ensure all required variables are set
3. **Database Connection**: Verify MongoDB connection string
4. **CORS Issues**: Check CORS_ORIGIN matches frontend URL

### Health Check Endpoint
Make sure your backend has a health check endpoint:
```javascript
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});
```

## Current Status
- ✅ Code ready for deployment
- ✅ Configuration files created
- 🔄 Manual deployment needed via Render web interface
- ⏳ Environment variables setup required
- ⏳ Testing and verification needed

## Next Steps
1. Follow this guide to deploy via Render web interface
2. Set up all environment variables
3. Test deployment
4. Update frontend to use production backend URL
5. Configure custom domain (optional)
