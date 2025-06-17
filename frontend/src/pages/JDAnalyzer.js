import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApiWithAuth } from '../hooks/useApiWithAuth';
import JDAnalyzer from '../components/analyzer/JDAnalyzer';
import AnalyzerHistory from '../components/analyzer/AnalyzerHistory';
import Spinner from '../components/common/Spinner';

const JDAnalyzerPage = () => {
  const apiCall = useApiWithAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiStatus, setAiStatus] = useState({ isPro: false, aiCredits: 0 });
  const [activeTab, setActiveTab] = useState('analyzer');
  const [specificAnalysis, setSpecificAnalysis] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Parse query parameters to see if we need to load a specific analysis
  const queryParams = new URLSearchParams(location.search);
  const analysisId = queryParams.get('id');
  
  useEffect(() => {
    const fetchUserProfile = async () => {      try {
        // Fetch user profile
        const profileResponse = await apiCall.get('/api/users/profile');
        setUserProfile(profileResponse.data);
        
        // Fetch AI status (credits and Pro status)
        const aiStatusResponse = await apiCall.get('/api/users/ai-status');
        
        setAiStatus({
          isPro: aiStatusResponse.isPro,
          aiCredits: aiStatusResponse.data.aiCredits
        });
          // If we have an analysis ID, fetch the specific analysis
        if (analysisId) {
          try {
            const analysisResponse = await apiCall.get(`/api/ai/analyzer-history/${analysisId}`);
            
            setSpecificAnalysis(analysisResponse.data);
            setActiveTab('analyzer'); // Show the analyzer tab with the loaded analysis
          } catch (analysisErr) {
            console.error('Error fetching specific analysis:', analysisErr);
            // If we can't find the analysis, just show the regular analyzer
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user profile. Please try again later.');
        setLoading(false);
        
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    
    fetchUserProfile();
  }, [navigate, analysisId]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="large" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }
    return (
    <div className="jd-analyzer container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">JD Skill Analyzer</h1>
        <div className="flex items-center space-x-4">
          {aiStatus.isPro ? (
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Pro
            </span>
          ) : (
            <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
              {aiStatus.aiCredits} Credits Left
            </span>
          )}
        </div>
      </div>
      
      <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-6">
        <p>
          This tool analyzes your resume against a job description to determine your match score, identify skill gaps, and suggest improvements.
          {!aiStatus.isPro && ` Each analysis costs 1 AI credit. You have ${aiStatus.aiCredits} credits remaining.`}
        </p>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('analyzer')}
            className={`${activeTab === 'analyzer' 
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} 
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Analyzer
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`${activeTab === 'history' 
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} 
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Analysis History
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'analyzer' ? (
        <JDAnalyzer 
          userProfile={userProfile} 
          preloadedAnalysis={specificAnalysis}
        />
      ) : (
        <AnalyzerHistory />
      )}
      
      {!aiStatus.isPro && (
        <div className="mt-8 p-4 bg-purple-50 border border-purple-200 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-purple-800 mb-2">Upgrade to Pro</h3>
          <p className="text-gray-700 mb-4">
            Get unlimited JD analyses, cover letter generation and more with Pro membership.
          </p>
          <button
            onClick={() => navigate('/cover-letter')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-md hover:from-purple-700 hover:to-blue-700"
          >
            Upgrade to Pro
          </button>
        </div>
      )}
    </div>
  );
};

export default JDAnalyzerPage;
