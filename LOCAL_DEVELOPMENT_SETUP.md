# AutoApplyPro Local Development Setup

## Deployments Disabled ✅

✅ **Netlify deployment disabled** - Build command changed to echo message
✅ **Heroku deployment disabled** - Procfile modified to prevent backend startup
✅ **Local environment files created**

## Quick Start for Local Development

### Option 1: Use the Batch File (Windows)
```bash
# From the root directory
start-local-dev.bat
```

### Option 2: Manual Start
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm start
```

## Local URLs
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## Environment Configuration

### Frontend (.env.local)
- Uses local backend URL (http://localhost:5000)
- Development Clerk keys
- Test Razorpay keys

### Backend (.env.local)
- Port 5000
- Development environment
- Local CORS settings

## To Re-enable Deployments Later

### Netlify (Frontend)
```toml
# In netlify.toml, change back to:
[build]
  command = "npm run build"
  publish = "build"
```

### Heroku (Backend)
```
# In Procfile, change back to:
web: node server-simple.js
```

## Notes
- Make sure you have all required API keys in your .env.local files
- The live sites will show build/deployment errors until re-enabled
- All changes are committed and pushed to prevent accidental deployments
