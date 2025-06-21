import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable tooltip component with enhanced mobile support and accessibility
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The element that triggers the tooltip
 * @param {string} props.text - Tooltip content
 * @param {string} props.position - Tooltip position (top, bottom, left, right)
 * @param {number} props.delay - Delay before showing tooltip (in ms)
 * @param {string} props.className - Additional classes for the wrapper
 * @param {boolean} props.showOnClick - Whether to show tooltip on click (for mobile)
 * @param {string} props.theme - Color theme (dark, light, indigo)
 */
const Tooltip = ({
  children,
  text,
  position = 'top',
  delay = 400,
  className = '',
  showOnClick = false,
  theme = 'dark'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);
  const tooltipRef = useRef(null);

  // Determine background and text colors based on theme
  const themeStyles = {
    dark: 'bg-gray-900 text-white',
    light: 'bg-white text-gray-900 border border-gray-200',
    indigo: 'bg-indigo-600 text-white'
  };

  const bgColor = themeStyles[theme] || themeStyles.dark;
  const arrowColor = theme === 'light' ? 'bg-white border border-gray-200' :
    theme === 'indigo' ? 'bg-indigo-600' : 'bg-gray-900';

  const showTip = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTip = () => {
    clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  const toggleTip = () => {
    setIsVisible(prev => !prev);
  };

  // Handle clicks outside to dismiss tooltip
  useEffect(() => {
    if (isVisible && showOnClick) {
      const handleOutsideClick = (event) => {
        if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
          hideTip();
        }
      };

      document.addEventListener('mousedown', handleOutsideClick);
      return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
      };
    }
  }, [isVisible, showOnClick]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const eventHandlers = showOnClick
    ? { onClick: toggleTip }
    : {
      onMouseEnter: showTip,
      onMouseLeave: hideTip,
      onFocus: showTip,
      onBlur: hideTip,
      onTouchStart: showTip
    };

  return (
    <div
      ref={tooltipRef}
      className={`relative inline-flex ${className}`}
      {...eventHandlers}
      aria-describedby={isVisible ? 'tooltip' : undefined}
    >
      {React.cloneElement(children, {
        'aria-label': text,
        className: `${children.props.className || ''} ${showOnClick ? 'cursor-pointer' : ''}`.trim()
      })}

      {isVisible && (
        <div
          id="tooltip"
          className={`
            absolute z-50 px-3 py-2 text-sm font-medium rounded-md shadow-md
            ${bgColor}
            max-w-xs
            ${position === 'top' ? 'bottom-full left-1/2 transform -translate-x-1/2 mb-2' : ''}
            ${position === 'bottom' ? 'top-full left-1/2 transform -translate-x-1/2 mt-2' : ''}
            ${position === 'left' ? 'right-full top-1/2 transform -translate-y-1/2 mr-2' : ''}
            ${position === 'right' ? 'left-full top-1/2 transform -translate-y-1/2 ml-2' : ''}
          `}
          role="tooltip"
          aria-hidden={!isVisible}
        >
          {text}
          <div
            className={`
              absolute w-2 h-2 transform rotate-45
              ${arrowColor}
              ${position === 'top' ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2' : ''}
              ${position === 'bottom' ? 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2' : ''}
              ${position === 'left' ? 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2' : ''}
              ${position === 'right' ? 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2' : ''}
            `}
          />
        </div>
      )}
    </div>
  );
};

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  delay: PropTypes.number,
  className: PropTypes.string,
  showOnClick: PropTypes.bool,
  theme: PropTypes.oneOf(['dark', 'light', 'indigo'])
};

export default Tooltip;
