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
      
      // Also check for extension-specific DOM elements or global variables
      const checkDOMForExtension = () => {
        // Check for extension-injected elements
        const extensionElement = document.querySelector('[data-autoapply-extension]');
        const extensionScript = document.querySelector('script[data-extension-id]');
        
        if (extensionElement || extensionScript || window.autoApplyExtension) {
          setExtensionStatus('installed');
          window.removeEventListener('message', handleMessage);
          return true;
        }
        return false;
      };
      
      // Check immediately
      if (checkDOMForExtension()) return;
      
      // If no response after 2 seconds, assume extension is not installed
      setTimeout(() => {
        if (extensionStatus === 'checking') {
          // One more DOM check before marking as not installed
          if (!checkDOMForExtension()) {
            setExtensionStatus('not-installed');
          }
          window.removeEventListener('message', handleMessage);
        }
      }, 2000);
      
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
  
  if (extensionStatus === 'installed') {    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-green-800">Extension Connected! 🎉</h3>
            <div className="mt-1 text-sm text-green-700">
              Your AutoApply Pro extension is active and ready to help you apply to jobs faster.
            </div>
            <div className="mt-2 flex items-center space-x-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✓ Connected
              </span>
              <button 
                onClick={() => setExtensionStatus('checking')}
                className="text-sm text-green-600 hover:text-green-800 font-medium"
              >
                Refresh Status
              </button>
            </div>
          </div>
        </div>
      </div>
    );  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        <div className="ml-4 flex-1">
          <h3 className="text-lg font-semibold text-amber-800">Extension Not Detected</h3>
          <div className="mt-1 text-sm text-amber-700">
            <p className="mb-3">Install the AutoApply Pro Chrome extension to automatically fill job applications with your profile data.</p>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <a 
                  href="/autoapply-extension.zip" 
                  download 
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  <svg className="mr-2 -ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Extension
                </a>
                <button 
                  onClick={() => {
                    const modal = document.createElement('div');
                    modal.innerHTML = `
                      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div class="bg-white rounded-lg p-6 max-w-md mx-4">
                          <h3 class="text-lg font-semibold mb-4">Installation Instructions</h3>
                          <ol class="list-decimal list-inside space-y-2 text-sm">
                            <li>Download the extension file</li>
                            <li>Open Chrome and go to chrome://extensions/</li>
                            <li>Enable "Developer mode" in the top right</li>
                            <li>Click "Load unpacked" and select the extension folder</li>
                            <li>Refresh this page to verify installation</li>
                          </ol>
                          <button onclick="this.closest('.fixed').remove()" class="mt-4 w-full bg-primary-600 text-white py-2 rounded">
                            Got it!
                          </button>
                        </div>
                      </div>
                    `;
                    document.body.appendChild(modal);
                  }}
                  className="inline-flex items-center justify-center px-4 py-2 border border-amber-300 text-sm font-medium rounded-lg text-amber-800 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
                >
                  <svg className="mr-2 -ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Installation Help
                </button>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-amber-600">Status: Not Connected</span>
                <button 
                  onClick={() => setExtensionStatus('checking')}
                  className="text-xs text-amber-600 hover:text-amber-800 font-medium"
                >
                  Check Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ExtensionDetector;

