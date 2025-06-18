const validator = require('validator');
const DOMPurify = require('isomorphic-dompurify');

/**
 * Enhanced input validation and sanitization middleware
 */

// Sanitize string input
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  
  // Remove HTML tags and sanitize
  const cleaned = DOMPurify.sanitize(str, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
  
  // Trim whitespace
  return cleaned.trim();
};

// Sanitize object recursively
const sanitizeObject = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return typeof obj === 'string' ? sanitizeString(obj) : obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    // Sanitize key
    const cleanKey = sanitizeString(key);
    // Sanitize value
    sanitized[cleanKey] = sanitizeObject(value);
  }
  
  return sanitized;
};

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  try {
    // Sanitize body
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeObject(req.body);
    }
    
    // Sanitize query parameters
    if (req.query && typeof req.query === 'object') {
      req.query = sanitizeObject(req.query);
    }
    
    // Sanitize URL parameters
    if (req.params && typeof req.params === 'object') {
      req.params = sanitizeObject(req.params);
    }
    
    next();
  } catch (error) {
    console.error('Input sanitization error:', error);
    return res.status(400).json({
      success: false,
      error: 'invalid_input',
      message: 'Invalid input data provided'
    });
  }
};

// Email validation
const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return validator.isEmail(email) && email.length <= 320; // RFC 5321 limit
};

// Password validation
const validatePassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  
  // At least 8 characters, at least one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,128}$/;
  return passwordRegex.test(password);
};

// MongoDB ObjectId validation
const validateObjectId = (id) => {
  if (!id || typeof id !== 'string') return false;
  return validator.isMongoId(id);
};

// File type validation
const validateFileType = (mimetype, allowedTypes = []) => {
  if (!mimetype || typeof mimetype !== 'string') return false;
  return allowedTypes.includes(mimetype);
};

// URL validation
const validateURL = (url) => {
  if (!url || typeof url !== 'string') return false;
  return validator.isURL(url, {
    protocols: ['http', 'https'],
    require_protocol: true,
    require_valid_protocol: true,
    allow_underscores: false,
    allow_trailing_dot: false,
    allow_protocol_relative_urls: false
  });
};

// Validation middleware factory
const createValidator = (validationRules) => {
  return (req, res, next) => {
    const errors = [];
    
    for (const [field, rules] of Object.entries(validationRules)) {
      const value = req.body[field];
      
      // Check required fields
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field} is required`);
        continue;
      }
      
      // Skip validation if field is not required and empty
      if (!rules.required && (value === undefined || value === null || value === '')) {
        continue;
      }
      
      // Type validation
      if (rules.type && typeof value !== rules.type) {
        errors.push(`${field} must be of type ${rules.type}`);
        continue;
      }
      
      // Length validation
      if (rules.minLength && value.length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters long`);
      }
      
      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${field} must be no more than ${rules.maxLength} characters long`);
      }
      
      // Custom validation
      if (rules.validator && !rules.validator(value)) {
        errors.push(rules.message || `${field} is invalid`);
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'validation_error',
        message: 'Validation failed',
        details: errors
      });
    }
    
    next();
  };
};

// Common validation rules
const commonValidations = {
  email: {
    required: true,
    type: 'string',
    validator: validateEmail,
    message: 'Please provide a valid email address'
  },
  password: {
    required: true,
    type: 'string',
    validator: validatePassword,
    message: 'Password must be at least 8 characters with uppercase, lowercase, and number'
  },
  name: {
    required: true,
    type: 'string',
    minLength: 2,
    maxLength: 50,
    message: 'Name must be between 2 and 50 characters'
  },
  objectId: {
    required: true,
    type: 'string',
    validator: validateObjectId,
    message: 'Invalid ID format'
  }
};

module.exports = {
  sanitizeInput,
  sanitizeString,
  sanitizeObject,
  validateEmail,
  validatePassword,
  validateObjectId,
  validateFileType,
  validateURL,
  createValidator,
  commonValidations,
  
  // Auth-specific validators
  validateRegistration: createValidator({
    name: commonValidations.name,
    email: commonValidations.email,
    password: commonValidations.password
  }),
  
  validateLogin: createValidator({
    email: commonValidations.email,
    password: {
      required: true,
      type: 'string',
      minLength: 1,
      message: 'Password is required'
    }
  }),
  
  // User profile validators
  validateProfileUpdate: createValidator({
    name: { ...commonValidations.name, required: false },
    email: { ...commonValidations.email, required: false }
  }),
  
  validatePasswordUpdate: createValidator({
    currentPassword: {
      required: true,
      type: 'string',
      minLength: 1,
      message: 'Current password is required'
    },
    newPassword: commonValidations.password
  })
};
