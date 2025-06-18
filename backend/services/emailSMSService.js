const nodemailer = require('nodemailer');
const twilio = require('twilio');
const logger = require('../utils/logger');
const { notificationService } = require('./notificationService');

/**
 * Email and SMS Notification Service
 * Handles email and SMS notifications for various events
 */

class EmailSMSService {
  constructor() {
    this.emailTransporter = null;
    this.twilioClient = null;
    this.initialize();
  }

  /**
   * Initialize email and SMS services
   */
  initialize() {
    // Initialize email transporter
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      this.emailTransporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
      
      logger.info('Email service initialized');
    } else {
      logger.warn('Email service not configured - missing SMTP credentials');
    }

    // Initialize Twilio client
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      
      logger.info('SMS service initialized');
    } else {
      logger.warn('SMS service not configured - missing Twilio credentials');
    }
  }

  /**
   * Send email notification
   */
  async sendEmail(to, subject, htmlContent, textContent = null) {
    if (!this.emailTransporter) {
      logger.warn('Email service not available');
      return false;
    }

    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject,
        html: htmlContent,
        text: textContent || this.htmlToText(htmlContent)
      };

      const result = await this.emailTransporter.sendMail(mailOptions);
      
      logger.info('Email sent successfully', { 
        to, 
        subject, 
        messageId: result.messageId 
      });
      
      return true;
    } catch (error) {
      logger.error('Email sending failed', { 
        to, 
        subject, 
        error: error.message 
      });
      
      return false;
    }
  }

  /**
   * Send SMS notification
   */
  async sendSMS(to, message) {
    if (!this.twilioClient) {
      logger.warn('SMS service not available');
      return false;
    }

    try {
      const result = await this.twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to
      });

      logger.info('SMS sent successfully', { 
        to, 
        messageSid: result.sid 
      });
      
      return true;
    } catch (error) {
      logger.error('SMS sending failed', { 
        to, 
        error: error.message 
      });
      
      return false;
    }
  }

  /**
   * Send welcome email to new user
   */
  async sendWelcomeEmail(user) {
    const subject = 'Welcome to AutoApplyPro!';
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to AutoApplyPro</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .features { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .feature { display: flex; align-items: center; margin: 15px 0; }
          .feature-icon { width: 24px; height: 24px; margin-right: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to AutoApplyPro, ${user.name}!</h1>
            <p>Your AI-powered job application assistant is ready to help you land your dream job.</p>
          </div>
          <div class="content">
            <p>Hi ${user.name},</p>
            <p>Thank you for joining AutoApplyPro! We're excited to help you streamline your job application process with our AI-powered tools.</p>
            
            <div class="features">
              <h3>🚀 Get Started with These Features:</h3>
              <div class="feature">
                <span class="feature-icon">📄</span>
                <span>Upload and optimize your resume with AI suggestions</span>
              </div>
              <div class="feature">
                <span class="feature-icon">✍️</span>
                <span>Generate personalized cover letters for any job</span>
              </div>
              <div class="feature">
                <span class="feature-icon">🔍</span>
                <span>Analyze job descriptions and match your skills</span>
              </div>
              <div class="feature">
                <span class="feature-icon">📊</span>
                <span>Track your applications and success rate</span>
              </div>
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Get Started Now</a>
            </div>
            
            <p><strong>Need Help?</strong></p>
            <p>Our support team is here to help! Email us at <a href="mailto:support@autoapplypro.tech">support@autoapplypro.tech</a> or visit our <a href="${process.env.FRONTEND_URL}/help">Help Center</a>.</p>
            
            <p>Best regards,<br>The AutoApplyPro Team</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail(user.email, subject, htmlContent);
  }

  /**
   * Send job application success notification
   */
  async sendJobApplicationNotification(user, jobTitle, companyName, success = true) {
    const subject = success 
      ? `✅ Job Application Submitted - ${jobTitle} at ${companyName}`
      : `❌ Job Application Failed - ${jobTitle} at ${companyName}`;

    const htmlContent = success ? `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Application Submitted Successfully</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .success { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .button { display: inline-block; background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>🎉 Application Submitted Successfully!</h2>
          <div class="success">
            <p><strong>Great news, ${user.name}!</strong></p>
            <p>Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been submitted successfully.</p>
          </div>
          <p><strong>Next Steps:</strong></p>
          <ul>
            <li>Keep track of your application in your dashboard</li>
            <li>Prepare for potential interviews</li>
            <li>Continue applying to other opportunities</li>
          </ul>
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/dashboard" class="button">View Dashboard</a>
          </div>
        </div>
      </body>
      </html>
    ` : `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Application Submission Failed</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .error { background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .button { display: inline-block; background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>❌ Application Submission Failed</h2>
          <div class="error">
            <p><strong>Hi ${user.name},</strong></p>
            <p>Unfortunately, your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> could not be submitted automatically.</p>
          </div>
          <p><strong>What you can do:</strong></p>
          <ul>
            <li>Try submitting the application manually</li>
            <li>Check if the job posting is still active</li>
            <li>Contact our support team for assistance</li>
          </ul>
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/support" class="button">Get Support</a>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email notification
    await this.sendEmail(user.email, subject, htmlContent);

    // Send real-time notification
    await notificationService.sendNotification(user._id.toString(), {
      title: success ? 'Application Submitted!' : 'Application Failed',
      message: success 
        ? `Your application for ${jobTitle} at ${companyName} was submitted successfully.`
        : `Failed to submit application for ${jobTitle} at ${companyName}. Please try again.`,
      category: 'job_application',
      priority: success ? 'normal' : 'high',
      actionUrl: success ? '/dashboard' : '/support'
    });
  }

  /**
   * Send subscription upgrade notification
   */
  async sendSubscriptionNotification(user, planName, isUpgrade = true) {
    const subject = isUpgrade 
      ? `🎉 Welcome to ${planName} Plan!`
      : `Plan Changed to ${planName}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Subscription Updated</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .upgrade { background: #d1ecf1; border: 1px solid #bee5eb; color: #0c5460; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .button { display: inline-block; background: #17a2b8; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>${isUpgrade ? '🎉' : '📋'} Your Plan Has Been Updated!</h2>
          <div class="upgrade">
            <p><strong>Hi ${user.name},</strong></p>
            <p>Your subscription has been ${isUpgrade ? 'upgraded' : 'changed'} to the <strong>${planName}</strong> plan.</p>
          </div>
          <p><strong>Your new benefits include:</strong></p>
          <ul>
            <li>Enhanced AI-powered features</li>
            <li>Priority customer support</li>
            <li>Advanced analytics and insights</li>
            <li>Unlimited resume optimizations</li>
          </ul>
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Explore Your New Features</a>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email notification
    await this.sendEmail(user.email, subject, htmlContent);

    // Send real-time notification
    await notificationService.sendNotification(user._id.toString(), {
      title: 'Subscription Updated',
      message: `Your plan has been ${isUpgrade ? 'upgraded' : 'changed'} to ${planName}. Enjoy your new features!`,
      category: 'subscription',
      priority: 'normal',
      actionUrl: '/dashboard'
    });
  }

  /**
   * Send feature limit reached notification
   */
  async sendFeatureLimitNotification(user, featureName, limit) {
    const subject = `⚠️ Feature Limit Reached - ${featureName}`;
    
    // Send real-time notification
    await notificationService.sendNotification(user._id.toString(), {
      title: 'Feature Limit Reached',
      message: `You've reached your ${featureName} limit (${limit}). Upgrade to continue using this feature.`,
      category: 'feature_limit',
      priority: 'high',
      actionUrl: '/upgrade'
    });

    // Send SMS if user has phone number and opted in
    if (user.phoneNumber && user.smsNotifications) {
      await this.sendSMS(
        user.phoneNumber,
        `AutoApplyPro: You've reached your ${featureName} limit. Upgrade at ${process.env.FRONTEND_URL}/upgrade`
      );
    }
  }

  /**
   * Convert HTML to plain text
   */
  htmlToText(html) {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
  }

  /**
   * Send bulk notifications
   */
  async sendBulkNotifications(users, subject, htmlContent, options = {}) {
    const results = {
      success: 0,
      failed: 0,
      errors: []
    };

    for (const user of users) {
      try {
        const success = await this.sendEmail(user.email, subject, htmlContent);
        if (success) {
          results.success++;
        } else {
          results.failed++;
        }

        // Add delay to avoid rate limiting
        if (options.delay) {
          await new Promise(resolve => setTimeout(resolve, options.delay));
        }
      } catch (error) {
        results.failed++;
        results.errors.push({ userId: user._id, error: error.message });
      }
    }

    logger.info('Bulk notification completed', results);
    return results;
  }
}

// Create singleton instance
const emailSMSService = new EmailSMSService();

module.exports = emailSMSService;
