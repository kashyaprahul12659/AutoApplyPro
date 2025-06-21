import React from 'react';
import PropTypes from 'prop-types';
import { FaCheckCircle, FaSpinner, FaExclamationCircle, FaClock } from 'react-icons/fa';

/**
 * StatusIndicator - Shows the current status of an operation with appropriate icons
 * Used for profile sync status, API operations, etc.
 */
const StatusIndicator = ({
  status,
  text,
  className = '',
  showIcon = true,
  timestamp = null,
  variant = 'default'
}) => {
  // Get icon and color based on status
  const getStatusDisplay = () => {
    switch (status) {
      case 'success':
        return {
          icon: <FaCheckCircle className="text-green-500" />,
          textColor: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'loading':
        return {
          icon: <FaSpinner className="animate-spin text-blue-500" />,
          textColor: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
      case 'error':
        return {
          icon: <FaExclamationCircle className="text-red-500" />,
          textColor: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      case 'idle':
      default:
        return {
          icon: <FaClock className="text-gray-500" />,
          textColor: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const { icon, textColor, bgColor, borderColor } = getStatusDisplay();

  // Format the timestamp if provided
  const formattedTime = timestamp ? new Date(timestamp).toLocaleTimeString() : null;

  // Component variations
  const wrapperClasses = variant === 'compact'
    ? `inline-flex items-center ${className}`
    : `flex items-center rounded-md p-2 ${bgColor} ${borderColor} border ${className}`;

  return (
    <div className={wrapperClasses}>
      {showIcon && (
        <span className="flex-shrink-0 mr-2">{icon}</span>
      )}
      <span className={`text-sm ${textColor}`}>
        {text}
        {timestamp && variant !== 'compact' && (
          <span className="text-xs ml-2 text-gray-500">
            at {formattedTime}
          </span>
        )}
      </span>
    </div>
  );
};

StatusIndicator.propTypes = {
  status: PropTypes.oneOf(['success', 'loading', 'error', 'idle']).isRequired,
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
  showIcon: PropTypes.bool,
  timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
  variant: PropTypes.oneOf(['default', 'compact'])
};

export default StatusIndicator;
