import React, { useState, useEffect, useRef } from 'react';
import {
  CogIcon,
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../hooks/useUniversalAuth';

/**
 * Enhanced Settings Dropdown Component
 * Provides quick access to user settings and preferences
 */
const SettingsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState('system');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useUser();

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'system';
    setTheme(savedTheme);
  }, []);

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

  // Handle theme change
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    // Apply theme
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else if (newTheme === 'light') {
      root.classList.remove('dark');
    } else {
      // System theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Settings menu items
  const settingsItems = [    {
      icon: UserIcon,
      label: 'Profile Settings',
      description: 'Manage your personal information',
      action: () => navigate('/settings/profile'),
      color: 'text-blue-500'
    },
    {
      icon: BellIcon,
      label: 'Notifications',
      description: 'Configure notification preferences',
      action: () => navigate('/settings/notifications'),
      color: 'text-green-500'
    },
    {
      icon: ShieldCheckIcon,
      label: 'Privacy & Security',
      description: 'Password and security settings',
      action: () => navigate('/settings/security'),
      color: 'text-purple-500'
    },
    {
      icon: CreditCardIcon,
      label: 'Billing & Subscription',
      description: 'Manage your subscription plan',
      action: () => navigate('/settings/billing'),
      color: 'text-orange-500',
      badge: user?.isProUser ? 'Pro' : 'Free'
    },
    {
      icon: SunIcon,
      label: 'Theme Settings',
      description: 'Customize the appearance',
      action: () => navigate('/settings/theme'),
      color: 'text-indigo-500'
    }
  ];
  // Support items
  const supportItems = [
    {
      icon: QuestionMarkCircleIcon,
      label: 'Help Center',
      description: 'Get help and support',
      action: () => navigate('/help'),
      color: 'text-gray-500'
    }
  ];

  // Theme options
  const themeOptions = [
    { id: 'light', label: 'Light', icon: SunIcon },
    { id: 'dark', label: 'Dark', icon: MoonIcon },
    { id: 'system', label: 'System', icon: ComputerDesktopIcon }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
        aria-label="Settings"
      >
        <CogIcon className="w-5 h-5" />
      </button>

      {/* Settings Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900">
                  {user?.fullName || 'User'}
                </h3>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              {user?.isProUser && (
                <span className="px-2 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full">
                  Pro
                </span>
              )}
            </div>
          </div>

          {/* Settings Items */}
          <div className="py-2">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Settings
            </div>
            {settingsItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  item.action();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {item.label}
                      </p>
                      {item.badge && (
                        <span className="px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Theme Settings */}
          <div className="py-2 border-t border-gray-200">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Appearance
            </div>
            <div className="px-4 py-2">
              <div className="grid grid-cols-3 gap-2">
                {themeOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleThemeChange(option.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      theme === option.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <option.icon className={`w-4 h-4 mx-auto mb-1 ${
                      theme === option.id ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <p className={`text-xs font-medium ${
                      theme === option.id ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {option.label}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="py-2 border-t border-gray-200">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Support
            </div>
            {supportItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  item.action();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {item.label}
                    </p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsDropdown;
