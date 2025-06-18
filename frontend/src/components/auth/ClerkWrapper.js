import React from 'react';
import { ClerkProvider } from '@clerk/clerk-react';
import { DevAuthProvider } from '../../context/DevAuthContext';

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

// Development fallback when Clerk is not properly configured
const isDevelopment = process.env.NODE_ENV === 'development';
const hasValidClerkKey = clerkPubKey && clerkPubKey.startsWith('pk_');

if (!hasValidClerkKey && !isDevelopment) {
  throw new Error('Missing or invalid Clerk Publishable Key. Please check your .env file.');
}

export function ClerkWrapper({ children }) {
  // Always wrap with DevAuthProvider to avoid conditional hook calls
  const content = (
    <DevAuthProvider>
      {children}
    </DevAuthProvider>
  );

  // In development without valid Clerk key, use only development auth
  if (!hasValidClerkKey && isDevelopment) {
    console.warn('⚠️ Clerk not configured. Using development authentication mode.');
    return content;
  }  // When Clerk is available, wrap DevAuthProvider with ClerkProvider
  return (
    <ClerkProvider 
      publishableKey={clerkPubKey}
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: '#4f46e5',
          colorBackground: '#ffffff',
          colorInputBackground: '#ffffff',
          colorInputText: '#1f2937',
        }
      }}
    >
      {content}
    </ClerkProvider>
  );
}
