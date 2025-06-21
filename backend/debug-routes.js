// Test route imports
console.log('Testing route imports...');

try {
  console.log('1. Testing routes/auth...');
  const authRoutes = require('./routes/auth');
  console.log('✓ Auth routes OK');
  
  console.log('2. Testing routes/users...');
  const userRoutes = require('./routes/users');
  console.log('✓ User routes OK');
  
  console.log('3. Testing routes/resumes...');
  const resumeRoutes = require('./routes/resumes');
  console.log('✓ Resume routes OK');
  
  console.log('4. Testing routes/history...');
  const historyRoutes = require('./routes/history');
  console.log('✓ History routes OK');
  
  console.log('5. Testing routes/ai...');
  const aiRoutes = require('./routes/ai');
  console.log('✓ AI routes OK');
  
  console.log('All route imports successful!');
  
} catch (error) {
  console.error('Route import failed:', error.message);
  console.error('Stack:', error.stack);
}
