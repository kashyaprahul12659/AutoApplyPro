import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center md:text-left">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Automate Your <span className="text-primary">Job Applications</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-600">
                AutoApply Pro helps you save time by automatically filling out job applications using data from your resume.
              </p>
              {user ? (
                <Link to="/dashboard" className="btn btn-primary px-8 py-3 text-lg">
                  Go to Dashboard
                </Link>
              ) : (
                <div className="space-x-4">
                  <Link to="/register" className="btn btn-primary px-8 py-3 text-lg">
                    Get Started
                  </Link>
                  <Link to="/login" className="btn btn-outline px-8 py-3 text-lg">
                    Login
                  </Link>
                </div>
              )}
            </div>
            <div className="md:w-1/2">
              <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center">
                <p className="text-gray-500 text-lg">Application Form Image</p>
              </div>
            </div>
          </div>
        </div>
      </section>

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
            </p>
            {user ? (
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
