import React from 'react';
import { PageErrorBoundary } from '../../components/withErrorBoundary';
import {
  QuestionMarkCircleIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const HelpCenter = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Help Center</h1>
        <p className="text-gray-600">Find answers to common questions and get support</p>
      </div>

      {/* Search */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <QuestionMarkCircleIcon className="h-8 w-8 text-primary-600" />
          </div>
          <div className="flex-grow">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">How can we help you?</h2>
            <div className="mt-2 relative">
              <input
                type="text"
                placeholder="Search for help articles, tutorials, or FAQs..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 pr-10"
              />
              <button className="absolute inset-y-0 right-0 px-3 flex items-center">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Quick Help Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 p-1.5 bg-primary-100 rounded-lg">
              <BookOpenIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Guides & Tutorials</h3>
              <p className="text-sm text-gray-600 mb-3">Step-by-step instructions on using AutoApply Pro.</p>
              <ul className="space-y-2">
                <li>
                  <a href="/help/tutorial/getting-started" className="text-primary-600 hover:text-primary-700 text-sm font-medium">Getting Started Guide</a>
                </li>
                <li>
                  <a href="/help/tutorial/resume-builder" className="text-primary-600 hover:text-primary-700 text-sm font-medium">Resume Builder Tutorial</a>
                </li>
                <li>
                  <a href="/help/tutorial/job-tracking" className="text-primary-600 hover:text-primary-700 text-sm font-medium">Job Tracker Guide</a>
                </li>
                <li>
                  <a href="/help/tutorial/all" className="text-primary-600 hover:text-primary-700 text-sm font-medium">View All Tutorials →</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 p-1.5 bg-blue-100 rounded-lg">
              <AcademicCapIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">FAQs</h3>
              <p className="text-sm text-gray-600 mb-3">Quick answers to common questions.</p>
              <ul className="space-y-2">
                <li>
                  <a href="/help/faq/subscription" className="text-primary-600 hover:text-primary-700 text-sm font-medium">Subscription & Billing</a>
                </li>
                <li>
                  <a href="/help/faq/extension" className="text-primary-600 hover:text-primary-700 text-sm font-medium">Chrome Extension</a>
                </li>
                <li>
                  <a href="/help/faq/privacy" className="text-primary-600 hover:text-primary-700 text-sm font-medium">Privacy & Data</a>
                </li>
                <li>
                  <a href="/help/faq/all" className="text-primary-600 hover:text-primary-700 text-sm font-medium">View All FAQs →</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Help Topics */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular Help Topics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/help/topic/chrome-extension-installation" className="block p-4 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-primary-300 transition">
            <h3 className="font-medium text-gray-900">Chrome Extension Installation</h3>
            <p className="text-sm text-gray-600 mt-1">How to install and set up the AutoApply Chrome Extension.</p>
          </a>
          <a href="/help/topic/account-setup" className="block p-4 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-primary-300 transition">
            <h3 className="font-medium text-gray-900">Account Setup</h3>
            <p className="text-sm text-gray-600 mt-1">Complete your profile and account setup.</p>
          </a>
          <a href="/help/topic/subscription-management" className="block p-4 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-primary-300 transition">
            <h3 className="font-medium text-gray-900">Subscription Management</h3>
            <p className="text-sm text-gray-600 mt-1">Change, upgrade or cancel your subscription plan.</p>
          </a>
          <a href="/help/topic/cover-letter-generation" className="block p-4 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-primary-300 transition">
            <h3 className="font-medium text-gray-900">AI Cover Letter Generation</h3>
            <p className="text-sm text-gray-600 mt-1">How to create personalized cover letters with our AI.</p>
          </a>
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-primary-600" />
          </div>
          <div className="flex-grow">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Contact Support</h2>
            <p className="text-gray-600 mb-4">Can't find what you're looking for? Our support team is here to help.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-md p-4 hover:border-primary-300 hover:bg-gray-50 transition">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <EnvelopeIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Email Support</h3>
                    <p className="text-sm text-gray-600 mt-1">support@autoapplypro.tech</p>
                    <p className="text-xs text-gray-500 mt-1">Typically responds within 24 hours</p>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-md p-4 hover:border-primary-300 hover:bg-gray-50 transition">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <PhoneIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Phone Support</h3>
                    <p className="text-sm text-gray-600 mt-1">+1 (800) 123-4567</p>
                    <p className="text-xs text-gray-500 mt-1">Mon-Fri, 9am-5pm EST</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium text-gray-900 mb-3">Submit a Request</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Brief description of your issue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Please provide details about your issue..."
                    rows="4"
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageErrorBoundary(HelpCenter, { pageName: 'HelpCenter' });
