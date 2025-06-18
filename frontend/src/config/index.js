/**
 * Configuration settings for the AutoApply Pro application
 * This file centralizes API configuration and environment-specific settings
 */

// Determine the API base URL based on environment
export const getAPIBaseUrl = () => {
  // For local development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5000/api';
  }
  
  // For production environment - Heroku backend
  return process.env.REACT_APP_API_URL || 'https://autoapplypro-backend-d14947a17c9b.herokuapp.com/api';
};

// App configuration
export const appConfig = {
  appName: 'AutoApply Pro',
  apiTimeout: 30000, // API request timeout in milliseconds
  maxFileSize: 5 * 1024 * 1024, // 5MB max file size for uploads
  supportedFileTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  defaultPagination: {
    limit: 10,
    page: 1
  }
};
