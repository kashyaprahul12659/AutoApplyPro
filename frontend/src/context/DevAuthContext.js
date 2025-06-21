import React, { createContext, useContext, useState, useEffect } from 'react';

// Development authentication context for when Clerk is not configured
const DevAuthContext = createContext();

export const useDevAuth = () => {
  const context = useContext(DevAuthContext);
  if (!context) {
    // Return a default context instead of throwing an error
    return {
      isSignedIn: false,
      user: null,
      isLoaded: true,
      signIn: () => Promise.reject('DevAuth not available'),
      signOut: () => Promise.reject('DevAuth not available'),
      signUp: () => Promise.reject('DevAuth not available')
    };
  }
  return context;
};

export function DevAuthProvider({ children }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Simulate loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
      // Check if user was previously logged in (simple localStorage simulation)
      const savedUser = localStorage.getItem('dev_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setIsSignedIn(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const signIn = (email, password) => {
    // Simulate sign in
    const mockUser = {
      id: 'dev_user_123',
      fullName: 'Development User',
      primaryEmailAddress: {
        emailAddress: email
      },
      imageUrl: null
    };

    setUser(mockUser);
    setIsSignedIn(true);
    localStorage.setItem('dev_user', JSON.stringify(mockUser));
    return Promise.resolve();
  };

  const signOut = () => {
    setUser(null);
    setIsSignedIn(false);
    localStorage.removeItem('dev_user');
    return Promise.resolve();
  };

  const value = {
    isSignedIn,
    user,
    isLoaded,
    signIn,
    signOut
  };

  return (
    <DevAuthContext.Provider value={value}>
      {children}
    </DevAuthContext.Provider>
  );
}
