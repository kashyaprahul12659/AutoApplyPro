import { useState, useEffect, useCallback, useRef } from 'react';
import apiService from '../services/api';

/**
 * Custom hook for API calls with loading, error, and robust error handling
 */
export const useApi = (apiCall, dependencies = [], options = {}) => {
  const [data, setData] = useState(options.initialData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);
  const abortControllerRef = useRef(null);

  // Handle safely destructured options with null check
  const {
    immediate = true,
    onSuccess,
    onError,
    retryCount = 0,
    retryDelay = 1000
  } = options || {};  const execute = useCallback(async (...args) => {
    if (!mountedRef.current) return;

    // Check if apiCall is a function with detailed logging
    if (typeof apiCall !== 'function') {
      const errorMessage = `API call is not a function: ${typeof apiCall}`;
      console.error(errorMessage, { apiCall });
      
      const error = new Error(errorMessage);
      setError(error);
      setLoading(false);
      
      if (typeof onError === 'function') {
        try {
          onError(error);
        } catch (callbackError) {
          console.error('Error in onError callback:', callbackError);
        }
      }
      
      return { error: true, data: null, message: errorMessage };
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    let attempt = 0;
    const maxAttempts = retryCount || 0;
    
    while (attempt <= maxAttempts) {
      try {
        // Careful invocation with try/catch
        let result;
        try {
          result = await apiCall(...args);
        } catch (invocationError) {
          console.error(`API call invocation error (attempt ${attempt + 1}/${maxAttempts + 1}):`, invocationError);
          throw invocationError; // Rethrow to be caught by the outer try/catch
        }

        if (!mountedRef.current) return;

        // Handle case where result or result.data might be undefined
        if (result === undefined || result === null) {
          console.warn('API call returned null/undefined result');
          result = { data: null };
        }
        
        const resultData = result?.data !== undefined ? result.data : null;
        setData(resultData);
        setLoading(false);

        if (typeof onSuccess === 'function') {
          try {
            onSuccess(resultData);
          } catch (successCallbackError) {
            console.error('Error in success callback:', successCallbackError);
          }
        }

        return resultData;
      } catch (err) {
        attempt++;

        if (!mountedRef.current) return;

        if (attempt > maxAttempts) {
          setError(err);
          setLoading(false);

          if (typeof onError === 'function') {
            try {
              onError(err);
            } catch (errorCallbackError) {
              console.error('Error in error callback:', errorCallbackError);
            }
          }

          return { 
            error: true, 
            data: null, 
            message: err.message || 'Unknown error occurred',
            originalError: err
          };
        }        // Wait before retry
        if (attempt <= maxAttempts) {
          const retryTime = retryDelay * Math.pow(2, attempt - 1);
          console.log(`Retrying API call, attempt ${attempt} of ${maxAttempts}, waiting ${retryTime}ms`);
          await new Promise(resolve => setTimeout(resolve, retryTime));
        }
      }
    }
    
    // This should never execute but adding as a fallback
    return { error: true, data: null, message: 'Unknown error in API call' };
  }, [apiCall, retryCount, retryDelay, onSuccess, onError]);
  useEffect(() => {
    if (immediate && typeof apiCall === 'function') {
      execute();
    }

    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);  // Provide apiCall in the return value for use in components
  return {
    data,
    loading,
    error,
    execute,
    refetch: execute,
    apiCall // Expose apiCall for direct use in components
  };
};

// Export a version with no parameters for use in components that just need the API utility
export const useApiInstance = () => {
  return {
    apiCall: async (endpoint, options) => {
      try {
        if (!endpoint) {
          console.error('No endpoint provided to apiCall');
          return { error: true, data: null, message: 'No endpoint provided' };
        }
        
        return await apiService.request(endpoint, options);
      } catch (error) {
        console.error('API call failed:', error);
        return { error: true, data: null, message: error.message || 'API call failed' };
      }
    }
  };
};

/**
 * Hook for form submissions with validation and loading states
 */
export const useFormSubmit = (submitFunction, options = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const {
    onSuccess,
    onError,
    resetOnSuccess = true,
    resetDelay = 2000
  } = options;

  const submit = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await submitFunction(formData);
      setSuccess(true);

      if (onSuccess) {
        onSuccess(result);
      }

      if (resetOnSuccess) {
        setTimeout(() => {
          setSuccess(false);
        }, resetDelay);
      }

      return result;
    } catch (err) {
      setError(err);

      if (onError) {
        onError(err);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, [submitFunction, onSuccess, onError, resetOnSuccess, resetDelay]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  return {
    submit,
    loading,
    error,
    success,
    reset
  };
};

/**
 * Hook for debounced search
 */
export const useDebounceSearch = (searchFunction, delay = 500) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const timeoutRef = useRef(null);

  const search = useCallback((searchQuery) => {
    setQuery(searchQuery);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!searchQuery.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    timeoutRef.current = setTimeout(async () => {
      try {
        const result = await searchFunction(searchQuery);
        setResults(result.data || result);
        setError(null);
      } catch (err) {
        setError(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, delay);
  }, [searchFunction, delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    query,
    results,
    loading,
    error,
    search,
    setQuery,
    clearResults: () => setResults([])
  };
};

/**
 * Hook for infinite scrolling/pagination
 */
export const useInfiniteScroll = (fetchFunction, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const {
    pageSize = 10,
    onSuccess,
    onError
  } = options;

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFunction({
        page,
        limit: pageSize
      });

      const newData = result.data || result;

      setData(prevData => [...prevData, ...newData]);
      setHasMore(newData.length === pageSize);
      setPage(prevPage => prevPage + 1);

      if (onSuccess) {
        onSuccess(newData);
      }
    } catch (err) {
      setError(err);

      if (onError) {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, loading, hasMore, page, pageSize, onSuccess, onError]);

  const reset = useCallback(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, []);

  useEffect(() => {
    loadMore();
  }, []);

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    reset
  };
};

/**
 * Hook for local storage with state synchronization
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

/**
 * Hook for optimistic updates
 */
export const useOptimisticUpdate = (initialData, updateFunction) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const update = useCallback(async (optimisticData, actualUpdateFunction) => {
    const previousData = data;

    // Apply optimistic update
    setData(optimisticData);
    setLoading(true);
    setError(null);

    try {
      // Perform actual update
      const result = await (actualUpdateFunction || updateFunction)(optimisticData);

      // Update with server response
      setData(result.data || result);
    } catch (err) {
      // Rollback on error
      setData(previousData);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [data, updateFunction]);

  return {
    data,
    loading,
    error,
    update,
    setData
  };
};

/**
 * Hook for file uploads with progress
 */
export const useFileUpload = (uploadFunction, options = {}) => {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const {
    onSuccess,
    onError,
    allowedTypes = [],
    maxSize = 5 * 1024 * 1024 // 5MB
  } = options;

  const upload = useCallback(async (file) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setProgress(0);

    // Validate file
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      const error = new Error(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
      setError(error);
      setLoading(false);
      if (onError) onError(error);
      return;
    }

    if (file.size > maxSize) {
      const error = new Error(`File too large. Max size: ${(maxSize / 1024 / 1024).toFixed(2)}MB`);
      setError(error);
      setLoading(false);
      if (onError) onError(error);
      return;
    }

    try {
      const result = await uploadFunction(file, setProgress);
      setSuccess(true);

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (err) {
      setError(err);

      if (onError) {
        onError(err);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, [uploadFunction, allowedTypes, maxSize, onSuccess, onError]);

  const reset = useCallback(() => {
    setProgress(0);
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  return {
    upload,
    progress,
    loading,
    error,
    success,
    reset
  };
};
