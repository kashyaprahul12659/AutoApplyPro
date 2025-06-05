/**
 * Button Utilities
 * Provides consistent loading state handling for buttons across the application
 */

import React from 'react';
import Spinner from '../components/common/Spinner';

/**
 * Creates a loading version of button content
 * @param {string} text - The text to show while loading
 * @param {string} size - Size of the spinner (sm, md, lg)
 * @returns {JSX.Element} Loading button content with spinner
 */
export const getLoadingContent = (text = 'Loading...', size = 'sm') => {
  return (
    <span className="flex items-center justify-center">
      <Spinner size={size} className="mr-2" />
      {text}
    </span>
  );
};

/**
 * HOC to add loading state to any button component
 * @param {React.ComponentType} ButtonComponent - The button component to enhance
 * @returns {React.ComponentType} Enhanced button with loading state
 */
export const withLoadingState = (ButtonComponent) => {
  return ({ isLoading, children, disabled, loadingText = 'Loading...', ...props }) => {
    return (
      <ButtonComponent
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? getLoadingContent(loadingText) : children}
      </ButtonComponent>
    );
  };
};

/**
 * Utility to convert any button to a loading button by modifying its text and adding a spinner
 * @param {string} originalText - Original button text
 * @param {boolean} isLoading - Whether button is in loading state
 * @param {string} loadingText - Text to show while loading
 * @returns {JSX.Element|string} Button content (either original or with spinner)
 */
export const getButtonContent = (originalText, isLoading, loadingText = 'Loading...') => {
  if (!isLoading) return originalText;
  
  return getLoadingContent(loadingText);
};

/**
 * Standard loading states for common actions
 */
export const LoadingStates = {
  SUBMIT: 'Submitting...',
  SAVE: 'Saving...',
  LOAD: 'Loading...',
  GENERATE: 'Generating...',
  ANALYZE: 'Analyzing...',
  CONNECT: 'Connecting...',
  PROCESS: 'Processing...',
  DELETE: 'Deleting...',
  AUTOFILL: 'Autofilling...',
};
