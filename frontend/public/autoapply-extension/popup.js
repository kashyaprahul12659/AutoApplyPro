document.addEventListener('DOMContentLoaded', function() {  // Use utility functions if available
  const utils = window.AutoApplyUtils || {};
  const debounce = utils.debounce || ((fn, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(null, args), delay || 300);
    };
  }); // Better fallback debounce implementation
    // Determine environment (development or production)
  let currentEnvironment = 'production';
  
  // Use a safer approach to check environment
  function checkEnvironment() {
    try {
      if (chrome.management && chrome.management.getSelf) {
        chrome.management.getSelf(info => {
          if (info && info.installType) {
            currentEnvironment = info.installType === 'development' ? 'development' : 'production';
            console.log(`Running in ${currentEnvironment} environment`);
          }
        });
      } else {
        // Fallback: assume production if management API is not available
        currentEnvironment = 'production';
        console.log('Management API not available, assuming production environment');
      }
    } catch (error) {
      // Fallback: assume production if there's any error
      currentEnvironment = 'production';
      console.log('Error checking environment, defaulting to production:', error);
    }
  }
  
  // Initialize environment check
  checkEnvironment();
  // Main UI elements
  const autofillBtn = document.getElementById('autofill-btn');
  const instantAutofillBtn = document.getElementById('instant-autofill-btn');
  const analyzeJdBtn = document.getElementById('analyze-jd-btn');
  const trackJobBtn = document.getElementById('track-job-btn');
  const openDashboardBtn = document.getElementById('open-dashboard-btn');
  const settingsLink = document.getElementById('settings-link');
  const helpLink = document.getElementById('help-link');
  const statusMessage = document.getElementById('status-message');
  const spinner = document.getElementById('spinner');
  const instantSpinner = document.getElementById('instant-spinner');
  const analyzeSpinner = document.getElementById('analyze-spinner');
  const trackJobSpinner = document.getElementById('track-job-spinner');
  const planBadge = document.getElementById('plan-badge');
  const loginStatus = document.getElementById('login-status');
  const versionLabel = document.getElementById('version-label');
  const feedbackLink = document.getElementById('feedback-link');
  const logoutLink = document.getElementById('logout-link');
  const loginDetails = document.getElementById('login-details');
  
  // Set version label
  if (versionLabel) {
    versionLabel.textContent = 'v1.0.0';
  }
  
  // Debug mode toggle (hidden in production)
  const debugModeContainer = document.createElement('div');
  debugModeContainer.className = 'mt-3 text-center d-none';
  debugModeContainer.innerHTML = `
    <div class="form-check form-switch">
      <input class="form-check-input" type="checkbox" id="debug-mode-toggle">
      <label class="form-check-label small text-muted" for="debug-mode-toggle">Debug Mode</label>
    </div>
  `;
  document.querySelector('.main-content').appendChild(debugModeContainer);
  
  // Set version label if exists
  if (versionLabel) {
    versionLabel.textContent = 'v1.0';
  } else {
    // Create version label if not exists
    const versionEl = document.createElement('span');
    versionEl.id = 'version-label';
    versionEl.className = 'badge badge-secondary badge-pill ml-1';
    versionEl.textContent = 'v1.0';
    
    // Find the header to append to
    const header = document.querySelector('h5.card-title') || document.querySelector('.header');
    if (header) {
      header.appendChild(versionEl);
    }
  }
  
  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'));
  tooltipTriggerList.forEach(tooltipTriggerEl => {
    new bootstrap.Tooltip(tooltipTriggerEl);
  });
  
  let profileData = null;  // Get API URL from background script
  let API_BASE_URL = '';
  
  // Request API URL from background script
  chrome.runtime.sendMessage({ type: 'getApiUrl' }, (response) => {
    if (response && response.apiUrl) {
      API_BASE_URL = response.apiUrl;
      console.log(`Using API: ${API_BASE_URL}`);
    } else {
      // Fallback to environment detection
      const isLocalhost = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' || 
                         window.location.hostname.includes('192.168.');
      
      API_BASE_URL = isLocalhost ? 'http://localhost:5000/api' : 'https://autoapplypro-backend-d14947a17c9b.herokuapp.com/api';
      console.log(`Fallback API: ${API_BASE_URL}`);
    }
  });
  
  // Enable debug mode toggling
  const debugModeToggle = document.getElementById('debug-mode-toggle');
  if (debugModeToggle) {
    chrome.storage.local.get(['debugMode'], function(result) {
      debugModeToggle.checked = result.debugMode === true;
    });
    
    debugModeToggle.addEventListener('change', function() {
      chrome.storage.local.set({ debugMode: this.checked }, function() {
        console.log('Debug mode ' + (this.checked ? 'enabled' : 'disabled'));
      });
    });
  }
  
  // Check if user is logged in and has an active profile
  checkProfileStatus();
  
  // Attach event listeners
  if (autofillBtn) {
    autofillBtn.addEventListener('click', handleAutofill);
  }
  
  if (instantAutofillBtn) {
    instantAutofillBtn.addEventListener('click', handleInstantAutofill);
  }
  
  if (analyzeJdBtn) analyzeJdBtn.addEventListener('click', handleAnalyzeJd);
  if (trackJobBtn) trackJobBtn.addEventListener('click', handleTrackJob);
  if (openDashboardBtn) openDashboardBtn.addEventListener('click', openDashboard);
  if (settingsLink) settingsLink.addEventListener('click', openSettings);
  if (helpLink) helpLink.addEventListener('click', openHelp);
  if (feedbackLink) feedbackLink.addEventListener('click', openFeedback);
  if (logoutLink) logoutLink.addEventListener('click', handleLogout);
  
  // Initialize the Copy Resume Info button
  const copyResumeBtn = document.getElementById('copy-resume-btn');
  if (copyResumeBtn) {
    copyResumeBtn.addEventListener('click', copyResumeInfo);
  }
  
  // Function to check profile status - with caching
  async function checkProfileStatus() {
    // Create a cache key based on the current user ID (if available)
    const createCacheKey = (userId) => `profile_status_${userId || 'anonymous'}`;
    let cacheKey = '';
    try {
      // Show initial loading state
      statusMessage.textContent = 'Loading...';
      autofillBtn.disabled = true;
      analyzeJdBtn.disabled = true;
      setButtonLoading(autofillBtn, true);
        // Check if the debug mode container should be shown (only in development)
      const debugModeContainer = document.querySelector('.mt-3.text-center.d-none');
      if (debugModeContainer) {
        try {
          if (chrome.management && chrome.management.getSelf) {
            chrome.management.getSelf(info => {
              if (info && info.installType === 'development') {
                debugModeContainer.classList.remove('d-none');
              }
            });
          }
        } catch (error) {
          console.log('Cannot check environment for debug mode:', error);
        }
      }
      
      // Get the auth token, user data, and profile data from storage
      chrome.storage.local.get(['authToken', 'userData', 'activeProfile', 'lastProfileCheck'], async function(result) {
        // Check if we've checked the profile recently (in the last 2 minutes)
        const lastCheck = result.lastProfileCheck || 0;
        const TWO_MINUTES = 2 * 60 * 1000;
        const isRecentCheck = (Date.now() - lastCheck) < TWO_MINUTES;
        const authToken = result.authToken;
        const userData = result.userData;
        const storedProfile = result.activeProfile;
        
        // Set cache key based on user ID
        cacheKey = createCacheKey(userData?.id);
        
        // Not logged in - show login prompt
        if (!authToken) {
          statusMessage.textContent = 'Not logged in. Please log in on the dashboard.';
          autofillBtn.disabled = true;
          analyzeJdBtn.disabled = true;
          updateLoginStatus('Not Logged In');
          updatePlanBadge('Free');
          setButtonLoading(autofillBtn, false);
          openDashboardBtn.classList.add('btn-primary');
          openDashboardBtn.classList.remove('btn-outline-primary');
          return;
        }
        
        // If we have userData from storage, update the UI with it
        if (userData) {
          updateLoginStatus(`Hello, ${userData.name || 'User'}`);
          
          // Update subscription badge based on user data
          if (userData.subscription && userData.subscription.status === 'active') {
            updatePlanBadge('Pro');
          } else if (userData.credits && userData.credits > 0) {
            updatePlanBadge(`Free - ${userData.credits} credits`);
          } else {
            updatePlanBadge('Free');
          }
          
          // If we have a stored profile, use it while we verify with the server
          if (storedProfile) {
            profileData = storedProfile;
            statusMessage.textContent = `Active Profile: ${profileData.name || 'Unknown'}`;
            // Enable buttons temporarily based on cached data
            autofillBtn.disabled = false;
            analyzeJdBtn.disabled = false;
            copyResumeBtn.style.display = 'inline-block';
            
            // If we've checked recently, we can skip the server check
            if (isRecentCheck) {
              setButtonLoading(autofillBtn, false);
              return;
            }
          } else {
            statusMessage.textContent = 'Checking profile status...';
          }
        }
        
        // Fetch fresh profile data from the server
        try {
          const response = await fetch(`${API_BASE_URL}/resumes/profile/active`, {
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            // Handle different error cases
            if (response.status === 404) {
              statusMessage.textContent = 'No active profile found. Please set a profile as active in the dashboard.';
              autofillBtn.disabled = true;
              analyzeJdBtn.disabled = false; // Can still use JD analyzer without profile
              copyResumeBtn.style.display = 'none';
              
              // Direct link to create profile
              const createProfileLink = document.createElement('a');
              createProfileLink.href = '#';
              createProfileLink.className = 'btn btn-sm btn-outline-primary mt-2';
              createProfileLink.textContent = 'Create Profile';
              createProfileLink.addEventListener('click', () => {
                chrome.tabs.create({ url: 'http://localhost:3000/dashboard/resumes/new' });
              });
              
              const actionContainer = document.querySelector('.action-container') || document.querySelector('.main-actions');
              if (actionContainer) {
                actionContainer.appendChild(createProfileLink);
              }
              
            } else if (response.status === 401) {
              statusMessage.textContent = 'Session expired. Please log in again.';
              autofillBtn.disabled = true;
              analyzeJdBtn.disabled = true;
              copyResumeBtn.style.display = 'none';
              // Clear invalid token
              chrome.storage.local.remove(['authToken', 'userData', 'activeProfile']);
            } else {
              statusMessage.textContent = 'Error connecting to server. Using cached data if available.';
              // If we have cached data, we can still use it
              if (profileData) {
                autofillBtn.disabled = false;
                analyzeJdBtn.disabled = false;
                copyResumeBtn.style.display = 'inline-block';
              } else {
                autofillBtn.disabled = true;
                analyzeJdBtn.disabled = true;
              }
            }
          } else {
            // Success - parse profile data
            const responseData = await response.json();
            profileData = responseData.data || responseData;
            
            // Save to storage for faster loading next time
            chrome.storage.local.set({ 
              activeProfile: profileData,
              lastProfileCheck: Date.now() 
            });
            
            // Update UI
            statusMessage.textContent = `Active Profile: ${profileData.name || 'No Name'}`;
            autofillBtn.disabled = false;
            analyzeJdBtn.disabled = false;
            copyResumeBtn.style.display = 'inline-block';
            
            // Setup copy resume button
            copyResumeBtn.addEventListener('click', copyResumeInfo);
          }
          
          // Refresh user data in the background for the latest subscription status
          try {
            const userResponse = await fetch(`${API_BASE_URL}/users/me`, {
              headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (userResponse.ok) {
              const responseData = await userResponse.json();
              const freshUserData = responseData.data || responseData;
              
              // Update storage
              chrome.storage.local.set({ userData: freshUserData });
              
              // Update UI
              updateLoginStatus(`Hello, ${freshUserData.name || 'User'}`);
              
              // Update subscription badge
              if (freshUserData.subscription && freshUserData.subscription.status === 'active') {
                updatePlanBadge('Pro');
              } else if (freshUserData.credits > 0) {
                updatePlanBadge(`Free - ${freshUserData.credits} credits`);
              } else {
                updatePlanBadge('Free');
              }
            }
          } catch (userError) {
            console.error('Error refreshing user data:', userError);
            // Non-fatal, we already have basic UI updated
          }
        } catch (fetchError) {
          console.error('Error fetching profile data:', fetchError);
          
          // Use cached data if available
          if (profileData) {
            statusMessage.textContent = `Using cached profile: ${profileData.name} (offline)`;
            autofillBtn.disabled = false;
            analyzeJdBtn.disabled = false;
            copyResumeBtn.style.display = 'inline-block';
          } else {
            statusMessage.textContent = 'Error connecting to server. Please try again.';
            autofillBtn.disabled = true;
            analyzeJdBtn.disabled = true;
          }
        } finally {
          // Always stop loading state
          setButtonLoading(autofillBtn, false);
        }
      });
    } catch (error) {
      console.error('Error checking profile status:', error);
      statusMessage.textContent = 'Error loading profile data. Please try again.';
      autofillBtn.disabled = true;
      analyzeJdBtn.disabled = true;
      setButtonLoading(autofillBtn, false);
    }
  }
  
  // Function to set button loading state
  function setButtonLoading(button, isLoading, spinner) {
    if (isLoading) {
      button.setAttribute('data-original-text', button.innerHTML);
      button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';
      button.disabled = true;
    } else {
      if (button.hasAttribute('data-original-text')) {
        button.innerHTML = button.getAttribute('data-original-text');
        button.removeAttribute('data-original-text');
      }
      // Note: We don't enable the button here as that depends on the app state
    }
  }
  
  // Function to copy resume information to clipboard
  function copyResumeInfo() {
    if (!profileData) {
      showToast('No profile data available', 'error');
      return;
    }
    
    setButtonLoading(copyResumeBtn, true);
    
    try {
      // Format profile data as readable text
      const formattedData = Object.entries(profileData)
        .filter(([key, value]) => {
          // Filter out internal fields and empty values
          return (
            value && 
            typeof value === 'string' && 
            !['_id', 'userId', 'createdAt', 'updatedAt', '__v'].includes(key)
          );
        })
        .map(([key, value]) => {
          // Format the key as a title case label
          const label = key.replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());
          return `${label}: ${value}`;
        })
        .join('\n');
      
      // Copy to clipboard
      navigator.clipboard.writeText(formattedData)
        .then(() => {
          showToast('Resume info copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
          showToast('Failed to copy resume info', 'error');
        });
    } catch (error) {
      console.error('Error formatting profile data:', error);
      showToast('Error processing profile data', 'error');
    } finally {
      setButtonLoading(copyResumeBtn, false);
    }
  }
  
  // Function to handle autofill button click
  async function handleAutofill() {
    if (!profileData) {
      showToast('No profile data available', 'error');
      return;
    }
    
    // Show loading state
    setButtonLoading(autofillBtn, true);
    
    try {
      // Get the current active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Check if we have permission to access the tab
      if (!tab || !tab.url.startsWith('http')) {
        showToast('Cannot autofill on this page', 'error');
        setButtonLoading(autofillBtn, false);
        return;
      }
      
      // First, clean up any previous autofill attempts
      try {
        await chrome.tabs.sendMessage(tab.id, { action: 'cleanup' });
      } catch (err) {
        // It's okay if this fails, might just mean content script isn't loaded yet
        console.log('Cleanup message failed, content script might not be loaded yet');
      }
      
      // Inject the content script if it's not already injected
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: injectAutofillData,
        args: [profileData]
      });
      
      // Track this autofill in usage statistics
      trackAutofillUsage(tab.url);
      
      // Show success message
      showToast('Form Autofilled Successfully!');
    } catch (error) {
      console.error('Error during autofill:', error);
      showToast('Error autofilling form', 'error');
    } finally {
      setButtonLoading(autofillBtn, false);
    }
  }
  
  // Function to handle instant autofill button click
  async function handleInstantAutofill() {
    if (!profileData) {
      showToast('No profile data available', 'error');
      return;
    }
    
    // Show loading state
    setButtonLoading(instantAutofillBtn, true, instantSpinner);
    
    try {
      // Get the current active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Check if we have permission to access the tab
      if (!tab || !tab.url.startsWith('http')) {
        showToast('Cannot autofill on this page', 'error');
        setButtonLoading(instantAutofillBtn, false, instantSpinner);
        return;
      }
      
      // Store the resume data in chrome.storage.local for access by content script
      await chrome.storage.local.set({
        resumeData: profileData
      });
      
      // Try to execute the content script if not already loaded
      try {
        // First try sending a message to see if content script is loaded
        await chrome.tabs.sendMessage(tab.id, { action: 'instantAutofill' });
      } catch (err) {
        console.log('Content script not loaded, injecting it now');
        
        // If that fails, inject the content script
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        });
        
        // Now send the message to the newly injected content script
        await chrome.tabs.sendMessage(tab.id, { action: 'instantAutofill' });
      }
      
      // Track this autofill in usage statistics
      trackAutofillUsage(tab.url);
      
      // Show success message and close popup after a delay
      showToast('Chrome-style instant autofill initiated');
      setTimeout(() => window.close(), 1500);
    } catch (error) {
      console.error('Error during instant autofill:', error);
      showToast('Error with instant autofill', 'error');
    } finally {
      setButtonLoading(instantAutofillBtn, false, instantSpinner);
    }
  }
  
  // Track autofill usage for analytics
  function trackAutofillUsage(pageUrl) {
    try {
      // Get domain from URL
      const domain = new URL(pageUrl).hostname;
      
      // Add to autofill history via background script
      chrome.runtime.sendMessage({
        action: 'trackAutofill',
        data: {
          domain: domain,
          timestamp: new Date().toISOString(),
          success: true
        }
      });
    } catch (error) {
      debugLog('Error tracking autofill usage:', error);
    }
  }
  
  // Function to be injected into the page
  function injectAutofillData(profileData) {
    // Log the autofill action
    console.log('AutoApply Pro: Starting autofill...');
    
    // Create a mapping of profile fields to common form field selectors
    const autofillMap = {
      name: ['name', 'full_name', 'fullname', 'first_name lastname', 'your name'],
      email: ['email', 'e-mail', 'emailaddress'],
      phone: ['phone', 'telephone', 'mobile', 'cell', 'contact'],
      // Add more mappings as needed
    };
    
    // Create a counter for filled fields
    let filledCount = 0;
    
    // Autofill function
    Object.entries(profileData).forEach(([key, value]) => {
      if (!value || typeof value !== 'string' || value.trim() === '') return;
      
      const keywords = autofillMap[key];
      if (!keywords) return;
      
      keywords.forEach(keyword => {
        // Try various selector combinations
        const selectors = [
          `input[name*="${keyword}" i]`,
          `input[id*="${keyword}" i]`,
          `input[placeholder*="${keyword}" i]`,
          `input[aria-label*="${keyword}" i]`,
          `textarea[name*="${keyword}" i]`,
          `textarea[id*="${keyword}" i]`,
          `textarea[placeholder*="${keyword}" i]`,
          `textarea[aria-label*="${keyword}" i]`
        ];
        
        // Try each selector
        for (const selector of selectors) {
          const elements = document.querySelectorAll(selector);
          
          elements.forEach(input => {
            // Skip if the field is already filled
            if (input.value && input.value.trim() !== '') return;
            
            // Fill the field
            input.focus();
            input.value = value;
            
            // Dispatch events to trigger form validation
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            input.dispatchEvent(new Event('blur', { bubbles: true }));
            
            // Highlight the field
            const originalBg = input.style.backgroundColor;
            const originalBorder = input.style.border;
            
            input.style.backgroundColor = '#e8f0fe';
            input.style.border = '1px solid #4285f4';
            
            // Reset the highlighting after 2 seconds
            setTimeout(() => {
              input.style.backgroundColor = originalBg;
              input.style.border = originalBorder;
            }, 2000);
            
            filledCount++;
            console.log(`AutoApply Pro: Filled ${key} field with selector "${selector}"`);
          });
        }
      });
    });
    
    // Special handling for skills, education, and experience
    if (profileData.skills && Array.isArray(profileData.skills)) {
      const skillSelectors = [
        'input[name*="skill" i]',
        'input[id*="skill" i]',
        'input[placeholder*="skill" i]',
        'textarea[name*="skill" i]',
        'textarea[id*="skill" i]',
        'textarea[placeholder*="skill" i]'
      ];
      
      for (const selector of skillSelectors) {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(input => {
          if (input.value && input.value.trim() !== '') return;
          
          input.focus();
          input.value = profileData.skills.join(', ');
          
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
          
          const originalBg = input.style.backgroundColor;
          input.style.backgroundColor = '#e8f0fe';
          
          setTimeout(() => {
            input.style.backgroundColor = originalBg;
          }, 2000);
          
          filledCount++;
        });
      }
    }
    
    // Show in-page toast notification
    const toast = document.createElement('div');
    toast.textContent = `AutoApply Pro: ${filledCount} fields autofilled`;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.backgroundColor = '#4285f4';
    toast.style.color = 'white';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '4px';
    toast.style.zIndex = '9999';
    toast.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    toast.style.fontSize = '14px';
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.5s ease';
      
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 500);
    }, 3000);
    
    return filledCount;
  }
  
  // Reset button state
  function resetButton() {
    autofillBtn.disabled = false;
    spinner.style.display = 'none';
  }
  
  // Show toast notification
  function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    
    if (type === 'error') {
      toast.style.backgroundColor = '#f44336';
    } else {
      toast.style.backgroundColor = '#4caf50';
    }
    
    toast.className = 'show';
    
    setTimeout(function() {
      toast.className = toast.className.replace('show', '');
    }, 3000);
  }
    // Open dashboard
  function openDashboard() {
    const dashboardUrl = currentEnvironment === 'development' 
      ? 'http://localhost:3000/dashboard' 
      : 'https://autoapplypro.com/dashboard';
    chrome.tabs.create({ url: dashboardUrl });
  }
  
  // Open settings
  function openSettings() {
    const settingsUrl = currentEnvironment === 'development' 
      ? 'http://localhost:3000/settings' 
      : 'https://autoapplypro.com/settings';
    chrome.tabs.create({ url: settingsUrl });
  }
    // Function to open help
  function openHelp() {
    const helpUrl = currentEnvironment === 'development' 
      ? 'http://localhost:3000/help' 
      : 'https://autoapplypro.com/help';
    chrome.tabs.create({ url: helpUrl });
  }
  
  // Function to open feedback form
  function openFeedback() {
    chrome.tabs.create({ url: 'https://forms.gle/5XpbLZGY5kHnqH7g6' });
  }
  // Handle tracking the current job with enhanced data extraction
  const handleTrackJob = async function() {
    // Set button to loading state
    setButtonLoading(trackJobBtn, true, trackJobSpinner);
    
    try {
      // Get auth token
      const token = await new Promise((resolve) => {
        chrome.storage.local.get(['authToken'], function(result) {
          resolve(result.authToken);
        });
      });
      
      if (!token) {
        showToast('Please log in to track jobs', 'error');
        setButtonLoading(trackJobBtn, false, trackJobSpinner);
        return;
      }
      
      // Get the current tab info
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Extract comprehensive job details from the page using enhanced extractor
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          // Use enhanced job extraction if available
          if (window.AutoApplyJobExtractor && window.AutoApplyJobExtractor.extractEnhancedJobDetails) {
            return window.AutoApplyJobExtractor.extractEnhancedJobDetails();
          } else if (window.AutoApplyJobExtractor && window.AutoApplyJobExtractor.extractJobDetails) {
            return window.AutoApplyJobExtractor.extractJobDetails();
          }
          return null;
        }
      });
      
      const jobDetails = results[0]?.result;
      
      if (!jobDetails) {
        showToast('Could not extract job details from this page. Please make sure you are on a job posting page.', 'error');
        setButtonLoading(trackJobBtn, false, trackJobSpinner);
        return;
      }
      
      // Get the API URL from background script
      const apiUrl = await new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: 'getApiUrl' }, (response) => {
          resolve(response.apiUrl);
        });
      });
      
      // Prepare enhanced job data for backend
      const jobApplicationData = {
        // Basic information
        jobTitle: jobDetails.jobTitle,
        company: jobDetails.company,
        location: jobDetails.location || '',
        jdUrl: jobDetails.jdUrl,
        status: 'interested',
        
        // Enhanced information if available
        jobDescription: jobDetails.jobDescription || '',
        salaryRange: jobDetails.salaryRange || { min: null, max: null, currency: 'USD' },
        employmentType: jobDetails.employmentType || 'full-time',
        workMode: jobDetails.workMode || 'onsite',
        experienceLevel: jobDetails.experienceLevel || 'mid',
        requiredSkills: jobDetails.requiredSkills || [],
        preferredSkills: jobDetails.preferredSkills || [],
        jobSource: jobDetails.jobSource || 'other',
        jobId: jobDetails.jobId || '',
        
        // Additional metadata if available
        applicationDeadline: jobDetails.applicationDeadline || null,
        recruiterInfo: jobDetails.contactInfo || { name: '', email: '', linkedin: '' }
      };
      
      // Send comprehensive job details to backend
      const response = await fetch(`${apiUrl}/job-tracker/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jobApplicationData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add job to tracker');
      }
      
      const data = await response.json();
      
      // Show enhanced success message with extracted details
      const skillsText = jobDetails.requiredSkills && jobDetails.requiredSkills.length > 0 
        ? ` (${jobDetails.requiredSkills.length} skills detected)` 
        : '';
      
      showToast(`✅ Job tracked successfully!${skillsText}`, 'success');
      
      // Reset button state
      setButtonLoading(trackJobBtn, false, trackJobSpinner);
      
      // Offer enhanced options after tracking
      setTimeout(() => {
        const message = `Job "${jobDetails.jobTitle}" at ${jobDetails.company} added to tracker!\n\nWhat would you like to do next?\n\n1. View Job Tracker\n2. Generate Custom Resume\n3. Analyze Job Match\n\nEnter 1, 2, or 3 (or cancel):`;
        
        const choice = prompt(message);
        
        if (choice === '1') {
          // Open job tracker
          const webAppUrl = currentEnvironment === 'development' ? 
            'http://localhost:3000/job-tracker' : 
            'https://autoapplypro.com/job-tracker';
          chrome.tabs.create({ url: webAppUrl });
        } else if (choice === '2') {
          // Generate custom resume
          generateCustomResumeForJob(data.data._id, token);
        } else if (choice === '3') {
          // Analyze job match
          if (jobDetails.jobDescription) {
            analyzeJobMatch(jobDetails.jobDescription, token);
          } else {
            showToast('No job description available for analysis', 'warning');
          }
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error tracking job:', error);
      showToast(error.message || 'Failed to track job', 'error');
      setButtonLoading(trackJobBtn, false, trackJobSpinner);
    }
  };

  // Function to generate custom resume for a tracked job
  const generateCustomResumeForJob = async (jobApplicationId, token) => {
    try {
      showToast('🔄 Generating custom resume...', 'info');
      
      const apiUrl = await new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: 'getApiUrl' }, (response) => {
          resolve(response.apiUrl);
        });
      });
      
      const response = await fetch(`${apiUrl}/job-tracker/${jobApplicationId}/generate-resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate custom resume');
      }
      
      const data = await response.json();
      showToast('✅ Custom resume generated successfully!', 'success');
      
      // Ask if user wants to view the resume
      setTimeout(() => {
        if (confirm('Custom resume generated! Would you like to view it in your dashboard?')) {
          const webAppUrl = currentEnvironment === 'development' ? 
            'http://localhost:3000/dashboard/resumes' : 
            'https://autoapplypro.com/dashboard/resumes';
          chrome.tabs.create({ url: webAppUrl });
        }
      }, 500);
      
    } catch (error) {
      console.error('Error generating custom resume:', error);
      showToast(error.message || 'Failed to generate custom resume', 'error');
    }
  };

  // Function to analyze job match using existing analyzer
  const analyzeJobMatch = async (jobDescription, token) => {
    try {
      showToast('🔍 Analyzing job match...', 'info');
      
      const apiUrl = await new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: 'getApiUrl' }, (response) => {
          resolve(response.apiUrl);
        });
      });
      
      const response = await fetch(`${apiUrl}/jd-analyzer/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          jobDescription: jobDescription
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze job match');
      }
      
      const data = await response.json();
      const matchScore = data.data?.matchScore || 'N/A';
      
      showToast(`📊 Job Match Score: ${matchScore}%`, 'success');
      
      // Optionally show detailed analysis
      setTimeout(() => {
        if (confirm(`Your job match score is ${matchScore}%\n\nWould you like to see detailed analysis in the dashboard?`)) {
          const webAppUrl = currentEnvironment === 'development' ? 
            'http://localhost:3000/dashboard/analyzer' : 
            'https://autoapplypro.com/dashboard/analyzer';
          chrome.tabs.create({ url: webAppUrl });
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error analyzing job match:', error);
      showToast('Failed to analyze job match', 'error');
    }
  };

  // Helper function to set button loading state
  const setButtonLoading = (button, isLoading, spinner) => {
    if (isLoading) {
      button.disabled = true;
      if (spinner) spinner.style.display = 'inline-block';
    } else {
      button.disabled = false;
      if (spinner) spinner.style.display = 'none';
    }
  }

  // Function to update the plan badge
  function updatePlanBadge(planText) {
    planBadge.textContent = planText;
    
    // Update badge styling based on plan
    if (planText.includes('Pro')) {
      planBadge.style.backgroundColor = '#4f46e5';
    } else if (planText.includes('credits')) {
      planBadge.style.backgroundColor = '#059669';
    } else {
      planBadge.style.backgroundColor = '#6b7280';
    }
  }
  
  // Function to update login status
  function updateLoginStatus(status, isLoggedIn = false) {
    loginStatus.textContent = status;
    
    // Update the login details in footer
    if (loginDetails) {
      loginDetails.textContent = isLoggedIn ? 
        `Logged in as ${status.replace('Hello, ', '')}` : 
        'Not logged in';
    }
    
    // Show/hide logout link
    if (logoutLink) {
      logoutLink.classList.toggle('hidden', !isLoggedIn);
    }
  }
  
  // Handle logout button click
  function handleLogout(e) {
    e.preventDefault();
    
    if (confirm('Are you sure you want to log out? You will need to log in again on the dashboard.')) {
      // Clear storage
      chrome.storage.local.remove(['authToken', 'userData', 'activeProfile', 'lastProfileCheck'], () => {
        // Update UI
        updateLoginStatus('Not logged in', false);
        profileData = null;
        statusMessage.textContent = 'Not logged in. Please log in on the dashboard.';
        autofillBtn.disabled = true;
        analyzeJdBtn.disabled = true;
        updatePlanBadge('Free');
        showToast('Logged out successfully');
        
        // Update primary button to guide to login
        openDashboardBtn.textContent = 'Log In';
        openDashboardBtn.classList.add('btn-primary');
        openDashboardBtn.classList.remove('btn-outline');
      });
    }
  }

  // Handle job description analysis with debouncing
  const handleAnalyzeJd = debounce(async function() {
    try {
      // Get the auth token from storage
      chrome.storage.local.get(['authToken'], async function(result) {
        const authToken = result.authToken;
        
        if (!authToken) {
          showToast('Please log in to use the JD Analyzer', 'error');
          return;
        }
        
        // Show loading state
        analyzeSpinner.style.display = 'inline-block';
        analyzeJdBtn.disabled = true;
        
        // Get current active tab
        chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
          const activeTab = tabs[0];
          
          // Inject the JD analyzer script if not already injected
          await chrome.scripting.executeScript({
            target: {tabId: activeTab.id},
            files: ['jd-analyzer.js']
          });
          
          // Extract job description from the page
          const response = await chrome.tabs.sendMessage(activeTab.id, {action: 'analyzeJobDescription'});
          
          if (!response || !response.success || !response.jobDescription) {
            showToast('Could not extract job description', 'error');
            resetAnalyzeButton();
            return;
          }
          
          const jobDescription = response.jobDescription;
          
          // If job description is too short, show error
          if (jobDescription.length < 100) {
            showToast('Job description is too short to analyze', 'error');
            resetAnalyzeButton();
            return;
          }
          
          // Send job description to server for analysis
          const analysisResponse = await fetch(`${API_BASE_URL}/jd-analyzer/analyze`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ jobDescription })
          });
          
          if (!analysisResponse.ok) {
            if (analysisResponse.status === 401) {
              showToast('Session expired. Please log in again.', 'error');
            } else {
              showToast('Failed to analyze job description', 'error');
            }
            resetAnalyzeButton();
            return;
          }
          
          const analysisData = await analysisResponse.json();
          
          // Display analysis results
          chrome.scripting.executeScript({
            target: {tabId: activeTab.id},
            func: (results) => {
              window.autoapplyJdAnalyzer.showAnalysisResults(results);
            },
            args: [analysisData.data]
          });
          
          // Reset button state and close popup
          resetAnalyzeButton();
          window.close();
        });
      });
    } catch (error) {
      console.error('Error analyzing job description:', error);
      showToast('Error analyzing job description', 'error');
      resetAnalyzeButton();
    }
  }, 500);
  
  // Reset analyze button state
  function resetAnalyzeButton() {
    analyzeSpinner.style.display = 'none';
    analyzeJdBtn.disabled = false;
  }
});
