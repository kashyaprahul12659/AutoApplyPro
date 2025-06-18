const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { auditLogger } = require('../utils/logger');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
    validate: {
      validator: function(v) {
        // Allow letters, spaces, hyphens, and apostrophes
        return /^[a-zA-Z\s\-']+$/.test(v);
      },
      message: 'Name can only contain letters, spaces, hyphens, and apostrophes'
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: [320, 'Email cannot exceed 320 characters'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email address'
    },
    index: true
  },
  password: {
    type: String,    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    maxlength: [128, 'Password cannot exceed 128 characters'],
    validate: {
      validator: function(v) {
        // At least one uppercase, one lowercase, one number, and one special character
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/.test(v);
      },
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    },
    select: false // Don't include password in queries by default
  },
  profilePicture: {
    type: String,
    default: '',
    validate: {
      validator: function(v) {
        return !v || validator.isURL(v);
      },
      message: 'Profile picture must be a valid URL'
    }
  },
  
  latestResume: {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume'
    },
    filename: {
      type: String,
      maxlength: [255, 'Filename cannot exceed 255 characters']
    },
    uploadDate: {
      type: Date,
      validate: {
        validator: function(v) {
          return !v || v <= new Date();
        },
        message: 'Upload date cannot be in the future'
      }
    }
  },
  profileData: {
    extractedFromResume: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      maxlength: [100, 'Profile name cannot exceed 100 characters']
    },
    email: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || validator.isEmail(v);
        },
        message: 'Profile email must be valid'
      }
    },
    phone: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || validator.isMobilePhone(v, 'any');
        },
        message: 'Phone number must be valid'
      }
    },
    education: [
      {
        degree: {
          type: String,
          maxlength: [100, 'Degree cannot exceed 100 characters']
        },
        institution: {
          type: String,
          maxlength: [200, 'Institution name cannot exceed 200 characters']
        },
        year: {
          type: String,
          validate: {
            validator: function(v) {
              return !v || /^\d{4}(-\d{4})?$/.test(v);
            },
            message: 'Year must be in format YYYY or YYYY-YYYY'
          }
        }
      }
    ],
    experience: [
      {
        company: {
          type: String,
          maxlength: [200, 'Company name cannot exceed 200 characters']
        },
        role: {
          type: String,
          maxlength: [100, 'Role cannot exceed 100 characters']
        },
        duration: {
          type: String,
          maxlength: [50, 'Duration cannot exceed 50 characters']
        }
      }
    ],
    skills: [{
      type: String,
      maxlength: [50, 'Skill name cannot exceed 50 characters']
    }],
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
    // Remove conflicting manual timestamp fields since we're using timestamps: true
  // createdAt and updatedAt will be automatically managed by Mongoose
  lastLogin: {
    type: Date,
    index: true
  },
  loginAttempts: {
    type: Number,
    default: 0,
    max: [10, 'Too many login attempts']
  },
  lockUntil: Date,
  aiCredits: {
    type: Number,
    default: 3,    min: [0, 'AI credits cannot be negative'],
    max: [1000, 'AI credits cannot exceed 1000']
  },
  isPro: {
    type: Boolean,
    default: false
  },
  isProUser: {
    type: Boolean,
    default: false
  },
  proExpiresAt: {
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v > new Date();
      },
      message: 'Pro expiration date must be in the future'
    }
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    select: false
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: {
    type: String,
    select: false
  },
  
  // Subscription and Plan Management
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'pro', 'enterprise'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'canceled', 'past_due', 'incomplete', 'trialing'],
      default: 'active'
    },
    razorpaySubscriptionId: String,
    razorpayCustomerId: String,
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    trialEnd: Date,
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false
    }
  },
  
  // Feature Usage Tracking
  featureUsage: {
    aiCreditsUsed: {
      type: Number,
      default: 0,
      min: 0
    },
    resumeAnalysisCount: {
      type: Number,
      default: 0,
      min: 0
    },
    jdAnalysisCount: {
      type: Number,
      default: 0,
      min: 0
    },
    resumeBuildsCount: {
      type: Number,
      default: 0,
      min: 0
    },
    apiCallsCount: {
      type: Number,
      default: 0,
      min: 0
    },
    lastResetDate: {
      type: Date,
      default: Date.now
    }
  },
  
  // Notification Preferences
  notificationPreferences: {
    email: {
      marketing: {
        type: Boolean,
        default: true
      },
      jobAlerts: {
        type: Boolean,
        default: true
      },
      systemUpdates: {
        type: Boolean,
        default: true
      },
      weeklyReports: {
        type: Boolean,
        default: true
      }
    },
    push: {
      enabled: {
        type: Boolean,
        default: true
      },
      jobMatches: {
        type: Boolean,
        default: true
      },
      applicationUpdates: {
        type: Boolean,
        default: true
      }
    },
    sms: {
      enabled: {
        type: Boolean,
        default: false
      },
      urgentOnly: {
        type: Boolean,
        default: true
      }
    }
  },
  
  // Analytics and Activity Tracking
  analytics: {
    loginCount: {
      type: Number,
      default: 0,
      min: 0
    },
    sessionDuration: {
      type: Number,
      default: 0,
      min: 0
    },
    featuresUsed: [{
      feature: String,
      count: {
        type: Number,
        default: 0
      },
      lastUsed: Date
    }],
    engagementScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    lastActivityDate: {
      type: Date,
      default: Date.now
    }
  },
  
  // Offline Notifications Storage
  offlineNotifications: [{
    type: {
      type: String,
      enum: ['success', 'error', 'warning', 'info'],
      required: true
    },
    title: {
      type: String,
      required: true,
      maxlength: 100
    },
    message: {
      type: String,
      required: true,
      maxlength: 500
    },
    data: mongoose.Schema.Types.Mixed,
    read: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      default: function() {
        return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      }
    }
  }],
  
  // API Access and Developer Features
  apiAccess: {
    enabled: {
      type: Boolean,
      default: false
    },
    apiKey: {
      type: String,
      select: false
    },
    apiKeyCreatedAt: Date,
    rateLimitTier: {
      type: String,
      enum: ['basic', 'premium', 'enterprise'],
      default: 'basic'
    },
    webhookUrl: String,
    webhookSecret: {
      type: String,      select: false
    }
  }
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt
  toJSON: {
    transform: function(doc, ret) {
      // Remove sensitive fields from JSON output
      delete ret.password;
      delete ret.emailVerificationToken;
      delete ret.passwordResetToken;
      delete ret.passwordResetExpires;
      delete ret.twoFactorSecret;
      delete ret.loginAttempts;
      delete ret.lockUntil;
      delete ret.__v;
      
      // Ensure consistency between isPro and isProUser
      ret.isPro = ret.isPro || ret.isProUser;
      ret.isProUser = ret.isPro || ret.isProUser;
      
      return ret;
    }
  }
});

// Compound indexes for better query performance
UserSchema.index({ email: 1, emailVerified: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ lastLogin: -1 });
UserSchema.index({ isPro: 1, proExpiresAt: 1 });

// New indexes for enhanced features
UserSchema.index({ 'subscription.plan': 1, 'subscription.status': 1 });
UserSchema.index({ 'analytics.lastActivityDate': -1 });
UserSchema.index({ 'analytics.engagementScore': -1 });
UserSchema.index({ 'apiAccess.enabled': 1, 'apiAccess.rateLimitTier': 1 });
UserSchema.index({ 'offlineNotifications.read': 1, 'offlineNotifications.createdAt': -1 });
UserSchema.index({ 'offlineNotifications.expiresAt': 1 }, { expireAfterSeconds: 0 }); // TTL index
UserSchema.index({ isProUser: 1, proExpiresAt: 1 }); // Index for Pro users

// Virtual for account lock status
UserSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Virtual for backward compatibility - sync isPro with isProUser
UserSchema.virtual('proStatus').get(function() {
  return this.isPro || this.isProUser;
});

// Pre-save middleware to sync isPro and isProUser
UserSchema.pre('save', function(next) {
  // Sync isPro and isProUser fields for consistency
  if (this.isModified('isPro')) {
    this.isProUser = this.isPro;
  } else if (this.isModified('isProUser')) {
    this.isPro = this.isProUser;
  }
  next();
});

// Remove the manual timestamp update middleware since timestamps: true handles it automatically

// Hash password before saving
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(12); // Increased from 10 to 12 for better security
    this.password = await bcrypt.hash(this.password, salt);
    
    // Log password change for audit
    if (!this.isNew) {
      auditLogger('password_changed', this._id, {
        timestamp: new Date().toISOString()
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Method to increment login attempts
UserSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // If we have hit max attempts and it's not locked already, lock the account
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
    
    // Log account lock for security
    auditLogger('account_locked', this._id, {
      reason: 'max_login_attempts',
      lockUntil: updates.$set.lockUntil,
      timestamp: new Date().toISOString()
    });
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
UserSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Method to update last login
UserSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save({ validateBeforeSave: false });
};

// Method to check if Pro subscription is expired
UserSchema.methods.isProExpired = function() {
  return (this.isPro || this.isProUser) && this.proExpiresAt && this.proExpiresAt < new Date();
};

// Method to safely get user data (excluding sensitive fields)
UserSchema.methods.getSafeUserData = function() {
  const userObject = this.toObject();
  
  // Remove sensitive fields
  delete userObject.password;
  delete userObject.emailVerificationToken;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  delete userObject.twoFactorSecret;
  delete userObject.loginAttempts;
  delete userObject.lockUntil;
  delete userObject.apiAccess?.apiKey;
  delete userObject.apiAccess?.webhookSecret;
  
  return userObject;
};

// Method to check feature access based on subscription plan
UserSchema.methods.hasFeatureAccess = function(feature) {
  const planLimits = {
    free: {
      aiCredits: 3,
      resumeAnalysis: 5,
      jdAnalysis: 3,
      resumeBuilds: 2,
      apiCalls: 0,
      advancedAnalytics: false,
      webhooks: false,
      prioritySupport: false
    },
    basic: {
      aiCredits: 20,
      resumeAnalysis: 25,
      jdAnalysis: 15,
      resumeBuilds: 10,
      apiCalls: 100,
      advancedAnalytics: true,
      webhooks: false,
      prioritySupport: false
    },
    pro: {
      aiCredits: 100,
      resumeAnalysis: 100,
      jdAnalysis: 75,
      resumeBuilds: 50,
      apiCalls: 1000,
      advancedAnalytics: true,
      webhooks: true,
      prioritySupport: true
    },
    enterprise: {
      aiCredits: -1, // unlimited
      resumeAnalysis: -1,
      jdAnalysis: -1,
      resumeBuilds: -1,
      apiCalls: -1,
      advancedAnalytics: true,
      webhooks: true,
      prioritySupport: true
    }
  };
  
  const userPlan = this.subscription?.plan || 'free';
  const limits = planLimits[userPlan];
  
  if (!limits) return false;
  
  // Check boolean features
  if (typeof limits[feature] === 'boolean') {
    return limits[feature];
  }
  
  // Check usage-based features
  if (limits[feature] === -1) return true; // unlimited
  if (limits[feature] === 0) return false; // not allowed
  
  // Check current usage against limits
  const currentUsage = this.featureUsage?.[feature + 'Count'] || 0;
  return currentUsage < limits[feature];
};

// Method to increment feature usage
UserSchema.methods.incrementFeatureUsage = function(feature) {
  if (!this.featureUsage) {
    this.featureUsage = {};
  }
  
  const field = feature + 'Count';
  this.featureUsage[field] = (this.featureUsage[field] || 0) + 1;
  
  // Update feature analytics
  if (!this.analytics.featuresUsed) {
    this.analytics.featuresUsed = [];
  }
  
  const featureUsage = this.analytics.featuresUsed.find(f => f.feature === feature);
  if (featureUsage) {
    featureUsage.count += 1;
    featureUsage.lastUsed = new Date();
  } else {
    this.analytics.featuresUsed.push({
      feature,
      count: 1,
      lastUsed: new Date()
    });
  }
  
  return this.save();
};

// Method to reset monthly usage
UserSchema.methods.resetMonthlyUsage = function() {
  this.featureUsage = {
    aiCreditsUsed: 0,
    resumeAnalysisCount: 0,
    jdAnalysisCount: 0,
    resumeBuildsCount: 0,
    apiCallsCount: 0,
    lastResetDate: new Date()
  };
  
  return this.save();
};

// Method to add offline notification
UserSchema.methods.addOfflineNotification = function(notification) {
  if (!this.offlineNotifications) {
    this.offlineNotifications = [];
  }
  
  // Limit to 50 notifications per user
  if (this.offlineNotifications.length >= 50) {
    this.offlineNotifications.shift(); // Remove oldest
  }
  
  this.offlineNotifications.push(notification);
  return this.save();
};

// Method to mark notifications as read
UserSchema.methods.markNotificationsAsRead = function(notificationIds = []) {
  if (notificationIds.length === 0) {
    // Mark all as read
    this.offlineNotifications.forEach(notification => {
      notification.read = true;
    });
  } else {
    // Mark specific notifications as read
    this.offlineNotifications.forEach(notification => {
      if (notificationIds.includes(notification._id.toString())) {
        notification.read = true;
      }
    });
  }
  
  return this.save();
};

// Method to update engagement score
UserSchema.methods.updateEngagementScore = function() {
  const now = new Date();
  const daysSinceLastActivity = this.analytics.lastActivityDate ? 
    Math.floor((now - this.analytics.lastActivityDate) / (1000 * 60 * 60 * 24)) : 0;
  
  let score = 0;
  
  // Base score from login frequency
  score += Math.min(this.analytics.loginCount * 2, 30);
  
  // Feature usage score
  const totalFeatureUsage = this.analytics.featuresUsed?.reduce((sum, f) => sum + f.count, 0) || 0;
  score += Math.min(totalFeatureUsage, 40);
  
  // Recency penalty
  if (daysSinceLastActivity > 30) {
    score *= 0.1; // Heavy penalty for inactive users
  } else if (daysSinceLastActivity > 7) {
    score *= 0.7;
  } else if (daysSinceLastActivity > 3) {
    score *= 0.9;
  }
  
  // Subscription bonus
  if (this.subscription?.plan === 'pro' || this.subscription?.plan === 'enterprise') {
    score += 10;
  } else if (this.subscription?.plan === 'basic') {
    score += 5;
  }
  
  this.analytics.engagementScore = Math.min(Math.round(score), 100);
  this.analytics.lastActivityDate = now;
  
  return this.save();
};

module.exports = mongoose.model('User', UserSchema);
