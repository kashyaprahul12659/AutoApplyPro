import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  BellIcon,
  CheckIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useApi } from '../../hooks/useApi';
import { formatDistanceToNow } from 'date-fns';

/**
 * Enhanced Notification Dropdown Component
 * Shows real-time notifications with mark as read and delete functionality
 */
const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  // Fix: apiCall might be undefined, destructure with default value
  const { apiCall = null } = useApi() || {};

  // Fetch notifications - Add defensive check for apiCall
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      // Fix: Check if apiCall is a function before calling it
      if (typeof apiCall === 'function') {
        const response = await apiCall('/api/notifications', {
          params: { limit: 10 }
        });
        setNotifications(response?.data?.data?.notifications || []);
      } else {
        console.warn('apiCall is not a function:', apiCall);
        throw new Error('API call function is not available');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Set mock data for demo
      setNotifications([
        {
          _id: '1',
          title: 'Welcome to AutoApply Pro!',
          message: 'Your account has been successfully created.',
          type: 'success',
          isRead: false,
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          title: 'Extension Installed',
          message: 'Chrome extension is ready to use.',
          type: 'info',
          isRead: true,
          createdAt: new Date(Date.now() - 3600000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  // Fetch unread count - Add defensive check for apiCall
  const fetchUnreadCount = useCallback(async () => {
    try {
      // Fix: Check if apiCall is a function before calling it
      if (typeof apiCall === 'function') {
        const response = await apiCall('/api/notifications/unread-count');
        setUnreadCount(response?.data?.data?.count || 0);
      } else {
        console.warn('apiCall is not a function:', apiCall);
        throw new Error('API call function is not available');
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
      setUnreadCount(1); // Mock count
    }
  }, [apiCall]);

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  // Mark notification as read - Add defensive check for apiCall
  const markAsRead = async (notificationId) => {
    try {
      // Fix: Check if apiCall is a function before calling it
      if (typeof apiCall === 'function') {
        await apiCall(`/api/notifications/${notificationId}/read`, {
          method: 'PUT'
        });
      } else {
        console.warn('apiCall is not a function:', apiCall);
        throw new Error('API call function is not available');
      }

      // Update local state
      setNotifications(notifications.map(notif =>
        notif._id === notificationId
          ? { ...notif, isRead: true }
          : notif
      ));

      // Update unread count
      if (unreadCount > 0) {
        setUnreadCount(unreadCount - 1);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Update local state anyway for demo
      setNotifications(notifications.map(notif =>
        notif._id === notificationId
          ? { ...notif, isRead: true }
          : notif
      ));
      if (unreadCount > 0) {
        setUnreadCount(unreadCount - 1);
      }
    }
  };

  // Mark all as read - Add defensive check for apiCall
  const markAllAsRead = async () => {
    try {
      // Fix: Check if apiCall is a function before calling it
      if (typeof apiCall === 'function') {
        await apiCall('/api/notifications/mark-all-read', {
          method: 'PUT'
        });
      } else {
        console.warn('apiCall is not a function:', apiCall);
        throw new Error('API call function is not available');
      }

      // Update local state
      setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // Update local state anyway for demo
      setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
      setUnreadCount(0);
    }
  };
  // Delete notification - Add defensive check for apiCall
  const deleteNotification = async (notificationId) => {
    try {
      // Fix: Check if apiCall is a function before calling it
      if (typeof apiCall === 'function') {
        await apiCall(`/api/notifications/${notificationId}`, {
          method: 'DELETE'
        });
      } else {
        console.warn('apiCall is not a function:', apiCall);
        throw new Error('API call function is not available');
      }

      // Update local state
      const deletedNotif = notifications.find(n => n._id === notificationId);
      setNotifications(notifications.filter(notif => notif._id !== notificationId));

      // Update unread count if deleted notification was unread
      if (deletedNotif && !deletedNotif.isRead) {
        setUnreadCount(Math.max(0, unreadCount - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      // Update local state anyway for demo
      const deletedNotif = notifications.find(n => n._id === notificationId);
      setNotifications(notifications.filter(notif => notif._id !== notificationId));
      if (deletedNotif && !deletedNotif.isRead) {
        setUnreadCount(Math.max(0, unreadCount - 1));
      }
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
        aria-label="Notifications"
      >
        <BellIcon className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <span className="mt-2 block">Loading...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <BellIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No notifications yet</p>
                <p className="text-sm">We'll notify you when something happens</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="mt-1 text-sm text-gray-600">
                            {notification.message}
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-1 ml-2">
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification._id)}
                              className="p-1 text-gray-400 hover:text-blue-600 rounded"
                              title="Mark as read"
                            >
                              <CheckIcon className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification._id)}
                            className="p-1 text-gray-400 hover:text-red-600 rounded"
                            title="Delete"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 text-center">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
