const { performanceLogger } = require('../utils/logger');

/**
 * Performance monitoring middleware
 * Tracks request duration and identifies slow operations
 */
const performanceMonitor = (req, res, next) => {
  const startTime = process.hrtime.bigint();
  const startMemory = process.memoryUsage();
  
  // Store original end method
  const originalEnd = res.end;
  
  // Override end method to capture metrics
  res.end = function(...args) {
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds
    const endMemory = process.memoryUsage();
    
    const metrics = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: Math.round(duration * 100) / 100, // Round to 2 decimal places
      memoryUsage: {
        heapUsed: Math.round((endMemory.heapUsed - startMemory.heapUsed) / 1024 / 1024 * 100) / 100, // MB
        heapTotal: Math.round(endMemory.heapTotal / 1024 / 1024 * 100) / 100, // MB
      },
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.id
    };
    
    // Log slow requests (over 1 second)
    if (duration > 1000) {
      performanceLogger('slow_request', duration, {
        ...metrics,
        level: 'warning'
      });
    } else if (duration > 5000) {
      // Very slow requests (over 5 seconds)
      performanceLogger('very_slow_request', duration, {
        ...metrics,
        level: 'error'
      });
    } else {
      // Normal request logging (only in development)
      if (process.env.NODE_ENV === 'development') {
        performanceLogger('request', duration, metrics);
      }
    }
    
    // Call original end method
    originalEnd.apply(this, args);
  };
  
  next();
};

/**
 * Database query performance tracking
 */
const trackDBQuery = (operation, queryTime, collection, query = {}) => {
  const metrics = {
    operation,
    collection,
    queryTime: Math.round(queryTime * 100) / 100,
    query: process.env.NODE_ENV === 'development' ? query : undefined
  };
  
  if (queryTime > 100) { // Slow queries over 100ms
    performanceLogger('slow_db_query', queryTime, {
      ...metrics,
      level: 'warning'
    });
  } else if (queryTime > 500) { // Very slow queries over 500ms
    performanceLogger('very_slow_db_query', queryTime, {
      ...metrics,
      level: 'error'
    });
  }
};

/**
 * API call performance tracking
 */
const trackAPICall = (service, operation, responseTime, success = true) => {
  const metrics = {
    service,
    operation,
    responseTime: Math.round(responseTime * 100) / 100,
    success,
    timestamp: new Date().toISOString()
  };
  
  if (!success) {
    performanceLogger('api_call_failed', responseTime, {
      ...metrics,
      level: 'error'
    });
  } else if (responseTime > 2000) { // Slow API calls over 2 seconds
    performanceLogger('slow_api_call', responseTime, {
      ...metrics,
      level: 'warning'
    });
  } else if (responseTime > 5000) { // Very slow API calls over 5 seconds
    performanceLogger('very_slow_api_call', responseTime, {
      ...metrics,
      level: 'error'
    });
  }
};

/**
 * Memory usage monitoring
 */
const monitorMemoryUsage = () => {
  const usage = process.memoryUsage();
  const metrics = {
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024 * 100) / 100, // MB
    heapTotal: Math.round(usage.heapTotal / 1024 / 1024 * 100) / 100, // MB
    external: Math.round(usage.external / 1024 / 1024 * 100) / 100, // MB
    rss: Math.round(usage.rss / 1024 / 1024 * 100) / 100, // MB
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString()
  };
  
  // Alert if memory usage is high
  if (metrics.heapUsed > 512) { // Over 512MB
    performanceLogger('high_memory_usage', metrics.heapUsed, {
      ...metrics,
      level: 'warning'
    });
  } else if (metrics.heapUsed > 1024) { // Over 1GB
    performanceLogger('critical_memory_usage', metrics.heapUsed, {
      ...metrics,
      level: 'error'
    });
  }
  
  return metrics;
};

// Schedule memory monitoring every 5 minutes
if (process.env.NODE_ENV === 'production') {
  setInterval(monitorMemoryUsage, 5 * 60 * 1000);
}

module.exports = {
  performanceMonitor,
  trackDBQuery,
  trackAPICall,
  monitorMemoryUsage
};
