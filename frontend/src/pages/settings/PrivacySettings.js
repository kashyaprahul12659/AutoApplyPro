import React from 'react';
import withErrorBoundary from '../../components/withErrorBoundary';
import { ShieldCheckIcon, EyeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const PrivacySettings = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Privacy Settings</h1>
        <p className="text-gray-600">Control your data and privacy preferences</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-start mb-4">
          <div className="flex-shrink-0 p-1">
            <ShieldCheckIcon className="h-6 w-6 text-primary-600" />
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-semibold text-gray-900">Data Privacy Controls</h2>
            <p className="text-sm text-gray-600">Manage how your data is used and shared</p>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-md font-medium text-gray-900">Profile Visibility</h3>
                <p className="text-sm text-gray-600 mt-1">Control who can see your profile information</p>
              </div>
              <select className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md text-sm">
                <option value="public">Public</option>
                <option value="registered">Registered Users</option>
                <option value="private" selected>Private</option>
              </select>
            </div>
          </div>

          <div className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-md font-medium text-gray-900">Resume Visibility</h3>
                <p className="text-sm text-gray-600 mt-1">Control who can see your uploaded resumes</p>
              </div>
              <select className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md text-sm">
                <option value="public">Public</option>
                <option value="employers">Employers Only</option>
                <option value="private" selected>Private</option>
              </select>
            </div>
          </div>

          <div className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-md font-medium text-gray-900">Activity History</h3>
                <p className="text-sm text-gray-600 mt-1">Control who can see your application history</p>
              </div>
              <select className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md text-sm">
                <option value="public">Public</option>
                <option value="connections">Connections Only</option>
                <option value="private" selected>Private</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-start mb-4">
          <div className="flex-shrink-0 p-1">
            <EyeIcon className="h-6 w-6 text-primary-600" />
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-semibold text-gray-900">Data Collection & Usage</h2>
            <p className="text-sm text-gray-600">Control how we collect and use your data</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-md font-medium text-gray-900">Analytics & Personalization</h3>
                <p className="text-sm text-gray-600 mt-1">Allow us to analyze your usage to improve your experience</p>
              </div>
              <div>
                <label className="inline-flex relative items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-md font-medium text-gray-900">Cookies Usage</h3>
                <p className="text-sm text-gray-600 mt-1">Control how cookies are used on our platform</p>
              </div>
              <div>
                <label className="inline-flex relative items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-md font-medium text-gray-900">Third-Party Data Sharing</h3>
                <p className="text-sm text-gray-600 mt-1">Allow sharing of anonymous usage data with partners</p>
              </div>
              <div>
                <label className="inline-flex relative items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-start mb-4">
          <div className="flex-shrink-0 p-1">
            <LockClosedIcon className="h-6 w-6 text-primary-600" />
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-semibold text-gray-900">Data Management</h2>
            <p className="text-sm text-gray-600">Access and control your data</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-2">Download Your Data</h3>
            <p className="text-sm text-gray-600 mb-3">Get a copy of all the data we have about you</p>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              Request Data Export
            </button>
            <p className="mt-2 text-xs text-gray-500">Data will be prepared and emailed to you within 48 hours.</p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-md font-medium text-gray-900 mb-2">Delete Account Data</h3>
            <p className="text-sm text-gray-600 mb-3">Request deletion of your personal data</p>
            <button className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Request Data Deletion
            </button>
            <p className="mt-2 text-xs text-gray-500">This process cannot be undone. Your account will be deactivated.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="button" className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          Cancel
        </button>
        <button type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default withErrorBoundary(PrivacySettings, {
  componentName: 'PrivacySettings',
  fallback: (
    <div className="p-4 text-red-700">
      There was an error loading privacy settings. Please try refreshing the page.
    </div>
  )
});
