import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-2xl font-semibold text-gray-600 mb-8">Page Not Found</p>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary px-6">
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;
