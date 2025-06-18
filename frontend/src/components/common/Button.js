import React from 'react';
import PropTypes from 'prop-types';
import Spinner from './Spinner';

/**
 * Enhanced Button component with modern design system
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  onClick,
  children,
  leftIcon,
  rightIcon,
  loadingText,
  htmlType = 'button',
  fullWidth = false,
  ...rest
}) => {
  const baseClasses = 'btn focus-ring';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    danger: 'btn-danger'
  };
  
  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
    xl: 'btn-xl'
  };
  
  const buttonClasses = [
    baseClasses,
    variantClasses[variant] || variantClasses.primary,
    sizeClasses[size] || '',
    fullWidth ? 'w-full' : '',
    isLoading ? 'cursor-wait' : '',
    className
  ].filter(Boolean).join(' ');
  
  const handleClick = (e) => {
    if (!disabled && !isLoading && onClick) {
      onClick(e);
    }
  };
  
  return (
    <button
      type={htmlType}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && <Spinner size="sm" className="mr-2" />}
      {!isLoading && leftIcon && <span className="mr-2 flex-shrink-0">{leftIcon}</span>}
      <span className="flex-1">{isLoading ? (loadingText || 'Loading...') : children}</span>
      {!isLoading && rightIcon && <span className="ml-2 flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'accent', 'outline', 'ghost', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  loadingText: PropTypes.string,
  htmlType: PropTypes.oneOf(['button', 'submit', 'reset']),
  fullWidth: PropTypes.bool,
};

export default Button;
