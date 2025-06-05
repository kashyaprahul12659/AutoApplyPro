import React from 'react';
import { Link } from 'react-router-dom';
import { FaChrome, FaFileAlt, FaRobot, FaCheckCircle, FaChartBar, FaLock, FaStar, FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import { Helmet } from 'react-helmet';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Helmet>
        <title>AutoApply Pro - Apply to jobs 10x faster with AI</title>
        <meta name="description" content="AutoApply Pro helps you automate job applications with smart form filling, AI cover letters, and resume matching." />
        <meta property="og:title" content="AutoApply Pro - Apply to jobs 10x faster with AI" />
        <meta property="og:description" content="Automate your job application process with AI-powered tools." />
        <link rel="icon" href="/favicon.ico" />
      </Helmet>
      
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-blue-600">Auto<span className="text-gray-800">Apply Pro</span></span>
              </div>
            </div>
            <div className="flex items-center">
              <Link to="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Login
              </Link>
              <Link to="/register" className="ml-4 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Register
              </Link>
              <a 
                href="https://chrome.google.com/webstore" 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-4 flex items-center text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                <FaChrome className="mr-2" /> Chrome Extension
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              Apply to jobs <span className="text-blue-600">10x faster</span> with AI
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Smart Autofill, AI Cover Letters, Resume Matching
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="https://chrome.google.com/webstore" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow-md transition-colors"
              >
                <FaChrome className="mr-2" /> Get the Chrome Extension
              </a>
              <Link 
                to="/register" 
                className="flex items-center bg-white border border-gray-300 hover:border-blue-600 text-gray-800 hover:text-blue-600 font-medium py-3 px-6 rounded-lg shadow-sm transition-colors"
              >
                Create Free Account
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src="/assets/hero-image.png" 
              alt="AutoApply Pro Demo" 
              className="rounded-lg shadow-xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/600x400?text=AutoApply+Pro";
              }}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Powerful Features</h2>
            <p className="mt-4 text-xl text-gray-600">Everything you need to streamline your job application process</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                <FaFileAlt className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Resume Parser</h3>
              <p className="text-gray-600">
                Automatically extracts data from your resume to fill out job applications with a single click.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                <FaRobot className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Cover Letter Generator</h3>
              <p className="text-gray-600">
                Create tailored cover letters in seconds using AI that matches your skills to the job description.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                <FaChartBar className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">JD Skill Analyzer</h3>
              <p className="text-gray-600">
                Analyze job descriptions against your resume to find skill gaps and improve your match rate.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                <FaLock className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Pro Plan Access</h3>
              <p className="text-gray-600">
                Unlock unlimited AI features, analytics, and premium support with our affordable Pro plan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">What Our Users Say</h2>
            <p className="mt-4 text-xl text-gray-600">Join thousands of job seekers who've streamlined their application process</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex -space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
              </div>
              <blockquote className="text-gray-700 text-lg italic mb-4">
                "AutoApply Pro saved me countless hours during my job search. The AI cover letter generator helped me personalize each application without spending hours rewriting."
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                  <span className="font-bold">SJ</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Sarah Johnson</p>
                  <p className="text-gray-600 text-sm">Software Engineer, Hired at Google</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex -space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
              </div>
              <blockquote className="text-gray-700 text-lg italic mb-4">
                "The JD Skill Analyzer was a game-changer for me. It helped me identify the exact skills I needed to highlight in my applications, resulting in a significant increase in interview calls."
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                  <span className="font-bold">MP</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Michael Patel</p>
                  <p className="text-gray-600 text-sm">Data Analyst, Hired at Microsoft</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-xl text-gray-600">Choose the plan that's right for you</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Free</h3>
              <p className="text-gray-600 mb-6">Get started with basic features</p>
              <p className="text-4xl font-bold text-gray-900 mb-6">$0<span className="text-gray-500 text-lg font-normal">/month</span></p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2" /> Resume Profile Storage
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2" /> 3 AI Cover Letters
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2" /> 3 JD Analyses
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2" /> Chrome Extension Access
                </li>
                <li className="flex items-center text-gray-400">
                  <span className="mr-2">✕</span> Unlimited AI Features
                </li>
                <li className="flex items-center text-gray-400">
                  <span className="mr-2">✕</span> Premium Support
                </li>
              </ul>
              
              <Link 
                to="/register" 
                className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Get Started
              </Link>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-blue-600 p-8 rounded-lg shadow-md relative">
              <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-800 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                POPULAR
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Pro</h3>
              <p className="text-blue-100 mb-6">Everything you need to succeed</p>
              <p className="text-4xl font-bold text-white mb-6">₹299<span className="text-blue-200 text-lg font-normal">/month</span></p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-white">
                  <FaCheckCircle className="text-green-300 mr-2" /> Resume Profile Storage
                </li>
                <li className="flex items-center text-white">
                  <FaCheckCircle className="text-green-300 mr-2" /> <strong>Unlimited</strong> AI Cover Letters
                </li>
                <li className="flex items-center text-white">
                  <FaCheckCircle className="text-green-300 mr-2" /> <strong>Unlimited</strong> JD Analyses
                </li>
                <li className="flex items-center text-white">
                  <FaCheckCircle className="text-green-300 mr-2" /> Chrome Extension Access
                </li>
                <li className="flex items-center text-white">
                  <FaCheckCircle className="text-green-300 mr-2" /> <strong>Unlimited</strong> AI Features
                </li>
                <li className="flex items-center text-white">
                  <FaCheckCircle className="text-green-300 mr-2" /> Premium Support
                </li>
              </ul>
              
              <Link 
                to="/login" 
                className="block w-full text-center bg-white text-blue-600 font-medium py-3 px-6 rounded-lg transition-colors hover:bg-blue-50"
              >
                Upgrade in App
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to transform your job application process?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of job seekers who are landing interviews faster with AutoApply Pro.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="https://chrome.google.com/webstore" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white text-blue-600 hover:bg-blue-50 font-medium py-3 px-6 rounded-lg shadow-md transition-colors"
            >
              <FaChrome className="inline mr-2" /> Get the Chrome Extension
            </a>
            <Link 
              to="/register" 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Auto<span className="text-blue-400">Apply Pro</span></h3>
              <p className="text-gray-400 mb-4">
                Streamlining your job application process with AI-powered tools.
              </p>
              <div className="flex space-x-4">
                <a href="mailto:contact@autoapplypro.com" className="text-gray-400 hover:text-white transition-colors">
                  <FaEnvelope />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <FaLinkedin />
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <FaGithub />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/register" className="text-gray-400 hover:text-white transition-colors">Register</Link></li>
                <li><a href="https://chrome.google.com/webstore" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Chrome Extension</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} AutoApply Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
