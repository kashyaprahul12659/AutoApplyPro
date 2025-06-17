import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Button from '../components/common/Button';
import ProBadge from '../components/common/ProBadge';
import ToastService from '../services/ToastService';

/**
 * Test Autofill Page
 * A developer tool to test the autofill functionality of the extension
 */
const TestAutofill = () => {
  const [extensionInstalled, setExtensionInstalled] = useState(false);
  const [extensionVersion, setExtensionVersion] = useState(null);
  const [isDetecting, setIsDetecting] = useState(true);
  
  // Check for extension installation
  useEffect(() => {
    // Listen for messages from the extension
    const handleExtensionMessage = (event) => {
      if (event.data && event.data.type === 'AUTOAPPLY_EXTENSION_RESPONSE') {
        setExtensionInstalled(true);
        setExtensionVersion(event.data.version);
        setIsDetecting(false);
      }
    };
    
    window.addEventListener('message', handleExtensionMessage);
    
    // Send message to check for extension
    window.postMessage({ type: 'AUTOAPPLY_CHECK_EXTENSION' }, '*');
    
    // Set timeout to end detection after 2 seconds
    const timer = setTimeout(() => {
      setIsDetecting(false);
    }, 2000);
    
    return () => {
      window.removeEventListener('message', handleExtensionMessage);
      clearTimeout(timer);
    };
  }, []);
  
  const handleTestForm = () => {
    ToastService.info('Fill this form using the AutoApply Pro extension');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>Test Autofill - AutoApply Pro</title>
        <meta name="description" content="Test the autofill functionality of AutoApply Pro extension" />
      </Helmet>
      
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Extension Test Page</h1>
        <div className="flex items-center">
          {extensionInstalled ? (
            <div className="flex items-center text-sm">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Extension Detected v{extensionVersion}
              </span>
            </div>
          ) : isDetecting ? (
            <div className="text-sm text-gray-500">Detecting extension...</div>
          ) : (
            <div className="flex items-center text-sm">
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Extension Not Detected
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Test Autofill Form</h2>
          <Button 
            type="primary" 
            size="sm" 
            onClick={handleTestForm}
            disabled={!extensionInstalled}
          >
            How to Use
          </Button>
        </div>
        
        <div className="text-sm text-gray-600 mb-4">
          This page contains a sample job application form to test the autofill functionality of the AutoApply Pro extension.
          If the extension is installed and you're logged in, use the extension's popup to autofill this form.
        </div>
        
        <form className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information Section */}
            <div className="col-span-2">
              <h3 className="text-md font-medium mb-4 flex items-center">
                Personal Information 
                <span className="ml-2 text-xs text-gray-500">(Required)</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input 
                    type="text" 
                    name="first_name" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input 
                    type="text" 
                    name="last_name" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Address Section */}
            <div className="col-span-2">
              <h3 className="text-md font-medium mb-4">Address Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input 
                    type="text" 
                    name="address" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input 
                    type="text" 
                    name="city" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                  <input 
                    type="text" 
                    name="state" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP/Postal Code</label>
                  <input 
                    type="text" 
                    name="zip_code" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <select 
                    name="country" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="IN">India</option>
                    <option value="SG">Singapore</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Professional Information */}
            <div className="col-span-2">
              <h3 className="text-md font-medium mb-4">Professional Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Professional Title</label>
                  <input 
                    type="text" 
                    name="headline" 
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                  <input 
                    type="url" 
                    name="linkedin" 
                    placeholder="https://linkedin.com/in/yourname"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                  <select 
                    name="experience" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Experience</option>
                    <option value="0-1">Less than 1 year</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
                  <select 
                    name="education" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Education</option>
                    <option value="high_school">High School</option>
                    <option value="associate">Associate's Degree</option>
                    <option value="bachelor">Bachelor's Degree</option>
                    <option value="master">Master's Degree</option>
                    <option value="phd">PhD</option>
                  </select>
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                  <textarea 
                    name="skills" 
                    rows="3"
                    placeholder="List your key skills, separated by commas"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  ></textarea>
                </div>
              </div>
            </div>
            
            {/* Work Authorization */}
            <div className="col-span-2">
              <h3 className="text-md font-medium mb-4">Work Authorization</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Are you legally authorized to work in the United States?</label>
                <div className="flex space-x-4 mt-2">
                  <label className="flex items-center">
                    <input type="radio" name="work_authorization" value="yes" className="mr-2" />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="work_authorization" value="no" className="mr-2" />
                    <span>No</span>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Additional Information */}
            <div className="col-span-2">
              <h3 className="text-md font-medium mb-4">Additional Information</h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">How did you hear about us?</label>
                  <select 
                    name="source" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Option</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="indeed">Indeed</option>
                    <option value="glassdoor">Glassdoor</option>
                    <option value="referral">Referral</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter / Additional Comments</label>
                  <textarea 
                    name="cover_letter" 
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button 
              type="light" 
              htmlType="reset"
            >
              Reset Form
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              onClick={(e) => {
                e.preventDefault();
                ToastService.success('Form submitted successfully! (Test only)');
              }}
            >
              Submit Application
            </Button>
          </div>
        </form>
      </div>
      
      <div className="bg-indigo-50 rounded-lg p-4 text-sm">
        <p className="font-medium mb-2">Developer Notes:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>This page is for testing the extension's autofill functionality</li>
          <li>Use it to verify field mapping and detection across different field types</li>
          <li>To test: open the extension popup and click "Autofill"</li>
          <li>Pro features can be tested with a <ProBadge /> account</li>
        </ul>
      </div>
    </div>
  );
};

export default TestAutofill;
