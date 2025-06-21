import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useUser } from '../../hooks/useUniversalAuth';
import { useDevAuth } from '../../context/DevAuthContext';

const ExtensionIntegration = () => {
  const clerkAuth = useAuth();
  const { user, isSignedIn } = useUser();
  const devAuth = useDevAuth();
  const [extensionInstalled, setExtensionInstalled] = useState(false);
  const [integrationStatus, setIntegrationStatus] = useState('pending');

  // Get authentication token based on current auth method
  const getAuthToken = useCallback(async () => {
    const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
    const hasValidClerkKey = clerkPubKey && clerkPubKey.startsWith('pk_');

    if (hasValidClerkKey && clerkAuth.getToken) {
      try {
        return await clerkAuth.getToken();
      } catch (error) {
        console.error('Failed to get Clerk token:', error);
        return null;
      }
    } else if (devAuth && user) {
      // For development auth, create a simple token
      return `dev_token_${user.id}`;
    }
    return null;
  }, [clerkAuth, user, devAuth]);

  // Function to sync auth token with extension - use direct Chrome messaging
  const syncAuthToken = useCallback(async () => {
    try {
      const authToken = await getAuthToken();
      if (!authToken) {
        console.warn('No auth token available for extension sync');
        return;
      }

      // Check if chrome extension API is available
      if (typeof window !== 'undefined' && window.chrome && window.chrome.runtime) {
        // Send directly to the extension using its ID
        // Use a specific ID in production for security
        window.chrome.runtime.sendMessage('*', {
          action: 'saveAuthToken',
          token: authToken
        }, response => {
          if (response && response.success) {
            console.log('Auth token successfully synced with extension');
            setIntegrationStatus('success');
          } else {
            console.warn('Extension responded but auth sync failed');
            setIntegrationStatus('warning');
          }
        });
      } else {
        // Fallback to postMessage for compatibility
        window.postMessage(
          {
            type: 'AUTOAPPLY_SYNC_TOKEN',
            payload: { token: authToken }
          },
          window.location.origin
        );
        console.log('Auth token sent to extension via postMessage');
      }    } catch (error) {
      console.error('Error sending token to extension:', error);
      setIntegrationStatus('error');
    }
  }, [getAuthToken]);

  // Check if extension is installed
  useEffect(() => {
    const checkExtension = () => {
      // Chrome extensions can communicate through a custom event
      if (typeof window !== 'undefined') {
        // Try to send a message to the extension
        try {
          window.postMessage(
            { type: 'AUTOAPPLY_CHECK_EXTENSION' },
            window.location.origin
          );

          // Set a timeout to assume extension is not installed if no response
          const timeout = setTimeout(() => {
            setExtensionInstalled(false);
          }, 1000);

          // Listen for response
          const messageListener = (event) => {
            if (
              event.source === window &&
              event.data &&
              event.data.type === 'AUTOAPPLY_EXTENSION_RESPONSE'
            ) {
              clearTimeout(timeout);
              setExtensionInstalled(true);
              window.removeEventListener('message', messageListener);
            }
          };

          window.addEventListener('message', messageListener);

          return () => {
            window.removeEventListener('message', messageListener);
            clearTimeout(timeout);
          };
        } catch (error) {
          console.error('Error checking extension:', error);
          setExtensionInstalled(false);
          setIntegrationStatus('error');
        }
      }
    };

    checkExtension();
  }, []);
  // Sync auth token with extension when user logs in
  useEffect(() => {
    if (isSignedIn && extensionInstalled) {
      syncAuthToken();
    }
  }, [isSignedIn, extensionInstalled, syncAuthToken]);

  // Component doesn't render anything visible
  return null;
};

export default ExtensionIntegration;
