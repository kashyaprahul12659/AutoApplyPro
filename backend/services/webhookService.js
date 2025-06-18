const axios = require('axios');
const crypto = require('crypto');
const { logger } = require('../utils/logger');
const User = require('../models/User');

class WebhookService {
  constructor() {
    this.deliveryQueue = [];
    this.isProcessing = false;
    this.retryDelays = [1000, 5000, 15000]; // 1s, 5s, 15s
  }
  
  // Send webhook to user
  async sendWebhook(userId, event, data, options = {}) {
    try {
      const user = await User.findById(userId).select('+apiAccess.webhookSecret');
      
      if (!user || !user.apiAccess?.webhookUrl) {
        logger.debug(`No webhook configured for user ${userId}`);
        return false;
      }
      
      const payload = {
        event,
        timestamp: new Date().toISOString(),
        userId,
        data,
        ...options
      };
      
      // Add to delivery queue
      this.deliveryQueue.push({
        userId,
        webhookUrl: user.apiAccess.webhookUrl,
        webhookSecret: user.apiAccess.webhookSecret,
        payload,
        retries: 0,
        maxRetries: options.maxRetries || 3
      });
      
      // Process queue if not already processing
      if (!this.isProcessing) {
        this.processQueue();
      }
      
      return true;
      
    } catch (error) {
      logger.error('Error queuing webhook:', error);
      return false;
    }
  }
  
  // Process webhook delivery queue
  async processQueue() {
    if (this.isProcessing || this.deliveryQueue.length === 0) {
      return;
    }
    
    this.isProcessing = true;
    
    while (this.deliveryQueue.length > 0) {
      const webhookJob = this.deliveryQueue.shift();
      await this.deliverWebhook(webhookJob);
    }
    
    this.isProcessing = false;
  }
  
  // Deliver individual webhook
  async deliverWebhook(webhookJob) {
    const { userId, webhookUrl, webhookSecret, payload, retries, maxRetries } = webhookJob;
    
    try {
      const signature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(payload))
        .digest('hex');
      
      const startTime = Date.now();
      
      const response = await axios.post(webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': `sha256=${signature}`,
          'User-Agent': 'AutoApplyPro-Webhook/1.0',
          'X-Webhook-Event': payload.event,
          'X-Webhook-Delivery': crypto.randomUUID()
        },
        timeout: 10000, // 10 second timeout
        validateStatus: (status) => status >= 200 && status < 300
      });
      
      const responseTime = Date.now() - startTime;
      
      // Log successful delivery
      logger.info('Webhook delivered successfully', {
        userId,
        event: payload.event,
        status: response.status,
        responseTime: `${responseTime}ms`,
        retries
      });
      
      // Store delivery log (you might want to implement this in a separate collection)
      await this.storeDeliveryLog(userId, payload.event, 'success', {
        status: response.status,
        responseTime,
        retries
      });
      
    } catch (error) {
      logger.error('Webhook delivery failed', {
        userId,
        event: payload.event,
        error: error.message,
        status: error.response?.status,
        retries
      });
      
      // Retry logic
      if (retries < maxRetries) {
        const delay = this.retryDelays[retries] || 15000;
        
        setTimeout(() => {
          this.deliveryQueue.push({
            ...webhookJob,
            retries: retries + 1
          });
          
          if (!this.isProcessing) {
            this.processQueue();
          }
        }, delay);
        
        logger.info(`Webhook retry scheduled for user ${userId}, attempt ${retries + 1}/${maxRetries}`);
      } else {
        // Max retries reached, log failure
        await this.storeDeliveryLog(userId, payload.event, 'failed', {
          status: error.response?.status || 0,
          error: error.message,
          retries
        });
        
        logger.error(`Webhook delivery failed permanently for user ${userId} after ${maxRetries} retries`);
      }
    }
  }
  
  // Store delivery log (implement based on your needs)
  async storeDeliveryLog(userId, event, status, details) {
    try {
      // This is a placeholder - you might want to store this in a separate WebhookLog collection
      // or in a time-series database for better performance
      logger.info('Webhook delivery log', {
        userId,
        event,
        status,
        timestamp: new Date().toISOString(),
        ...details
      });
    } catch (error) {
      logger.error('Error storing webhook delivery log:', error);
    }
  }
  
  // Helper methods for common webhook events
  async sendJobApplicationWebhook(userId, jobData) {
    return this.sendWebhook(userId, 'job.applied', {
      jobId: jobData.jobId,
      jobTitle: jobData.title,
      company: jobData.company,
      appliedAt: new Date().toISOString(),
      resumeUsed: jobData.resumeId,
      status: 'submitted'
    });
  }
  
  async sendResumeAnalysisWebhook(userId, analysisData) {
    return this.sendWebhook(userId, 'resume.analyzed', {
      resumeId: analysisData.resumeId,
      analysis: analysisData.analysis,
      score: analysisData.score,
      suggestions: analysisData.suggestions,
      analyzedAt: new Date().toISOString()
    });
  }
  
  async sendProfileUpdateWebhook(userId, updatedFields) {
    return this.sendWebhook(userId, 'profile.updated', {
      updatedFields,
      updatedAt: new Date().toISOString()
    });
  }
  
  async sendSubscriptionChangeWebhook(userId, oldPlan, newPlan) {
    return this.sendWebhook(userId, 'subscription.changed', {
      oldPlan,
      newPlan,
      changedAt: new Date().toISOString(),
      billingPeriod: 'monthly' // or determine based on subscription
    });
  }
  
  async sendLowCreditWebhook(userId, currentCredits, threshold, plan) {
    return this.sendWebhook(userId, 'credit.low', {
      currentCredits,
      threshold,
      plan
    });
  }
  
  async sendAnalysisCompletedWebhook(userId, type, analysisId, results) {
    return this.sendWebhook(userId, 'analysis.completed', {
      type,
      analysisId,
      results,
      completedAt: new Date().toISOString()
    });
  }
  
  // Validate webhook signature (for incoming webhooks from external services)
  validateSignature(payload, signature, secret) {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'utf8'),
      Buffer.from(`sha256=${expectedSignature}`, 'utf8')
    );
  }
}

module.exports = new WebhookService();
