// Test import file to debug server.js issues
console.log('Testing imports...');

try {
  console.log('1. Testing express...');
  const express = require('express');
  console.log('✓ Express OK');
  
  console.log('2. Testing mongoose...');
  const mongoose = require('mongoose');
  console.log('✓ Mongoose OK');
  
  console.log('3. Testing cors...');
  const cors = require('cors');
  console.log('✓ CORS OK');
  
  console.log('4. Testing dotenv...');
  const dotenv = require('dotenv');
  console.log('✓ dotenv OK');
  
  console.log('5. Testing @clerk/express...');
  const { clerkMiddleware } = require('@clerk/express');
  console.log('✓ Clerk Express OK');
  
  console.log('6. Testing middleware/errorHandler...');
  const errorHandler = require('./middleware/errorHandler');
  console.log('✓ Error Handler OK');
  
  console.log('7. Testing middleware/security...');
  const securityHeaders = require('./middleware/security');
  console.log('✓ Security Headers OK');
  
  console.log('All imports successful!');
  
} catch (error) {
  console.error('Import failed:', error.message);
  console.error('Stack:', error.stack);
}
