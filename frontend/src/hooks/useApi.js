import { useState, useEffect, useCallback, useRef } from 'react';
import apiService from '../services/api';

/**
 * Custom hook for API calls with loading, error, and caching
 */
export const useApi = (apiCall, dependencies = [], options = {}) => {
  const [data, setData] = useState(options.initialData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);
  const abortControllerRef = useRef(null);

  const {
    immediate = true,
    onSuccess,
    onError,
    retryCount = 0,
    retryDelay = 1000
  } = options;

  const execute = useCallback(async (...args) => {
    if (!mountedRef.current) return;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    let attempt = 0;
    while (attempt <= retryCount) {
      try {
        const result = await apiCall(...args);
        
        if (!mountedRef.current) return;

        setData(result.data);
        setLoading(false);
        
        if (onSuccess) {
          onSuccess(result.data);
        }
        
        return result.data;
      } catch (err) {
        attempt++;
        
        if (!mountedRef.current) return;

        if (attempt > retryCount) {
          setError(err);
          setLoading(false);
          
          if (onError) {
            onError(err);
          }
          
          throw err;
        }

        // Wait before retry
        if (attempt <= retryCount) {
          await new Promise(resolve => 
            setTimeout(resolve, retryDelay * Math.pow(2, attempt - 1))
          );
        }
      }
    }
  }, [apiCall, retryCount, retryDelay, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      execute();
    }

    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, dependencies);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    refetch: execute
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
