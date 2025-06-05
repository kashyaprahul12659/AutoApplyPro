import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import ProUpgradeModal from './ProUpgradeModal';
import AlertMessage from '../common/AlertMessage';

const CoverLetterGenerator = ({ onGenerate, isGenerating }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    jobDescription: '',
    jobRole: ''
  });
  const [hasProfile, setHasProfile] = useState(false);
  const [aiStatus, setAiStatus] = useState({
    aiCredits: 0,
    isPro: false
  });
  const [showProModal, setShowProModal] = useState(false);
  const [error, setError] = useState(null);
  const [jobRoles] = useState([
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Scientist',
    'UI/UX Designer',
    'Product Manager',
    'Project Manager',
    'DevOps Engineer',
    'QA Engineer',
    'Other'
  ]);
  const [customJobRole, setCustomJobRole] = useState('');

  useEffect(() => {
    // Check if user has profile data
    setHasProfile(user && user.profileData && user.profileData.extractedFromResume);
    
    // Fetch AI credits and Pro status
    const fetchAIStatus = async () => {
      try {
        const res = await axios.get('/api/users/ai-status');
        if (res.data.success) {
          setAiStatus(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching AI status:', error);
        const errorMessage = error.response?.status === 401 
          ? 'Your session has expired. Please log in again.'
          : 'Unable to verify your account status. Please try again later.';
        setError({
          type: 'error',
          message: errorMessage
        });
      }
    };
    
    if (user) {
      fetchAIStatus();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null); // Clear any previous errors
    
    // Validate inputs
    if (!formData.jobDescription.trim()) {
      setError({
        type: 'warning',
        message: 'Please enter a job description to generate a tailored cover letter.'
      });
      return;
    }
    
    if (formData.jobRole === 'Other' && !customJobRole.trim()) {
      setError({
        type: 'warning',
        message: 'Please specify the custom job role.'
      });
      return;
    }
    
    // Check if user has credits or is Pro
    if (!aiStatus.isPro && aiStatus.aiCredits <= 0) {
      setShowProModal(true);
      return;
    }

    // Prepare data for submission
    const submitData = {
      ...formData,
      jobRole: formData.jobRole === 'Other' ? customJobRole : formData.jobRole
    };

    // Call the onGenerate function from parent component
    onGenerate(submitData).catch(err => {
      console.error('Error generating cover letter:', err);
      
      // Handle specific error types
      if (err.response?.status === 429) {
        setError({
          type: 'error',
          title: 'API Limit Exceeded',
          message: 'You have exceeded the allowed number of requests. Please try again later or upgrade to a Pro plan.'
        });
      } else if (err.response?.status === 401) {
        setError({
          type: 'error',
          title: 'Authentication Error',
          message: 'Your session has expired. Please log in again.'
        });
      } else {
        setError({
          type: 'error',
          message: 'An error occurred while generating your cover letter. Please try again later.'
        });
      }
    });
  };
  
  const handleProUpgrade = (success) => {
    if (success) {
      setAiStatus(prev => ({ ...prev, isPro: true }));
    }
  };

  return (
    <>
      {/* Main component content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Display error message if present */}
        {error && (
          <AlertMessage
            type={error.type}
            title={error.title}
            message={error.message}
            onDismiss={() => setError(null)}
          />
        )}
        
        {!hasProfile ? (
          <AlertMessage
            type="warning"
            title="Resume Required"
            message="Please upload and parse your resume in the Dashboard before generating a cover letter. This helps us create a more personalized letter using your skills and experience."
          />
        ) : (
          <AlertMessage
            type="info"
            message="We'll use your resume data to create a personalized cover letter. You can edit the result after generation."
            className="mb-6"
          />
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="jobRole" className="block text-sm font-medium text-gray-700 mb-1">
              Job Role
            </label>
            <select
              id="jobRole"
              name="jobRole"
              value={formData.jobRole}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
            >
              <option value="">Select a job role</option>
              {jobRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {formData.jobRole === 'Other' && (
            <div className="mb-6">
              <label htmlFor="customJobRole" className="block text-sm font-medium text-gray-700 mb-1">
                Custom Job Role
              </label>
              <input
                type="text"
                id="customJobRole"
                name="customJobRole"
                value={customJobRole}
                onChange={(e) => setCustomJobRole(e.target.value)}
                placeholder="Enter job role"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                required={formData.jobRole === 'Other'}
              />
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Job Description
            </label>
            <textarea
              id="jobDescription"
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              placeholder="Paste the full job description here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              rows="10"
              required
            ></textarea>
            <p className="mt-1 text-xs text-gray-500">
              For best results, include the complete job description with requirements and responsibilities.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {!aiStatus.isPro && (
                  <div className="flex items-center mr-4 bg-blue-50 px-3 py-1 rounded-full">
                    <svg className="h-5 w-5 text-blue-600 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    <span className="text-sm font-medium text-blue-800">Credits: {aiStatus.aiCredits}</span>
                  </div>
                )}
                {aiStatus.isPro && (
                  <div className="flex items-center mr-4 bg-purple-50 px-3 py-1 rounded-full">
                    <svg className="h-5 w-5 text-purple-600 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1z" clipRule="evenodd" />
                      <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9z" />
                    </svg>
                    <span className="text-sm font-medium text-purple-800">Pro Plan</span>
                  </div>
                )}
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              disabled={isGenerating || !hasProfile}
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Cover Letter...
                </>
              ) : (
                'Generate Cover Letter'
              )}
            </button>
          </div>
        </form>
      </div>
      
      {/* Pro Upgrade Modal */}
      <ProUpgradeModal
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
        onUpgrade={handleProUpgrade}
      />
    </>
  );
};

export default CoverLetterGenerator;
