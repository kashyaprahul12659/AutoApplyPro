const User = require('../models/User');
const webhookService = require('../services/webhookService');
const { logger } = require('../utils/logger');
const crypto = require('crypto');
const axios = require('axios');

const webhookController = {
  // Get webhook configuration
  async getWebhookConfig(req, res) {
    try {
      const userId = req.auth.userId;
      
      const user = await User.findById(userId).select('+apiAccess.webhookSecret');
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      const config = {
        webhookUrl: user.apiAccess?.webhookUrl || '',
        enabled: !!user.apiAccess?.webhookUrl,
        hasSecret: !!user.apiAccess?.webhookSecret,
        events: [
          'job.applied',
          'resume.analyzed',
          'profile.updated',
          'subscription.changed',
          'credit.low',
          'analysis.completed'
        ]
      };
      
      res.json({
        success: true,
        data: config
      });
      
    } catch (error) {
      logger.error('Error fetching webhook config:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch webhook configuration'
      });
    }
  },
  
  // Update webhook configuration
  async updateWebhookConfig(req, res) {
    try {
      const userId = req.auth.userId;
      const { webhookUrl, enabled } = req.body;
      
      // Validate webhook URL
      if (webhookUrl && !webhookUrl.startsWith('https://')) {
        return res.status(400).json({
          success: false,
          message: 'Webhook URL must use HTTPS'
        });
      }
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Initialize apiAccess if not exists
      if (!user.apiAccess) {
        user.apiAccess = { enabled: false };
      }
      
      // Update webhook configuration
      if (enabled === false) {
        user.apiAccess.webhookUrl = '';
        user.apiAccess.webhookSecret = '';
      } else if (webhookUrl) {
        user.apiAccess.webhookUrl = webhookUrl;
        
        // Generate webhook secret if not exists
        if (!user.apiAccess.webhookSecret) {
          user.apiAccess.webhookSecret = crypto.randomBytes(32).toString('hex');
        }
      }
      
      await user.save();
      
      res.json({
        success: true,
        message: 'Webhook configuration updated',
        data: {
          webhookUrl: user.apiAccess.webhookUrl,
          enabled: !!user.apiAccess.webhookUrl,
          secret: user.apiAccess.webhookSecret // Return secret for setup
        }
      });
      
    } catch (error) {
      logger.error('Error updating webhook config:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update webhook configuration'
      });
    }
  },
  
  // Test webhook endpoint
  async testWebhook(req, res) {
    try {
      const userId = req.auth.userId;
      
      const user = await User.findById(userId).select('+apiAccess.webhookSecret');
      if (!user || !user.apiAccess?.webhookUrl) {
        return res.status(400).json({
          success: false,
          message: 'Webhook URL not configured'
        });
      }
      
      const testPayload = {
        event: 'webhook.test',
        timestamp: new Date().toISOString(),
        data: {
          message: 'This is a test webhook event',
          userId: userId
        }
      };
      
      try {
        const signature = crypto
          .createHmac('sha256', user.apiAccess.webhookSecret)
          .update(JSON.stringify(testPayload))
          .digest('hex');
        
        const response = await axios.post(user.apiAccess.webhookUrl, testPayload, {
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': `sha256=${signature}`,
            'User-Agent': 'AutoApplyPro-Webhook/1.0'
          },
          timeout: 10000 // 10 second timeout
        });
        
        res.json({
          success: true,
          message: 'Test webhook sent successfully',
          data: {
            status: response.status,
            statusText: response.statusText,
            responseTime: response.headers['x-response-time'] || 'N/A'
          }
        });
        
      } catch (webhookError) {
        logger.error('Webhook test failed:', webhookError);
        res.json({
          success: false,
          message: 'Webhook test failed',
          error: {
            code: webhookError.code,
            message: webhookError.message,
            status: webhookError.response?.status || 'N/A'
          }
        });
      }
      
    } catch (error) {
      logger.error('Error testing webhook:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to test webhook'
      });
    }
  },
  
  // Get webhook logs (placeholder - implement based on your logging strategy)
  async getWebhookLogs(req, res) {
    try {
      const userId = req.auth.userId;
      const { page = 1, limit = 20 } = req.query;
      
      // This is a placeholder implementation
      // In a real scenario, you'd store webhook delivery logs in a separate collection
      const logs = [
        {
          id: '1',
          event: 'job.applied',
          timestamp: new Date().toISOString(),
          status: 'success',
          statusCode: 200,
          responseTime: '150ms',
          retries: 0
        },
        {
          id: '2',
          event: 'resume.analyzed',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          status: 'failed',
          statusCode: 500,
          responseTime: '5000ms',
          retries: 3,
          error: 'Internal Server Error'
        }
      ];
      
      res.json({
        success: true,
        data: {
          logs,
          pagination: {
            currentPage: parseInt(page),
            totalPages: 1,
            totalItems: logs.length
          }
        }
      });
      
    } catch (error) {
      logger.error('Error fetching webhook logs:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch webhook logs'
      });
    }
  },
  
  // Regenerate webhook secret
  async regenerateWebhookSecret(req, res) {
    try {
      const userId = req.auth.userId;
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      if (!user.apiAccess?.webhookUrl) {
        return res.status(400).json({
          success: false,
          message: 'Webhook URL not configured'
        });
      }
      
      // Generate new secret
      user.apiAccess.webhookSecret = crypto.randomBytes(32).toString('hex');
      await user.save();
      
      res.json({
        success: true,
        message: 'Webhook secret regenerated',
        data: {
          secret: user.apiAccess.webhookSecret
        }
      });
      
    } catch (error) {
      logger.error('Error regenerating webhook secret:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to regenerate webhook secret'
      });
    }
  },
  
  // Get webhook events documentation
  async getWebhookEvents(req, res) {
    try {
      const events = [
        {
          event: 'job.applied',
          description: 'Triggered when a job application is submitted',
          payload: {
            jobId: 'string',
            jobTitle: 'string',
            company: 'string',
            appliedAt: 'ISO string',
            resumeUsed: 'string',
            status: 'string'
          }
        },
        {
          event: 'resume.analyzed',
          description: 'Triggered when resume analysis is completed',
          payload: {
            resumeId: 'string',
            analysis: 'object',
            score: 'number',
            suggestions: 'array',
            analyzedAt: 'ISO string'
          }
        },
        {
          event: 'profile.updated',
          description: 'Triggered when user profile is updated',
          payload: {
            updatedFields: 'array',
            updatedAt: 'ISO string'
          }
        },
        {
          event: 'subscription.changed',
          description: 'Triggered when subscription plan changes',
          payload: {
            oldPlan: 'string',
            newPlan: 'string',
            changedAt: 'ISO string',
            billingPeriod: 'string'
          }
        },
        {
          event: 'credit.low',
          description: 'Triggered when AI credits are running low',
          payload: {
            currentCredits: 'number',
            threshold: 'number',
            plan: 'string'
          }
        },
        {
          event: 'analysis.completed',
          description: 'Triggered when any analysis task is completed',
          payload: {
            type: 'string', // 'resume', 'jd', 'profile'
            analysisId: 'string',
            results: 'object',
            completedAt: 'ISO string'
          }
        }
      ];
      
      res.json({
        success: true,
        data: {
          events,
          security: {
            signatureHeader: 'X-Webhook-Signature',
            signatureFormat: 'sha256=<hash>',
            verificationInstructions: 'Use HMAC-SHA256 with your webhook secret to verify the payload'
          },
          retryPolicy: {
            maxRetries: 3,
            backoffStrategy: 'exponential',
            timeoutSeconds: 10
          }
        }
      });
      
    } catch (error) {
      logger.error('Error fetching webhook events:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch webhook events'
      });
    }
  }
};

module.exports = webhookController;
