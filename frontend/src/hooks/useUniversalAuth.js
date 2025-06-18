import { useUser as useClerkUser } from '@clerk/clerk-react';
import { useDevAuth } from '../context/DevAuthContext';

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
const isDevelopment = process.env.NODE_ENV === 'development';
const hasValidClerkKey = clerkPubKey && clerkPubKey.startsWith('pk_');

// Fixed: Remove console.log statements in production, keep only development logging
if (isDevelopment) {
  console.log('useUniversalAuth: Clerk key available:', !!clerkPubKey);
  console.log('useUniversalAuth: Valid Clerk key:', hasValidClerkKey);
  console.log('useUniversalAuth: Development mode:', isDevelopment);
}

// Universal user hook that works with both Clerk and development auth
export function useUser() {
  const clerkUser = useClerkUser();
  // Always call useDevAuth to avoid conditional hook calls
  const devAuth = useDevAuth();
  // Use Clerk if available and properly configured
  if (hasValidClerkKey) {
    // Fixed: Only log in development mode
    if (isDevelopment) {
      console.log('useUniversalAuth: Using Clerk authentication');
    }
    return clerkUser;
  }

  // Use development auth in development without valid Clerk key
  if (isDevelopment && devAuth) {
    // Fixed: Only log in development mode
    if (isDevelopment) {
      console.log('useUniversalAuth: Using development authentication');
    }
    return {
      isLoaded: devAuth.isLoaded,
      isSignedIn: devAuth.isSignedIn,
      user: devAuth.user
    };
  }
  // Fallback for production without proper Clerk setup
  // Fixed: Use console.warn only in development, avoid console output in production
  if (isDevelopment) {
    console.warn('useUniversalAuth: No authentication method available');
  }
  return {
    isLoaded: true,
    isSignedIn: false,
    user: null
  };
}
