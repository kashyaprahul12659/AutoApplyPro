import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const ExtensionDetector = () => {
  const [extensionStatus, setExtensionStatus] = useState('checking'); // 'checking', 'installed', 'not-installed', 'error'
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const checkExtension = async () => {
    return new Promise((resolve) => {
      // Send message to extension
      const messageId = Date.now().toString();
      
      const handleMessage = (event) => {
        if (event.source !== window || !event.data.type) return;
        
        if (event.data.type === 'AUTOAPPLY_EXTENSION_RESPONSE' && event.data.messageId === messageId) {
          window.removeEventListener('message', handleMessage);
          resolve(true);
        }
      };

      window.addEventListener('message', handleMessage);
      
      // Send message to extension
      window.postMessage({
        type: 'AUTOAPPLY_EXTENSION_CHECK',
        messageId: messageId
      }, '*');

      // Timeout after 3 seconds
      setTimeout(() => {
        window.removeEventListener('message', handleMessage);
        resolve(false);
      }, 3000);
    });
  };

  const detectExtension = async () => {
    setExtensionStatus('checking');
    
    try {
      const isInstalled = await checkExtension();
      setExtensionStatus(isInstalled ? 'installed' : 'not-installed');
    } catch (error) {
      console.error('Extension detection error:', error);
      setExtensionStatus('error');
    }
  };

  const handleRetry = async () => {
    if (retryCount >= maxRetries) return;
    
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    await detectExtension();
    
    setIsRetrying(false);
  };

  const handleInstallExtension = () => {
    // Download the extension
    const link = document.createElement('a');
    link.href = '/autoapply-extension.zip';
    link.download = 'autoapply-extension.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show instructions
    alert(`Extension downloaded! To install:
1. Extract the ZIP file
2. Open Chrome and go to chrome://extensions/
3. Enable "Developer mode" (top right)
4. Click "Load unpacked" and select the extracted folder
5. Refresh this page to verify installation`);
  };

  useEffect(() => {
    detectExtension();
  }, []);

  const renderStatus = () => {
    switch (extensionStatus) {
      case 'checking':
        return (
          <div className="flex items-center space-x-2 text-blue-600">
            <ArrowPathIcon className="h-5 w-5 animate-spin" />
            <span>Checking extension...</span>
          </div>
        );
        
      case 'installed':
        return (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircleIcon className="h-5 w-5" />
            <span>Extension connected!</span>
          </div>
        );
        
      case 'not-installed':
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-amber-600">
              <ExclamationTriangleIcon className="h-5 w-5" />
              <span>Extension not detected</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleInstallExtension}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Download Extension
              </button>
              {retryCount < maxRetries && (
                <button
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm disabled:opacity-50"
                >
                  {isRetrying ? 'Retrying...' : `Retry (${retryCount}/${maxRetries})`}
                </button>
              )}
            </div>
          </div>
        );
        
      case 'error':
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-red-600">
              <ExclamationTriangleIcon className="h-5 w-5" />
              <span>Extension check failed</span>
            </div>
            {retryCount < maxRetries && (
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm disabled:opacity-50"
              >
                {isRetrying ? 'Retrying...' : `Retry (${retryCount}/${maxRetries})`}
              </button>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Browser Extension</h3>
      {renderStatus()}
      
      {extensionStatus === 'not-installed' && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Installation Instructions:</h4>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Download the extension using the button above</li>
            <li>2. Extract the ZIP file to a folder</li>
            <li>3. Open Chrome and navigate to chrome://extensions/</li>
            <li>4. Enable "Developer mode" (toggle in top right)</li>
            <li>5. Click "Load unpacked" and select the extracted folder</li>
            <li>6. Refresh this page to verify installation</li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default ExtensionDetector;
