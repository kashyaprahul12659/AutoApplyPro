const User = require('../models/User');
const notificationService = require('../services/notificationService');
const { logger } = require('../utils/logger');
const { validationResult } = require('express-validator');

const notificationController = {
  // Get user's notifications
  async getUserNotifications(req, res) {
    try {
      const { page = 1, limit = 20, unreadOnly = false } = req.query;
      const userId = req.auth.userId;
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      let notifications = user.offlineNotifications || [];
      
      // Filter for unread only if requested
      if (unreadOnly === 'true') {
        notifications = notifications.filter(n => !n.read);
      }
      
      // Sort by creation date (newest first)
      notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedNotifications = notifications.slice(startIndex, endIndex);
      
      res.json({
        success: true,
        data: {
          notifications: paginatedNotifications,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(notifications.length / limit),
            totalItems: notifications.length,
            hasNext: endIndex < notifications.length,
            hasPrev: startIndex > 0
          }
        }
      });
      
    } catch (error) {
      logger.error('Error fetching notifications:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch notifications'
      });
    }
  },
  
  // Get unread notification count
  async getUnreadCount(req, res) {
    try {
      const userId = req.auth.userId;
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      const unreadCount = user.offlineNotifications?.filter(n => !n.read).length || 0;
      
      res.json({
        success: true,
        data: { unreadCount }
      });
      
    } catch (error) {
      logger.error('Error fetching unread count:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch unread count'
      });
    }
  },
  
  // Mark notifications as read
  async markAsRead(req, res) {
    try {
      const userId = req.auth.userId;
      const { notificationIds } = req.body;
      
      if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid notification IDs'
        });
      }
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      await user.markNotificationsAsRead(notificationIds);
      
      res.json({
        success: true,
        message: 'Notifications marked as read'
      });
      
    } catch (error) {
      logger.error('Error marking notifications as read:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark notifications as read'
      });
    }
  },
  
  // Mark all notifications as read
  async markAllAsRead(req, res) {
    try {
      const userId = req.auth.userId;
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      await user.markNotificationsAsRead();
      
      res.json({
        success: true,
        message: 'All notifications marked as read'
      });
      
    } catch (error) {
      logger.error('Error marking all notifications as read:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark all notifications as read'
      });
    }
  },
  
  // Delete notification
  async deleteNotification(req, res) {
    try {
      const userId = req.auth.userId;
      const { notificationId } = req.params;
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Remove notification from array
      user.offlineNotifications = user.offlineNotifications.filter(
        n => n._id.toString() !== notificationId
      );
      
      await user.save();
      
      res.json({
        success: true,
        message: 'Notification deleted'
      });
      
    } catch (error) {
      logger.error('Error deleting notification:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete notification'
      });
    }
  },
  
  // Update notification preferences
  async updatePreferences(req, res) {
    try {
      const userId = req.auth.userId;
      const { email, push, sms } = req.body;
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Update preferences
      if (email) user.notificationPreferences.email = { ...user.notificationPreferences.email, ...email };
      if (push) user.notificationPreferences.push = { ...user.notificationPreferences.push, ...push };
      if (sms) user.notificationPreferences.sms = { ...user.notificationPreferences.sms, ...sms };
      
      await user.save();
      
      res.json({
        success: true,
        message: 'Notification preferences updated',
        data: user.notificationPreferences
      });
      
    } catch (error) {
      logger.error('Error updating notification preferences:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update notification preferences'
      });
    }
  },
  
  // Get notification preferences
  async getPreferences(req, res) {
    try {
      const userId = req.auth.userId;
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      res.json({
        success: true,
        data: user.notificationPreferences || {}
      });
      
    } catch (error) {
      logger.error('Error fetching notification preferences:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch notification preferences'
      });
    }
  },
  
  // Send test notification
  async sendTestNotification(req, res) {
    try {
      const userId = req.auth.userId;
      const { type = 'info', title = 'Test Notification', message = 'This is a test notification' } = req.body;
      
      // Send real-time notification if user is connected
      await notificationService.sendToUser(userId, {
        type,
        title,
        message,
        data: { test: true }
      });
      
      res.json({
        success: true,
        message: 'Test notification sent'
      });
      
    } catch (error) {
      logger.error('Error sending test notification:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send test notification'
      });
    }
  },
  
  // Subscribe to push notifications
  async subscribeToPush(req, res) {
    try {
      const userId = req.auth.userId;
      const { subscription } = req.body;
      
      // Store push subscription in user record or separate collection
      // This is a placeholder - implement based on your push notification service
      
      res.json({
        success: true,
        message: 'Subscribed to push notifications'
      });
      
    } catch (error) {
      logger.error('Error subscribing to push notifications:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to subscribe to push notifications'
      });
    }
  },
  
  // Unsubscribe from push notifications
  async unsubscribeFromPush(req, res) {
    try {
      const userId = req.auth.userId;
      
      // Remove push subscription from user record
      // This is a placeholder - implement based on your push notification service
      
      res.json({
        success: true,
        message: 'Unsubscribed from push notifications'
      });
      
    } catch (error) {
      logger.error('Error unsubscribing from push notifications:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to unsubscribe from push notifications'
      });
    }
  }
};

module.exports = notificationController;
