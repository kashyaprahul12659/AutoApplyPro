import { useAuth } from '@clerk/clerk-react';
import { useUser } from './useUniversalAuth';
import { useDevAuth } from '../context/DevAuthContext';
import axios from 'axios';
import { useCallback } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://autoapplypro-backend-d14947a17c9b.herokuapp.com';
const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
const hasValidClerkKey = clerkPubKey && clerkPubKey.startsWith('pk_');

export const useApiWithAuth = () => {
  const clerkAuth = useAuth();
  const { user, isSignedIn, isLoaded } = useUser();
  const devAuth = useDevAuth();

  const makeAuthenticatedRequest = useCallback(async (method, endpoint, data = null) => {
    if (!isLoaded) {
      throw new Error('Authentication not loaded');
    }

    if (!isSignedIn) {
      throw new Error('User not authenticated');
    }

    try {
      const config = {
        method,
        url: `${API_BASE_URL}${endpoint}`,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // Add authentication header based on auth method
      if (hasValidClerkKey && clerkAuth.getToken) {
        // Use Clerk authentication
        const token = await clerkAuth.getToken();
        config.headers['Authorization'] = `Bearer ${token}`;
      } else if (devAuth && user) {
        // Use development authentication
        config.headers['x-dev-user-id'] = user.id || 'dev-user-123';
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
  }, [clerkAuth, user, isSignedIn, isLoaded, devAuth, hasValidClerkKey]);

  return {
    get: (endpoint) => makeAuthenticatedRequest('GET', endpoint),
    post: (endpoint, data) => makeAuthenticatedRequest('POST', endpoint, data),
    put: (endpoint, data) => makeAuthenticatedRequest('PUT', endpoint, data),
    delete: (endpoint) => makeAuthenticatedRequest('DELETE', endpoint),
    isAuthenticated: isLoaded && isSignedIn,
  };
};
