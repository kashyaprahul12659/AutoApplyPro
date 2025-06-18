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
              <a href="mailto:support@autoapplypro.tech" className="hover:text-primary transition-colors">
                support@autoapplypro.tech
              </a>
            </p>
          </div>
        </div>
        
        {/* Copyright and Legal */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left text-gray-400">
              <p>&copy; {currentYear} AutoApply Pro. All rights reserved.</p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap justify-center md:justify-end gap-4 text-sm">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="text-gray-400 hover:text-primary transition-colors">Terms of Service</Link>
              <Link to="/refund-policy" className="text-gray-400 hover:text-primary transition-colors">Refund Policy</Link>
            </div>
          </div>
          <div className="text-center mt-4">
            <span className="bg-gray-800 px-2 py-1 rounded text-xs text-gray-400">v1.3.5</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
