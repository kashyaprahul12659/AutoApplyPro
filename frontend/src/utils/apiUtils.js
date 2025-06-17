import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
const hasValidClerkKey = clerkPubKey && clerkPubKey.startsWith('pk_');

// Get authentication token based on current auth method
const getAuthToken = () => {
  // For now, use localStorage token or fallback to development auth
  // In a real implementation, this would be passed from the calling component
  return localStorage.getItem('token') || 'dev-token';
};

// Get user ID for development auth
const getDevUserId = () => {
  const userData = localStorage.getItem('user');
  if (userData) {
    try {
      const user = JSON.parse(userData);
      return user.id || 'dev-user-123';
    } catch (error) {
      return 'dev-user-123';
    }
  }
  return 'dev-user-123';
};

// Create authenticated API call
export const createApiCall = async (method, endpoint, data = null) => {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };    // Add authentication header based on auth method
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

    console.log('Making API request:', method, endpoint, 'Auth method:', hasValidClerkKey ? 'Clerk' : 'Development');
    
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

// Convenience methods
export const apiGet = (endpoint) => createApiCall('GET', endpoint);
export const apiPost = (endpoint, data) => createApiCall('POST', endpoint, data);
export const apiPut = (endpoint, data) => createApiCall('PUT', endpoint, data);
export const apiDelete = (endpoint) => createApiCall('DELETE', endpoint);
