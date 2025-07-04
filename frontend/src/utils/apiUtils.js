import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://autoapplypro-backend-d14947a17c9b.herokuapp.com/api';
const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
const hasValidClerkKey = clerkPubKey && clerkPubKey.startsWith('pk_');

// Get authentication token based on current auth method with error handling
const getAuthToken = () => {
  try {
    // For now, use localStorage token or fallback to development auth
    // In a real implementation, this would be passed from the calling component
    return localStorage.getItem('token') || 'dev-token';
  } catch (error) {
    console.error('Error retrieving auth token:', error);
    return 'dev-token';
  }
};

// Get user ID for development auth with enhanced error handling
const getDevUserId = () => {
  try {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user?.id || 'dev-user-123';
      } catch (parseError) {
        console.warn('Failed to parse user data:', parseError);
        return 'dev-user-123';
      }
    }
    return 'dev-user-123';
  } catch (error) {
    console.error('Error retrieving user ID:', error);
    return 'dev-user-123';
  }
};

// Create authenticated API call
export const createApiCall = async (method, endpoint, data = null) => {
  try {
    if (!method || !endpoint) {
      console.error('Invalid API call: Missing method or endpoint', { method, endpoint });
      throw new Error('Invalid API call: Missing method or endpoint');
    }

    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };    
    
    // Add authentication header based on auth method
    if (hasValidClerkKey) {
      const token = getAuthToken();
      if (token && token !== 'dev-token') {
        config.headers['Authorization'] = `Bearer ${token}`;
      } else {
        config.headers['x-dev-user-id'] = getDevUserId();
      }
    } else {
      // Use development authentication
      config.headers['x-dev-user-id'] = getDevUserId();
    }

    if (data) {
      config.data = data;
    }

    // Add request timeout and error handling
    config.timeout = 30000; // 30 seconds timeout
    config.validateStatus = status => status >= 200 && status < 500; // Handle 4xx errors in response data

    console.log('Making API request:', method, endpoint, 'Auth method:', hasValidClerkKey ? 'Clerk' : 'Development');

    try {
      const response = await axios(config);
      return response.data;
    } catch (axiosError) {
      console.error('API Request failed (axios):', axiosError.message || axiosError);
      // Return structured error response instead of throwing
      return {
        error: true,
        message: axiosError.message || 'API request failed',
        code: axiosError.code || 'UNKNOWN_ERROR',
        data: null
      };
    }
  } catch (error) {
    console.error('API Request failed (general):', error);
    // Return structured error response instead of throwing
    return {
      error: true,
      message: error.message || 'API request failed',
      code: 'API_CALL_ERROR',
      data: null
    };
  }
};

// Convenience methods with defensive programming
export const apiGet = (endpoint) => {
  if (!endpoint) {
    console.warn('Invalid API GET call: Missing endpoint');
    return Promise.resolve({ error: true, message: 'Invalid endpoint', data: null });
  }
  return createApiCall('GET', endpoint);
};

export const apiPost = (endpoint, data) => {
  if (!endpoint) {
    console.warn('Invalid API POST call: Missing endpoint');
    return Promise.resolve({ error: true, message: 'Invalid endpoint', data: null });
  }
  return createApiCall('POST', endpoint, data);
};

export const apiPut = (endpoint, data) => {
  if (!endpoint) {
    console.warn('Invalid API PUT call: Missing endpoint');
    return Promise.resolve({ error: true, message: 'Invalid endpoint', data: null });
  }
  return createApiCall('PUT', endpoint, data);
};

export const apiDelete = (endpoint) => {
  if (!endpoint) {
    console.warn('Invalid API DELETE call: Missing endpoint');
    return Promise.resolve({ error: true, message: 'Invalid endpoint', data: null });
  }
  return createApiCall('DELETE', endpoint);
};
