import React from 'react';

const Loader = ({ size = 'medium', color = 'blue' }) => {
  // Size classes
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  // Color classes
  const colorClasses = {
    blue: 'border-blue-500',
    gray: 'border-gray-500',
    green: 'border-green-500',
    red: 'border-red-500',
    purple: 'border-purple-500'
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} border-2 border-t-transparent ${colorClasses[color]}`}
      />
    </div>
  );
};

export default Loader;
