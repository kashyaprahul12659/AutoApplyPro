import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../hooks/useUniversalAuth';

const Home = () => {
  const { user, isSignedIn, isLoaded } = useUser();

  // Show loading state while authentication is being determined
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }  return (
    <div className="space-y-16 py-8">
      {/* Breadcrumb for logged-in users */}
      {isSignedIn && (
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link to="/home" className="text-primary font-medium">Home</Link>
            <span>•</span>
            <span>Welcome back!</span>
          </nav>
        </div>
      )}
      
      {/* Conditional Hero Section */}
      {isSignedIn ? (
        /* Welcome Back Section for Authenticated Users */
        <section className="text-center">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-primary to-blue-600 text-white rounded-2xl p-8 md:p-12 shadow-xl">
              <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  Welcome back, {user?.fullName?.split(' ')[0] || 'there'}! 👋
                </h1>
                <p className="text-xl mb-8 text-blue-100">
                  Ready to continue your job search journey? Access your dashboard to manage applications, build resumes, and leverage AI tools.
                </p>                <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-2xl mx-auto">
                  <Link to="/dashboard" className="btn bg-white text-primary hover:bg-gray-100 px-6 py-3 text-base font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center">
                    📊 <span className="ml-2">Dashboard</span>
                  </Link>
                  <Link to="/job-tracker" className="btn bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 text-base font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center">
                    📋 <span className="ml-2">Job Tracker</span>
                  </Link>
                  <Link to="/coverletter" className="btn bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 text-base font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center">
                    ✨ <span className="ml-2">AI Tools</span>
                  </Link>
                </div>
              </div>
            </div>
              {/* Quick Stats and Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <Link to="/dashboard" className="bg-white rounded-lg shadow-md p-6 text-center border-l-4 border-green-500 hover:shadow-lg transition-shadow duration-200 group">
                <div className="flex items-center justify-center mb-3">
                  <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition-colors">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">Resume Ready</h3>
                <p className="text-gray-600 text-sm">Manage your profile and resumes</p>
              </Link>
              <Link to="/coverletter" className="bg-white rounded-lg shadow-md p-6 text-center border-l-4 border-blue-500 hover:shadow-lg transition-shadow duration-200 group">
                <div className="flex items-center justify-center mb-3">
                  <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition-colors">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">AI Tools</h3>
                <p className="text-gray-600 text-sm">Generate cover letters & analyze JDs</p>
              </Link>
              <a href="https://chrome.google.com/webstore" target="_blank" rel="noopener noreferrer" className="bg-white rounded-lg shadow-md p-6 text-center border-l-4 border-purple-500 hover:shadow-lg transition-shadow duration-200 group">
                <div className="flex items-center justify-center mb-3">
                  <div className="bg-purple-100 p-3 rounded-full group-hover:bg-purple-200 transition-colors">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">Extension</h3>
                <p className="text-gray-600 text-sm">Auto-fill applications across the web</p>
              </a>
            </div>
          </div>
        </section>
      ) : (
        /* Hero Section for Non-Authenticated Users */
        <section className="text-center md:text-left">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Automate Your <span className="text-primary">Job Applications</span>
                </h1>
                <p className="text-lg md:text-xl mb-8 text-gray-600">
                  AutoApply Pro helps you save time by automatically filling out job applications using data from your resume.
                </p>                <div className="space-x-4">
                  <Link to="/register" className="btn btn-primary px-8 py-3 text-lg">
                    Get Started
                  </Link>
                  <Link to="/login" className="btn btn-outline px-8 py-3 text-lg">
                    Login
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center">
                  <p className="text-gray-500 text-lg">Application Form Image</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card text-center">
              <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Upload Your Resume</h3>
              <p className="text-gray-600">
                Upload your resume once and we'll extract all the important information.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card text-center">
              <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Apply to Jobs</h3>
              <p className="text-gray-600">
                When you find a job you want to apply for, use our extension to autofill the application.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card text-center">
              <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Track Applications</h3>
              <p className="text-gray-600">
                Keep track of all your job applications in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-primary text-white rounded-lg p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to simplify your job search?</h2>
            <p className="text-xl mb-8">
              Join thousands of job seekers who are saving time with AutoApply Pro.
            </p>            {isSignedIn ? (
              <Link to="/dashboard" className="btn bg-white text-primary hover:bg-gray-100 px-8 py-3 text-lg">
                Go to Dashboard
              </Link>
            ) : (
              <Link to="/register" className="btn bg-white text-primary hover:bg-gray-100 px-8 py-3 text-lg">
                Sign Up Now
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
