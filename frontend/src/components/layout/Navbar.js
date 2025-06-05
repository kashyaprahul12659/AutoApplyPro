import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Tooltip from '../common/Tooltip';
import PlanBadge from '../common/PlanBadge';
import WhatsNewButton from '../common/WhatsNewButton';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-dark text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-white flex items-center">
            <span className="text-primary mr-1">Auto</span>Apply Pro
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Tooltip text="Go to homepage">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            </Tooltip>
            {user ? (
              <>
                <Tooltip text="View your dashboard">
                  <Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
                </Tooltip>
                <Tooltip text="View your application history">
                  <Link to="/history" className="hover:text-primary transition-colors">History</Link>
                </Tooltip>
                <Tooltip text="Track your job applications">
                  <Link to="/job-tracker" className="hover:text-primary transition-colors">Job Tracker</Link>
                </Tooltip>
                <Tooltip text="Build and manage your resumes">
                  <Link to="/resumes" className="hover:text-primary transition-colors">Resume Builder</Link>
                </Tooltip>
                <div className="relative group">
                  <Tooltip text="Access AI-powered tools">
                    <span className="hover:text-primary transition-colors cursor-pointer">AI Tools</span>
                  </Tooltip>
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <Link to="/coverletter" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">AI Cover Letter</Link>
                    <Link to="/jd-analyzer" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">JD Skill Analyzer</Link>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <PlanBadge />
                  <WhatsNewButton />
                </div>
                <Tooltip text="Sign out of your account">
                  <button onClick={handleLogout} className="hover:text-primary transition-colors">Logout</button>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip text="Sign in to your account">
                  <Link to="/login" className="hover:text-primary transition-colors">Login</Link>
                </Tooltip>
                <Tooltip text="Create a new account">
                  <Link to="/register" className="hover:text-primary transition-colors">Register</Link>
                </Tooltip>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden flex items-center"
            onClick={toggleMenu}
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

          {/* Mobile Menu - Adding transition and better z-index */}
          <div 
            className={`md:hidden py-3 pb-4 border-t border-gray-700 absolute left-0 right-0 bg-dark shadow-lg transition-all duration-300 ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5 pointer-events-none'} z-50`}
            style={{top: '100%'}}
          >
            <Link to="/" className="block py-2 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Home</Link>
            {user ? (
              <>
                {/* User info section in mobile menu */}
                <div className="flex items-center justify-between py-2 px-1 border-b border-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="text-sm truncate max-w-[150px]">{user.name || user.email}</div>
                  </div>
                  <PlanBadge />
                </div>
                
                <Link to="/dashboard" className="block py-2 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                <Link to="/history" className="block py-2 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>History</Link>
                <Link to="/job-tracker" className="block py-2 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Job Tracker</Link>
                <Link to="/resumes" className="block py-2 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Resume Builder</Link>
                
                <div className="py-2 border-t border-gray-700">
                  <div className="px-2 py-1 text-sm text-gray-400">AI Tools</div>
                  <Link to="/coverletter" className="block py-2 pl-4 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>AI Cover Letter</Link>
                  <Link to="/jd-analyzer" className="block py-2 pl-4 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>JD Skill Analyzer</Link>
                </div>
                
                <div className="flex items-center justify-between py-2 px-1 border-t border-gray-700">
                  <div className="flex space-x-2">
                    <WhatsNewButton />
                    <a href="/help" className="text-sm text-gray-300 hover:text-primary">Help</a>
                  </div>
                  <button onClick={handleLogout} className="text-sm text-gray-300 hover:text-primary transition-colors">Logout</button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/register" className="block py-2 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
      </div>
    </nav>
  );
};

export default Navbar;
