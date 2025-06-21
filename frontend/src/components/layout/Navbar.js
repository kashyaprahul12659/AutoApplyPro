import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SignOutButton } from '@clerk/clerk-react';
import { useUser } from '../../hooks/useUniversalAuth';
import { useDevAuth } from '../../context/DevAuthContext';
import Tooltip from '../common/Tooltip';
import PlanBadge from '../common/PlanBadge';
import WhatsNewButton from '../common/WhatsNewButton';

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
const hasValidClerkKey = clerkPubKey && clerkPubKey.startsWith('pk_');

const Navbar = () => {
  const { user, isSignedIn } = useUser();
  const devAuth = useDevAuth(); // Always call useDevAuth to avoid conditional hook calls
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    if (devAuth) {
      devAuth.signOut();
    }
    setIsMenuOpen(false);
  };
  return (
    <nav className="bg-white/95 backdrop-blur-md text-neutral-900 shadow-soft border-b border-neutral-200 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-neutral-900 flex items-center group">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-bold text-sm">AA</span>
              </div>
              <span className="gradient-text">AutoApply Pro</span>
            </div>
          </Link>          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {isSignedIn ? (
              <Tooltip text="Go to home page">
                <Link to="/home" className="px-3 py-2 rounded-xl text-neutral-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 font-medium">
                  Home
                </Link>
              </Tooltip>
            ) : (
              <Tooltip text="Go to homepage">
                <Link to="/" className="px-3 py-2 rounded-xl text-neutral-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 font-medium">
                  Home
                </Link>
              </Tooltip>
            )}
            {isSignedIn ? (
              <>
                <Tooltip text="View your dashboard">
                  <Link to="/dashboard" className="px-3 py-2 rounded-xl text-neutral-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 font-medium">
                    Dashboard
                  </Link>
                </Tooltip>
                <Tooltip text="View your application history">
                  <Link to="/history" className="px-3 py-2 rounded-xl text-neutral-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 font-medium">
                    History
                  </Link>
                </Tooltip>
                <Tooltip text="Track your job applications">
                  <Link to="/job-tracker" className="px-3 py-2 rounded-xl text-neutral-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 font-medium">
                    Job Tracker
                  </Link>
                </Tooltip>
                <Tooltip text="Build and manage your resumes">
                  <Link to="/resumes" className="px-3 py-2 rounded-xl text-neutral-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 font-medium">
                    Resume Builder
                  </Link>
                </Tooltip>
                <div className="relative group">
                  <Tooltip text="Access AI-powered tools">
                    <span className="px-3 py-2 rounded-xl text-neutral-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 cursor-pointer font-medium flex items-center">
                      AI Tools
                      <svg className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </Tooltip>
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-large border border-neutral-200 py-2 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                    <Link to="/coverletter" className="block px-4 py-3 text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200 font-medium">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium">AI Cover Letter</div>
                          <div className="text-xs text-neutral-500">Generate personalized letters</div>
                        </div>
                      </div>
                    </Link>
                    <Link to="/jd-analyzer" className="block px-4 py-3 text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200 font-medium">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium">JD Skill Analyzer</div>
                          <div className="text-xs text-neutral-500">Match skills to jobs</div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-neutral-200">
                  <PlanBadge />
                  <WhatsNewButton />
                </div>
                <Tooltip text="Sign out of your account">
                  {hasValidClerkKey ? (
                    <SignOutButton>
                      <button className="btn btn-ghost btn-sm ml-2">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </SignOutButton>
                  ) : (
                    <button onClick={handleLogout} className="btn btn-ghost btn-sm ml-2">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  )}
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip text="Sign in to your account">
                  <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
                </Tooltip>
                <Tooltip text="Create a new account">
                  <Link to="/register" className="btn btn-primary btn-sm ml-2">Get Started</Link>
                </Tooltip>
              </>
            )}
          </div>          {/* Mobile menu button */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl text-neutral-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu - Enhanced with modern design */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? 'max-h-screen opacity-100 visible'
            : 'max-h-0 opacity-0 invisible overflow-hidden'
        }`}>
          <div className="py-4 border-t border-neutral-200 bg-white/95 backdrop-blur-md">
            {isSignedIn ? (
              <Link
                to="/home"
                className="block px-4 py-3 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 font-medium rounded-xl mx-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            ) : (
              <Link
                to="/"
                className="block px-4 py-3 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 font-medium rounded-xl mx-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            )}
            {isSignedIn ? (
              <>
                {/* User info section in mobile menu */}
                <div className="flex items-center justify-between px-4 py-3 mx-2 border-b border-neutral-200 mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
                      {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-neutral-900 truncate max-w-[150px]">
                        {user?.fullName || 'User'}
                      </div>
                      <div className="text-xs text-neutral-500 truncate max-w-[150px]">
                        {user?.primaryEmailAddress?.emailAddress}
                      </div>
                    </div>
                  </div>
                  <PlanBadge />
                </div>

                <Link
                  to="/dashboard"
                  className="block px-4 py-3 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 font-medium rounded-xl mx-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/history"
                  className="block px-4 py-3 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 font-medium rounded-xl mx-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  History
                </Link>
                <Link
                  to="/job-tracker"
                  className="block px-4 py-3 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 font-medium rounded-xl mx-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Job Tracker
                </Link>
                <Link
                  to="/resumes"
                  className="block px-4 py-3 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 font-medium rounded-xl mx-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Resume Builder
                </Link>

                <div className="py-2 border-t border-neutral-200 mt-2">
                  <div className="px-4 py-2 text-sm font-medium text-neutral-500 uppercase tracking-wider">AI Tools</div>
                  <Link
                    to="/coverletter"
                    className="block px-6 py-3 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 font-medium rounded-xl mx-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      AI Cover Letter
                    </div>
                  </Link>
                  <Link
                    to="/jd-analyzer"
                    className="block px-6 py-3 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 font-medium rounded-xl mx-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      JD Skill Analyzer
                    </div>
                  </Link>
                </div>

                <div className="flex items-center justify-between px-4 py-3 mx-2 border-t border-neutral-200 mt-2">
                  <div className="flex space-x-3">
                    <WhatsNewButton />
                    <a href="/help" className="text-sm text-neutral-500 hover:text-primary-600 transition-colors duration-200">Help</a>
                  </div>
                  {hasValidClerkKey ? (
                    <SignOutButton>
                      <button className="btn btn-ghost btn-sm">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </SignOutButton>
                  ) : (
                    <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-3 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 font-medium rounded-xl mx-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <div className="px-2 mt-2">
                  <Link
                    to="/register"
                    className="btn btn-primary w-full justify-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
