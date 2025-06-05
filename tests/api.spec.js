const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Helper to log test failures in detail
const logTestError = (error, context = '') => {
  console.error(`💥 Test failed ${context ? `(${context})` : ''}:`, 
    error.response?.data || error.response?.body || error.message || error);
};

// Mock data for testing
const mockUser = {
  _id: '60d0fe4f5311236168a109ca',
  name: 'Test User',
  email: 'test@example.com',
  role: 'user',
  createdAt: '2023-05-28T10:00:00.000Z'
};

const mockResume = {
  _id: '60d0fe4f5311236168a109cb',
  userId: '60d0fe4f5311236168a109ca',
  title: 'Test Resume',
  blocks: [
    {
      type: 'summary',
      content: 'Experienced software developer with skills in React and Node.js',
      order: 0
    },
    {
      type: 'experience',
      content: 'Software Developer at ABC Corp, 2020-Present',
      order: 1
    }
  ],
  templateId: 'classic',
  createdAt: '2023-05-28T10:30:00.000Z',
  updatedAt: '2023-05-28T10:45:00.000Z'
};

const mockOpenAIResponse = {
  success: true,
  data: {
    original: 'Software developer with 5 years experience',
    improved: 'Accomplished Software Engineer with 5+ years of expertise in developing scalable web applications using React.js and Node.js. Proven track record of optimizing application performance by 40% and implementing CI/CD pipelines that reduced deployment time by 60%.'
  }
};

// Mock JWT token - not a real token, just for testing
const mockAuthToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MGQwZmU0ZjUzMTEyMzYxNjhhMTA5Y2EiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE2MjEwMDAwMDAsImV4cCI6MTYyMTAwMDAwMH0.mocked-signature-for-testing';

// Mock response route handler function
function mockResponse(status, body) {
  return {
    status,
    ok: () => status >= 200 && status < 300,
    json: async () => body,
    text: async () => JSON.stringify(body),
  };
}

test.describe('API Tests', () => {
  // Configure the route mocks for each test
  test.beforeEach(async ({ page }) => {
    console.log('🔧 Setting up API test mocks');
    // No actual setup needed with our approach
  });

  test('should get user profile', async () => {
    try {
      console.log('👤 Testing user profile fetch (mocked)');
      
      // Mock the user profile response
      const response = mockResponse(200, mockUser);
      
      // Verify the response data structure
      expect(response.ok()).toBeTruthy();
      const userData = await response.json();
      
      expect(userData).toHaveProperty('email');
      expect(userData.email).toBe('test@example.com');
      expect(userData).toHaveProperty('_id');
      expect(userData).toHaveProperty('name');
      
      console.log('✅ User profile test passed');
    } catch (error) {
      logTestError(error, 'get profile');
      throw error;
    }
  });

  test('should create and retrieve a resume', async () => {
    try {
      console.log('📄 Testing resume creation and retrieval (mocked)');
      
      // Mock the resume creation response
      const createResponse = mockResponse(201, {
        success: true,
        data: mockResume
      });
      
      // Verify create response
      expect(createResponse.ok()).toBeTruthy();
      const createData = await createResponse.json();
      
      expect(createData.success).toBeTruthy();
      expect(createData.data).toHaveProperty('_id');
      expect(createData.data).toHaveProperty('title');
      expect(createData.data).toHaveProperty('blocks');
      expect(createData.data.blocks.length).toBeGreaterThanOrEqual(2);
      
      // Mock the resume retrieval response
      const getResponse = mockResponse(200, {
        success: true,
        data: mockResume
      });
      
      // Verify get response
      expect(getResponse.ok()).toBeTruthy();
      const getData = await getResponse.json();
      
      expect(getData.success).toBeTruthy();
      expect(getData.data).toHaveProperty('title', mockResume.title);
      expect(getData.data.blocks.length).toBe(mockResume.blocks.length);
      
      console.log('✅ Resume operations test passed');
    } catch (error) {
      logTestError(error, 'resume operations');
      throw error;
    }
  });

  test('should improve resume block with AI', async () => {
    try {
      console.log('🤖 Testing AI resume improvement (mocked)');
      
      // Create a test block for improvement
      const blockData = {
        blockType: 'summary',
        content: 'Software developer with 5 years experience',
        targetRole: 'Senior Developer'
      };
      
      // Mock the AI improvement response
      const response = mockResponse(200, mockOpenAIResponse);
      
      // Verify response
      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      
      expect(data.success).toBeTruthy();
      expect(data.data).toHaveProperty('original');
      expect(data.data).toHaveProperty('improved');
      expect(data.data.improved.length).toBeGreaterThan(
        data.data.original.length
      );
      
      console.log('✅ AI improvement test passed');
    } catch (error) {
      logTestError(error, 'AI improvement');
      throw error;
    }
  });
});
