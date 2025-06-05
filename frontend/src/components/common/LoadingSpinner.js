import React from 'react';

/**
 * Loading Spinner Component
 * Displays a loading spinner with customizable size
 * 
 * @param {string} size - Size of the spinner (sm, md, lg)
 * @param {string} color - Color of the spinner (primary, secondary, white)
 */
const LoadingSpinner = ({ size = 'md', color = 'primary' }) => {
  // Size mappings
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };
  
  // Color mappings
  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white'
  };
  
  const spinnerSize = sizeClasses[size] || sizeClasses.md;
  const spinnerColor = colorClasses[color] || colorClasses.primary;
  
  return (
    <div className="flex justify-center items-center">
      <svg 
        className={`animate-spin ${spinnerSize} ${spinnerColor}`} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
        data-testid="loading-spinner"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        ></circle>
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );
};

export default LoadingSpinner;
