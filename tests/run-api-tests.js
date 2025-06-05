// Helper script to run API tests with proper configuration
const { execSync } = require('child_process');
const path = require('path');

// Set environment variables for testing
process.env.MOCK_OPENAI = 'true'; // Use mocks for OpenAI by default
process.env.NODE_ENV = 'test';

console.log('🧪 Running AutoApply Pro API Tests');
console.log('-----------------------------------');
console.log('Mode: Using OpenAI mocks');
console.log('Backend URL: http://localhost:5000');

try {
  // Only run tests with the api-tests project to ensure we use our API test configuration
  execSync('npx playwright test api.spec.js --project=api-tests', {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });
  
  console.log('\n✅ API Tests completed successfully!');
} catch (error) {
  console.error('\n❌ API Tests failed');
  console.error('Please check the logs above for details.');
  process.exit(1);
}
