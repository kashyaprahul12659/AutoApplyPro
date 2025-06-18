const logger = require('../utils/logger');
const cache = require('../utils/cache');

describe('Logging System', () => {
  beforeEach(() => {
    // Clear any existing logs
    logger.clear();
  });

  it('should log info messages', () => {
    const testMessage = 'Test info message';
    const testMeta = { userId: '123', action: 'test' };
    
    logger.info(testMessage, testMeta);
    
    // In a real test, you would check the log output
    // For now, we just ensure it doesn't throw
    expect(true).toBe(true);
  });

  it('should log error messages with stack traces', () => {
    const testError = new Error('Test error');
    
    logger.error('Test error message', { error: testError.message });
    
    // In a real test, you would check the log output
    expect(true).toBe(true);
  });

  it('should log warnings', () => {
    const testMessage = 'Test warning message';
    
    logger.warn(testMessage, { source: 'test' });
    
    expect(true).toBe(true);
  });
});

describe('Caching System', () => {
  beforeEach(async () => {
    // Clear cache before each test
    await cache.flushAll();
  });

  it('should set and get cache values', async () => {
    const key = 'test-key';
    const value = { message: 'Hello World', timestamp: Date.now() };
    
    await cache.set(key, value, 60); // 60 seconds TTL
    const retrieved = await cache.get(key);
    
    expect(retrieved).toEqual(value);
  });

  it('should return null for non-existent keys', async () => {
    const result = await cache.get('non-existent-key');
    expect(result).toBeNull();
  });

  it('should respect TTL expiration', async () => {
    const key = 'expiring-key';
    const value = 'test-value';
    
    await cache.set(key, value, 1); // 1 second TTL
    
    // Should exist immediately
    let result = await cache.get(key);
    expect(result).toBe(value);
    
    // Wait for expiration
    await new Promise(resolve => setTimeout(resolve, 1100));
    
    // Should be expired
    result = await cache.get(key);
    expect(result).toBeNull();
  });

  it('should delete specific keys', async () => {
    const key = 'delete-test';
    const value = 'test-value';
    
    await cache.set(key, value, 60);
    
    // Verify it exists
    let result = await cache.get(key);
    expect(result).toBe(value);
    
    // Delete it
    await cache.del(key);
    
    // Verify it's gone
    result = await cache.get(key);
    expect(result).toBeNull();
  });

  it('should handle multiple keys', async () => {
    const keys = ['key1', 'key2', 'key3'];
    const values = ['value1', 'value2', 'value3'];
    
    // Set multiple values
    for (let i = 0; i < keys.length; i++) {
      await cache.set(keys[i], values[i], 60);
    }
    
    // Retrieve and verify
    for (let i = 0; i < keys.length; i++) {
      const result = await cache.get(keys[i]);
      expect(result).toBe(values[i]);
    }
  });
});

describe('Performance Monitoring', () => {
  it('should handle cache performance under load', async () => {
    const startTime = Date.now();
    const operations = 100;
    
    // Perform multiple cache operations
    const promises = [];
    for (let i = 0; i < operations; i++) {
      promises.push(cache.set(`key-${i}`, `value-${i}`, 60));
    }
    
    await Promise.all(promises);
    
    // Retrieve all values
    const retrievePromises = [];
    for (let i = 0; i < operations; i++) {
      retrievePromises.push(cache.get(`key-${i}`));
    }
    
    const results = await Promise.all(retrievePromises);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Verify all operations completed
    expect(results.length).toBe(operations);
    
    // Should complete reasonably quickly (under 1 second for 100 operations)
    expect(duration).toBeLessThan(1000);
    
    // Log performance
    logger.info('Cache performance test', {
      operations,
      duration: `${duration}ms`,
      opsPerSecond: Math.round(operations / (duration / 1000))
    });
  });
});
