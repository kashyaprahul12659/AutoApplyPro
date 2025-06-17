import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../hooks/useUniversalAuth';

const PrivateRoute = ({ children }) => {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isSignedIn ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
