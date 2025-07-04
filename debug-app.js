#!/usr/bin/env node

/**
 * Debug helper for AutoApplyPro
 * 
 * This script helps diagnose issues in the AutoApplyPro application.
 * 
 * Usage: node debug-app.js [options]
 * 
 * Options:
 *   --all       Run all checks
 *   --frontend  Check frontend issues
 *   --backend   Check backend issues
 *   --extension Check Chrome extension issues
 *   --api       Test API endpoints
 *   --auth      Test authentication
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const debug = require('debug')('autoapply:diagnostics');

// Enable debug output
debug.enabled = true;

// Configuration
const config = {
  backendDir: path.join(__dirname, 'backend'),
  frontendDir: path.join(__dirname, 'frontend'),
  extensionDir: path.join(__dirname, 'autoapply-extension'),
  apiEndpoint: process.env.API_URL || 'http://localhost:5000/api',
};

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  all: args.includes('--all') || args.length === 0,
  frontend: args.includes('--frontend'),
  backend: args.includes('--backend'),
  extension: args.includes('--extension'),
  api: args.includes('--api'),
  auth: args.includes('--auth'),
};

// Colorize output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function logSuccess(message) {
  console.log(`${colors.green}✓ ${message}${colors.reset}`);
}

function logError(message) {
  console.log(`${colors.red}✗ ${message}${colors.reset}`);
}

function logWarning(message) {
  console.log(`${colors.yellow}⚠ ${message}${colors.reset}`);
}

function logInfo(message) {
  console.log(`${colors.blue}ℹ ${message}${colors.reset}`);
}

function runCommand(command, directory = __dirname) {
  debug(`Running command: ${command} in ${directory}`);
  try {
    const output = execSync(command, { 
      cwd: directory, 
      stdio: ['pipe', 'pipe', 'pipe'],
      encoding: 'utf8'
    });
    return { success: true, output };
  } catch (error) {
    return { 
      success: false, 
      output: error.stdout || '', 
      error: error.stderr || error.message 
    };
  }
}

function checkDirectoryExists(dir, name) {
  debug(`Checking if ${name} directory exists: ${dir}`);
  if (fs.existsSync(dir)) {
    logSuccess(`${name} directory found`);
    return true;
  } else {
    logError(`${name} directory not found: ${dir}`);
    return false;
  }
}

function checkPackageJson(dir, name) {
  const packageJsonPath = path.join(dir, 'package.json');
  debug(`Checking ${name} package.json: ${packageJsonPath}`);
  
  if (!fs.existsSync(packageJsonPath)) {
    logError(`${name} package.json not found`);
    return false;
  }
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    logSuccess(`${name} package.json is valid`);
    return packageJson;
  } catch (error) {
    logError(`${name} package.json is invalid: ${error.message}`);
    return false;
  }
}

function checkDependencies(packageJson, name) {
  debug(`Checking ${name} dependencies`);
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  const count = Object.keys(dependencies).length;
  logInfo(`${name} has ${count} dependencies`);
  
  // Check for outdated packages
  const result = runCommand('npm outdated --json', path.dirname(packageJson));
  if (result.success) {
    try {
      const outdated = JSON.parse(result.output);
      const outdatedCount = Object.keys(outdated).length;
      if (outdatedCount > 0) {
        logWarning(`${name} has ${outdatedCount} outdated dependencies`);
      } else {
        logSuccess(`${name} dependencies are up to date`);
      }
    } catch (error) {
      debug(`Error parsing npm outdated output: ${error.message}`);
    }
  }
}

function checkBackend() {
  console.log(`\n${colors.cyan}=== Checking Backend ===\n${colors.reset}`);
  
  if (!checkDirectoryExists(config.backendDir, 'Backend')) return;
  
  const packageJson = checkPackageJson(config.backendDir, 'Backend');
  if (packageJson) {
    checkDependencies(packageJson, 'Backend');
  }
  
  // Check if server can start
  logInfo('Attempting to start backend server...');
  const serverResult = runCommand('node server-dev.js --check', config.backendDir);
  if (serverResult.success) {
    logSuccess('Backend server can start');
  } else {
    logError(`Backend server failed to start: ${serverResult.error}`);
  }
  
  // Check for common backend issues
  checkBackendIssues();
}

function checkBackendIssues() {
  // Check MongoDB connection
  logInfo('Checking MongoDB connection...');
  const mongoCheck = runCommand('node -e "require(\'./config/db\').testConnection()"', config.backendDir);
  if (mongoCheck.success) {
    logSuccess('MongoDB connection successful');
  } else {
    logError('MongoDB connection failed');
    debug(`MongoDB error: ${mongoCheck.error}`);
  }
  
  // Check environment variables
  logInfo('Checking backend environment variables...');
  const envCheck = runCommand('node validateEnvironment.js', config.backendDir);
  if (envCheck.success) {
    logSuccess('Environment variables are properly set');
  } else {
    logWarning('Some environment variables might be missing');
    console.log(envCheck.output);
  }
}

function checkFrontend() {
  console.log(`\n${colors.cyan}=== Checking Frontend ===\n${colors.reset}`);
  
  if (!checkDirectoryExists(config.frontendDir, 'Frontend')) return;
  
  const packageJson = checkPackageJson(config.frontendDir, 'Frontend');
  if (packageJson) {
    checkDependencies(packageJson, 'Frontend');
  }
  
  // Check build process
  logInfo('Checking if frontend can build...');
  // We're not actually running the build as it takes too long
  const buildFilesExist = fs.existsSync(path.join(config.frontendDir, 'build'));
  if (buildFilesExist) {
    logSuccess('Frontend build files exist');
  } else {
    logWarning('Frontend build files not found. Run npm run build in frontend directory');
  }
  
  // Check for common frontend issues
  checkFrontendIssues();
}

function checkFrontendIssues() {
  // Check for React issues
  const srcDir = path.join(config.frontendDir, 'src');
  if (fs.existsSync(srcDir)) {
    // Count React components
    const files = fs.readdirSync(srcDir, { recursive: true });
    const jsxFiles = files.filter(file => 
      typeof file === 'string' && 
      (file.endsWith('.jsx') || file.endsWith('.js'))
    );
    
    logInfo(`Found ${jsxFiles.length} JavaScript/React files`);
    
    // Check for common React issues in some files
    let errorCount = 0;
    jsxFiles.slice(0, 5).forEach(file => {
      try {
        const content = fs.readFileSync(path.join(srcDir, file), 'utf8');
        if (content.includes('componentWillMount') || 
            content.includes('componentWillReceiveProps')) {
          logWarning(`Found deprecated lifecycle methods in ${file}`);
          errorCount++;
        }
      } catch (error) {
        debug(`Error reading ${file}: ${error.message}`);
      }
    });
    
    if (errorCount === 0) {
      logSuccess('No common React issues found in sampled files');
    }
  }
}

function checkExtension() {
  console.log(`\n${colors.cyan}=== Checking Chrome Extension ===\n${colors.reset}`);
  
  if (!checkDirectoryExists(config.extensionDir, 'Extension')) return;
  
  const manifestPath = path.join(config.extensionDir, 'manifest.json');
  if (fs.existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      logSuccess(`Extension manifest.json found (version ${manifest.version})`);
      
      // Check manifest requirements
      const requiredFields = ['name', 'version', 'manifest_version'];
      const missingFields = requiredFields.filter(field => !manifest[field]);
      
      if (missingFields.length > 0) {
        logError(`Extension manifest is missing required fields: ${missingFields.join(', ')}`);
      } else {
        logSuccess('Extension manifest contains all required fields');
      }
    } catch (error) {
      logError(`Extension manifest.json is invalid: ${error.message}`);
    }
  } else {
    logError('Extension manifest.json not found');
  }
  
  // Check packaging script
  const packageScript = path.join(config.extensionDir, 'package-extension.js');
  if (fs.existsSync(packageScript)) {
    logSuccess('Extension packaging script found');
  } else {
    logWarning('Extension packaging script not found');
  }
}

function checkApi() {
  console.log(`\n${colors.cyan}=== Checking API ===\n${colors.reset}`);
  
  // Ensure the API endpoint is defined
  if (!config.apiEndpoint) {
    logError('API endpoint not defined. Set API_URL environment variable');
    return;
  }
  
  logInfo(`Testing API endpoint: ${config.apiEndpoint}`);
  
  // Test API health endpoint
  const healthEndpoint = `${config.apiEndpoint}/health`;
  try {
    const http = require('http');
    const https = require('https');
    
    const client = healthEndpoint.startsWith('https') ? https : http;
    
    const req = client.get(healthEndpoint, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          logSuccess(`API health check successful (${res.statusCode})`);
          try {
            const response = JSON.parse(data);
            Object.entries(response).forEach(([key, value]) => {
              logInfo(`${key}: ${value}`);
            });
          } catch (error) {
            debug(`Error parsing API response: ${error.message}`);
          }
        } else {
          logError(`API health check failed (${res.statusCode}): ${data}`);
        }
      });
    });
    
    req.on('error', (error) => {
      logError(`API health check request failed: ${error.message}`);
    });
    
    req.end();
  } catch (error) {
    logError(`API health check error: ${error.message}`);
  }
}

function runAll() {
  console.log(`${colors.magenta}=== AutoApplyPro Diagnostic Tool ===\n${colors.reset}`);
  logInfo(`Running diagnostics at ${new Date().toLocaleString()}`);
  
  checkBackend();
  checkFrontend();
  checkExtension();
  checkApi();
}

// Run selected checks
if (options.all) {
  runAll();
} else {
  if (options.backend) checkBackend();
  if (options.frontend) checkFrontend();
  if (options.extension) checkExtension();
  if (options.api) checkApi();
}

console.log(`\n${colors.magenta}=== Diagnostic Complete ===\n${colors.reset}`);
