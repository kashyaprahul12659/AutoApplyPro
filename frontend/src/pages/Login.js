import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignIn } from '@clerk/clerk-react';
import { Helmet } from 'react-helmet-async';
import { useUser } from '../hooks/useUniversalAuth';
import DevLoginForm from '../components/auth/DevLoginForm';

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
const hasValidClerkKey = clerkPubKey && clerkPubKey.startsWith('pk_');

const Login = () => {
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
        <title>Login - AutoApply Pro</title>
        <meta name="description" content="Login to your AutoApply Pro account to access AI-powered job application tools." />
      </Helmet>

      {hasValidClerkKey ? (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
          <div className="w-full max-w-md">            <SignIn
            routing="hash"
            redirectUrl="/dashboard"
            signUpUrl="/register"
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
          <DevLoginForm />
        </div>
      )}
    </>
  );
};export default Login;
