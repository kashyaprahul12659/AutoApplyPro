#!/usr/bin/env node

/**
 * AutoApply Pro Extension - Chrome Web Store Package Builder
 * Creates a production-ready ZIP package for Chrome Web Store submission
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('🚀 AutoApply Pro - Chrome Web Store Package Builder');
console.log('=================================================');

// Configuration
const EXTENSION_DIR = __dirname;
const OUTPUT_DIR = path.join(__dirname, '..', 'dist');
const PACKAGE_NAME = 'autoapply-pro-extension-v1.0.0.zip';

// Files and directories to exclude from package
const EXCLUDE_PATTERNS = [
  'node_modules',
  '.git',
  '.gitignore',
  'package.json',
  'package-lock.json',
  '.DS_Store',
  'Thumbs.db',
  '*.log',
  '.env',
  '.env.*',
  'package-extension.js', // Don't include the packaging script itself
  '*.md' // Exclude README files
];

// Files that MUST be included
const REQUIRED_FILES = [
  'manifest.json',
  'popup.html',
  'popup.js',
  'background.js',
  'content.js',
  'listener.js',
  'utils.js',
  'jd-analyzer.js',
  'utils/jobExtractor.js',
  'icons/icon16.png',
  'icons/icon48.png',
  'icons/icon128.png'
];

/**
 * Check if all required files exist
 */
function validateRequiredFiles() {
  console.log('\n📋 Validating required files...');
  
  let allFilesExist = true;
  
  REQUIRED_FILES.forEach(file => {
    const filePath = path.join(EXTENSION_DIR, file);
    if (fs.existsSync(filePath)) {
      console.log(`  ✅ ${file}`);
    } else {
      console.log(`  ❌ ${file} - MISSING`);
      allFilesExist = false;
    }
  });
  
  if (!allFilesExist) {
    console.log('\n❌ Some required files are missing. Cannot create package.');
    process.exit(1);
  }
  
  console.log('\n✅ All required files are present.');
}

/**
 * Validate manifest.json for Chrome Web Store requirements
 */
function validateManifest() {
  console.log('\n🔍 Validating manifest.json...');
  
  try {
    const manifestPath = path.join(EXTENSION_DIR, 'manifest.json');
    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(manifestContent);
    
    // Check required fields
    const requiredFields = ['name', 'version', 'description', 'manifest_version'];
    const missingFields = [];
    
    requiredFields.forEach(field => {
      if (!manifest[field]) {
        missingFields.push(field);
      }
    });
    
    if (missingFields.length > 0) {
      console.log(`  ❌ Missing required fields: ${missingFields.join(', ')}`);
      process.exit(1);
    }
    
    // Check for localhost references (not allowed in production)
    const manifestStr = JSON.stringify(manifest);
    if (manifestStr.includes('localhost') || manifestStr.includes('127.0.0.1')) {
      console.log('  ⚠️  Warning: Manifest contains localhost references');
      console.log('  📝 Make sure to use production URLs only');
    }
    
    // Validate manifest version
    if (manifest.manifest_version !== 3) {
      console.log('  ❌ Manifest version must be 3 for Chrome Web Store');
      process.exit(1);
    }
    
    // Validate icons
    if (!manifest.icons || !manifest.icons['128']) {
      console.log('  ❌ 128x128 icon is required for Chrome Web Store');
      process.exit(1);
    }
    
    console.log(`  ✅ Name: ${manifest.name}`);
    console.log(`  ✅ Version: ${manifest.version}`);
    console.log(`  ✅ Description: ${manifest.description.substring(0, 60)}...`);
    console.log(`  ✅ Manifest Version: ${manifest.manifest_version}`);
    console.log(`  ✅ Icons: ${Object.keys(manifest.icons).join(', ')}`);
    
  } catch (error) {
    console.log('  ❌ Error validating manifest.json:', error.message);
    process.exit(1);
  }
}

/**
 * Create the ZIP package using archiver (fallback method)
 */
function createPackageWithArchiver() {
  console.log('  📦 Using archiver to create package...');
  
  try {
    const archiver = require('archiver');
    const output = fs.createWriteStream(path.join(OUTPUT_DIR, PACKAGE_NAME));
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    return new Promise((resolve, reject) => {
      output.on('close', () => {
        console.log('  ✅ Package created successfully!');
        displayPackageInfo(path.join(OUTPUT_DIR, PACKAGE_NAME));
        resolve();
      });
      
      archive.on('error', (err) => {
        reject(err);
      });
      
      archive.pipe(output);
      
      // Add required files
      REQUIRED_FILES.forEach(file => {
        const filePath = path.join(EXTENSION_DIR, file);
        if (fs.existsSync(filePath)) {
          if (file.includes('/')) {
            // Handle subdirectory files
            archive.file(filePath, { name: file });
          } else {
            archive.file(filePath, { name: file });
          }
        }
      });
      
      archive.finalize();
    });
    
  } catch (error) {
    console.log('  ❌ Archiver not available. Please install: npm install archiver');
    console.log('  📝 Or manually create ZIP file with the required files.');
    throw error;
  }
}

/**
 * Display package information
 */
function displayPackageInfo(packagePath) {
  console.log('\n📊 Package Information:');
  
  try {
    const stats = fs.statSync(packagePath);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    console.log(`  📁 File: ${path.basename(packagePath)}`);
    console.log(`  📍 Location: ${packagePath}`);
    console.log(`  📏 Size: ${sizeInMB} MB`);
    console.log(`  📅 Created: ${stats.birthtime.toLocaleString()}`);
    
    // Size validation
    if (stats.size > 128 * 1024 * 1024) { // 128MB limit
      console.log('  ⚠️  Warning: Package size exceeds Chrome Web Store limit (128MB)');
    } else {
      console.log('  ✅ Package size is within Chrome Web Store limits');
    }
    
  } catch (error) {
    console.log('  ❌ Error reading package info:', error.message);
  }
}

/**
 * Display next steps
 */
function displayNextSteps() {
  console.log('\n🚀 Next Steps for Chrome Web Store Submission:');
  console.log('===============================================');
  console.log('1. 📝 Create store listing screenshots and promotional images');
  console.log('2. 💳 Set up Google Developer account ($5 one-time fee)');
  console.log('3. 🌐 Visit Chrome Web Store Developer Dashboard:');
  console.log('   https://chrome.google.com/webstore/devconsole/');
  console.log('4. 📤 Upload the created ZIP package');
  console.log('5. 📋 Complete store listing information');
  console.log('6. 🔍 Submit for review (typically 1-3 business days)');
  console.log('');
  console.log('📚 Refer to CHROME_WEB_STORE_GUIDE.md for detailed instructions');
  console.log('');
  console.log('🎉 Your AutoApply Pro extension is ready for the Chrome Web Store!');
}

// Main execution
async function main() {
  try {
    validateRequiredFiles();
    validateManifest();
    
    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    console.log('\n📦 Creating Chrome Web Store package...');
    
    await createPackageWithArchiver();
    displayNextSteps();
    
  } catch (error) {
    console.log('\n❌ Packaging failed:', error.message);
    console.log('\n📝 Manual packaging instructions:');
    console.log('1. Create a new ZIP file');
    console.log('2. Add these files to the ZIP:');
    REQUIRED_FILES.forEach(file => {
      console.log(`   - ${file}`);
    });
    console.log('3. Upload the ZIP to Chrome Web Store Developer Console');
    process.exit(1);
  }
}

// Run the packaging process
main();
