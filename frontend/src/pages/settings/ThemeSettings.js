import React from 'react';
import { PageErrorBoundary } from '../../components/withErrorBoundary';
import { useTheme } from '../../context/ThemeContext';
import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';

const ThemeSettings = () => {
  const { themeSetting, setTheme } = useTheme();
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Appearance Settings</h1>
        <p className="text-gray-600 dark:text-gray-300">Customize the appearance of the application</p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Theme</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            className={`cursor-pointer p-4 rounded-lg border transition-all ${
              themeSetting === 'light' 
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-500' 
                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
            }`}
            onClick={() => setTheme('light')}
          >
            <div className="flex flex-col items-center text-center">
              <SunIcon className="w-10 h-10 text-yellow-500 mb-3" />
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Light Mode</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Standard light appearance with bright background
              </p>
            </div>
          </div>

          <div 
            className={`cursor-pointer p-4 rounded-lg border transition-all ${
              themeSetting === 'dark' 
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-500' 
                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
            }`}
            onClick={() => setTheme('dark')}
          >
            <div className="flex flex-col items-center text-center">
              <MoonIcon className="w-10 h-10 text-indigo-500 mb-3" />
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Dark Mode</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Dark appearance with reduced brightness
              </p>
            </div>
          </div>

          <div 
            className={`cursor-pointer p-4 rounded-lg border transition-all ${
              themeSetting === 'system' 
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-500' 
                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
            }`}
            onClick={() => setTheme('system')}
          >
            <div className="flex flex-col items-center text-center">
              <ComputerDesktopIcon className="w-10 h-10 text-blue-500 mb-3" />
              <h3 className="font-medium text-gray-900 dark:text-gray-100">System Default</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Match your system's appearance settings
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-md">
          <h3 className="font-medium text-gray-900 dark:text-gray-200 mb-2">Current Appearance</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Your appearance is set to: <span className="font-semibold">{themeSetting.charAt(0).toUpperCase() + themeSetting.slice(1)}</span>
          </p>
          {themeSetting === 'system' && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Following your device settings. Change your system theme to update this application's appearance.
            </p>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Advanced Settings</h2>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-md font-medium text-gray-900 dark:text-gray-200">Reduced Animation</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Minimize motion for a more subtle experience</p>
              </div>
              <div>
                <label className="inline-flex relative items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-md font-medium text-gray-900 dark:text-gray-200">High Contrast Mode</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Increase contrast for better visibility</p>
              </div>
              <div>
                <label className="inline-flex relative items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-md font-medium text-gray-900 dark:text-gray-200">Focus Mode</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Simplify the interface to reduce distractions</p>
              </div>
              <div>
                <label className="inline-flex relative items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default PageErrorBoundary(ThemeSettings, { pageName: 'ThemeSettings' });
