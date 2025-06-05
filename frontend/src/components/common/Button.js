import React from 'react';
import PropTypes from 'prop-types';
import Spinner from './Spinner';

/**
 * Button component with built-in loading state
 * 
 * @param {Object} props
 * @param {string} props.type - Button type (primary, secondary, success, danger, warning, info, light, dark)
 * @param {string} props.size - Button size (sm, md, lg)
 * @param {boolean} props.isLoading - Whether the button is in loading state
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {string} props.className - Additional classes
 * @param {function} props.onClick - Click handler
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.loadingText - Text to show while loading (defaults to "Loading...")
 * @param {string} props.htmlType - HTML button type (button, submit, reset)
 */
const Button = ({
  type = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  onClick,
  children,
  loadingText = 'Loading...',
  htmlType = 'button',
  ...rest
}) => {
  // Base button classes
  const baseClasses = 'font-medium rounded-lg focus:ring-2 focus:outline-none transition-all duration-200';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-2.5 text-lg'
  };
  
  // Type classes
  const typeClasses = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-300',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-300',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-300',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-300',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-300',
    info: 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-300',
    light: 'bg-gray-200 hover:bg-gray-300 text-gray-700 focus:ring-gray-200',
    dark: 'bg-gray-800 hover:bg-gray-900 text-white focus:ring-gray-500',
    // Outline variants
    'outline-primary': 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-300',
    'outline-secondary': 'border border-gray-500 text-gray-500 hover:bg-gray-50 focus:ring-gray-300',
  };
  
  // Disabled styles
  const disabledClasses = 'opacity-60 cursor-not-allowed';
  
  // Combine all classes
  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size] || sizeClasses.md}
    ${typeClasses[type] || typeClasses.primary}
    ${(disabled || isLoading) ? disabledClasses : ''}
    ${className}
  `;
  
  return (
    <button
      type={htmlType}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <Spinner size="sm" className="mr-2" />
          {loadingText}
        </span>
      ) : children}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.oneOf([
    'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark',
    'outline-primary', 'outline-secondary'
  ]),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  loadingText: PropTypes.string,
  htmlType: PropTypes.oneOf(['button', 'submit', 'reset'])
};

export default Button;
