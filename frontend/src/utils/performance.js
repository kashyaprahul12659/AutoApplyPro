/**
 * Performance monitoring and optimization utilities
 */

// Performance metrics collection
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = [];
    this.isEnabled = process.env.NODE_ENV === 'production' || 
                     process.env.REACT_APP_PERFORMANCE_MONITORING === 'true';
    
    if (this.isEnabled) {
      this.initializeObservers();
    }
  }

  initializeObservers() {
    // Performance Observer for navigation timing
    if ('PerformanceObserver' in window) {
      // Navigation timing
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric('navigation', {
            name: entry.name,
            duration: entry.duration,
            loadEventEnd: entry.loadEventEnd,
            domContentLoadedEventEnd: entry.domContentLoadedEventEnd,
            type: entry.type
          });
        }
      });

      navObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navObserver);

      // Resource timing
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 100) { // Only log slow resources
            this.recordMetric('resource', {
              name: entry.name,
              duration: entry.duration,
              transferSize: entry.transferSize,
              encodedBodySize: entry.encodedBodySize,
              initiatorType: entry.initiatorType
            });
          }
        }
      });

      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);

      // Long task timing
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric('long-task', {
            duration: entry.duration,
            startTime: entry.startTime,
            name: entry.name
          });
        }
      });

      try {
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.push(longTaskObserver);
      } catch (e) {
        // Long task observer not supported in all browsers
      }
    }

    // Custom timing for React components
    this.startComponentTiming = this.startComponentTiming.bind(this);
    this.endComponentTiming = this.endComponentTiming.bind(this);
  }

  recordMetric(type, data) {
    const timestamp = Date.now();
    const metric = {
      type,
      timestamp,
      ...data
    };

    if (!this.metrics.has(type)) {
      this.metrics.set(type, []);
    }

    this.metrics.get(type).push(metric);

    // Keep only last 100 metrics per type
    if (this.metrics.get(type).length > 100) {
      this.metrics.get(type).shift();
    }

    // Log performance issues
    if (type === 'navigation' && data.duration > 3000) {
      console.warn('Slow page load detected:', data.duration + 'ms');
    }

    if (type === 'long-task' && data.duration > 50) {
      console.warn('Long task detected:', data.duration + 'ms');
    }
  }

  startComponentTiming(componentName) {
    if (!this.isEnabled) return;
    
    const startTime = performance.now();
    return {
      end: () => {
        const duration = performance.now() - startTime;
        this.recordMetric('component', {
          name: componentName,
          duration,
          renderTime: startTime
        });
      }
    };
  }

  endComponentTiming(timer) {
    if (timer && timer.end) {
      timer.end();
    }
  }

  // Get Web Vitals
  getCoreWebVitals() {
    return new Promise((resolve) => {
      const vitals = {};

      // First Contentful Paint
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              vitals.fcp = entry.startTime;
            }
          }
        });
        observer.observe({ entryTypes: ['paint'] });
      }

      // Largest Contentful Paint
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          vitals.lcp = lastEntry.startTime;
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      }

      // Cumulative Layout Shift
      if ('PerformanceObserver' in window) {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          vitals.cls = clsValue;
        });
        observer.observe({ entryTypes: ['layout-shift'] });
      }

      // First Input Delay would be measured when user interacts
      vitals.fid = 0; // Placeholder

      setTimeout(() => resolve(vitals), 2000);
    });
  }

  getMetrics() {
    const allMetrics = {};
    for (const [type, metrics] of this.metrics) {
      allMetrics[type] = metrics;
    }
    return allMetrics;
  }

  // Memory usage monitoring
  getMemoryUsage() {
    if ('memory' in performance) {
      return {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
        usagePercentage: (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100
      };
    }
    return null;
  }

  // Network information
  getNetworkInfo() {
    if ('connection' in navigator) {
      return {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
        saveData: navigator.connection.saveData
      };
    }
    return null;
  }

  // Generate performance report
  generateReport() {
    return {
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      memory: this.getMemoryUsage(),
      network: this.getNetworkInfo(),
      metrics: this.getMetrics(),
      webVitals: null // Would need to be populated separately
    };
  }

  // Clean up observers
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
  }
}

// Image optimization utilities
export const ImageOptimizer = {
  // Lazy loading intersection observer
  createLazyLoadObserver(callback, options = {}) {
    const defaultOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    };

    return new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry.target);
        }
      });
    }, { ...defaultOptions, ...options });
  },

  // Preload critical images
  preloadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  },

  // Generate responsive image srcSet
  generateSrcSet(baseUrl, sizes = [320, 640, 960, 1280]) {
    return sizes.map(size => `${baseUrl}?w=${size} ${size}w`).join(', ');
  },

  // Optimize image loading
  optimizeImage(imgElement, options = {}) {
    const { lazy = true, sizes, quality = 80 } = options;

    if (lazy) {
      imgElement.loading = 'lazy';
    }

    if (sizes) {
      imgElement.sizes = sizes;
    }

    // Add quality parameter if URL supports it
    if (imgElement.src && quality !== 80) {
      const url = new URL(imgElement.src);
      url.searchParams.set('q', quality);
      imgElement.src = url.toString();
    }
  }
};

// Bundle optimization utilities
export const BundleOptimizer = {
  // Dynamically import modules
  async importModule(modulePath) {
    try {
      const module = await import(modulePath);
      return module;
    } catch (error) {
      console.error(`Failed to load module: ${modulePath}`, error);
      throw error;
    }
  },

  // Preload critical resources
  preloadResource(href, as = 'script') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  },

  // Prefetch resources for future navigation
  prefetchResource(href) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  }
};

// Create global performance monitor instance
const performanceMonitor = new PerformanceMonitor();

// React hook for component performance monitoring
export const usePerformanceMonitor = (componentName) => {
  const startTiming = () => performanceMonitor.startComponentTiming(componentName);
  const endTiming = (timer) => performanceMonitor.endComponentTiming(timer);
  
  return { startTiming, endTiming };
};

// React hook for memory monitoring
export const useMemoryMonitor = () => {
  const getMemoryUsage = () => performanceMonitor.getMemoryUsage();
  const checkMemoryPressure = () => {
    const memory = getMemoryUsage();
    if (memory && memory.usagePercentage > 80) {
      console.warn('High memory usage detected:', memory.usagePercentage + '%');
      return true;
    }
    return false;
  };

  return { getMemoryUsage, checkMemoryPressure };
};

// Debounce utility
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

// Throttle utility
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Memoization utility
export const memoize = (fn, getKey = (...args) => JSON.stringify(args)) => {
  const cache = new Map();
  
  return (...args) => {
    const key = getKey(...args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    
    // Limit cache size
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    return result;
  };
};

export default performanceMonitor;
