import React from 'react';
import { FaExclamationTriangle, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';

const AlertMessage = ({ 
  type = 'info', 
  title, 
  message, 
  onDismiss,
  showIcon = true,
  className = ''
}) => {
  const getAlertStyles = () => {
    switch (type) {
      case 'error':
        return {
          container: 'bg-red-50 border-l-4 border-red-500 text-red-700',
          icon: <FaExclamationTriangle className="text-red-500" />
        };
      case 'success':
        return {
          container: 'bg-green-50 border-l-4 border-green-500 text-green-700',
          icon: <FaCheckCircle className="text-green-500" />
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700',
          icon: <FaExclamationTriangle className="text-yellow-500" />
        };
      case 'info':
      default:
        return {
          container: 'bg-blue-50 border-l-4 border-blue-500 text-blue-700',
          icon: <FaInfoCircle className="text-blue-500" />
        };
    }
  };

  const styles = getAlertStyles();

  return (
    <div className={`${styles.container} p-4 my-4 rounded ${className}`} role="alert">
      <div className="flex">
        {showIcon && (
          <div className="flex-shrink-0 mr-3">
            {styles.icon}
          </div>
        )}
        <div>
          {title && <h3 className="font-medium mb-1">{title}</h3>}
          <p className="text-sm">{message}</p>
        </div>
        {onDismiss && (
          <button 
            onClick={onDismiss} 
            className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 hover:bg-opacity-20 hover:bg-gray-500"
            aria-label="Close"
          >
            <span className="sr-only">Close</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertMessage;
