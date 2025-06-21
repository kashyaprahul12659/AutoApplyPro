import React from 'react';
import {
  FaFileUpload,
  FaFileAlt,
  FaChartBar,
  FaHistory,
  FaExclamationTriangle
} from 'react-icons/fa';

/**
 * Reusable empty state component with configurable icon, title, message and action
 */
const EmptyState = ({
  type = 'default',
  title,
  message,
  actionText,
  onAction,
  className = ''
}) => {
  // Determine which icon to show based on type
  const getIcon = () => {
    switch (type) {
      case 'resume':
        return <FaFileUpload className="text-5xl text-gray-400" />;
      case 'coverletter':
        return <FaFileAlt className="text-5xl text-gray-400" />;
      case 'analyzer':
        return <FaChartBar className="text-5xl text-gray-400" />;
      case 'history':
        return <FaHistory className="text-5xl text-gray-400" />;
      case 'error':
        return <FaExclamationTriangle className="text-5xl text-red-400" />;
      default:
        return (
          <svg
            className="text-gray-400 w-12 h-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
    }
  };

  return (
    <div className={`text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 ${className}`}>
      <div className="flex justify-center mb-4">
        {getIcon()}
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{message}</p>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
