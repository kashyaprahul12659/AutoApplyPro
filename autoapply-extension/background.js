// AutoApply Pro - Background Service Worker
// This script runs in the background and handles communication between the extension and the web app

console.log('AutoApply Pro: Background service worker initialized');

// Configure API Base URL for development and production environments
const API_BASE_URL = {
  development: 'http://localhost:5000/api',
  production: 'https://api.autoapplypro.com/api'
};

// Determine the environment based on extension installation type
let currentEnvironment = 'production';
chrome.management.getSelf(info => {
  if (info.installType === 'development') {
    currentEnvironment = 'development';
  }
  console.log(`Running in ${currentEnvironment} environment`);
});

// Helper function to get the current API URL
function getApiUrl() {
  return API_BASE_URL[currentEnvironment];
}

/**
 * Clear all authentication data from storage when a token expires
 * @returns {Promise<void>}
 */
async function clearAuthData() {
  return new Promise((resolve) => {
    chrome.storage.local.remove(['authToken', 'userData', 'activeProfile'], () => {
      // Show a notification that the session has expired
      if (chrome.notifications) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: chrome.runtime.getURL('icons/icon128.png'),
          title: 'Session Expired',
          message: 'Your session has expired. Please log in again.',
          priority: 2
        });
      }
      resolve();
    });
  });
}

// Set up context menu
chrome.runtime.onInstalled.addListener((details) => {
  // Ensure the contextMenus API is properly initialized
  if (chrome.contextMenus) {
    chrome.contextMenus.create({
      id: 'autofill',
      title: 'Autofill with AutoApply Pro',
      contexts: ['page']
    });
  } else {
    console.error('ContextMenus API not available');
  }
});

// Handle context menu clicks
if (chrome.contextMenus) {
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'autofill') {
      // Check if we have an auth token
      chrome.storage.local.get(['authToken'], async result => {
        if (!result.authToken) {
          // Not logged in, show notification if available
          if (chrome.notifications) {
            chrome.notifications.create({
              type: 'basic',
              iconUrl: chrome.runtime.getURL('icons/icon128.png'),
              title: 'AutoApply Pro',
              message: 'Please log in to use the autofill feature'
            });
          }
          
          // Open dashboard for login
          chrome.tabs.create({ url: 'http://localhost:3000/login' });
          return;
        }
        
        // Fetch active profile data
        try {
          const response = await fetch('http://localhost:5000/api/resumes/profile/active', {
            headers: {
              'Authorization': `Bearer ${result.authToken}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            // Handle errors
            if (response.status === 401) {
              // Token expired
              if (chrome.notifications) {
                chrome.notifications.create({
                  type: 'basic',
                  iconUrl: chrome.runtime.getURL('icons/icon128.png'),
                  title: 'AutoApply Pro',
                  message: 'Your session has expired. Please log in again.'
                });
              }
              
              // Clear invalid token
              chrome.storage.local.remove(['authToken']);
              
              // Open dashboard for login
              chrome.tabs.create({ url: 'http://localhost:3000/login' });
            } else {
              // Other error
              if (chrome.notifications) {
                chrome.notifications.create({
                  type: 'basic',
                  iconUrl: chrome.runtime.getURL('icons/icon128.png'),
                  title: 'AutoApply Pro',
                  message: 'Error fetching profile data. Please try again.'
                });
              }
            }
            return;
          }
          
          const data = await response.json();
          
          if (!data.success || !data.data) {
            if (chrome.notifications) {
              chrome.notifications.create({
                type: 'basic',
                iconUrl: chrome.runtime.getURL('icons/icon128.png'),
                title: 'AutoApply Pro',
                message: 'No active profile found. Please set a profile as active in the dashboard.'
              });
            }
            return;
          }
          
          // Send profile data to the content script
          chrome.tabs.sendMessage(tab.id, {
            action: 'autofill',
            profileData: data.data
          }, response => {
            if (chrome.runtime.lastError) {
              console.error('Error sending message to content script:', chrome.runtime.lastError);
              
              // Content script might not be loaded, inject it
              chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['content.js']
              }, () => {
                // Try again after content script is loaded
                setTimeout(() => {
                  chrome.tabs.sendMessage(tab.id, {
                    action: 'autofill',
                    profileData: data.data
                  });
                }, 500);
              });
            }
          });
        } catch (error) {
          console.error('Error in background script:', error);
          if (chrome.notifications) {
            chrome.notifications.create({
              type: 'basic',
              iconUrl: chrome.runtime.getURL('icons/icon128.png'),
              title: 'AutoApply Pro',
              message: 'Error connecting to server. Please check your connection.'
            });
          }
        }
      });
    }
  });
}

// Debug mode - can be toggled via extension popup
const DEBUG = false;

function debugLog(...args) {
  if (DEBUG) {
    console.log('[AutoApply Background]', ...args);
  }
}

// Function to fetch user data with better error handling
function fetchUserData(token) {
  debugLog('Fetching user data from API');
  
  return fetch(`${getApiUrl()}/users/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok) {
      // Handle different status codes
      if (response.status === 401) {
        throw new Error('Unauthorized: Token may be expired');
      } else if (response.status === 404) {
        throw new Error('User not found');
      } else {
        throw new Error(`Server error: ${response.status}`);
      }
    }
    return response.json();
  })
  .then(data => {
    debugLog('User data retrieved successfully');
    return data.data || data;
  })
  .catch(async err => {
    console.error('Error fetching user data:', err);
    
    // Handle token expiration
    if (err.message?.includes('Unauthorized') || err.status === 401) {
      debugLog('Token expired or invalid - clearing auth data');
      await clearAuthData();
    }
    
    throw err; // Re-throw to be handled by caller
  });
}

// Function to fetch active profile
function fetchActiveProfile(token) {
  debugLog('Fetching active profile');
  
  return fetch(`${getApiUrl()}/resumes/profile/active`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Token may be expired');
      } else if (response.status === 404) {
        throw new Error('No active profile found');
      } else {
        throw new Error(`Server error: ${response.status}`);
      }
    }
    return response.json();
  })
  .then(data => {
    debugLog('Active profile retrieved successfully');
    return data.data || data;
  })
  .catch(err => {
    console.error('Error fetching active profile:', err);
    throw err;
  });
}

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  debugLog('Received message:', message.type || message.action);
  
  // Handle getApiUrl message
  if (message.type === 'getApiUrl') {
    sendResponse({ apiUrl: getApiUrl() });
    return true; // Keep the message channel open for async response
  }
  
  // Handle saveAuthToken action
  if (message.action === 'saveAuthToken') {
    // Save the auth token to storage
    const saveData = { authToken: message.token };
    
    // If userData was passed directly, save it too
    if (message.userData) {
      saveData.userData = message.userData;
      
      chrome.storage.local.set(saveData, () => {
        if (chrome.runtime.lastError) {
          debugLog('Error saving auth data:', chrome.runtime.lastError);
          sendResponse({ success: false, error: chrome.runtime.lastError.message });
          return;
        }
        
        debugLog('Auth token and user data saved to extension storage');
        sendResponse({ success: true });
      });
    } else {
      // Save token first
      chrome.storage.local.set(saveData, () => {
        if (chrome.runtime.lastError) {
          debugLog('Error saving auth token:', chrome.runtime.lastError);
          sendResponse({ success: false, error: chrome.runtime.lastError.message });
          return;
        }
        
        debugLog('Auth token saved, now fetching user data');
        
        // Then fetch and store user data for plan badge and profile information
        fetchUserData(message.token)
          .then(userData => {
            if (userData) {
              chrome.storage.local.set({ userData: userData }, () => {
                debugLog('User data saved to extension storage');
                
                // Try to fetch active profile too
                fetchActiveProfile(message.token)
                  .then(profileData => {
                    if (profileData) {
                      chrome.storage.local.set({ activeProfile: profileData }, () => {
                        debugLog('Active profile saved to extension storage');
                      });
                    }
                  })
                  .catch(err => {
                    debugLog('No active profile found, user will need to create one');
                  })
                  .finally(() => {
                    // Always respond successfully if we at least saved the token
                    sendResponse({ success: true });
                  });
              });
            } else {
              // Token saved but no user data
              sendResponse({ success: true, userData: null });
            }
          })
          .catch(err => {
            debugLog('Error in user data fetch:', err);
            // Still respond with success since we saved the token
            sendResponse({ success: true, error: 'Failed to fetch user data' });
          });
      });
    }
    return true; // Required to use sendResponse asynchronously
  }
  
  // Handle clearAuthToken action
  if (message.action === 'clearAuthToken') {
    // Clear auth data from storage on logout
    chrome.storage.local.remove(['authToken', 'userData', 'activeProfile'], () => {
      if (chrome.runtime.lastError) {
        debugLog('Error clearing auth data:', chrome.runtime.lastError);
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
        return;
      }
      
      debugLog('Auth data cleared from extension storage');
      sendResponse({ success: true });
    });
    return true;
  } 
  
  // Handle getAuthToken action
  if (message.action === 'getAuthToken') {
    // Retrieve the auth token from storage
    chrome.storage.local.get(['authToken'], result => {
      sendResponse({ token: result.authToken || null });
    });
    return true;
  }
  
  // Handle getUserData action
  if (message.action === 'getUserData') {
    // Retrieve user data from storage
    chrome.storage.local.get(['userData'], result => {
      sendResponse({ userData: result.userData || null });
    });
    return true;
  }
  
  // Handle getActiveProfile action
  if (message.action === 'getActiveProfile') {
    // Retrieve active profile from storage
    chrome.storage.local.get(['activeProfile'], result => {
      sendResponse({ profile: result.activeProfile || null });
    });
    return true;
  }
  
  // Handle refreshUserData action
  if (message.action === 'refreshUserData') {
    chrome.storage.local.get(['authToken'], result => {
      if (!result.authToken) {
        sendResponse({ success: false, error: 'Not authenticated' });
        return;
      }
      
      fetchUserData(result.authToken)
        .then(userData => {
          if (userData) {
            chrome.storage.local.set({ userData: userData }, () => {
              debugLog('User data refreshed in extension storage');
              sendResponse({ success: true, userData: userData });
            });
          } else {
            sendResponse({ success: false, error: 'No user data returned' });
          }
        })
        .catch(err => {
          debugLog('Error refreshing user data:', err);
          sendResponse({ success: false, error: err.message });
        });
    });
    return true;
  }
});

// Handle installation and updates separately
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    // Show welcome notification if notifications API is available
    if (chrome.notifications) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: chrome.runtime.getURL('icons/icon128.png'),
        title: 'AutoApply Pro Installed',
        message: 'Thank you for installing AutoApply Pro! Click to set up your profile.'
      });
    }
    
    // Open dashboard on install
    chrome.tabs.create({ url: 'http://localhost:3000/dashboard' });
  } else if (details.reason === 'update') {
    // Show update notification if notifications API is available
    if (chrome.notifications) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: chrome.runtime.getURL('icons/icon128.png'),
        title: 'AutoApply Pro Updated',
        message: `AutoApply Pro has been updated to version ${chrome.runtime.getManifest().version}`
      });
    }
  }
});
