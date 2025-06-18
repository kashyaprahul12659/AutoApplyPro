import React from 'react';
import ErrorBoundary from './ErrorBoundary';

/**
 * Higher-order component that wraps components with error boundary
 */
const withErrorBoundary = (WrappedComponent, fallback = null) => {
  return function WithErrorBoundaryComponent(props) {
    return (
      <ErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
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
