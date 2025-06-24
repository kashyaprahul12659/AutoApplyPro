# AutoApplyPro - Deployment Guide

## Production Deployment Status

✅ **Frontend**: Live on Netlify at https://autoapplypro.tech
✅ **Backend**: Live on Heroku at https://autoapplypro-backend-d14947a17c9b.herokuapp.com

## Deployment Instructions

### Frontend (Netlify)

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Log in to Netlify**:
   ```bash
   netlify login
   ```

3. **Deploy**:
   ```bash
   cd frontend
   npm run build
   netlify deploy --prod
   ```

### Backend (Heroku)

#### Option 1: Using Deployment Scripts

We've provided several deployment scripts for different environments:

**For Windows (PowerShell)**:
1. Right-click on `deploy-heroku.ps1` and select "Run with PowerShell" or run:
   ```powershell
   .\deploy-heroku.ps1
   ```

**For Windows (Command Prompt)**:
1. Double-click on `deploy-heroku.bat` or run:
   ```cmd
   deploy-heroku.bat
   ```

**For Node.js Users**:
1. Run the Node.js deployment script:
   ```bash
   cd backend
   node deploy-heroku.js
   ```

#### Option 2: Manual Deployment

1. **Install Heroku CLI**:
   ```bash
   npm install -g heroku
   ```

2. **Log in to Heroku**:
   ```bash
   heroku login
   ```

3. **Set up Git repository** (if not already done):
   ```bash
   cd backend
   git init
   git remote add heroku https://git.heroku.com/autoapplypro-backend.git
   ```

4. **Commit and push to Heroku**:
   ```bash
   git add .
   git commit -m "Update for production deployment"
   git push heroku master
   ```

5. **Check logs**:
   ```bash
   heroku logs --tail
   ```

## Environment Variables

Ensure all environment variables are properly set on both Netlify and Heroku. See `.env.example` files in both frontend and backend directories for required variables.

## Post-Deployment Verification

1. Check the frontend health at: https://autoapplypro.tech
2. Check the backend health at: https://autoapplypro-backend-d14947a17c9b.herokuapp.com/api/health
3. Verify API integration by logging in and accessing the dashboard

## Troubleshooting

If you encounter issues after deployment:

1. **Check Logs**:
   - Netlify: Visit the Netlify dashboard and check the deploy logs
   - Heroku: Run `heroku logs --tail` for real-time logs

2. **Verify Environment Variables**:
   - Ensure all required environment variables are set correctly

3. **Check CORS Configuration**:
   - If API calls fail, check CORS settings in `server.js` and ensure the frontend domain is whitelisted

4. **Restart Heroku Dyno**:
   ```bash
   heroku restart
   ```

## Client Error Logging

The application includes a client-side error logging system that sends errors to `/api/client-errors`. This helps track and resolve production issues.
