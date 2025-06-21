import React from 'react';
import PropTypes from 'prop-types';

/**
 * Enhanced Loading Spinner with multiple styles and modern animations
 *
 * @param {string} size - Size of the spinner (xs, sm, md, lg, xl, 2xl)
 * @param {string} variant - Color variant (primary, secondary, accent, white, dark)
 * @param {string} className - Additional CSS classes
 * @param {string} text - Optional loading text
 * @param {boolean} fullScreen - Whether to take full screen
 * @param {boolean} overlay - Whether to show as overlay
 * @param {string} type - Spinner type (circle, dots, pulse, bars)
 */
const LoadingSpinner = ({
  size = 'md',
  variant = 'primary',
  className = '',
  text = '',
  fullScreen = false,
  overlay = false,
  type = 'circle'
}) => {
  // Size mappings
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-24 h-24'
  };

  // Enhanced color mappings
  const variantClasses = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    accent: 'text-accent-600',
    white: 'text-white',
    dark: 'text-neutral-800'
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;
  const spinnerColor = variantClasses[variant] || variantClasses.primary;

  // Different spinner types
  const renderSpinner = () => {
    switch (type) {
      case 'dots':
        return (
          <div className={`flex space-x-1 ${className}`}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${spinnerColor} rounded-full animate-pulse-soft`}
                style={{
                  width: size === 'xs' ? '4px' : size === 'sm' ? '6px' : '8px',
                  height: size === 'xs' ? '4px' : size === 'sm' ? '6px' : '8px',
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <div className={`${spinnerSize} ${spinnerColor} relative ${className}`}>
            <div className="absolute inset-0 rounded-full bg-current opacity-20 animate-ping"></div>
            <div className="absolute inset-0 rounded-full bg-current opacity-40"></div>
          </div>
        );

      case 'bars':
        return (
          <div className={`flex space-x-1 items-end ${className}`}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`${spinnerColor} bg-current animate-bounce-subtle`}
                style={{
                  width: size === 'xs' ? '2px' : size === 'sm' ? '3px' : '4px',
                  height: size === 'xs' ? '8px' : size === 'sm' ? '12px' : '16px',
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        );

      case 'circle':
      default:
        return (
          <svg
            className={`animate-spin ${spinnerSize} ${spinnerColor} ${className}`}
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
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        );
    }
  };

  const content = (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? 'min-h-screen' : ''}`}>
      {renderSpinner()}

      {text && (
        <p className={`mt-4 text-sm font-medium ${spinnerColor} animate-pulse-soft`}>
          {text}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'accent', 'white', 'dark']),
  className: PropTypes.string,
  text: PropTypes.string,
  fullScreen: PropTypes.bool,
  overlay: PropTypes.bool,
  type: PropTypes.oneOf(['circle', 'dots', 'pulse', 'bars'])
};

export default LoadingSpinner;
