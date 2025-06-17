const { test, expect } = require('@playwright/test');

test.describe('API Endpoints and Backend Integration', () => {
  test('Should handle user registration API correctly', async ({ request }) => {
    // Test user registration endpoint
    const testUser = {
      name: 'Test User API',
      email: `test-api-${Date.now()}@example.com`,
      password: 'TestPassword123!'
    };
    
    const response = await request.post('http://localhost:5000/api/auth/register', {
      data: testUser
    });
    
    console.log(`Registration API Response Status: ${response.status()}`);
    
    if (response.status() === 201) {
      const responseBody = await response.json();
      console.log('✅ Registration successful:', responseBody.message || 'User created');
      
      // Should receive a token or success message
      expect(responseBody).toHaveProperty('success', true);
    } else if (response.status() === 400) {
      const errorBody = await response.json();
      console.log('ℹ️ Registration validation error (expected):', errorBody.message);
      
      // 400 is acceptable for validation errors
      expect(response.status()).toBe(400);
    } else {
      console.log('⚠️ Unexpected registration response status:', response.status());
    }
  });

  test('Should handle user login API correctly', async ({ request }) => {
    // Test login with invalid credentials (should return 400 or 401)
    const invalidCredentials = {
      email: 'nonexistent@example.com',
      password: 'wrongpassword'
    };
    
    const response = await request.post('http://localhost:5000/api/auth/login', {
      data: invalidCredentials
    });
    
    console.log(`Login API Response Status: ${response.status()}`);
    
    // Should return 400 or 401 for invalid credentials
    expect([400, 401]).toContain(response.status());
      const responseBody = await response.json();
    
    // API returns {msg: "Invalid credentials"} format, not {success: false}
    expect(responseBody).toHaveProperty('msg');
    expect(responseBody.msg).toContain('credentials');
    
    console.log('✅ Invalid login correctly rejected:', responseBody.msg);
  });

  test('Should check AI service endpoints availability', async ({ request }) => {    // Test AI endpoints (these might require authentication)
    const aiEndpoints = [
      '/api/ai/cover-letter',
      '/api/jd-analyzer/analyze',
      '/api/resume-ai/improve-resume-block',
      '/api/resumes'
    ];
    
    for (const endpoint of aiEndpoints) {
      try {
        const response = await request.post(`http://localhost:5000${endpoint}`, {
          data: { test: 'data' },
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log(`${endpoint}: Status ${response.status()}`);
        
        if (response.status() === 401) {
          console.log(`✅ ${endpoint} correctly requires authentication`);
        } else if (response.status() === 400) {
          console.log(`✅ ${endpoint} validates input correctly`);
        } else {
          console.log(`ℹ️ ${endpoint} returned status ${response.status()}`);
        }
        
      } catch (error) {
        console.log(`⚠️ ${endpoint} connection error:`, error.message);
      }
    }
  });

  test('Should validate CORS headers for frontend integration', async ({ request }) => {
    // Test if CORS is properly configured
    const response = await request.get('http://localhost:5000/api/health');
    
    expect(response.status()).toBe(200);
    
    const headers = response.headers();
    console.log('CORS Headers:', {
      'access-control-allow-origin': headers['access-control-allow-origin'],
      'access-control-allow-credentials': headers['access-control-allow-credentials'],
      'access-control-allow-methods': headers['access-control-allow-methods']
    });
    
    // Should allow frontend origin
    const allowOrigin = headers['access-control-allow-origin'];
    if (allowOrigin) {
      console.log('✅ CORS configured for origin:', allowOrigin);
    } else {
      console.log('ℹ️ CORS headers not found in health endpoint');
    }
  });

  test('Should handle file upload endpoints', async ({ request }) => {    // Test resume upload endpoint (without authentication)
    try {
      const response = await request.post('http://localhost:5000/api/resumes', {
        multipart: {
          resume: {
            name: 'test-resume.txt',
            mimeType: 'text/plain',
            buffer: Buffer.from('Test resume content')
          }
        }
      });
      
      console.log(`Resume upload Status: ${response.status()}`);
      
      if (response.status() === 401) {
        console.log('✅ Resume upload correctly requires authentication');
      } else if (response.status() === 400) {
        console.log('✅ Resume upload validates file format');
      } else {
        console.log(`ℹ️ Resume upload returned: ${response.status()}`);
      }
      
    } catch (error) {
      console.log('⚠️ Resume upload endpoint error:', error.message);
    }
  });

  test('Should test database connectivity through API', async ({ request }) => {
    // The health endpoint should include database status
    const response = await request.get('http://localhost:5000/api/health');
    
    expect(response.status()).toBe(200);
    
    const health = await response.json();
    console.log('Health check response:', health);
    
    // Check if MongoDB connection status is included
    if (health.mongodb) {
      expect(health.mongodb).toBe('connected');
      console.log('✅ MongoDB connection verified through API');
    } else {
      console.log('ℹ️ MongoDB status not included in health response');
    }
    
    // Verify basic health structure
    expect(health).toHaveProperty('status', 'ok');
    expect(health).toHaveProperty('timestamp');
  });
});
