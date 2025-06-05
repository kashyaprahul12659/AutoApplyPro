// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const path = require('path');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  // Turn off parallel execution for API tests to avoid race conditions
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  // Add more retries for potentially flaky API tests
  retries: process.env.CI ? 2 : 1,
  // Limit workers to reduce database contention with API tests
  workers: process.env.CI ? 1 : 1,
  // Use both HTML and list reporters for better visibility
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],
  // Longer timeout for API tests, especially with OpenAI
  timeout: 60000,
  use: {
    // For UI tests (frontend)
    baseURL: 'http://localhost:3000',
    // Trace on all tests for easier debugging
    trace: 'on',
    screenshot: 'only-on-failure',
    // Record videos for failed tests
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'api-tests',
      use: { baseURL: 'http://localhost:5000' },
    }
  ],
  // Configure multiple web servers - for full-stack testing
  webServer: [
    {
      // Frontend server
      command: 'cd frontend && npm start',
      url: 'http://localhost:3000',
      reuseExistingServer: true,
      stdout: 'pipe',
      stderr: 'pipe',
      timeout: 10000,
    },
    {
      // Backend server
      command: 'cd backend && npm run dev',
      url: 'http://localhost:5000/api/health',
      reuseExistingServer: true,
      stdout: 'pipe',
      stderr: 'pipe',
      timeout: 10000,
    }
  ],
  // Output path for test results
  outputDir: path.join(__dirname, 'test-results'),
});
