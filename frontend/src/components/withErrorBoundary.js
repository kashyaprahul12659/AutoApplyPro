import React from 'react';
import ErrorBoundary from './ErrorBoundary';

/**
 * Higher-order component that wraps components with error boundary
 * Enhanced with component name tracking and defensive programming
 */
const withErrorBoundary = (WrappedComponent, options = {}) => {
  // Handle both legacy fallback-only usage and new options object
  const fallback = typeof options === 'function' || React.isValidElement(options) 
    ? options 
    : options.fallback || null;
    
  // Get component display name for better error reporting
  const componentName = 
    WrappedComponent.displayName || 
    WrappedComponent.name || 
    'AnonymousComponent';
    
  // Create the wrapped component with error boundary
  const WithErrorBoundaryComponent = function(props) {
    // Add defensive check for props that might be undefined
    const safeProps = props || {};
    
    // Add error handler for render errors
    const handleRenderError = (error) => {
      console.error(`Error rendering ${componentName}:`, error);
      return null; // Prevent cascading failures
    };
    
    try {
      return (
        <ErrorBoundary 
          fallback={fallback} 
          componentName={componentName}
          userId={safeProps.userId || safeProps.user?.id} // Extract user ID from props if available
        >
          <WrappedComponent {...safeProps} />
        </ErrorBoundary>
      );
    } catch (error) {
      return handleRenderError(error);
    }
  };
  
  // Set display name for better debugging
  WithErrorBoundaryComponent.displayName = `WithErrorBoundary(${componentName})`;
  
  return WithErrorBoundaryComponent;
};

/**
 * Page-level error boundary with custom fallback
 */
export const PageErrorBoundary = ({ children, pageName }) => {
  return (
    <ErrorBoundary userId={null} pageName={pageName}>
      {children}
    </ErrorBoundary>
  );
};

/**
 * Component-level error boundary with inline fallback
 */
export const ComponentErrorBoundary = ({ children, fallback }) => {
  const defaultFallback = (
    <div className="p-4 bg-red-50 border border-red-200 rounded-md">
      <div className="flex items-center">
        <svg
          className="w-5 h-5 text-red-600 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <p className="text-red-800 text-sm">
          Something went wrong with this component. Please refresh the page.
        </p>
      </div>
    </div>
  );

  return (
    <ErrorBoundary fallback={fallback || defaultFallback}>
      {children}
    </ErrorBoundary>
  );
};

export default withErrorBoundary;
