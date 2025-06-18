const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const User = require('../models/User');

/**
 * Real-time Notification System using WebSockets
 * Handles real-time notifications, updates, and live features
 */

class NotificationService {
  constructor() {
    this.clients = new Map(); // userId -> WebSocket connection
    this.rooms = new Map(); // roomId -> Set of userIds
  }

  /**
   * Initialize WebSocket server
   */
  initialize(server) {
    this.wss = new WebSocket.Server({ 
      server,
      path: '/ws',
      verifyClient: this.verifyClient.bind(this)
    });

    this.wss.on('connection', this.handleConnection.bind(this));
    
    logger.info('WebSocket server initialized');
  }

  /**
   * Verify WebSocket client authentication
   */
  async verifyClient(info) {
    try {
      const url = new URL(info.req.url, 'http://localhost');
      const token = url.searchParams.get('token');
      
      if (!token) {
        logger.warn('WebSocket connection rejected - no token');
        return false;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.user.id);
      
      if (!user) {
        logger.warn('WebSocket connection rejected - invalid user');
        return false;
      }

      // Store user info for later use
      info.req.user = user;
      return true;
    } catch (error) {
      logger.error('WebSocket verification error', { error: error.message });
      return false;
    }
  }

  /**
   * Handle new WebSocket connection
   */
  handleConnection(ws, req) {
    const user = req.user;
    const userId = user._id.toString();
    
    logger.info('WebSocket client connected', { userId, userEmail: user.email });

    // Store connection
    this.clients.set(userId, ws);

    // Set up connection handlers
    ws.on('message', (data) => this.handleMessage(ws, userId, data));
    ws.on('close', () => this.handleDisconnection(userId));
    ws.on('error', (error) => this.handleError(userId, error));

    // Send connection confirmation
    this.sendToUser(userId, {
      type: 'connection_confirmed',
      timestamp: new Date().toISOString(),
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

    // Send any pending notifications
    this.sendPendingNotifications(userId);
  }

  /**
   * Handle incoming WebSocket messages
   */
  handleMessage(ws, userId, data) {
    try {
      const message = JSON.parse(data);
      
      logger.debug('WebSocket message received', { userId, type: message.type });

      switch (message.type) {
        case 'ping':
          this.sendToUser(userId, { type: 'pong', timestamp: new Date().toISOString() });
          break;
          
        case 'join_room':
          this.joinRoom(userId, message.roomId);
          break;
          
        case 'leave_room':
          this.leaveRoom(userId, message.roomId);
          break;
          
        case 'mark_notification_read':
          this.markNotificationRead(userId, message.notificationId);
          break;
          
        default:
          logger.warn('Unknown WebSocket message type', { userId, type: message.type });
      }
    } catch (error) {
      logger.error('WebSocket message handling error', { userId, error: error.message });
    }
  }

  /**
   * Handle WebSocket disconnection
   */
  handleDisconnection(userId) {
    logger.info('WebSocket client disconnected', { userId });
    
    this.clients.delete(userId);
    
    // Remove from all rooms
    for (const [roomId, users] of this.rooms.entries()) {
      users.delete(userId);
      if (users.size === 0) {
        this.rooms.delete(roomId);
      }
    }
  }

  /**
   * Handle WebSocket errors
   */
  handleError(userId, error) {
    logger.error('WebSocket error', { userId, error: error.message });
  }

  /**
   * Send message to specific user
   */
  sendToUser(userId, message) {
    const client = this.clients.get(userId);
    if (client && client.readyState === WebSocket.OPEN) {
      try {
        client.send(JSON.stringify(message));
        logger.debug('Message sent to user', { userId, type: message.type });
      } catch (error) {
        logger.error('Error sending message to user', { userId, error: error.message });
      }
    }
  }

  /**
   * Send message to all users in a room
   */
  sendToRoom(roomId, message) {
    const users = this.rooms.get(roomId);
    if (users) {
      users.forEach(userId => {
        this.sendToUser(userId, { ...message, roomId });
      });
    }
  }

  /**
   * Broadcast message to all connected users
   */
  broadcast(message) {
    this.clients.forEach((client, userId) => {
      this.sendToUser(userId, message);
    });
  }

  /**
   * Join a room (for grouped notifications)
   */
  joinRoom(userId, roomId) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }
    this.rooms.get(roomId).add(userId);
    
    logger.debug('User joined room', { userId, roomId });
    
    this.sendToUser(userId, {
      type: 'room_joined',
      roomId,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Leave a room
   */
  leaveRoom(userId, roomId) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.delete(userId);
      if (room.size === 0) {
        this.rooms.delete(roomId);
      }
    }
    
    logger.debug('User left room', { userId, roomId });
    
    this.sendToUser(userId, {
      type: 'room_left',
      roomId,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Send notification to user
   */
  async sendNotification(userId, notification) {
    // Send real-time notification if user is connected
    this.sendToUser(userId, {
      type: 'notification',
      notification: {
        id: notification.id || Date.now().toString(),
        title: notification.title,
        message: notification.message,
        category: notification.category || 'general',
        priority: notification.priority || 'normal',
        actionUrl: notification.actionUrl,
        timestamp: new Date().toISOString(),
        ...notification
      }
    });

    // Also store in database for offline users
    try {
      await User.findByIdAndUpdate(userId, {
        $push: {
          notifications: {
            id: notification.id || Date.now().toString(),
            title: notification.title,
            message: notification.message,
            category: notification.category || 'general',
            priority: notification.priority || 'normal',
            actionUrl: notification.actionUrl,
            isRead: false,
            createdAt: new Date()
          }
        }
      });
    } catch (error) {
      logger.error('Error storing notification', { userId, error: error.message });
    }
  }

  /**
   * Send pending notifications to newly connected user
   */
  async sendPendingNotifications(userId) {
    try {
      const user = await User.findById(userId);
      const unreadNotifications = user.notifications?.filter(n => !n.isRead) || [];
      
      if (unreadNotifications.length > 0) {
        this.sendToUser(userId, {
          type: 'pending_notifications',
          notifications: unreadNotifications,
          count: unreadNotifications.length
        });
      }
    } catch (error) {
      logger.error('Error sending pending notifications', { userId, error: error.message });
    }
  }

  /**
   * Mark notification as read
   */
  async markNotificationRead(userId, notificationId) {
    try {
      await User.findOneAndUpdate(
        { _id: userId, 'notifications.id': notificationId },
        { $set: { 'notifications.$.isRead': true, 'notifications.$.readAt': new Date() } }
      );
      
      this.sendToUser(userId, {
        type: 'notification_marked_read',
        notificationId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Error marking notification as read', { userId, notificationId, error: error.message });
    }
  }

  /**
   * Get connected users count
   */
  getConnectedUsersCount() {
    return this.clients.size;
  }

  /**
   * Get user connection status
   */
  isUserConnected(userId) {
    return this.clients.has(userId);
  }
}

// Notification types and categories
const NOTIFICATION_TYPES = {
  JOB_APPLICATION_SUCCESS: 'job_application_success',
  JOB_APPLICATION_ERROR: 'job_application_error',
  RESUME_ANALYSIS_COMPLETE: 'resume_analysis_complete',
  COVER_LETTER_GENERATED: 'cover_letter_generated',
  SUBSCRIPTION_UPDATED: 'subscription_updated',
  FEATURE_LIMIT_REACHED: 'feature_limit_reached',
  SYSTEM_MAINTENANCE: 'system_maintenance',
  WELCOME: 'welcome',
  SECURITY_ALERT: 'security_alert'
};

const NOTIFICATION_PRIORITIES = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent'
};

// Create singleton instance
const notificationService = new NotificationService();

module.exports = {
  notificationService,
  NOTIFICATION_TYPES,
  NOTIFICATION_PRIORITIES
};
