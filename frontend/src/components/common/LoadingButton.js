import React from 'react';
import PropTypes from 'prop-types';

/**
 * LoadingButton - A button component with loading state
 * Provides consistent loading state UI across the application
 */
const LoadingButton = ({
  isLoading,
  loadingText = 'Loading...',
  children,
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  // Determine button style based on variant
  const getButtonStyle = () => {
    const baseStyle = 'rounded-md font-medium focus:outline-none transition-all duration-150 inline-flex items-center justify-center';
    const sizeClasses = {
      sm: 'py-1.5 px-3 text-sm',
      md: 'py-2 px-4 text-base',
      lg: 'py-2.5 px-5 text-lg'
    };

    const variantClasses = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:bg-blue-300',
      secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:bg-gray-100 disabled:text-gray-400',
      outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50 disabled:border-blue-300 disabled:text-blue-300',
      danger: 'bg-red-600 hover:bg-red-700 text-white disabled:bg-red-300',
      success: 'bg-green-600 hover:bg-green-700 text-white disabled:bg-green-300'
    };

    return `${baseStyle} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
  };

  // Actual button component with loading state
  return (
    <button
      type={type}
      className={getButtonStyle()}
      disabled={isLoading || disabled}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
};

LoadingButton.propTypes = {
  isLoading: PropTypes.bool,
  loadingText: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'danger', 'success']),
  size: PropTypes.oneOf(['sm', 'md', 'lg'])
};

export default LoadingButton;
