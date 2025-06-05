// AutoApply Pro - Content Script
// This script is injected into web pages to autofill form fields

// Check for debug mode in storage
let DEBUG = false;
chrome.storage.local.get(['debugMode'], function(result) {
  DEBUG = result.debugMode === true;
});

function debugLog(...args) {
  if (DEBUG) {
    console.log('[AutoApply Content]', ...args);
  }
}

// Track event listeners to prevent duplicates
const eventRegistry = new Map();

// Keep track of any timeouts we create so we can clear them if needed
const activeTimeouts = new Set();

// Keep track of any elements we've modified to restore them on cleanup
const modifiedElements = new Set();

debugLog('Content script loaded');

// Clean up function to prevent memory leaks
function cleanup() {
  debugLog('Cleaning up content script resources');
  
  // Clear all timeouts
  activeTimeouts.forEach(timeoutId => {
    clearTimeout(timeoutId);
  });
  activeTimeouts.clear();
  
  // Remove any modified element styles
  modifiedElements.forEach(element => {
    if (element && element._originalStyles) {
      Object.entries(element._originalStyles).forEach(([prop, value]) => {
        element.style[prop] = value;
      });
      delete element._originalStyles;
      delete element._highlightTimeoutId;
    }
  });
  modifiedElements.clear();
  
  // Remove event listeners
  eventRegistry.forEach((listener, key) => {
    const [element, eventType] = key.split('|');
    if (document.querySelector(element)) {
      document.querySelector(element).removeEventListener(eventType, listener);
    }
  });
  eventRegistry.clear();
  
  // Remove toast container if it exists
  const toastContainer = document.getElementById('autoapply-toast-container');
  if (toastContainer && toastContainer.parentNode) {
    document.body.removeChild(toastContainer);
  }
}

// Listen for messages from the popup or background script
// Centralized field mapping configuration for instant autofill
const instantFieldMap = {
  fullName: ['name', 'full_name', 'fullname', 'applicant', 'candidate'],
  email: ['email', 'e-mail', 'user_email', 'emailaddress'],
  phone: ['phone', 'mobile', 'contact', 'telephone', 'cell'],
  address: ['address', 'location', 'addr', 'street'],
  linkedin: ['linkedin', 'linkedin_profile', 'linkedinurl'],
  github: ['github', 'github_url', 'githubprofile'],
  summary: ['summary', 'bio', 'about', 'profile', 'introduction'],
  firstName: ['first_name', 'firstname', 'given_name', 'forename'],
  lastName: ['last_name', 'lastname', 'surname', 'family_name'],
  city: ['city', 'town', 'municipality'],
  state: ['state', 'province', 'region'],
  zipCode: ['zip', 'zipcode', 'postal_code', 'postalcode'],
  country: ['country', 'nation'],
  headline: ['headline', 'title', 'job_title', 'position', 'role'],
  website: ['website', 'personal_website', 'portfolio', 'homepage']
};

// Function to match field attributes to resume data keys
function matchField(label, placeholder, nameAttr, idAttr) {
  const allText = [label, placeholder, nameAttr, idAttr]
    .filter(text => text && typeof text === 'string')
    .join(' ')
    .toLowerCase();

  for (const [resumeKey, keywords] of Object.entries(instantFieldMap)) {
    for (const keyword of keywords) {
      if (allText.includes(keyword)) {
        return resumeKey;
      }
    }
  }
  return null;
}

// Chrome-style instant autofill function
function instantAutofill() {
  debugLog('Starting instant autofill');
  
  // Show loading toast
  showToastNotification('AutoApply Pro: Instant autofill in progress...', 'info');
  
  chrome.storage.local.get('resumeData', ({ resumeData }) => {
    if (!resumeData) {
      showToastNotification('Resume data not found. Please upload your resume in the AutoApply dashboard.', 'error');
      return;
    }
    
    debugLog('Retrieved resume data:', resumeData);
    
    const inputs = document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="checkbox"]):not([type="radio"]), textarea, select');
    let filledCount = 0;
    
    inputs.forEach((input) => {
      // Skip if already filled, disabled, or readonly
      if ((input.value && input.value.trim() !== '') || input.disabled || input.readOnly) {
        return;
      }
      
      // Skip if not visible
      if (!isElementVisible(input)) {
        return;
      }
      
      // Get associated label text
      let labelText = '';
      if (input.id) {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (label) {
          labelText = label.innerText || label.textContent;
        }
      }
      
      // Match field to resume data
      const matchedKey = matchField(
        labelText, 
        input.placeholder, 
        input.name, 
        input.id
      );
      
      if (matchedKey && resumeData[matchedKey]) {
        // Fill the field
        input.value = resumeData[matchedKey];
        
        // Dispatch input event to trigger form validations and reactive updates
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Highlight the field
        highlightField(input);
        filledCount++;
        
        debugLog(`Instant filled "${matchedKey}" in field:`, input);
      }
    });
    
    // Show success message
    if (filledCount > 0) {
      showToastNotification(`✅ AutoFilled ${filledCount} fields using your resume`);
    } else {
      showToastNotification('No matching fields found', 'warning');
    }
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  debugLog('Received message:', message.action);
  
  // Handle different message actions
  switch (message.action) {
    case 'autofill':
      // Run cleanup first to ensure no leftover state from previous runs
      cleanup();
      // Call autofill function with profile data
      const filledCount = autofillForm(message.profileData);
      sendResponse({ success: true, filledCount: filledCount });
      break;
      
    case 'instantAutofill':
      // Call the new instant autofill function
      instantAutofill();
      sendResponse({ success: true });
      break;
      
    case 'cleanup':
      // Allow explicit cleanup from outside
      cleanup();
      sendResponse({ success: true });
      break;
  }
  
  return true; // Keep the message channel open for async responses
});

// Clean up when the content script is unloaded
window.addEventListener('beforeunload', cleanup);

// Safe way to add event listeners that prevents duplicates
function addSafeEventListener(element, eventType, listener) {
  // Create a unique key for this element + event combination
  const selector = element.id ? 
    `#${element.id}` : 
    (element.className ? `.${element.className.replace(/\s+/g, '.')}` : 'element');
  
  const key = `${selector}|${eventType}`;
  
  // Remove any existing listener for this combination
  if (eventRegistry.has(key)) {
    element.removeEventListener(eventType, eventRegistry.get(key));
  }
  
  // Add the new listener and store it
  element.addEventListener(eventType, listener);
  eventRegistry.set(key, listener);
}

// Main autofill function
function autofillForm(profileData) {
  debugLog('Starting form autofill with profile data:', profileData);
  
  // Show loading toast
  showToastNotification('AutoApply Pro: Filling form fields...', 'info');
  
  // Map profile fields to common form field identifiers (expanded)
  const fieldMap = {
    // Personal information
    name: ['name', 'full_name', 'fullname', 'your name', 'first_name lastname', 'applicant', 'candidate'],
    firstName: ['first_name', 'firstname', 'given name', 'forename'],
    lastName: ['last_name', 'lastname', 'surname', 'family name'],
    email: ['email', 'e-mail', 'emailaddress', 'email address', 'your email'],
    phone: ['phone', 'telephone', 'mobile', 'cell', 'contact', 'phone number', 'your phone'],
    address: ['address', 'street', 'location', 'residence'],
    city: ['city', 'town', 'municipality'],
    state: ['state', 'province', 'region'],
    zipCode: ['zip', 'zipcode', 'postal code', 'postalcode', 'post code'],
    country: ['country', 'nation'],
    
    // Professional information
    headline: ['headline', 'title', 'job title', 'position', 'role'],
    summary: ['summary', 'about', 'profile', 'overview', 'bio', 'about me', 'introduction'],
    linkedin: ['linkedin', 'linked in', 'linkedinprofile', 'linkedin url', 'linkedin profile'],
    website: ['website', 'personal website', 'portfolio', 'personal site', 'homepage'],
    github: ['github', 'git hub', 'githubprofile', 'github url', 'repository'],
    
    // Work authorization
    citizenship: ['citizenship', 'citizen of', 'nationality'],
    workAuthorization: ['work authorization', 'work permit', 'authorized to work', 'legally authorized', 'sponsorship'],
    
    // Salary
    salaryExpectation: ['salary', 'compensation', 'expected salary', 'desired salary', 'salary expectation', 'salary requirement']
  };
  
  // Track filled fields
  let filledCount = 0;
  const filledFields = [];
  
  // Process each profile field
  Object.entries(profileData).forEach(([field, value]) => {
    // Skip complex objects, empty values, or internal fields
    if (typeof value !== 'string' || value.trim() === '' || field.startsWith('_')) return;
    
    // Get field keywords or use the field name itself if not mapped
    const keywords = fieldMap[field] || [field];
    
    // Try each keyword for this field
    keywords.forEach(keyword => {
      // Try various selector combinations
      const selectors = [
        // Input elements
        `input[name*="${keyword}" i]`,
        `input[id*="${keyword}" i]`,
        `input[placeholder*="${keyword}" i]`,
        `input[aria-label*="${keyword}" i]`,
        `input[data-testid*="${keyword}" i]`,
        `input[data-field*="${keyword}" i]`,
        
        // Textarea elements
        `textarea[name*="${keyword}" i]`,
        `textarea[id*="${keyword}" i]`,
        `textarea[placeholder*="${keyword}" i]`,
        `textarea[aria-label*="${keyword}" i]`,
        `textarea[data-testid*="${keyword}" i]`,
        
        // Select elements
        `select[name*="${keyword}" i]`,
        `select[id*="${keyword}" i]`,
        `select[aria-label*="${keyword}" i]`,
        
        // Labels followed by inputs (common pattern)
        `label:contains("${keyword}")`
      ];
      
      // Try each selector
      selectors.forEach(selector => {
        let elements = [];
        
        // Special handling for label selector
        if (selector.startsWith('label:contains')) {
          // Use a more reliable approach since :contains is jQuery
          document.querySelectorAll('label').forEach(label => {
            if (label.textContent.toLowerCase().includes(keyword.toLowerCase())) {
              // Find the associated input by for attribute or next sibling
              const forId = label.getAttribute('for');
              if (forId) {
                const input = document.getElementById(forId);
                if (input) elements.push(input);
              } else {
                // Check next siblings
                let sibling = label.nextElementSibling;
                while (sibling && elements.length === 0) {
                  if (sibling.tagName === 'INPUT' || sibling.tagName === 'TEXTAREA' || sibling.tagName === 'SELECT') {
                    elements.push(sibling);
                  }
                  sibling = sibling.nextElementSibling;
                }
              }
            }
          });
        } else {
          elements = document.querySelectorAll(selector);
        }
        
        if (elements.length > 0) {
          elements.forEach(element => {
            // Skip if already filled or disabled
            if ((element.value && element.value.trim() !== '') || element.disabled || element.readOnly) {
              return;
            }
            
            // Check if the element is visible and interactable
            if (!isElementVisible(element)) {
              debugLog('Skipping hidden element:', element);
              return;
            }
            
            // Fill the field based on element type
            const success = fillField(element, value, field);
            if (success) {
              highlightField(element);
              filledCount++;
              filledFields.push({ field, element, selector });
              
              debugLog(`Filled "${field}" in field matching "${selector}"`);
            }
          });
        }
      });
    });
  });
  
  // Check if we should try to handle select elements with complex values
  if (filledCount === 0) {
    debugLog('No fields filled with direct matching, trying advanced select handling');
    tryFillSelectElements(profileData);
  }
  
  // Handle special fields like skills, education, and experience
  handleSpecialFields(profileData, filledCount);
  
  // Show success message if any fields were filled
  if (filledCount > 0) {
    showToastNotification(`AutoApply Pro: ${filledCount} fields filled successfully!`);
  } else {
    showToastNotification('AutoApply Pro: No matching fields found', 'warning');
  }
  
  return filledCount;
}

// Fill a field and trigger necessary events
function fillField(element, value, fieldType) {
  try {
    // Focus the element
    element.focus();
    
    // Handle different element types
    if (element.tagName === 'SELECT') {
      // For select elements, find the option that matches the value
      let optionFound = false;
      
      // Try exact match first
      for (let i = 0; i < element.options.length; i++) {
        const option = element.options[i];
        if (option.value.toLowerCase() === value.toLowerCase() || 
            option.text.toLowerCase() === value.toLowerCase()) {
          element.selectedIndex = i;
          optionFound = true;
          break;
        }
      }
      
      // If no exact match, try partial match
      if (!optionFound) {
        for (let i = 0; i < element.options.length; i++) {
          const option = element.options[i];
          if (option.text.toLowerCase().includes(value.toLowerCase()) || 
              value.toLowerCase().includes(option.text.toLowerCase())) {
            element.selectedIndex = i;
            optionFound = true;
            break;
          }
        }
      }
      
      if (!optionFound) {
        debugLog(`No matching option found for ${fieldType} with value ${value}`);
        return false;
      }
    } else {
      // For text inputs and textareas
      element.value = value;
    }
    
    // Trigger events to ensure form validation captures the change
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.dispatchEvent(new Event('blur', { bubbles: true }));
    
    return true;
  } catch (error) {
    debugLog('Error filling field:', error);
    return false;
  }
}

// Check if an element is visible and interactable
function isElementVisible(element) {
  // Check if element exists
  if (!element || !(element instanceof Element)) return false;
  
  // Check computed style
  const style = window.getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
    return false;
  }
  
  // Check dimensions (elements with 0 height/width are not visible)
  const rect = element.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) {
    return false;
  }
  
  // Check if element is in viewport or reasonably close
  const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
  // Consider elements that are a bit outside the viewport but could be scrolled to
  if (rect.bottom < -viewHeight || rect.top > viewHeight * 2) {
    return false;
  }
  
  // Check if covered by another element
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const elementAtPoint = document.elementFromPoint(centerX, centerY);
  
  if (elementAtPoint && !element.contains(elementAtPoint) && !elementAtPoint.contains(element)) {
    // Element is likely covered by another element
    return false;
  }
  
  return true;
}

// Try to fill select elements with complex values
function tryFillSelectElements(profileData) {
  // Find all select elements
  const selectElements = document.querySelectorAll('select');
  let filledCount = 0;
  
  selectElements.forEach(select => {
    // Skip if already has a value
    if (select.value && select.selectedIndex > 0) return;
    
    // Look for labels or surrounding text to guess what this select is for
    let fieldType = null;
    let fieldValue = null;
    
    // Check for label
    const id = select.getAttribute('id');
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) {
        const labelText = label.textContent.toLowerCase();
        
        // Try to guess what field this is
        if (labelText.includes('country')) {
          fieldType = 'country';
          fieldValue = profileData.country;
        } else if (labelText.includes('state') || labelText.includes('province')) {
          fieldType = 'state';
          fieldValue = profileData.state;
        } else if (labelText.includes('city')) {
          fieldType = 'city';
          fieldValue = profileData.city;
        } else if (labelText.includes('education') || labelText.includes('degree')) {
          fieldType = 'education';
          fieldValue = profileData.degree || (profileData.education && profileData.education[0]?.degree);
        } else if (labelText.includes('experience') || labelText.includes('years')) {
          fieldType = 'experience';
          fieldValue = profileData.yearsOfExperience || '3-5'; // Default assumption
        }
      }
    }
    
    // If we identified a field type and have a value, try to fill it
    if (fieldType && fieldValue) {
      const success = fillField(select, fieldValue, fieldType);
      if (success) {
        highlightField(select);
        filledCount++;
        debugLog(`Auto-detected and filled select field for ${fieldType}`);
      }
    }
  });
  
  return filledCount;
}

// Highlight a field that was filled
function highlightField(element) {
  // Create a unique ID for tracking this highlight
  const highlightId = 'autoapply-highlight-' + Math.random().toString(36).substring(2, 11);
  element.setAttribute('data-highlight-id', highlightId);
  
  // Save original styles
  const originalOutline = element.style.outline;
  const originalOutlineOffset = element.style.outlineOffset;
  const originalBoxShadow = element.style.boxShadow;
  const originalBorder = element.style.border;
  const originalTransition = element.style.transition;
  
  // Apply yellow highlight
  element.style.transition = 'outline 0.3s, outline-offset 0.3s, border 0.3s, box-shadow 0.3s';
  element.style.outline = '2px solid #FFEB3B'; // Yellow outline
  element.style.outlineOffset = '2px';
  element.style.boxShadow = '0 0 8px rgba(255, 235, 59, 0.5)'; // Subtle yellow glow
  
  if (element.style.border) {
    element.style.border = '1px solid #FFEB3B'; // Yellow border
  }
  
  // Reset after 1 second (as per requirements)
  const timeoutId = setTimeout(() => {
    // Only reset if the element still exists and the highlight ID matches
    if (element && element.getAttribute('data-highlight-id') === highlightId) {
      element.style.outline = originalOutline;
      element.style.outlineOffset = originalOutlineOffset;
      element.style.boxShadow = originalBoxShadow;
      element.style.border = originalBorder;
      
      // Remove the highlight ID
      element.removeAttribute('data-highlight-id');
      
      // Reset transition after the animation completes
      setTimeout(() => {
        if (element) {
          element.style.transition = originalTransition;
        }
      }, 300);
    }
  }, 1000);
  
  // Store the timeout ID so it can be cleared if needed
  element._highlightTimeoutId = timeoutId;
}

// Handle special fields like skills, education and experience
function handleSpecialFields(profileData, filledCount) {
  // Handle skills (join array into comma-separated list)
  if (profileData.skills && Array.isArray(profileData.skills) && profileData.skills.length > 0) {
    const skillValue = profileData.skills.join(', ');
    const skillSelectors = [
      'textarea[name*="skill" i]',
      'textarea[id*="skill" i]',
      'textarea[placeholder*="skill" i]',
      'input[name*="skill" i]',
      'input[id*="skill" i]',
      'input[placeholder*="skill" i]'
    ];
    
    skillSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (!element.value || element.value.trim() === '') {
          fillField(element, skillValue);
          highlightField(element);
          filledCount++;
        }
      });
    });
  }
  
  // Handle education history (most recent first)
  if (profileData.education && Array.isArray(profileData.education) && profileData.education.length > 0) {
    // Sort education by year (most recent first)
    const sortedEducation = [...profileData.education].sort((a, b) => {
      const yearA = parseInt(a.year) || 0;
      const yearB = parseInt(b.year) || 0;
      return yearB - yearA;
    });
    
    // Try to fill education fields
    const mostRecent = sortedEducation[0];
    if (mostRecent) {
      // Degree
      const degreeSelectors = [
        'input[name*="degree" i]',
        'input[id*="degree" i]',
        'input[name*="qualification" i]',
        'input[id*="qualification" i]',
        'input[name*="education" i]',
        'input[id*="education" i]'
      ];
      
      degreeSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          if (!element.value || element.value.trim() === '') {
            fillField(element, mostRecent.degree);
            highlightField(element);
            filledCount++;
          }
        });
      });
      
      // Institution
      const institutionSelectors = [
        'input[name*="institution" i]',
        'input[id*="institution" i]',
        'input[name*="school" i]',
        'input[id*="school" i]',
        'input[name*="university" i]',
        'input[id*="university" i]',
        'input[name*="college" i]',
        'input[id*="college" i]'
      ];
      
      institutionSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          if (!element.value || element.value.trim() === '') {
            fillField(element, mostRecent.institution);
            highlightField(element);
            filledCount++;
          }
        });
      });
      
      // Year
      const yearSelectors = [
        'input[name*="year" i]',
        'input[id*="year" i]',
        'input[name*="graduation" i]',
        'input[id*="graduation" i]'
      ];
      
      yearSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          if (!element.value || element.value.trim() === '') {
            fillField(element, mostRecent.year);
            highlightField(element);
            filledCount++;
          }
        });
      });
    }
  }
  
  // Handle work experience (most recent first)
  if (profileData.experience && Array.isArray(profileData.experience) && profileData.experience.length > 0) {
    const mostRecent = profileData.experience[0];
    if (mostRecent) {
      // Company
      const companySelectors = [
        'input[name*="company" i]',
        'input[id*="company" i]',
        'input[name*="employer" i]',
        'input[id*="employer" i]',
        'input[name*="organization" i]',
        'input[id*="organization" i]'
      ];
      
      companySelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          if (!element.value || element.value.trim() === '') {
            fillField(element, mostRecent.company);
            highlightField(element);
            filledCount++;
          }
        });
      });
      
      // Role/Title
      const roleSelectors = [
        'input[name*="role" i]',
        'input[id*="role" i]',
        'input[name*="title" i]',
        'input[id*="title" i]',
        'input[name*="position" i]',
        'input[id*="position" i]',
        'input[name*="job title" i]',
        'input[id*="job title" i]'
      ];
      
      roleSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          if (!element.value || element.value.trim() === '') {
            fillField(element, mostRecent.role);
            highlightField(element);
            filledCount++;
          }
        });
      });
      
      // Duration
      const durationSelectors = [
        'input[name*="duration" i]',
        'input[id*="duration" i]',
        'input[name*="period" i]',
        'input[id*="period" i]',
        'input[name*="tenure" i]',
        'input[id*="tenure" i]'
      ];
      
      durationSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          if (!element.value || element.value.trim() === '') {
            fillField(element, mostRecent.duration);
            highlightField(element);
            filledCount++;
          }
        });
      });
    }
  }
  
  return filledCount;
}

// Show a toast notification in the page
function showToastNotification(message, type = 'success') {
  // Create a unique ID for this toast
  const toastId = `autoapply-toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  // Check if toast container exists, create it if not
  let toastContainer = document.getElementById('autoapply-toast-container');
  
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'autoapply-toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    `;
    document.body.appendChild(toastContainer);
  }
  
  // Create toast element
  const toast = document.createElement('div');
  toast.id = toastId;
  toast.style.cssText = `
    background-color: ${type === 'success' ? '#4CAF50' : type === 'warning' ? '#FF9800' : type === 'error' ? '#F44336' : '#2196F3'};
    color: white;
    padding: 12px 16px;
    border-radius: 4px;
    margin-top: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    font-family: Arial, sans-serif;
    font-size: 14px;
    max-width: 300px;
    display: flex;
    align-items: center;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.3s, transform 0.3s;
  `;
  
  // Add icon
  const icon = document.createElement('span');
  icon.style.cssText = `
    margin-right: 8px;
    font-weight: bold;
  `;
  icon.textContent = type === 'success' ? '✓' : type === 'warning' ? '⚠' : type === 'error' ? '✕' : 'ℹ';
  toast.appendChild(icon);
  
  // Add message
  const messageEl = document.createElement('span');
  messageEl.textContent = message;
  toast.appendChild(messageEl);
  
  // Add close button
  const closeBtn = document.createElement('span');
  closeBtn.style.cssText = `
    margin-left: 8px;
    cursor: pointer;
    font-weight: bold;
    opacity: 0.7;
  `;
  closeBtn.textContent = '×';
  closeBtn.addEventListener('click', function() {
    removeToast(toastId);
  });
  toast.appendChild(closeBtn);
  
  // Add to container
  toastContainer.appendChild(toast);
  
  // Trigger animation
  const animateInTimeoutId = setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  }, 10);
  activeTimeouts.add(animateInTimeoutId);
  
  // Remove after delay
  const removeTimeoutId = setTimeout(() => {
    removeToast(toastId);
  }, 3000);
  activeTimeouts.add(removeTimeoutId);
  
  return toastId;
}

// Remove a toast by ID
function removeToast(toastId) {
  const toast = document.getElementById(toastId);
  if (!toast) return;
  
  toast.style.opacity = '0';
  toast.style.transform = 'translateY(-20px)';
  
  // Remove from DOM after animation
  const removeTimeoutId = setTimeout(() => {
    const toastContainer = document.getElementById('autoapply-toast-container');
    
    if (toast.parentNode) {
      toastContainer.removeChild(toast);
    }
    
    // Remove container if empty
    if (toastContainer && toastContainer.children.length === 0 && toastContainer.parentNode) {
      document.body.removeChild(toastContainer);
    }
  }, 300);
  
  activeTimeouts.add(removeTimeoutId);
}
