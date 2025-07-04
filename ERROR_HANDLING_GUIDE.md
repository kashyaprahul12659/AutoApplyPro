# AutoApplyPro Error Handling & Debugging Guide

This document provides an overview of error handling and debugging tools available in the AutoApplyPro project.

## Available Tools

### 1. JAM Debugging

JAM provides advanced debugging capabilities that capture the full context of errors including:

- Complete stack traces
- Network requests and responses
- Component state at time of error
- User interactions leading to error

**Configuration**: See `.jamrc` in the project root

### 2. Debug.js Integration

For detailed logging throughout the application:

- Backend: `autoapply:api`, `autoapply:auth`, `autoapply:db`
- Frontend: `autoapply:ui`, `autoapply:api`, `autoapply:state`
- Extension: `autoapply:extension`

**See**: `frontend/src/utils/debug.js` and `backend/utils/debug.js`

### 3. Error Simulation Utilities

For testing error handling in development:

- Network outage simulation
- Slow response simulation
- Endpoint-specific failures
- Error boundary testing

**Usage**:

```javascript
// In browser console
import { ErrorSimulator } from '../utils/errorSimulator';
ErrorSimulator.networkOutage(10000); // 10 second outage
```

### 4. API Connectivity Verification

A Node.js script to verify connectivity to all critical API endpoints:

**Usage**:

```bash
node verify-connectivity.js
```

## Best Practices

### Error Handling

1. **Always handle promise rejections**:

    ```javascript
    try {
      await api.fetchData();
    } catch (error) {
      // Log with JAM and debug
      jam.error('Data fetch failed', error);
      debug.api('API error:', error);
      
      // Show user-friendly message
      toast.error('Unable to load data. Please try again.');
      
      // Set appropriate UI state
      setError(true);
      setLoading(false);
    }
    ```

1. **Use error boundaries for React components**:

    ```javascript
    <ErrorBoundary 
      fallback={<ErrorFallback />}
      onError={(error) => jam.error('Component error', error)}
    >
      <YourComponent />
    </ErrorBoundary>
    ```

1. **Handle network connectivity issues**:

    ```javascript
    // In API service
    if (!navigator.onLine) {
      throw new NetworkError('You appear to be offline');
    }
    ```

### Debugging

1. **Use JAM for complex issues**:

    ```javascript
    // Start debug session for important flows
    jam.debug('User onboarding flow', { userId, step });

    // When error occurs
    jam.error('Onboarding failed', error);
    ```

1. **Use debug.js for fine-grained logging**:

    ```javascript
    // Log specific operations
    const debug = require('../utils/debug');
    debug.api('Processing request:', req.path);
    ```

1. **Test with error simulation**:

    ```javascript
    // During development
    ErrorSimulator.endpointErrors(['/api/dashboard']);
    // Test your component's behavior
    ```

## Troubleshooting Common Issues

### "Dashboard Data Not Loading"

1. Verify backend health: Run `node verify-connectivity.js`
2. Check browser console for errors
3. Check JAM dashboard for captured error sessions
4. Verify API base URL configuration

### "API Authentication Errors"

1. Check if authentication tokens are correctly stored
2. Verify token expiry and refresh mechanism
3. Look for CORS issues in browser console
4. Check if backend authentication service is responding

### "Chrome Extension Not Working"

1. Check extension logs: `chrome://extensions` > Developer mode > Inspect views
2. Verify content script injection
3. Check for console errors in background script
4. Verify permissions in `manifest.json`

## Contributing

When adding new features or fixing bugs:

1. Include appropriate error handling
2. Add debug statements for important operations
3. Consider edge cases and error states
4. Test with simulated failures
5. Document any new error handling patterns

For detailed instructions on using the debugging tools, see `DEVELOPER_TOOLS_GUIDE.md`.
