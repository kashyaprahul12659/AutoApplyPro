const User = require('../models/User');
const { logger } = require('../utils/logger');
const crypto = require('crypto');

const apiController = {
  // Get API key information
  async getApiKey(req, res) {
    try {
      const userId = req.auth.userId;
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      const apiAccess = user.apiAccess || {};
      
      res.json({
        success: true,
        data: {
          hasApiKey: !!apiAccess.apiKey,
          enabled: apiAccess.enabled || false,
          rateLimitTier: apiAccess.rateLimitTier || 'basic',
          createdAt: apiAccess.apiKeyCreatedAt,
          // Don't return the actual API key for security
          keyPreview: apiAccess.apiKey ? `${apiAccess.apiKey.substring(0, 8)}...` : null
        }
      });
      
    } catch (error) {
      logger.error('Error fetching API key info:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch API key information'
      });
    }
  },
  
  // Generate new API key
  async generateApiKey(req, res) {
    try {
      const userId = req.auth.userId;
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Check if user already has an API key
      if (user.apiAccess?.apiKey) {
        return res.status(400).json({
          success: false,
          message: 'API key already exists. Use regenerate endpoint to create a new one.'
        });
      }
      
      // Generate API key
      const apiKey = `aap_${crypto.randomBytes(32).toString('hex')}`;
      
      // Initialize or update API access
      if (!user.apiAccess) {
        user.apiAccess = {};
      }
      
      user.apiAccess.apiKey = apiKey;
      user.apiAccess.enabled = true;
      user.apiAccess.apiKeyCreatedAt = new Date();
      user.apiAccess.rateLimitTier = this.getRateLimitTierForPlan(user.subscription?.plan || 'free');
      
      await user.save();
      
      logger.info(`API key generated for user ${userId}`);
      
      res.json({
        success: true,
        message: 'API key generated successfully',
        data: {
          apiKey, // Return the full key only on generation
          rateLimitTier: user.apiAccess.rateLimitTier,
          createdAt: user.apiAccess.apiKeyCreatedAt
        }
      });
      
    } catch (error) {
      logger.error('Error generating API key:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate API key'
      });
    }
  },
  
  // Regenerate API key
  async regenerateApiKey(req, res) {
    try {
      const userId = req.auth.userId;
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Generate new API key
      const apiKey = `aap_${crypto.randomBytes(32).toString('hex')}`;
      
      // Initialize or update API access
      if (!user.apiAccess) {
        user.apiAccess = {};
      }
      
      user.apiAccess.apiKey = apiKey;
      user.apiAccess.apiKeyCreatedAt = new Date();
      user.apiAccess.rateLimitTier = this.getRateLimitTierForPlan(user.subscription?.plan || 'free');
      
      await user.save();
      
      logger.info(`API key regenerated for user ${userId}`);
      
      res.json({
        success: true,
        message: 'API key regenerated successfully',
        data: {
          apiKey, // Return the full key only on regeneration
          rateLimitTier: user.apiAccess.rateLimitTier,
          createdAt: user.apiAccess.apiKeyCreatedAt
        }
      });
      
    } catch (error) {
      logger.error('Error regenerating API key:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to regenerate API key'
      });
    }
  },
  
  // Revoke API key
  async revokeApiKey(req, res) {
    try {
      const userId = req.auth.userId;
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      if (!user.apiAccess?.apiKey) {
        return res.status(400).json({
          success: false,
          message: 'No API key to revoke'
        });
      }
      
      // Revoke API key
      user.apiAccess.apiKey = undefined;
      user.apiAccess.enabled = false;
      user.apiAccess.apiKeyCreatedAt = undefined;
      
      await user.save();
      
      logger.info(`API key revoked for user ${userId}`);
      
      res.json({
        success: true,
        message: 'API key revoked successfully'
      });
      
    } catch (error) {
      logger.error('Error revoking API key:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to revoke API key'
      });
    }
  },
  
  // Get API usage statistics
  async getApiUsage(req, res) {
    try {
      const userId = req.auth.userId;
      const { period = 'month' } = req.query;
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      const currentUsage = user.featureUsage?.apiCallsCount || 0;
      const limits = this.getRateLimitsForTier(user.apiAccess?.rateLimitTier || 'basic');
      
      // This is a simplified implementation
      // In a real scenario, you'd track API calls with timestamps in a separate collection
      const usageData = {
        current: {
          calls: currentUsage,
          limit: limits.monthly,
          remaining: Math.max(0, limits.monthly - currentUsage),
          resetDate: this.getNextResetDate(user.featureUsage?.lastResetDate)
        },
        rateLimits: {
          perMinute: limits.perMinute,
          perHour: limits.perHour,
          perDay: limits.perDay,
          perMonth: limits.monthly
        },
        tier: user.apiAccess?.rateLimitTier || 'basic',
        period: period
      };
      
      res.json({
        success: true,
        data: usageData
      });
      
    } catch (error) {
      logger.error('Error fetching API usage:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch API usage'
      });
    }
  },
  
  // Get rate limit information
  async getRateLimits(req, res) {
    try {
      const userId = req.auth.userId;
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      const tier = user.apiAccess?.rateLimitTier || 'basic';
      const limits = this.getRateLimitsForTier(tier);
      
      res.json({
        success: true,
        data: {
          tier,
          limits,
          upgradeOptions: this.getUpgradeOptions(tier)
        }
      });
      
    } catch (error) {
      logger.error('Error fetching rate limits:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch rate limits'
      });
    }
  },
  
  // Get API endpoints documentation
  async getApiEndpoints(req, res) {
    try {
      const endpoints = [
        {
          method: 'POST',
          path: '/api/v1/resumes/analyze',
          description: 'Analyze a resume and get insights',
          parameters: {
            resumeText: 'string (required) - The resume content to analyze',
            jobDescription: 'string (optional) - Job description for tailored analysis'
          },
          response: {
            success: 'boolean',
            data: {
              score: 'number',
              insights: 'array',
              suggestions: 'array'
            }
          }
        },
        {
          method: 'POST',
          path: '/api/v1/jd/analyze',
          description: 'Analyze a job description',
          parameters: {
            jobDescription: 'string (required) - The job description to analyze'
          },
          response: {
            success: 'boolean',
            data: {
              requirements: 'array',
              skills: 'array',
              experience: 'string'
            }
          }
        },
        {
          method: 'GET',
          path: '/api/v1/profile',
          description: 'Get user profile information',
          response: {
            success: 'boolean',
            data: {
              name: 'string',
              email: 'string',
              profileData: 'object'
            }
          }
        },
        {
          method: 'GET',
          path: '/api/v1/analytics/usage',
          description: 'Get API usage statistics',
          response: {
            success: 'boolean',
            data: {
              current: 'object',
              rateLimits: 'object'
            }
          }
        }
      ];
      
      res.json({
        success: true,
        data: {
          baseUrl: process.env.API_BASE_URL || 'https://api.autoapplypro.tech',
          version: 'v1',
          authentication: {
            type: 'API Key',
            header: 'X-API-Key',
            example: 'X-API-Key: aap_your-api-key-here'
          },
          endpoints
        }
      });
      
    } catch (error) {
      logger.error('Error fetching API endpoints:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch API endpoints'
      });
    }
  },
  
  // Get API examples
  async getApiExamples(req, res) {
    try {
      const examples = {
        resumeAnalysis: {          curl: `curl -X POST https://api.autoapplypro.tech/api/v1/resumes/analyze \\
  -H "X-API-Key: aap_your-api-key-here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "resumeText": "John Doe\\nSoftware Engineer\\n...",
    "jobDescription": "We are looking for a senior software engineer..."
  }'`,
          javascript: `const response = await fetch('https://api.autoapplypro.tech/api/v1/resumes/analyze', {
  method: 'POST',
  headers: {
    'X-API-Key': 'aap_your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    resumeText: 'John Doe\\nSoftware Engineer\\n...',
    jobDescription: 'We are looking for a senior software engineer...'
  })
});

const data = await response.json();`,
          python: `import requests

response = requests.post(
    'https://api.autoapplypro.tech/api/v1/resumes/analyze',
    headers={
        'X-API-Key': 'aap_your-api-key-here',
        'Content-Type': 'application/json'
    },
    json={
        'resumeText': 'John Doe\\nSoftware Engineer\\n...',
        'jobDescription': 'We are looking for a senior software engineer...'
    }
)

data = response.json()`
        }
      };
      
      res.json({
        success: true,
        data: examples
      });
      
    } catch (error) {
      logger.error('Error fetching API examples:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch API examples'
      });
    }
  },
  
  // Helper methods
  getRateLimitTierForPlan(plan) {
    const tiers = {
      free: 'basic',
      basic: 'basic',
      pro: 'premium',
      enterprise: 'enterprise'
    };
    return tiers[plan] || 'basic';
  },
  
  getRateLimitsForTier(tier) {
    const limits = {
      basic: {
        perMinute: 10,
        perHour: 100,
        perDay: 500,
        monthly: 1000
      },
      premium: {
        perMinute: 50,
        perHour: 1000,
        perDay: 5000,
        monthly: 10000
      },
      enterprise: {
        perMinute: 200,
        perHour: 5000,
        perDay: 25000,
        monthly: 100000
      }
    };
    return limits[tier] || limits.basic;
  },
  
  getUpgradeOptions(currentTier) {
    const options = {
      basic: [
        {
          tier: 'premium',
          plan: 'pro',
          benefits: ['10x higher rate limits', 'Advanced analytics', 'Webhook support']
        },
        {
          tier: 'enterprise',
          plan: 'enterprise',
          benefits: ['100x higher rate limits', 'Priority support', 'Custom integrations']
        }
      ],
      premium: [
        {
          tier: 'enterprise',
          plan: 'enterprise',
          benefits: ['4x higher rate limits', 'Priority support', 'Custom integrations']
        }
      ],
      enterprise: []
    };
    return options[currentTier] || [];
  },
  
  getNextResetDate(lastResetDate) {
    const now = new Date();
    const resetDate = new Date(lastResetDate || now);
    resetDate.setMonth(resetDate.getMonth() + 1);
    resetDate.setDate(1);
    resetDate.setHours(0, 0, 0, 0);
    return resetDate;
  }
};

module.exports = apiController;
