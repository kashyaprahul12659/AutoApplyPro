/**
 * Debug utility for AutoApplyPro
 * 
 * Usage:
 * - Import this file: const debug = require('./utils/debug');
 * - Use specific namespaces: const apiDebug = debug('api');
 * - Log with the debugger: apiDebug('Request received:', req.path);
 * 
 * To enable debugging:
 * - In browser: localStorage.debug = 'autoapply:*'
 * - In Node.js: set DEBUG=autoapply:* (Windows) or export DEBUG=autoapply:* (Unix)
 */

const debug = require('debug');

// Setup main namespace
const baseDebug = debug('autoapply');

// Create namespaced debuggers
const createDebugger = (namespace) => baseDebug.extend(namespace);

// Export pre-configured debuggers
module.exports = {
  api: createDebugger('api'),
  auth: createDebugger('auth'),
  db: createDebugger('db'),
  frontend: createDebugger('frontend'),
  extension: createDebugger('extension'),
  // Create custom debugger with specific namespace
  create: createDebugger
};
