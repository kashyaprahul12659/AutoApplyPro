const request = require('supertest');
const app = require('../server');
const { User } = require('../models/User');

// Mock JWT for testing
const mockJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ5YzlhOGI4ZjI5ZjIwMDEyMzQ1Njc4In0sImlhdCI6MTY4NzkyODk2MywiZXhwIjoxNjkwNTIwOTYzfQ.mock_signature';

describe('Authentication Endpoints', () => {
  beforeEach(async () => {
    // Clear test database before each test
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'StrongPass123!'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.name).toBe(userData.name);
      expect(response.body.user.password).toBeUndefined(); // Password should not be returned
    });

    it('should reject registration with invalid email', async () => {
      const userData = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'StrongPass123!'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should reject registration with weak password', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: '123' // Too weak
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should reject registration with duplicate email', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'StrongPass123!'
      };

      // First registration
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Second registration with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('exists');
    });

    it('should sanitize input data', async () => {
      const userData = {
        name: '<script>alert("xss")</script>Test User',
        email: 'test@example.com',
        password: 'StrongPass123!'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.user.name).not.toContain('<script>');
      expect(response.body.user.name).toBe('Test User');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user for login tests
      const testUser = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'StrongPass123!'
      });
      await testUser.save();
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'StrongPass123!'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe(loginData.email);
    });

    it('should reject login with invalid email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'StrongPass123!'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid');
    });

    it('should reject login with invalid password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'WrongPassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid');
    });
  });
});

describe('Rate Limiting', () => {
  it('should apply rate limiting to auth endpoints', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'StrongPass123!'
    };

    // Make multiple rapid requests
    const promises = Array(6).fill().map(() => 
      request(app)
        .post('/api/auth/register')
        .send(userData)
    );

    const responses = await Promise.all(promises);
    
    // Some requests should be rate limited (429 status)
    const rateLimitedResponses = responses.filter(res => res.status === 429);
    expect(rateLimitedResponses.length).toBeGreaterThan(0);
  });
});

describe('Input Validation', () => {
  it('should sanitize HTML in all string inputs', async () => {
    const maliciousData = {
      name: '<script>alert("xss")</script><img src="x" onerror="alert(1)">Test',
      email: 'test@example.com',
      password: 'StrongPass123!'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(maliciousData)
      .expect(201);

    expect(response.body.user.name).not.toContain('<script>');
    expect(response.body.user.name).not.toContain('<img');
    expect(response.body.user.name).toBe('Test');
  });
});

describe('Security Headers', () => {
  it('should include security headers in responses', async () => {
    const response = await request(app)
      .get('/api/auth/me')
      .expect(401); // Unauthorized, but headers should be present

    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBe('DENY');
    expect(response.headers['x-xss-protection']).toBe('1; mode=block');
  });
});
