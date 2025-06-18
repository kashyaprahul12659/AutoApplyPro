import axios from 'axios';
import { getAPIBaseUrl } from '../config';

/**
 * Enhanced API service with caching, retry logic, and better error handling
 */

// Create axios instance with default configuration
const api = axios.create({
  baseURL: getAPIBaseUrl(),
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// In-memory cache for GET requests
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for performance monitoring
    config.metadata = { startTime: new Date() };

    // Add request ID for debugging
    config.headers['X-Request-ID'] = generateRequestId();

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log performance metrics in development
    if (process.env.NODE_ENV === 'development') {
      const endTime = new Date();
      const duration = endTime - response.config.metadata.startTime;
      console.log(`API Request: ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`);
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear invalid tokens
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      
      return Promise.reject(error);
    }

    // Handle network errors with retry logic
    if (!error.response && originalRequest.retryCount < 3) {
      originalRequest.retryCount = (originalRequest.retryCount || 0) + 1;
      
      // Exponential backoff
      const delay = Math.pow(2, originalRequest.retryCount) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return api(originalRequest);
    }

    // Enhanced error logging
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      requestId: error.config?.headers['X-Request-ID']
    });

    return Promise.reject(error);
  }
);

// Generate unique request ID
function generateRequestId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Get cache key for request
function getCacheKey(method, url, params) {
  return `${method}:${url}:${JSON.stringify(params || {})}`;
}

// Check if response is cacheable
function isCacheable(method, url) {
  return method === 'GET' && !url.includes('/auth/') && !url.includes('/health');
}

// Enhanced API methods with caching
const apiService = {
  // GET with caching
  async get(url, config = {}) {
    const cacheKey = getCacheKey('GET', url, config.params);
    
    // Check cache first
    if (isCacheable('GET', url)) {
      const cached = cache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
        return cached.data;
      }
    }

    try {
      const response = await api.get(url, config);
      
      // Cache successful responses
      if (isCacheable('GET', url) && response.status === 200) {
        cache.set(cacheKey, {
          data: response,
          timestamp: Date.now()
        });
        
        // Clean up old cache entries
        if (cache.size > 100) {
          const oldestKey = cache.keys().next().value;
          cache.delete(oldestKey);
        }
      }
      
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // POST
  async post(url, data, config = {}) {
    try {
      // Invalidate related cache entries
      this.invalidateCache(url);
      
      const response = await api.post(url, data, config);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // PUT
  async put(url, data, config = {}) {
    try {
      // Invalidate related cache entries
      this.invalidateCache(url);
      
      const response = await api.put(url, data, config);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // DELETE
  async delete(url, config = {}) {
    try {
      // Invalidate related cache entries
      this.invalidateCache(url);
      
      const response = await api.delete(url, config);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // File upload with progress
  async upload(url, formData, onProgress = null) {
    try {
      const response = await api.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(progress);
          }
        },
      });
      
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Download file
  async download(url, filename) {
    try {
      const response = await api.get(url, {
        responseType: 'blob',
      });
      
      // Create download link
      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Batch requests
  async batch(requests) {
    try {
      const promises = requests.map(request => {
        const { method, url, data, config } = request;
        return this[method](url, data, config);
      });
      
      const results = await Promise.allSettled(promises);
      return results;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Cache management
  invalidateCache(url) {
    // Remove cache entries that match the URL pattern
    for (const [key] of cache) {
      if (key.includes(url) || url.includes(key.split(':')[1])) {
        cache.delete(key);
      }
    }
  },

  clearCache() {
    cache.clear();
  },

  getCacheStats() {
    return {
      size: cache.size,
      keys: Array.from(cache.keys())
    };
  },

  // Error handling
  handleError(error) {
    const errorData = {
      message: 'An unexpected error occurred',
      status: error.response?.status,
      code: error.code,
      details: error.response?.data
    };

    // Customize error messages based on status code
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          errorData.message = data?.message || 'Invalid request data';
          break;
        case 401:
          errorData.message = 'Authentication required';
          break;
        case 403:
          errorData.message = 'Access denied';
          break;
        case 404:
          errorData.message = 'Resource not found';
          break;
        case 409:
          errorData.message = data?.message || 'Conflict occurred';
          break;
        case 422:
          errorData.message = 'Validation failed';
          break;
        case 429:
          errorData.message = 'Too many requests. Please try again later.';
          break;
        case 500:
          errorData.message = 'Server error. Please try again later.';
          break;
        case 503:
          errorData.message = 'Service temporarily unavailable';
          break;
        default:
          errorData.message = data?.message || 'An error occurred';
      }
    } else if (error.code === 'NETWORK_ERROR') {
      errorData.message = 'Network connection failed. Please check your internet connection.';
    } else if (error.code === 'TIMEOUT') {
      errorData.message = 'Request timed out. Please try again.';
    }

    return errorData;
  }
};

// Health check
apiService.healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw apiService.handleError(error);
  }
};

// Authentication helpers
apiService.auth = {
  login: (credentials) => apiService.post('/auth/login', credentials),
  register: (userData) => apiService.post('/auth/register', userData),
  logout: () => apiService.post('/auth/logout'),
  refreshToken: () => apiService.post('/auth/refresh'),
  forgotPassword: (email) => apiService.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => apiService.post('/auth/reset-password', { token, password }),
  verifyEmail: (token) => apiService.post('/auth/verify-email', { token })
};

// User management
apiService.user = {
  getProfile: () => apiService.get('/users/profile'),
  updateProfile: (data) => apiService.put('/users/profile', data),
  changePassword: (data) => apiService.put('/users/password', data),
  deleteAccount: () => apiService.delete('/users/account')
};

// Resume management
apiService.resume = {
  getAll: () => apiService.get('/resumes'),
  getById: (id) => apiService.get(`/resumes/${id}`),
  upload: (file, onProgress) => {
    const formData = new FormData();
    formData.append('resume', file);
    return apiService.upload('/resumes', formData, onProgress);
  },
  update: (id, data) => apiService.put(`/resumes/${id}`, data),
  delete: (id) => apiService.delete(`/resumes/${id}`),
  setPrimary: (id) => apiService.put(`/resumes/${id}/primary`)
};

// AI services
apiService.ai = {
  generateCoverLetter: (data) => apiService.post('/ai/cover-letter', data),
  analyzeJD: (data) => apiService.post('/jd-analyzer/analyze', data),
  improveResume: (data) => apiService.post('/resume-ai/improve', data)
};

// Job tracking
apiService.jobs = {
  getAll: (params) => apiService.get('/job-tracker', { params }),
  getById: (id) => apiService.get(`/job-tracker/${id}`),
  create: (data) => apiService.post('/job-tracker', data),
  update: (id, data) => apiService.put(`/job-tracker/${id}`, data),
  delete: (id) => apiService.delete(`/job-tracker/${id}`)
};

export default apiService;
