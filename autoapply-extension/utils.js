/**
 * AutoApply Pro - Utility Functions
 * Collection of utility functions for performance optimization and API handling
 */

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * @param {Function} func The function to debounce
 * @param {number} wait The number of milliseconds to delay
 * @param {boolean} immediate Whether to invoke the function immediately
 * @returns {Function} The debounced function
 */
function debounce(func, wait = 300, immediate = false) {
  let timeout;
  
  return function executedFunction(...args) {
    const context = this;
    
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    
    const callNow = immediate && !timeout;
    
    clearTimeout(timeout);
    
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(context, args);
  };
}

/**
 * Safely parses JSON with error handling
 * @param {string} str The string to parse
 * @param {*} fallback The fallback value if parsing fails
 * @returns {*} The parsed JSON or fallback value
 */
function safeJsonParse(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch (err) {
    console.error('JSON parse error:', err);
    return fallback;
  }
}

/**
 * Caches API responses with TTL
 * @param {string} key The cache key
 * @param {*} data The data to cache
 * @param {number} ttl Time to live in milliseconds
 */
function cacheApiResponse(key, data, ttl = 1000 * 60 * 5) { // Default 5 minutes
  const cacheItem = {
    data,
    expiry: Date.now() + ttl
  };
  
  chrome.storage.local.set({ [key]: JSON.stringify(cacheItem) });
}

/**
 * Gets cached API response if not expired
 * @param {string} key The cache key
 * @returns {Promise<{data: *, isCached: boolean}>} The cached data or null if expired
 */
async function getCachedApiResponse(key) {
  return new Promise(resolve => {
    chrome.storage.local.get([key], result => {
      const cachedItem = safeJsonParse(result[key], null);
      
      if (!cachedItem || Date.now() > cachedItem.expiry) {
        resolve({ data: null, isCached: false });
        return;
      }
      
      resolve({ data: cachedItem.data, isCached: true });
    });
  });
}

/**
 * Creates a cached API fetching function with exponential backoff retry
 * @param {Function} fetchFn The fetch function
 * @param {string} cacheKey The cache key
 * @param {number} cacheTtl Cache TTL in milliseconds
 * @param {number} maxRetries Maximum number of retries
 * @returns {Promise<*>} The API response
 */
async function cachedFetchWithRetry(fetchFn, cacheKey, cacheTtl = 1000 * 60 * 5, maxRetries = 2) {
  // Try to get from cache first
  const { data: cachedData, isCached } = await getCachedApiResponse(cacheKey);
  if (isCached) return cachedData;
  
  // Not in cache, make actual API call with retry logic
  let lastError = null;
  let retryCount = 0;
  
  while (retryCount <= maxRetries) {
    try {
      // Wait with exponential backoff before retrying
      if (retryCount > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount - 1)));
      }
      
      const data = await fetchFn();
      
      // Cache successful response
      cacheApiResponse(cacheKey, data, cacheTtl);
      
      return data;
    } catch (err) {
      lastError = err;
      retryCount++;
      
      // If it's a 401 (auth error) or 404 (not found), don't retry
      if (err.status === 401 || err.status === 404) {
        break;
      }
    }
  }
  
  // If we got here, all retries failed
  throw lastError;
}

// Export utilities
window.AutoApplyUtils = {
  debounce,
  safeJsonParse,
  cacheApiResponse,
  getCachedApiResponse,
  cachedFetchWithRetry
};
