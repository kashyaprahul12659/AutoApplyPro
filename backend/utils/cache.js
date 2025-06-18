const NodeCache = require('node-cache');
const { logger, performanceLogger } = require('../utils/logger');

// Create cache instances with different TTL settings
const caches = {
  // Short-term cache for frequently accessed data (5 minutes)
  short: new NodeCache({ 
    stdTTL: 300, // 5 minutes
    checkperiod: 60, // Check for expired keys every minute
    useClones: false,
    maxKeys: 1000
  }),
  
  // Medium-term cache for semi-static data (30 minutes)
  medium: new NodeCache({ 
    stdTTL: 1800, // 30 minutes
    checkperiod: 300, // Check for expired keys every 5 minutes
    useClones: false,
    maxKeys: 500
  }),
  
  // Long-term cache for static data (2 hours)
  long: new NodeCache({ 
    stdTTL: 7200, // 2 hours
    checkperiod: 600, // Check for expired keys every 10 minutes
    useClones: false,
    maxKeys: 200
  }),
  
  // User session cache (24 hours)
  session: new NodeCache({ 
    stdTTL: 86400, // 24 hours
    checkperiod: 3600, // Check for expired keys every hour
    useClones: false,
    maxKeys: 10000
  })
};

// Cache event listeners for monitoring
Object.entries(caches).forEach(([name, cache]) => {
  cache.on('set', (key, value) => {
    if (process.env.NODE_ENV === 'development') {
      logger.debug(`Cache SET [${name}]: ${key}`);
    }
  });
  
  cache.on('del', (key, value) => {
    if (process.env.NODE_ENV === 'development') {
      logger.debug(`Cache DEL [${name}]: ${key}`);
    }
  });
  
  cache.on('expired', (key, value) => {
    if (process.env.NODE_ENV === 'development') {
      logger.debug(`Cache EXPIRED [${name}]: ${key}`);
    }
  });
});

/**
 * Generic cache wrapper function
 */
const withCache = (cacheType = 'short') => {
  return (key, asyncFunction, ttl = null) => {
    return async (...args) => {
      const cache = caches[cacheType];
      const startTime = Date.now();
      
      try {
        // Try to get from cache first
        const cached = cache.get(key);
        if (cached !== undefined) {
          performanceLogger('cache_hit', Date.now() - startTime, {
            cacheType,
            key: process.env.NODE_ENV === 'development' ? key : 'redacted'
          });
          return cached;
        }
        
        // If not in cache, execute function
        const result = await asyncFunction(...args);
        
        // Store in cache
        if (ttl) {
          cache.set(key, result, ttl);
        } else {
          cache.set(key, result);
        }
        
        performanceLogger('cache_miss', Date.now() - startTime, {
          cacheType,
          key: process.env.NODE_ENV === 'development' ? key : 'redacted'
        });
        
        return result;
      } catch (error) {
        logger.error(`Cache operation failed for key ${key}:`, error);
        // If cache fails, execute function normally
        return await asyncFunction(...args);
      }
    };
  };
};

/**
 * Cache middleware for Express routes
 */
const cacheMiddleware = (cacheType = 'short', keyGenerator = null, ttl = null) => {
  return (req, res, next) => {
    const cache = caches[cacheType];
    
    // Generate cache key
    let cacheKey;
    if (keyGenerator) {
      cacheKey = keyGenerator(req);
    } else {
      // Default cache key generation
      const userId = req.user?.id || 'anonymous';
      const method = req.method;
      const path = req.originalUrl;
      const queryString = JSON.stringify(req.query);
      cacheKey = `${method}:${path}:${userId}:${queryString}`;
    }
    
    // Try to get from cache
    const cached = cache.get(cacheKey);
    if (cached !== undefined) {
      logger.debug(`Cache hit for key: ${cacheKey}`);
      return res.json(cached);
    }
    
    // If not in cache, store original res.json
    const originalJson = res.json;
    
    res.json = function(data) {
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        if (ttl) {
          cache.set(cacheKey, data, ttl);
        } else {
          cache.set(cacheKey, data);
        }
        logger.debug(`Cached response for key: ${cacheKey}`);
      }
      
      // Call original json method
      return originalJson.call(this, data);
    };
    
    next();
  };
};

/**
 * Cache invalidation helpers
 */
const invalidateCache = {
  // Invalidate user-specific cache
  user: (userId) => {
    Object.values(caches).forEach(cache => {
      const keys = cache.keys();
      keys.forEach(key => {
        if (key.includes(userId)) {
          cache.del(key);
        }
      });
    });
    logger.info(`Invalidated cache for user: ${userId}`);
  },
  
  // Invalidate cache by pattern
  pattern: (pattern, cacheType = 'all') => {
    const targetCaches = cacheType === 'all' ? Object.values(caches) : [caches[cacheType]];
    
    targetCaches.forEach(cache => {
      const keys = cache.keys();
      keys.forEach(key => {
        if (key.includes(pattern)) {
          cache.del(key);
        }
      });
    });
    logger.info(`Invalidated cache for pattern: ${pattern}`);
  },
  
  // Clear all cache
  all: (cacheType = 'all') => {
    if (cacheType === 'all') {
      Object.values(caches).forEach(cache => cache.flushAll());
      logger.info('Cleared all caches');
    } else {
      caches[cacheType].flushAll();
      logger.info(`Cleared ${cacheType} cache`);
    }
  },
  
  // Invalidate specific key
  key: (key, cacheType = 'all') => {
    if (cacheType === 'all') {
      Object.values(caches).forEach(cache => cache.del(key));
    } else {
      caches[cacheType].del(key);
    }
    logger.info(`Invalidated cache key: ${key}`);
  }
};

/**
 * Cache statistics
 */
const getCacheStats = () => {
  const stats = {};
  
  Object.entries(caches).forEach(([name, cache]) => {
    stats[name] = {
      keys: cache.keys().length,
      hits: cache.getStats().hits,
      misses: cache.getStats().misses,
      hitRate: cache.getStats().hits / (cache.getStats().hits + cache.getStats().misses) * 100 || 0
    };
  });
  
  return stats;
};

/**
 * Specific cache functions for common use cases
 */
const userCache = {
  get: (userId) => caches.session.get(`user:${userId}`),
  set: (userId, userData, ttl = 3600) => caches.session.set(`user:${userId}`, userData, ttl),
  del: (userId) => caches.session.del(`user:${userId}`)
};

const resumeCache = {
  get: (resumeId) => caches.medium.get(`resume:${resumeId}`),
  set: (resumeId, resumeData, ttl = 1800) => caches.medium.set(`resume:${resumeId}`, resumeData, ttl),
  del: (resumeId) => caches.medium.del(`resume:${resumeId}`)
};

const aiCache = {
  get: (prompt) => {
    const hash = require('crypto').createHash('md5').update(prompt).digest('hex');
    return caches.long.get(`ai:${hash}`);
  },
  set: (prompt, response, ttl = 7200) => {
    const hash = require('crypto').createHash('md5').update(prompt).digest('hex');
    return caches.long.set(`ai:${hash}`, response, ttl);
  }
};

// Periodic cache cleanup and monitoring
if (process.env.NODE_ENV === 'production') {
  setInterval(() => {
    const stats = getCacheStats();
    logger.info('Cache statistics:', stats);
    
    // Alert if hit rate is too low
    Object.entries(stats).forEach(([name, stat]) => {
      if (stat.hitRate < 50 && stat.hits + stat.misses > 100) {
        logger.warn(`Low cache hit rate for ${name}: ${stat.hitRate.toFixed(2)}%`);
      }
    });
  }, 15 * 60 * 1000); // Every 15 minutes
}

module.exports = {
  caches,
  withCache,
  cacheMiddleware,
  invalidateCache,
  getCacheStats,
  userCache,
  resumeCache,
  aiCache
};
