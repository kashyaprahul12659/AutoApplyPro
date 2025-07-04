/**
 * Debug utility for AutoApplyPro frontend
 *
 * Usage:
 * - Import this file: import debug from './utils/debug';
 * - Use specific namespaces: const uiDebug = debug.ui;
 * - Log with the debugger: uiDebug('Component rendered:', props);
 *
 * To enable debugging in browser:
 * - Open console and run: localStorage.debug = 'autoapply:*'
 * - Refresh the page
 */

import debugModule from 'debug';

// Setup main namespace
const baseDebug = debugModule('autoapply');

// Create namespaced debuggers
const createDebugger = (namespace) => baseDebug.extend(namespace);

// Export pre-configured debuggers
const debug = {
  ui: createDebugger('ui'),
  api: createDebugger('api'),
  auth: createDebugger('auth'),
  state: createDebugger('state'),
  performance: createDebugger('performance'),
  // Create custom debugger with specific namespace
  create: createDebugger
};

export default debug;
