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
    WrappedComponent?.displayName || 
    WrappedComponent?.name || 
    'AnonymousComponent';
    
  // Create the wrapped component with error boundary
  const WithErrorBoundaryComponent = function(props) {
    // Add defensive check for props that might be undefined
    const safeProps = props || {};
    
    // Check if the component is valid
    if (!WrappedComponent || typeof WrappedComponent !== 'function') {
      console.error(`Error in withErrorBoundary: Invalid component ${componentName}`);
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">Component error: Invalid component reference</p>
        </div>
      );
    }
    
    // Add error handler for render errors
    const handleRenderError = (error) => {
      console.error(`Error rendering ${componentName}:`, error);
      
      // Return a simple error display to prevent cascading failures
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">Component rendering error</p>
        </div>
      );
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
    <ErrorBoundary 
      userId={null} 
      pageName={pageName}
      fallback={({error}) => (
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Page Error</h2>
          <p className="text-red-600 mb-4">Sorry, something went wrong loading this page</p>
          <p className="text-gray-700 mb-6 text-center max-w-md">
            {error?.message || 'An unexpected error occurred'}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Refresh Page
          </button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
};

/**
 * Component-level error boundary with inline fallback
 */
export const ComponentErrorBoundary = ({ children, fallback, componentName = "Component" }) => {
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
          {componentName} error. Please refresh the page.
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
