import React, { useState, useEffect } from 'react';

const ExtensionDetector = () => {
  const [extensionStatus, setExtensionStatus] = useState('checking');
  
  useEffect(() => {
    // Check if the extension is installed
    const checkExtension = () => {
      // Set up a listener for extension response
      const handleMessage = (event) => {
        if (
          event.source === window &&
          event.data.type === 'AUTOAPPLY_EXTENSION_RESPONSE'
        ) {
          setExtensionStatus('installed');
          window.removeEventListener('message', handleMessage);
        }
      };
      
      window.addEventListener('message', handleMessage);
      
      // Send a message to check if the extension is installed
      window.postMessage(
        { type: 'AUTOAPPLY_CHECK_EXTENSION' },
        window.location.origin
      );
      
      // If no response after 1 second, assume extension is not installed
      setTimeout(() => {
        if (extensionStatus === 'checking') {
          setExtensionStatus('not-installed');
          window.removeEventListener('message', handleMessage);
        }
      }, 1000);
      
      return () => {
        window.removeEventListener('message', handleMessage);
      };
    };
    
    checkExtension();
  }, [extensionStatus]);
  
  if (extensionStatus === 'checking') {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 animate-pulse">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-700">Checking extension status...</h3>
          </div>
        </div>
      </div>
    );
  }
  
  if (extensionStatus === 'installed') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">AutoApply Pro Extension Installed</h3>
            <div className="mt-1 text-sm text-green-700">
              You're all set! You can now use the extension to autofill job applications.
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg className="h-6 w-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">AutoApply Pro Extension Not Detected</h3>
          <div className="mt-1 text-sm text-yellow-700">
            <p>The AutoApply Pro Chrome extension is not installed. Install it to autofill job applications with your profile data.</p>
            <div className="mt-3 flex flex-col space-y-2">
              <a 
                href="/autoapply-extension.zip" 
                download 
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="mr-2 -ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Extension
              </a>
              <button 
                onClick={() => window.open('chrome://extensions/', '_blank')}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="mr-2 -ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Installation Instructions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtensionDetector;
