# Render Deployment Configuration for AutoApply Pro Backend

## Build Command
```bash
npm install
```

## Start Command
```bash
npm start
```

## Environment Variables (Set in Render Dashboard)
```
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://autoapplypro.tech
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
ADMIN_EMAIL=admin@autoapplypro.tech
DOMAIN=autoapplypro.tech
DATABASE_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
```

## Render Service Configuration

### Service Type: Web Service
### Build Command: `npm install`
### Start Command: `npm start`
### Node Version: 18 or higher

### Health Check Path: `/health`

## Important Notes:
1. Make sure to set all environment variables in Render dashboard
2. The service will be available at: https://autoapply-pro-backend.onrender.com
3. Update CORS settings to allow the frontend domain
4. Ensure database connection is properly configured
