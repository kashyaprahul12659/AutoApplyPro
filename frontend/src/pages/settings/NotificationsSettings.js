import React from 'react';
import { PageErrorBoundary } from '../../components/withErrorBoundary';
import { BellIcon, EnvelopeIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

const NotificationsSettings = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Notification Settings</h1>
        <p className="text-gray-600">Manage how and when you receive notifications</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h2>
        <div className="divide-y divide-gray-200">
          <div className="py-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <EnvelopeIcon className="h-6 w-6 text-gray-500" />
              </div>
              <div className="ml-3 flex-grow">
                <div className="flex items-center justify-between">
                  <h3 className="text-md font-medium text-gray-900">Email Notifications</h3>
                  <div className="ml-3">
                    <label className="inline-flex relative items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">Receive email notifications about application updates, responses, and important alerts.</p>
                <div className="mt-3 space-y-2">
                  <label className="inline-flex items-center">
                    <input type="checkbox" className="rounded text-primary-600 border-gray-300 focus:ring-primary-500 h-4 w-4" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700">Job application updates</span>
                  </label>
                  <div className="block">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="rounded text-primary-600 border-gray-300 focus:ring-primary-500 h-4 w-4" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">Interview invitations</span>
                    </label>
                  </div>
                  <div className="block">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="rounded text-primary-600 border-gray-300 focus:ring-primary-500 h-4 w-4" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">Resume views</span>
                    </label>
                  </div>
                  <div className="block">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="rounded text-primary-600 border-gray-300 focus:ring-primary-500 h-4 w-4" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">Weekly summary</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="py-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <BellIcon className="h-6 w-6 text-gray-500" />
              </div>
              <div className="ml-3 flex-grow">
                <div className="flex items-center justify-between">
                  <h3 className="text-md font-medium text-gray-900">In-app Notifications</h3>
                  <div className="ml-3">
                    <label className="inline-flex relative items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">Receive notifications while using the application.</p>
                <div className="mt-3 space-y-2">
                  <label className="inline-flex items-center">
                    <input type="checkbox" className="rounded text-primary-600 border-gray-300 focus:ring-primary-500 h-4 w-4" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700">Real-time application updates</span>
                  </label>
                  <div className="block">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="rounded text-primary-600 border-gray-300 focus:ring-primary-500 h-4 w-4" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">Job recommendations</span>
                    </label>
                  </div>
                  <div className="block">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="rounded text-primary-600 border-gray-300 focus:ring-primary-500 h-4 w-4" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">System alerts</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="py-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <DevicePhoneMobileIcon className="h-6 w-6 text-gray-500" />
              </div>
              <div className="ml-3 flex-grow">
                <div className="flex items-center justify-between">
                  <h3 className="text-md font-medium text-gray-900">Push Notifications</h3>
                  <div className="ml-3">
                    <label className="inline-flex relative items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">Receive push notifications on your device (requires browser permission).</p>
                <p className="mt-2 text-xs text-gray-500">
                  Push notifications are currently in beta. Enable them to receive important updates even when you're not using the application.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Communication Frequency</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Digest Frequency</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500">
              <option value="daily">Daily</option>
              <option value="weekly" selected>Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
              <option value="never">Never</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quiet Hours</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">From</label>
                <input type="time" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500" value="22:00" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">To</label>
                <input type="time" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500" value="07:00" />
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">We won't send notifications during these hours.</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button 
          type="button" 
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Reset to Defaults
        </button>
        <button 
          type="submit" 
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default PageErrorBoundary(NotificationsSettings, { pageName: 'NotificationsSettings' });
