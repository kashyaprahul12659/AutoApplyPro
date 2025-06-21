import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Setup axios defaults when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Load user on initial render if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('/api/auth/me');
        setUser(res.data);
      } catch (err) {
        console.error('Error loading user:', err);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Register user
  const register = async (formData) => {
    setError(null);
    try {
      const res = await axios.post('/api/auth/register', formData);
      setToken(res.data.token);
      return true;
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
      return false;
    }
  };

  // Login user
  const login = async (formData) => {
    setError(null);
    try {
      const res = await axios.post('/api/auth/login', formData);
      setToken(res.data.token);
      return true;
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
      return false;
    }
  };

  // Logout user
  const logout = () => {
    // Clear token and user state
    setToken(null);
    setUser(null);

    // Notify Chrome extension about logout
    try {
      // Method 1: Direct chrome message if extension is installed and in same browser
      if (typeof window !== 'undefined' && window.chrome && window.chrome.runtime) {
        try {
          window.chrome.runtime.sendMessage('*', { action: 'clearAuthToken' }, response => {
            console.log('Extension notified about logout');
          });
        } catch (chromeErr) {
          console.log('Could not directly message extension:', chromeErr);
        }
      }

      // Method 2: Fallback to window message for content script
      window.postMessage({
        type: 'AUTOAPPLY_LOGOUT'
      }, window.location.origin);

      console.log('Sent logout notification to extension');
    } catch (err) {
      console.error('Error notifying extension about logout:', err);
    }
  };

  // Update user profile
  const updateProfile = async (formData) => {
    try {
      const res = await axios.put('/api/users/profile', formData);
      setUser(res.data);
      return { success: true, data: res.data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.msg || 'Failed to update profile'
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
