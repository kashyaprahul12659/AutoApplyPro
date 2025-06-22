// AutoApply Pro - Message Listener
// This script listens for messages from the web app and handles communication

// Determine environment based on extension installation type
let isDevMode = false;

// Use a safer approach to check environment
function checkEnvironment() {
  try {
    // Check if we're in an extension context and have management permissions
    if (typeof chrome !== 'undefined' && 
        chrome.management && 
        typeof chrome.management.getSelf === 'function') {
      
      chrome.management.getSelf((info) => {
        if (chrome.runtime.lastError) {
          // Permission denied or other error, assume production
          isDevMode = false;
          debugLog('Management API error, assuming production environment');
        } else if (info && info.installType) {
          isDevMode = info.installType === 'development';
          debugLog(`Environment detected: ${isDevMode ? 'development' : 'production'}`);
        }
      });
    } else {
      // Fallback: assume production if management API is not available
      isDevMode = false;
      debugLog('Management API not available, assuming production environment');
    }
  } catch (error) {
    // Fallback: assume production if there's any error
    isDevMode = false;
    debugLog('Error checking environment, defaulting to production:', error);
  }
}

// Initialize environment check
checkEnvironment();

function debugLog(...args) {
  if (isDevMode) {
    console.log('[AutoApply Listener]', ...args);
  }
}

// Get allowed origins based on environment
const getAllowedOrigins = () => {
  return isDevMode ? 
    ['http://localhost:3000', 'https://autoapplypro.netlify.app'] : 
    ['https://autoapplypro.tech', 'https://www.autoapplypro.tech', 'https://autoapplypro.com', 'https://www.autoapplypro.com', 'https://autoapplypro.netlify.app'];
};

// Throttle postMessage to avoid spamming
let lastTokenSync = 0;
const TOKEN_SYNC_THROTTLE_MS = 3000;

// Listen for messages from the web page
window.addEventListener('message', function(event) {
  // We only accept messages from the AutoApply Pro web app
  const allowedOrigins = getAllowedOrigins();
  if (!allowedOrigins.includes(event.origin)) {
    debugLog('Rejected message from unauthorized origin:', event.origin);
    return;
  }
  
  // Check if this is a message for the extension
  if (event.data && event.data.type) {
    debugLog('Received message:', event.data.type);
    
    switch (event.data.type) {
      case 'AUTOAPPLY_CHECK_EXTENSION':
        // Respond to the web app that the extension is installed
        window.postMessage({
          type: 'AUTOAPPLY_EXTENSION_RESPONSE',
          version: chrome.runtime.getManifest().version
        }, '*');
        
        // Check if we already have a token - if so, let the web app know
        chrome.storage.local.get(['authToken', 'userData'], function(result) {
          if (result.authToken) {
            debugLog('Extension has existing auth token, sharing status with web app');
            window.postMessage({
              type: 'AUTOAPPLY_AUTH_STATUS',
              isAuthenticated: true,
              userData: result.userData || null
            }, '*');
          } else {
            window.postMessage({
              type: 'AUTOAPPLY_AUTH_STATUS',
              isAuthenticated: false
            }, '*');
          }
        });
        break;
        
      case 'AUTOAPPLY_SYNC_TOKEN': {
        // Throttle repeated token syncs
        const now = Date.now();
        if (now - lastTokenSync < TOKEN_SYNC_THROTTLE_MS) {
          debugLog('Throttled repeated AUTOAPPLY_SYNC_TOKEN');
          window.postMessage({
            type: 'AUTOAPPLY_TOKEN_SAVED',
            success: false,
            error: 'Throttled repeated token sync.'
          }, '*');
          return;
        }
        lastTokenSync = now;
        
        // Save the auth token to Chrome extension storage
        if (event.data.payload && event.data.payload.token) {
          debugLog('Saving auth token to extension storage');
          
          // Also save user data if provided
          const userData = event.data.payload.userData || null;
          
          chrome.runtime.sendMessage({
            action: 'saveAuthToken',
            token: event.data.payload.token,
            userData: userData
          }, function(response) {
            if (chrome.runtime.lastError) {
              debugLog('Error saving token:', chrome.runtime.lastError);
              window.postMessage({
                type: 'AUTOAPPLY_TOKEN_SAVED',
                success: false,
                error: chrome.runtime.lastError.message
              }, '*');
              return;
            }
            
            debugLog('Auth token saved successfully');
            
            // Confirm to the web app that the token was saved
            window.postMessage({
              type: 'AUTOAPPLY_TOKEN_SAVED',
              success: true
            }, '*');
          });
        }
        break;
      }
        
      case 'AUTOAPPLY_SYNC_USER_DATA':
        // Save user data separately (for plan updates, etc.)
        if (event.data.payload && event.data.payload.userData) {
          debugLog('Syncing user data to extension');
          
          chrome.storage.local.set({ userData: event.data.payload.userData }, function() {
            if (chrome.runtime.lastError) {
              debugLog('Error saving user data:', chrome.runtime.lastError);
              return;
            }
            
            debugLog('User data saved to extension storage');
            window.postMessage({
              type: 'AUTOAPPLY_USER_DATA_SAVED',
              success: true
            }, '*');
          });
        }
        break;
        
      case 'AUTOAPPLY_LOGOUT':
        // Clear the auth token when user logs out from the web app
        debugLog('Clearing auth data from extension storage');
        
        chrome.runtime.sendMessage({
          action: 'clearAuthToken'
        }, function(response) {
          if (chrome.runtime.lastError) {
            debugLog('Error clearing token:', chrome.runtime.lastError);
            return;
          }
          
          debugLog('Auth data cleared from extension storage');
          window.postMessage({
            type: 'AUTOAPPLY_TOKEN_CLEARED',
            success: true
          }, '*');
        });
        break;
        
      default:
        debugLog('Unknown message type:', event.data.type);
        break;
    }
  }
});

// Let the web app know the extension is ready
window.addEventListener('load', function() {
  // Wait a moment for the page to fully load
  setTimeout(() => {
    debugLog('Extension announcing presence to web app');
    let version = 'unknown';
    try {
      // Only access chrome if defined
      if (typeof window.chrome !== 'undefined' && window.chrome.runtime && typeof window.chrome.runtime.getManifest === 'function') {
        version = window.chrome.runtime.getManifest().version;
      }
    } catch (e) {
      // ignore
    }
    window.postMessage({
      type: 'AUTOAPPLY_EXTENSION_LOADED',
      version
    }, '*');
  }, 1000);
});
