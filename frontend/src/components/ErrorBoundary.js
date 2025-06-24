import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(_error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }

    // Special handling for common TypeError issues
    if (error && error.name === 'TypeError') {
      // Handle specific errors related to functions not being callable
      if (
        error.message.includes('is not a function') ||
        error.message.includes('cannot read property') ||
        error.message.includes('undefined is not an object')
      ) {
        console.warn('Function call error detected. This may be caused by an undefined or non-function value being called.', {
          message: error.message,
          stackTrace: error.stack,
          componentStack: errorInfo?.componentStack
        });
      }
    }

    // Update state with error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }
  }
  logErrorToService = (error, errorInfo) => {
    // In a real app, you'd send this to your error tracking service
    // like Sentry, LogRocket, or your own logging endpoint
    try {
      // Enhanced error data for better debugging
      const errorData = {
        message: error.message,
        name: error.name,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        pathname: window.location.pathname,
        userId: this.props.userId || 'anonymous',
        // Add runtime error classification
        errorType: this.classifyError(error),
        // Add component info if available
        component: this.props.componentName || 'Unknown',
        // Add client context
        browserInfo: {
          language: navigator.language,
          platform: navigator.platform,
          screenSize: `${window.screen.width}x${window.screen.height}`
        }
      };
      
      // Use direct POST endpoint defined in server.js
      fetch('/api/client-errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(errorData),
        // Add proper error handling
        credentials: 'include'
      }).catch(err => {
        // Log locally if the API call fails
        console.error('Failed to log error to service:', err);
      });
    } catch (loggingError) {
      console.error('Error while logging error:', loggingError);
    }
  };

  // Helper method to classify common runtime errors
  classifyError = (error) => {
    if (!error) return 'Unknown';
    
    // Type errors (undefined is not a function, etc.)
    if (error.name === 'TypeError') {
      if (error.message.includes('is not a function')) {
        return 'NotAFunctionError';
      }
      if (error.message.includes('cannot read property') || 
          error.message.includes('undefined is not an object')) {
        return 'UndefinedPropertyError';
      }
      return 'TypeError';
    }
    
    // Promise rejections
    if (error.name === 'Error' && error.message.includes('promise')) {
      return 'PromiseRejectionError';
    }
    
    // Network errors
    if (error.name === 'Error' && 
        (error.message.includes('network') || 
         error.message.includes('fetch') ||
         error.message.includes('api'))) {
      return 'NetworkError';
    }
    
    return error.name || 'UnknownError';
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <svg
                className="w-6 h-6 text-red-600"
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
            </div>

            <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
              Oops! Something went wrong
            </h2>

            <p className="text-gray-600 text-center mb-6">
              We're sorry for the inconvenience. An unexpected error occurred.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-4 p-3 bg-red-50 rounded-md border border-red-200">
                <summary className="cursor-pointer text-red-800 font-medium">
                  Error Details (Development)
                </summary>
                <div className="mt-2 text-sm text-red-700">
                  <p><strong>Error:</strong> {this.state.error.message}</p>
                  <pre className="mt-2 text-xs overflow-auto">
                    {this.state.error.stack}
                  </pre>
                  {this.state.errorInfo && (
                    <pre className="mt-2 text-xs overflow-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            <div className="flex space-x-3">
              <button
                onClick={this.handleRetry}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
              >
                Go Home
              </button>
            </div>            <div className="mt-4 text-center">
              <a
                href="mailto:support@autoapplypro.tech"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
