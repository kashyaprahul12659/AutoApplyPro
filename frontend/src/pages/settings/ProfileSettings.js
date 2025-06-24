import React from 'react';
import { PageErrorBoundary } from '../../components/withErrorBoundary';

const ProfileSettings = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-600">Manage your personal details and preferences</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Your first name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Your last name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="example@email.com"
                disabled
              />
              <p className="mt-1 text-xs text-gray-500">Contact support to change your email</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                type="tel" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">About Me</label>
            <textarea 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Brief description about yourself"
              rows="3"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button 
              type="button" 
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-2">Password</h3>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Change your password or reset it if you've forgotten it.</p>
              <button 
                type="button" 
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Change Password
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-2">Account Deletion</h3>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button 
                type="button" 
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageErrorBoundary(ProfileSettings, { pageName: 'ProfileSettings' });
