# 🔑 Complete API Keys & Environment Variables for AutoApplyPro Production

## 📋 **EXECUTIVE SUMMARY**

Based on comprehensive analysis and validation of the AutoApplyPro codebase, here are **ALL** API keys and environment variables required for production deployment:

### 🚨 **CRITICAL STATUS (Current Environment)**
- ✅ **7/8 Critical Variables** are set
- ❌ **Missing: RAZORPAY_SECRET** (Required for payments)
- ⚠️  **1/6 Recommended Variables** are set
- 💡 **0/5 Optional Variables** are set

---

## ⭐ **CRITICAL API KEYS** (Production Cannot Run Without These)

### 1. **Database Connection**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/autoapplypro?retryWrites=true&w=majority
```
- **Status**: ✅ **CONFIGURED**
- **Provider**: [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Cost**: $9-57/month (M2-M10 cluster)
- **Setup**: Create cluster → Create database user → Whitelist IPs

### 2. **Security & JWT**
```env
JWT_SECRET=your_super_secure_random_string_at_least_32_characters_long
```
- **Status**: ✅ **CONFIGURED**
- **Generate**: `openssl rand -hex 32`
- **Requirements**: Minimum 32 characters, cryptographically secure
- **Cost**: Free

### 3. **Authentication Service**
```env
CLERK_PUBLISHABLE_KEY=pk_live_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_live_your_clerk_secret_key
```
- **Status**: ✅ **CONFIGURED**
- **Provider**: [Clerk Dashboard](https://dashboard.clerk.com/)
- **Cost**: $25/month (Pro plan required for production)
- **Format**: Secret key must start with `sk_`

### 4. **AI Processing (Core Feature)**
```env
OPENAI_API_KEY=sk-proj-your_openai_api_key_here
```
- **Status**: ✅ **CONFIGURED** (but format warning)
- **Provider**: [OpenAI Platform](https://platform.openai.com/api-keys)
- **Cost**: $50-300/month (usage-based)
- **Format**: Must start with `sk-` or `sk-proj-`
- **Note**: Currently configured but should ideally start with "sk-"

### 5. **Payment Processing**
```env
RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_SECRET=your_razorpay_secret_key
```
- **Status**: 
  - ✅ **RAZORPAY_KEY_ID**: CONFIGURED
  - ❌ **RAZORPAY_SECRET**: **MISSING** 🚨
- **Provider**: [Razorpay Dashboard](https://dashboard.razorpay.com/)
- **Cost**: 2% transaction fee (no monthly fee)
- **Setup**: Complete KYB verification → Activate live mode → Get live keys

### 6. **Runtime Environment**
```env
NODE_ENV=production
```
- **Status**: ⚠️ **Currently "development"** (should be "production" for prod)
- **Action Required**: Change to "production" before deployment

---

## 🔶 **RECOMMENDED API KEYS** (Important for Full Functionality)

### 1. **Email Service**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
SMTP_FROM=AutoApply Pro <noreply@autoapplypro.com>
```
- **Status**: ❌ **NOT CONFIGURED**
- **Provider Options**:
  - **SendGrid** (Recommended): $14.95/month for 40k emails
  - **Gmail SMTP** (Free): Up to 100 emails/day
  - **Amazon SES**: $0.10 per 1,000 emails
  - **Mailgun**: $35/month for 50k emails

### 2. **API Configuration**
```env
API_BASE_URL=https://api.autoapplypro.com
CORS_ORIGIN=https://autoapplypro.com,https://www.autoapplypro.com
```
- **Status**: ❌ **NOT CONFIGURED**
- **Purpose**: API endpoints and CORS security
- **Cost**: Free (configuration only)

### 3. **Frontend Integration**
```env
FRONTEND_URL=https://autoapplypro.com
```
- **Status**: ✅ **CONFIGURED**
- **Purpose**: Cross-origin requests and redirects

---

## 🔵 **OPTIONAL API KEYS** (Enhanced Features)

### 1. **SMS Notifications**
```env
TWILIO_ACCOUNT_SID=AC_your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```
- **Status**: ❌ **NOT CONFIGURED**
- **Provider**: [Twilio Console](https://console.twilio.com/)
- **Cost**: $15/month for phone number + $0.0075 per SMS
- **Features**: Real-time SMS notifications for job applications

### 2. **Error Monitoring**
```env
SENTRY_DSN=your_sentry_dsn_here
```
- **Status**: ❌ **NOT CONFIGURED**
- **Provider**: [Sentry](https://sentry.io/)
- **Cost**: Free tier available, Pro starts at $26/month
- **Features**: Real-time error tracking and performance monitoring

### 3. **Performance Monitoring**
```env
NEW_RELIC_LICENSE_KEY=your_new_relic_key_here
```
- **Status**: ❌ **NOT CONFIGURED**
- **Provider**: [New Relic](https://newrelic.com/)
- **Cost**: Free tier available, Pro starts at $25/month
- **Features**: Application performance monitoring

---

## 🛠️ **ADDITIONAL CONFIGURATION VARIABLES**

### **File Upload Configuration**
```env
FILE_UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760  # 10MB
```

### **Security Configuration**
```env
BCRYPT_ROUNDS=12
ACCOUNT_LOCKOUT_ATTEMPTS=5
ACCOUNT_LOCKOUT_TIME=7200000
TRUST_PROXY=true
FORCE_HTTPS=true
```

### **Rate Limiting Configuration**
```env
RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=1000
AUTH_RATE_LIMIT_MAX=10
UPLOAD_RATE_LIMIT_MAX=50
AI_RATE_LIMIT_MAX=30
```

### **Caching Configuration**
```env
CACHE_ENABLED=true
CACHE_TTL_SHORT=300
CACHE_TTL_MEDIUM=1800
CACHE_TTL_LONG=7200
```

### **Administrative Configuration**
```env
ADMIN_EMAILS=admin@autoapplypro.com,dev@autoapplypro.com
DEV_EMAIL=dev@autoapplypro.com
```

### **Logging Configuration**
```env
LOG_LEVEL=warn
LOG_MAX_FILES=90d
LOG_MAX_SIZE=50m
```

---

## 💰 **COST BREAKDOWN**

### **Minimum Production Setup** (Essential Services Only)
| Service | Monthly Cost | Status |
|---------|-------------|---------|
| MongoDB Atlas (M2) | $9 | ✅ Ready |
| Clerk Auth (Pro) | $25 | ✅ Ready |
| OpenAI API | $50-200 | ✅ Ready |
| Razorpay | 2% per transaction | ❌ **Need Secret Key** |
| **TOTAL MINIMUM** | **$84-234/month** | + Transaction fees |

### **Recommended Production Setup** (Full Features)
| Service | Monthly Cost | Status |
|---------|-------------|---------|
| MongoDB Atlas (M10) | $57 | ✅ Ready |
| Clerk Auth (Pro) | $25 | ✅ Ready |
| OpenAI API | $100-300 | ✅ Ready |
| Razorpay | 2% per transaction | ❌ **Need Secret Key** |
| SendGrid (Essentials) | $14.95 | ❌ Not configured |
| Twilio SMS | $20 | ❌ Not configured |
| Sentry (Pro) | $26 | ❌ Not configured |
| **TOTAL RECOMMENDED** | **$242-442/month** | + Transaction fees |

---

## 🚨 **IMMEDIATE ACTION ITEMS**

### **CRITICAL (Cannot Deploy Without)**
1. **Get Razorpay Secret Key**
   - Log into [Razorpay Dashboard](https://dashboard.razorpay.com/)
   - Navigate to Settings → API Keys
   - Copy the "Key Secret" value
   - Add to environment variables

2. **Set NODE_ENV to production**
   ```env
   NODE_ENV=production
   ```

### **RECOMMENDED (Before Full Launch)**
1. **Configure Email Service**
   - Choose provider (SendGrid recommended)
   - Set up SMTP credentials
   - Test email delivery

2. **Set API URLs**
   ```env
   API_BASE_URL=https://your-api-domain.com
   CORS_ORIGIN=https://your-frontend-domain.com
   ```

### **OPTIONAL (Can Add Later)**
1. **SMS Notifications** - Set up Twilio
2. **Error Monitoring** - Set up Sentry
3. **Performance Monitoring** - Set up New Relic

---

## 🔧 **VALIDATION & TESTING**

### **Run Environment Validation**
```bash
cd backend
node validateEnvironment.js
```

### **Test Critical Integrations**
```bash
# Test database connection
curl -X GET "https://your-api.com/api/health"

# Test Clerk authentication
curl -X GET "https://api.clerk.dev/v1/users" \
  -H "Authorization: Bearer sk_live_your_key"

# Test OpenAI integration
curl -X GET "https://api.openai.com/v1/models" \
  -H "Authorization: Bearer sk-proj-your_key"

# Test Razorpay connection
curl -X GET "https://api.razorpay.com/v1/payments" \
  -u "rzp_live_key:secret"
```

---

## 📝 **PRODUCTION .env TEMPLATE**

```env
# =================================
# AUTOAPPLYPRO PRODUCTION CONFIG
# =================================

# Core Configuration
NODE_ENV=production
PORT=5000

# Database (CRITICAL) ⭐
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/autoapplypro

# Security (CRITICAL) ⭐
JWT_SECRET=your_super_secure_jwt_secret_key_here_make_it_long_and_random
JWT_EXPIRE=30d

# Authentication (CRITICAL) ⭐
CLERK_PUBLISHABLE_KEY=pk_live_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_live_your_clerk_secret_key

# AI Services (CRITICAL) ⭐
OPENAI_API_KEY=sk-proj-your_openai_api_key_here

# Payment Processing (CRITICAL) ⭐
RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_SECRET=your_razorpay_secret_key

# Email Service (RECOMMENDED) 🔶
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
SMTP_FROM=AutoApply Pro <noreply@autoapplypro.com>

# SMS Service (OPTIONAL) 🔵
TWILIO_ACCOUNT_SID=AC_your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Monitoring (OPTIONAL) 🔵
SENTRY_DSN=your_sentry_dsn_here
NEW_RELIC_LICENSE_KEY=your_new_relic_key_here

# URLs and Domains (RECOMMENDED) 🔶
API_BASE_URL=https://api.autoapplypro.com
FRONTEND_URL=https://autoapplypro.com
CORS_ORIGIN=https://autoapplypro.com,https://www.autoapplypro.com

# Additional Configuration
FILE_UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
ADMIN_EMAILS=admin@autoapplypro.com
DEV_EMAIL=dev@autoapplypro.com
CACHE_ENABLED=true
RATE_LIMIT_ENABLED=true
BCRYPT_ROUNDS=12
TRUST_PROXY=true
FORCE_HTTPS=true
LOG_LEVEL=warn
```

---

## 🎯 **DEPLOYMENT READINESS CHECKLIST**

### **Phase 1: Critical Setup** ⭐
- [ ] MongoDB Atlas cluster created and URI configured
- [ ] Clerk authentication set up with live keys
- [ ] OpenAI API key configured and tested
- [ ] **Razorpay secret key obtained and configured** 🚨
- [ ] JWT secret generated and secured
- [ ] NODE_ENV set to "production"

### **Phase 2: Recommended Setup** 🔶
- [ ] Email service configured and tested
- [ ] API and CORS URLs configured
- [ ] Domain and SSL certificate configured
- [ ] All environment variables validated

### **Phase 3: Optional Enhancements** 🔵
- [ ] SMS notifications configured
- [ ] Error monitoring set up
- [ ] Performance monitoring configured
- [ ] Automated backups configured

### **Phase 4: Go Live** 🚀
- [ ] All critical tests passing
- [ ] Load testing completed
- [ ] Monitoring and alerts configured
- [ ] Rollback plan prepared

---

## 📞 **SUPPORT RESOURCES**

- **MongoDB Atlas**: [Support Portal](https://support.mongodb.com/)
- **Clerk**: [Support](https://clerk.com/support)
- **OpenAI**: [Help Center](https://help.openai.com/)
- **Razorpay**: [Support](https://razorpay.com/support)
- **SendGrid**: [Support](https://support.sendgrid.com/)
- **Twilio**: [Support](https://support.twilio.com/)

---

**🎯 BOTTOM LINE**: You need **1 critical API key (RAZORPAY_SECRET)** to be production-ready. Everything else is configured or optional. Minimum monthly cost: $84-234 plus transaction fees.
