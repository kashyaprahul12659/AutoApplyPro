import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and description */}
          <div>
            <Link to="/" className="text-xl font-bold flex items-center">
              <span className="text-primary mr-1">Auto</span>Apply Pro
            </Link>
            <p className="mt-3 text-gray-300">
              Simplify your job application process with automated form filling based on your resume data.
            </p>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/dashboard" className="text-gray-300 hover:text-primary transition-colors">Dashboard</Link></li>
              <li><Link to="/history" className="text-gray-300 hover:text-primary transition-colors">Application History</Link></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-300">
              Have questions or feedback?<br />
              <a href="mailto:support@autoapplypro.com" className="hover:text-primary transition-colors">
                support@autoapplypro.com
              </a>
            </p>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {currentYear} AutoApply Pro. All rights reserved.</p>
          <p className="mt-2 text-xs">
            <span className="bg-gray-800 px-2 py-1 rounded">v1.3.5</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
