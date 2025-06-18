# 🔑 AutoApplyPro Production API Keys & Environment Variables Guide

## 📋 Overview
This guide provides a comprehensive list of all API keys and environment variables required for deploying AutoApplyPro to production.

---

## 🚨 **CRITICAL API KEYS REQUIRED**

### 1. **Database & Core Services**

#### **MongoDB Atlas** ⭐ **REQUIRED**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/autoapplypro?retryWrites=true&w=majority
```
- **Where to get**: [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Cost**: Free tier available (512MB), Paid plans start at $9/month
- **Setup**: Create cluster, create database user, whitelist IP addresses

#### **JWT Secret** ⭐ **REQUIRED**
```env
JWT_SECRET=your_super_secure_random_string_at_least_32_characters_long
```
- **Where to get**: Generate using: `openssl rand -hex 32`
- **Cost**: Free
- **Note**: Must be at least 32 characters long and secure

---

### 2. **Authentication Services**

#### **Clerk Authentication** ⭐ **REQUIRED**
```env
CLERK_PUBLISHABLE_KEY=pk_live_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_live_your_clerk_secret_key
```
- **Where to get**: [Clerk Dashboard](https://dashboard.clerk.com/)
- **Cost**: Free tier (10,000 MAU), Pro starts at $25/month
- **Setup Steps**:
  1. Create Clerk account
  2. Create new application
  3. Get keys from API Keys section
  4. Configure allowed origins and redirects

---

### 3. **AI Services**

#### **OpenAI API** ⭐ **REQUIRED** (Core Feature)
```env
OPENAI_API_KEY=sk-proj-your_openai_api_key_here
```
- **Where to get**: [OpenAI Platform](https://platform.openai.com/api-keys)
- **Cost**: Pay-per-use, typically $0.002/1K tokens for GPT-3.5-turbo
- **Monthly estimate**: $50-200 depending on usage
- **Setup**: Create OpenAI account, add payment method, generate API key

---

### 4. **Payment Processing**

#### **Razorpay** ⭐ **REQUIRED** (For Subscriptions)
```env
RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_SECRET=your_razorpay_secret_key
```
- **Where to get**: [Razorpay Dashboard](https://dashboard.razorpay.com/)
- **Cost**: 2% transaction fee
- **Setup Steps**:
  1. Complete KYB (Know Your Business) verification
  2. Activate live mode
  3. Get live API keys
  4. Set up webhooks

---

### 5. **Communication Services**

#### **Email Service (SMTP)** 🔶 **RECOMMENDED**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-business-email@domain.com
SMTP_PASS=your-app-password
SMTP_FROM=AutoApply Pro <noreply@autoapplypro.com>
```

**Options:**
1. **Gmail SMTP** (Free for low volume)
   - Cost: Free up to 100 emails/day
   - Setup: Enable 2FA, create app password

2. **SendGrid** (Recommended for production)
   - Cost: Free tier (100 emails/day), Paid plans start at $14.95/month
   - Where to get: [SendGrid](https://sendgrid.com/)

3. **Amazon SES** (Cost-effective)
   - Cost: $0.10 per 1,000 emails
   - Where to get: [AWS SES](https://aws.amazon.com/ses/)

4. **Mailgun** (Developer-friendly)
   - Cost: Free tier (5,000 emails/month), Paid plans start at $35/month
   - Where to get: [Mailgun](https://www.mailgun.com/)

#### **SMS Service (Twilio)** 🔶 **OPTIONAL**
```env
TWILIO_ACCOUNT_SID=AC_your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```
- **Where to get**: [Twilio Console](https://console.twilio.com/)
- **Cost**: $15/month for phone number + $0.0075 per SMS
- **Setup**: Verify business, purchase phone number

---

## 🌐 **PRODUCTION ENVIRONMENT VARIABLES**

### **Complete Production .env File Template**

```env
# =================================
# PRODUCTION ENVIRONMENT VARIABLES
# =================================

# Server Configuration
NODE_ENV=production
PORT=5000

# Database Configuration ⭐ REQUIRED
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/autoapplypro

# Security ⭐ REQUIRED
JWT_SECRET=your_super_secure_jwt_secret_key_here_make_it_long_and_random
JWT_EXPIRE=30d

# Authentication ⭐ REQUIRED
CLERK_PUBLISHABLE_KEY=pk_live_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_live_your_clerk_secret_key

# AI Services ⭐ REQUIRED
OPENAI_API_KEY=sk-proj-your_openai_api_key_here

# Payment Processing ⭐ REQUIRED
RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_SECRET=your_razorpay_secret_key

# Email Configuration 🔶 RECOMMENDED
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
SMTP_FROM=AutoApply Pro <noreply@autoapplypro.com>

# SMS Configuration 🔶 OPTIONAL
TWILIO_ACCOUNT_SID=AC_your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# URLs and Domains
API_BASE_URL=https://api.autoapplypro.com
FRONTEND_URL=https://autoapplypro.com
CORS_ORIGIN=https://autoapplypro.com,https://www.autoapplypro.com

# File Upload Configuration
FILE_UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760  # 10MB

# Admin Configuration
ADMIN_EMAILS=admin@autoapplypro.com,dev@autoapplypro.com
DEV_EMAIL=dev@autoapplypro.com

# Caching Configuration
CACHE_ENABLED=true
CACHE_TTL_SHORT=300
CACHE_TTL_MEDIUM=1800
CACHE_TTL_LONG=7200

# Rate Limiting Configuration
RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=1000
AUTH_RATE_LIMIT_MAX=10
UPLOAD_RATE_LIMIT_MAX=50
AI_RATE_LIMIT_MAX=30

# Security Configuration
BCRYPT_ROUNDS=12
ACCOUNT_LOCKOUT_ATTEMPTS=5
ACCOUNT_LOCKOUT_TIME=7200000
TRUST_PROXY=true
FORCE_HTTPS=true

# Logging Configuration
LOG_LEVEL=warn
LOG_MAX_FILES=90d
LOG_MAX_SIZE=50m

# Performance Monitoring (Optional)
# SENTRY_DSN=your_sentry_dsn_here
# NEW_RELIC_LICENSE_KEY=your_new_relic_key_here
```

---

## 💰 **COST BREAKDOWN**

### **Minimum Monthly Costs (Essential Services)**
| Service | Cost | Notes |
|---------|------|-------|
| MongoDB Atlas | $9/month | M2 cluster (2GB storage) |
| Clerk Auth | $25/month | Pro plan for production features |
| OpenAI API | $50-200/month | Depends on usage volume |
| Razorpay | 2% per transaction | No monthly fee |
| **Total Minimum** | **$84-234/month** | Plus transaction fees |

### **Recommended Monthly Costs (Full Features)**
| Service | Cost | Notes |
|---------|------|-------|
| MongoDB Atlas | $57/month | M10 cluster (10GB storage) |
| Clerk Auth | $25/month | Pro plan |
| OpenAI API | $100-300/month | Medium usage volume |
| Razorpay | 2% per transaction | Transaction fees |
| SendGrid | $14.95/month | Essentials plan (40k emails) |
| Twilio SMS | $20/month | Phone number + SMS usage |
| **Total Recommended** | **$216-416/month** | Plus transaction fees |

---

## 🔒 **SECURITY BEST PRACTICES**

### **API Key Security**
1. **Never commit API keys to version control**
2. **Use different keys for staging and production**
3. **Rotate keys regularly (every 90 days)**
4. **Use environment-specific key names**
5. **Monitor API key usage for anomalies**

### **Environment Variable Management**
1. **Use a secrets management service** (AWS Secrets Manager, Azure Key Vault)
2. **Set up proper IAM roles and permissions**
3. **Use encrypted environment variables**
4. **Audit access to production secrets**

---

## 🚀 **DEPLOYMENT PLATFORMS & SETUP**

### **Recommended Platforms**

#### **1. Railway** (Easiest)
- **Cost**: $5-20/month
- **Setup**: Connect GitHub, add environment variables
- **Pros**: Simple deployment, built-in PostgreSQL/Redis
- **Cons**: Less control over infrastructure

#### **2. Render** (Balanced)
- **Cost**: $7-25/month
- **Setup**: Connect GitHub, configure environment
- **Pros**: Good balance of simplicity and features
- **Cons**: Limited customization

#### **3. DigitalOcean App Platform** (Flexible)
- **Cost**: $12-30/month
- **Setup**: Dockerfile or buildpack deployment
- **Pros**: Good performance, reasonable pricing
- **Cons**: Requires more setup

#### **4. AWS/Azure/GCP** (Enterprise)
- **Cost**: Variable, typically $20-100+/month
- **Setup**: Complex, requires DevOps knowledge
- **Pros**: Full control, enterprise features
- **Cons**: Steep learning curve

---

## 📋 **SETUP CHECKLIST**

### **Phase 1: Core Services** ⭐
- [ ] Create MongoDB Atlas cluster
- [ ] Set up Clerk authentication
- [ ] Get OpenAI API key
- [ ] Configure Razorpay payments
- [ ] Generate secure JWT secret

### **Phase 2: Communication** 🔶
- [ ] Set up email service (SendGrid recommended)
- [ ] Configure SMS service (Twilio - optional)
- [ ] Test email/SMS delivery

### **Phase 3: Deployment** 🚀
- [ ] Choose deployment platform
- [ ] Configure environment variables
- [ ] Set up domain and SSL
- [ ] Configure CORS and security headers
- [ ] Test all integrations

### **Phase 4: Monitoring** 📊
- [ ] Set up error tracking (Sentry)
- [ ] Configure performance monitoring
- [ ] Set up logging and alerts
- [ ] Monitor API usage and costs

---

## 🆘 **TROUBLESHOOTING**

### **Common Issues**

#### **Database Connection**
```bash
# Test MongoDB connection
curl -X GET "https://your-api.com/api/health"
```

#### **Authentication Issues**
```bash
# Verify Clerk keys
curl -X GET "https://api.clerk.dev/v1/users" \
  -H "Authorization: Bearer sk_live_your_key"
```

#### **OpenAI API Issues**
```bash
# Test OpenAI connection
curl -X GET "https://api.openai.com/v1/models" \
  -H "Authorization: Bearer sk-proj-your_key"
```

#### **Payment Issues**
```bash
# Test Razorpay connection
curl -X GET "https://api.razorpay.com/v1/payments" \
  -u "rzp_live_key:secret"
```

---

## 📞 **SUPPORT CONTACTS**

- **MongoDB**: [Support Portal](https://support.mongodb.com/)
- **Clerk**: [Support](https://clerk.com/support)
- **OpenAI**: [Help Center](https://help.openai.com/)
- **Razorpay**: [Support](https://razorpay.com/support/)
- **SendGrid**: [Support](https://support.sendgrid.com/)
- **Twilio**: [Support](https://support.twilio.com/)

---

## ⚡ **QUICK START COMMANDS**

```bash
# 1. Clone and setup
git clone your-repo
cd AutoApplyPro/backend
npm install

# 2. Create production environment file
cp .env.example .env.production
# Edit .env.production with your API keys

# 3. Test environment
npm run test:env

# 4. Deploy to production
npm run deploy:production
```

---

**⚠️ Remember**: Start with the minimum required services and scale up as your user base grows. You can always add optional services like SMS later!
