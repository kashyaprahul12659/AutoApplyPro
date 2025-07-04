/**
 * Frontend Error Handling Test Utility
 * 
 * This utility helps test the error handling capabilities of frontend components
 * by simulating different API responses and error conditions.
 * 
 * Usage:
 * 1. Import this module in your development environment
 * 2. Call the appropriate methods to simulate errors
 */

// Store original fetch implementation
const originalFetch = window.fetch;

// Error simulation configuration
let simulationActive = false;
let simulationConfig = {
  // Default configuration
  failureRate: 0, // 0-1, percentage of requests that will fail
  delay: 0, // Delay in milliseconds
  statusCode: 500, // Status code to return for failures
  endpoints: [], // Specific endpoints to affect (empty means all)
  errorMessage: 'Simulated server error'
};

/**
 * Start simulating API errors
 * @param {Object} config - Configuration for error simulation
 * @param {number} config.failureRate - Rate of failures (0-1)
 * @param {number} config.delay - Delay before response in ms
 * @param {number} config.statusCode - HTTP status code to return
 * @param {Array<string>} config.endpoints - Specific endpoints to affect
 * @param {string} config.errorMessage - Error message to return
 */
function startSimulation(config = {}) {
  // Update simulation configuration
  simulationConfig = { ...simulationConfig, ...config };
  simulationActive = true;
  
  // Replace global fetch
  window.fetch = simulatedFetch;
  
  console.log('%c[Error Simulator] Enabled', 'color: orange; font-weight: bold');
  console.log('Configuration:', simulationConfig);
  
  return simulationConfig;
}

/**
 * Stop simulating API errors
 */
function stopSimulation() {
  // Restore original fetch
  window.fetch = originalFetch;
  simulationActive = false;
  
  console.log('%c[Error Simulator] Disabled', 'color: green; font-weight: bold');
}

/**
 * Simulated fetch implementation
 */
async function simulatedFetch(url, options = {}) {
  if (!simulationActive) {
    return originalFetch(url, options);
  }
  
  // Check if this URL should be affected
  const shouldAffect = simulationConfig.endpoints.length === 0 || 
    simulationConfig.endpoints.some(endpoint => url.includes(endpoint));
  
  // Determine if this request should fail based on failure rate
  const shouldFail = shouldAffect && Math.random() < simulationConfig.failureRate;
  
  // Log the simulation decision
  console.log(
    `%c[Error Simulator] ${url} - ${shouldFail ? 'FAILING' : 'PASSING'}`,
    `color: ${shouldFail ? 'red' : 'green'}`
  );
  
  // Apply configured delay
  if (simulationConfig.delay > 0) {
    await new Promise(resolve => setTimeout(resolve, simulationConfig.delay));
  }
  
  // Either return error or continue with normal fetch
  if (shouldFail) {
    // Create a simulated response
    return new Response(
      JSON.stringify({ error: simulationConfig.errorMessage }),
      { 
        status: simulationConfig.statusCode,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } else {
    // Proceed with original fetch
    return originalFetch(url, options);
  }
}

/**
 * Simulate a network outage
 * @param {number} duration - Duration in milliseconds (0 = until explicitly stopped)
 */
function simulateNetworkOutage(duration = 0) {
  startSimulation({
    failureRate: 1,
    statusCode: 0,
    errorMessage: 'Network error'
  });
  
  // Create a special fetch that always fails with network error
  window.fetch = () => Promise.reject(new Error('Failed to fetch: Network error'));
  
  console.log('%c[Error Simulator] Network Outage Started', 'color: red; font-weight: bold');
  
  if (duration > 0) {
    setTimeout(() => {
      stopSimulation();
      console.log('%c[Error Simulator] Network Outage Ended', 'color: green; font-weight: bold');
    }, duration);
  }
}

/**
 * Simulate slow responses
 * @param {number} delay - Delay in milliseconds
 * @param {number} duration - Duration of simulation in milliseconds (0 = until explicitly stopped)
 */
function simulateSlowNetwork(delay = 2000, duration = 0) {
  startSimulation({
    delay,
    failureRate: 0
  });
  
  console.log(`%c[Error Simulator] Slow Network Started (${delay}ms delay)`, 'color: orange; font-weight: bold');
  
  if (duration > 0) {
    setTimeout(() => {
      stopSimulation();
      console.log('%c[Error Simulator] Slow Network Ended', 'color: green; font-weight: bold');
    }, duration);
  }
}

/**
 * Simulate errors for specific endpoints
 * @param {Array<string>} endpoints - Array of endpoint URL parts to affect
 * @param {number} failureRate - Rate of failures (0-1)
 */
function simulateEndpointErrors(endpoints = [], failureRate = 1) {
  startSimulation({
    endpoints,
    failureRate
  });
  
  console.log(`%c[Error Simulator] Endpoint Errors Started for:`, 'color: orange; font-weight: bold');
  console.log(endpoints);
}

/**
 * Helper to test component error boundaries
 * @param {string} componentId - DOM ID of the component to test
 */
function testErrorBoundary(componentId) {
  const element = document.getElementById(componentId);
  if (!element) {
    console.error(`%c[Error Simulator] Component with ID '${componentId}' not found`, 'color: red');
    return;
  }
  
  // Find React instance and trigger error
  try {
    console.log(`%c[Error Simulator] Triggering error in component '${componentId}'`, 'color: orange; font-weight: bold');
    
    // This is a crude way to force a React error - in a real app use React DevTools
    const reactInstance = element._reactRootContainer;
    if (reactInstance) {
      throw new Error('Simulated component error');
    } else {
      console.error(`%c[Error Simulator] Could not access React instance on element`, 'color: red');
    }
  } catch (e) {
    console.log(`%c[Error Simulator] Error triggered:`, 'color: orange; font-weight: bold', e);
  }
}

// Export the API
window.ErrorSimulator = {
  start: startSimulation,
  stop: stopSimulation,
  networkOutage: simulateNetworkOutage,
  slowNetwork: simulateSlowNetwork,
  endpointErrors: simulateEndpointErrors,
  testErrorBoundary
};

// Usage examples to show in console
console.log('%c[Error Simulator] Available for testing', 'color: blue; font-weight: bold');
console.log('Example usage:');
console.log(`ErrorSimulator.networkOutage(10000); // Simulate 10s network outage`);
console.log(`ErrorSimulator.slowNetwork(3000); // Simulate 3s response delay`);
console.log(`ErrorSimulator.endpointErrors(['/api/dashboard', '/api/jobs']); // Fail specific endpoints`);
console.log(`ErrorSimulator.start({ failureRate: 0.5 }); // Fail 50% of all requests`);
console.log(`ErrorSimulator.stop(); // Stop all simulations`);
