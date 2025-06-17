import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignUp } from '@clerk/clerk-react';
import { Helmet } from 'react-helmet-async';
import { useUser } from '../hooks/useUniversalAuth';
import DevLoginForm from '../components/auth/DevLoginForm';

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
const hasValidClerkKey = clerkPubKey && clerkPubKey.startsWith('pk_');

const Register = () => {
  const { isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate('/dashboard');
    }
  }, [isLoaded, isSignedIn, navigate]);

  return (
    <>
      <Helmet>
        <title>Register - AutoApply Pro</title>
        <meta name="description" content="Create your AutoApply Pro account to start applying to jobs faster with AI assistance." />
      </Helmet>
      
      {hasValidClerkKey ? (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
          <div className="w-full max-w-md">            <SignUp 
              routing="hash"
              redirectUrl="/dashboard"
              signInUrl="/login"
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-sm normal-case',
                  card: 'shadow-lg',
                  headerTitle: 'text-2xl font-bold text-gray-900',
                  headerSubtitle: 'text-gray-600',
                  socialButtonsBlockButton: 'border border-gray-300 hover:bg-gray-50',
                  formFieldInput: 'border border-gray-300 rounded-md',
                  footerActionLink: 'text-indigo-600 hover:text-indigo-500'
                }
              }}
            />
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 min-h-screen py-8">
          <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Development Mode</h1>
              <p className="text-sm text-gray-600 mt-2">
                Registration is not available in development mode. Use the login page to access the application.
              </p>
            </div>
            <div className="text-center">
              <button
                onClick={() => navigate('/login')}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
