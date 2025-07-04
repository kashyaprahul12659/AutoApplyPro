# Developer Tools Guide for AutoApplyPro

This guide explains how to use the developer tools integrated into AutoApplyPro.

## Code Review with CodeRabbit AI

[CodeRabbit AI](https://coderabbit.ai/) is integrated for automated code reviews.

### How to Use CodeRabbit AI

1. Make a pull request to the repository
2. CodeRabbit AI will automatically review your code
3. Check the PR comments for the AI's suggestions and feedback
4. Address the feedback and update your PR

### Configuration

The CodeRabbit AI configuration is in `.coderabbit.yaml` at the root of the project. You can customize:

- Review thresholds
- Path-specific instructions
- File patterns to include/exclude
- Auto-review settings

## Debugging with JAM

[JAM](https://jam.dev/) is integrated for enhanced debugging capabilities across the entire application stack.

### How to Use JAM for Debugging

1. When an error occurs in development or production, JAM captures the context
2. Access the JAM dashboard to view captured debug sessions
3. Explore the full stack trace, network requests, component state, and more
4. Share debug sessions with team members for collaborative troubleshooting

### JAM Configuration

The JAM configuration is in `.jamrc` at the root of the project. Current settings include:

- Frontend React debugging with component profiling and error boundaries
- Backend API call tracing and performance monitoring
- Chrome extension devtools integration

To start a JAM debug session manually:

```javascript
import { jam } from '@jam-dev/javascript';

// Start a session with custom context
jam.debug('User dashboard error', { 
  userId: user.id,
  currentView: 'dashboard'
});

// In error handlers
try {
  // code that might fail
} catch (error) {
  jam.error('Failed to load dashboard data', error);
}
```

## Debugging with Debug.js

We use [debug](https://www.npmjs.com/package/debug) for application debugging.

### Backend Debugging

```javascript
// Import the debug utility
const debug = require('./utils/debug');

// Use a specific namespace
const apiDebug = debug.api;

// Log with the debugger
apiDebug('Processing request for:', req.path);
```

To enable backend debugging:

- Windows: `set DEBUG=autoapply:*` then start the server
- Mac/Linux: `export DEBUG=autoapply:*` then start the server

### Frontend Debugging

```javascript
// Import the debug utility
import debug from '../utils/debug';

// Use a specific namespace
const uiDebug = debug.ui;

// Log with the debugger
uiDebug('Rendering component with:', props);
```

To enable frontend debugging:

- Open browser console
- Run: `localStorage.debug = 'autoapply:*'`
- Refresh the page

### Available Debug Namespaces

Backend:

- `autoapply:api` - API requests and responses
- `autoapply:auth` - Authentication flows
- `autoapply:db` - Database operations

Frontend:

- `autoapply:ui` - UI rendering and interactions
- `autoapply:api` - API calls
- `autoapply:state` - State management
- `autoapply:performance` - Performance metrics

Extension:

- `autoapply:extension` - Chrome extension operations

## Tips for Effective Debugging

1. Be specific with debug namespaces to reduce noise
2. Use descriptive messages
3. Include relevant data but avoid logging sensitive information
4. In production, only enable debugging when necessary
5. Combine JAM and debug.js for comprehensive debugging coverage
6. Share JAM debug sessions when reporting bugs for faster resolution
