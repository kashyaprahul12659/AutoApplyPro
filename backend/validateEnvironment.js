const dotenv = require('dotenv');
const { logger } = require('./utils/logger');

// Load environment variables
dotenv.config();

/**
 * Environment Variable Validation Script
 * Checks if all required environment variables are set for production
 */

class EnvironmentValidator {
  constructor() {
    this.requiredVars = {
      // Core required variables
      CRITICAL: [
        'NODE_ENV',
        'MONGODB_URI',
        'JWT_SECRET',
        'CLERK_PUBLISHABLE_KEY',
        'CLERK_SECRET_KEY',
        'OPENAI_API_KEY',
        'RAZORPAY_KEY_ID',
        'RAZORPAY_SECRET'
      ],
      
      // Recommended variables
      RECOMMENDED: [
        'SMTP_HOST',
        'SMTP_USER',
        'SMTP_PASS',
        'API_BASE_URL',
        'FRONTEND_URL',
        'CORS_ORIGIN'
      ],
      
      // Optional variables
      OPTIONAL: [
        'TWILIO_ACCOUNT_SID',
        'TWILIO_AUTH_TOKEN',
        'TWILIO_PHONE_NUMBER',
        'SENTRY_DSN',
        'NEW_RELIC_LICENSE_KEY'
      ]
    };
    
    this.validationResults = {
      critical: { passed: [], failed: [] },
      recommended: { passed: [], failed: [] },
      optional: { passed: [], failed: [] }
    };
  }
  
  /**
   * Validate all environment variables
   */
  validateAll() {
    console.log('\n🔍 VALIDATING ENVIRONMENT VARIABLES...\n');
    
    this.validateCritical();
    this.validateRecommended();
    this.validateOptional();
    this.validateSpecific();
    
    this.printResults();
    this.printRecommendations();
    
    return this.isProductionReady();
  }
  
  /**
   * Validate critical environment variables
   */
  validateCritical() {
    console.log('⭐ CRITICAL VARIABLES (Required for production):');
    
    this.requiredVars.CRITICAL.forEach(varName => {
      const value = process.env[varName];
      const isValid = this.validateVariable(varName, value);
      
      if (isValid) {
        this.validationResults.critical.passed.push(varName);
        console.log(`   ✅ ${varName}: Set`);
      } else {
        this.validationResults.critical.failed.push(varName);
        console.log(`   ❌ ${varName}: Missing or invalid`);
      }
    });
    
    console.log('');
  }
  
  /**
   * Validate recommended environment variables
   */
  validateRecommended() {
    console.log('🔶 RECOMMENDED VARIABLES (Important for full functionality):');
    
    this.requiredVars.RECOMMENDED.forEach(varName => {
      const value = process.env[varName];
      const isValid = this.validateVariable(varName, value);
      
      if (isValid) {
        this.validationResults.recommended.passed.push(varName);
        console.log(`   ✅ ${varName}: Set`);
      } else {
        this.validationResults.recommended.failed.push(varName);
        console.log(`   ⚠️  ${varName}: Missing (recommended)`);
      }
    });
    
    console.log('');
  }
  
  /**
   * Validate optional environment variables
   */
  validateOptional() {
    console.log('🔵 OPTIONAL VARIABLES (Nice to have):');
    
    this.requiredVars.OPTIONAL.forEach(varName => {
      const value = process.env[varName];
      const isValid = this.validateVariable(varName, value);
      
      if (isValid) {
        this.validationResults.optional.passed.push(varName);
        console.log(`   ✅ ${varName}: Set`);
      } else {
        this.validationResults.optional.failed.push(varName);
        console.log(`   ⭕ ${varName}: Not set (optional)`);
      }
    });
    
    console.log('');
  }
  
  /**
   * Validate specific variable formats
   */
  validateSpecific() {
    console.log('🔍 SPECIFIC VALIDATION CHECKS:');
    
    // JWT Secret length
    const jwtSecret = process.env.JWT_SECRET;
    if (jwtSecret && jwtSecret.length < 32) {
      console.log('   ⚠️  JWT_SECRET: Should be at least 32 characters long');
    } else if (jwtSecret) {
      console.log('   ✅ JWT_SECRET: Length is adequate');
    }
    
    // Clerk keys format
    const clerkSecret = process.env.CLERK_SECRET_KEY;
    if (clerkSecret && !clerkSecret.startsWith('sk_')) {
      console.log('   ⚠️  CLERK_SECRET_KEY: Should start with "sk_"');
    } else if (clerkSecret) {
      console.log('   ✅ CLERK_SECRET_KEY: Format is correct');
    }
    
    const clerkPublic = process.env.CLERK_PUBLISHABLE_KEY;
    if (clerkPublic && !clerkPublic.startsWith('pk_')) {
      console.log('   ⚠️  CLERK_PUBLISHABLE_KEY: Should start with "pk_"');
    } else if (clerkPublic) {
      console.log('   ✅ CLERK_PUBLISHABLE_KEY: Format is correct');
    }
    
    // OpenAI key format
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey && !openaiKey.startsWith('sk-')) {
      console.log('   ⚠️  OPENAI_API_KEY: Should start with "sk-"');
    } else if (openaiKey) {
      console.log('   ✅ OPENAI_API_KEY: Format is correct');
    }
    
    // Razorpay key format
    const razorpayKey = process.env.RAZORPAY_KEY_ID;
    if (razorpayKey && !razorpayKey.startsWith('rzp_')) {
      console.log('   ⚠️  RAZORPAY_KEY_ID: Should start with "rzp_"');
    } else if (razorpayKey) {
      console.log('   ✅ RAZORPAY_KEY_ID: Format is correct');
    }
    
    // MongoDB URI format
    const mongoUri = process.env.MONGODB_URI;
    if (mongoUri && !mongoUri.startsWith('mongodb')) {
      console.log('   ⚠️  MONGODB_URI: Should start with "mongodb://" or "mongodb+srv://"');
    } else if (mongoUri) {
      console.log('   ✅ MONGODB_URI: Format is correct');
    }
    
    // Node environment
    const nodeEnv = process.env.NODE_ENV;
    if (nodeEnv === 'production') {
      console.log('   ✅ NODE_ENV: Set to production');
    } else {
      console.log(`   ⚠️  NODE_ENV: Currently "${nodeEnv}" (should be "production" for prod)`);
    }
    
    console.log('');
  }
  
  /**
   * Validate individual variable
   */
  validateVariable(varName, value) {
    return value && value.trim() !== '' && value !== 'your_key_here' && !value.includes('placeholder');
  }
  
  /**
   * Print validation results summary
   */
  printResults() {
    console.log('📊 VALIDATION SUMMARY:');
    console.log(`   Critical Variables: ${this.validationResults.critical.passed.length}/${this.requiredVars.CRITICAL.length} passed`);
    console.log(`   Recommended Variables: ${this.validationResults.recommended.passed.length}/${this.requiredVars.RECOMMENDED.length} passed`);
    console.log(`   Optional Variables: ${this.validationResults.optional.passed.length}/${this.requiredVars.OPTIONAL.length} passed`);
    console.log('');
  }
  
  /**
   * Print recommendations
   */
  printRecommendations() {
    console.log('💡 RECOMMENDATIONS:');
    
    if (this.validationResults.critical.failed.length > 0) {
      console.log('   🚨 CRITICAL: The following variables MUST be set for production:');
      this.validationResults.critical.failed.forEach(varName => {
        console.log(`      - ${varName}: ${this.getVariableHelp(varName)}`);
      });
      console.log('');
    }
    
    if (this.validationResults.recommended.failed.length > 0) {
      console.log('   ⚠️  RECOMMENDED: Consider setting these for full functionality:');
      this.validationResults.recommended.failed.forEach(varName => {
        console.log(`      - ${varName}: ${this.getVariableHelp(varName)}`);
      });
      console.log('');
    }
    
    if (this.validationResults.optional.failed.length > 0) {
      console.log('   💡 OPTIONAL: These can enhance your application:');
      this.validationResults.optional.failed.forEach(varName => {
        console.log(`      - ${varName}: ${this.getVariableHelp(varName)}`);
      });
      console.log('');
    }
  }
  
  /**
   * Get help text for each variable
   */
  getVariableHelp(varName) {
    const helpText = {
      NODE_ENV: 'Set to "production" for production deployment',
      MONGODB_URI: 'MongoDB connection string from MongoDB Atlas',
      JWT_SECRET: 'Generate with: openssl rand -hex 32',
      CLERK_PUBLISHABLE_KEY: 'Get from Clerk dashboard (starts with pk_)',
      CLERK_SECRET_KEY: 'Get from Clerk dashboard (starts with sk_)',
      OPENAI_API_KEY: 'Get from OpenAI platform (starts with sk-)',
      RAZORPAY_KEY_ID: 'Get from Razorpay dashboard (starts with rzp_)',
      RAZORPAY_SECRET: 'Get from Razorpay dashboard',
      SMTP_HOST: 'Email service hostname (e.g., smtp.gmail.com)',
      SMTP_USER: 'Email service username',
      SMTP_PASS: 'Email service password or API key',      API_BASE_URL: 'Your API domain (e.g., https://api.autoapplypro.tech)',
      FRONTEND_URL: 'Your frontend domain (e.g., https://autoapplypro.tech)',
      CORS_ORIGIN: 'Allowed CORS origins (comma-separated)',
      TWILIO_ACCOUNT_SID: 'Twilio Account SID for SMS',
      TWILIO_AUTH_TOKEN: 'Twilio Auth Token for SMS',
      TWILIO_PHONE_NUMBER: 'Twilio phone number for SMS',
      SENTRY_DSN: 'Sentry DSN for error tracking',
      NEW_RELIC_LICENSE_KEY: 'New Relic license key for monitoring'
    };
    
    return helpText[varName] || 'Check documentation for details';
  }
  
  /**
   * Check if production ready
   */
  isProductionReady() {
    const criticalPassed = this.validationResults.critical.failed.length === 0;
    
    if (criticalPassed) {
      console.log('🎉 PRODUCTION READY: All critical variables are set!');
      
      if (this.validationResults.recommended.failed.length === 0) {
        console.log('✨ EXCELLENT: All recommended variables are also set!');
      } else {
        console.log('💡 GOOD: Consider setting recommended variables for best experience.');
      }
      
      return true;
    } else {
      console.log('🚨 NOT PRODUCTION READY: Critical variables are missing!');
      console.log('   Please set all critical variables before deploying to production.');
      return false;
    }
  }
  
  /**
   * Generate environment file template
   */
  generateTemplate() {
    console.log('\n📝 ENVIRONMENT FILE TEMPLATE:\n');
    console.log('# Critical Variables (Required)');
    this.requiredVars.CRITICAL.forEach(varName => {
      console.log(`${varName}=your_${varName.toLowerCase()}_here`);
    });
    
    console.log('\n# Recommended Variables');
    this.requiredVars.RECOMMENDED.forEach(varName => {
      console.log(`${varName}=your_${varName.toLowerCase()}_here`);
    });
    
    console.log('\n# Optional Variables');
    this.requiredVars.OPTIONAL.forEach(varName => {
      console.log(`# ${varName}=your_${varName.toLowerCase()}_here`);
    });
  }
}

// Run validation if script is executed directly
if (require.main === module) {
  const validator = new EnvironmentValidator();
  
  // Check if user wants to generate template
  const args = process.argv.slice(2);
  if (args.includes('--template') || args.includes('-t')) {
    validator.generateTemplate();
  } else {
    const isReady = validator.validateAll();
    process.exit(isReady ? 0 : 1);
  }
}

module.exports = EnvironmentValidator;
