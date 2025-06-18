import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApiWithAuth } from '../hooks/useApiWithAuth';
import JDAnalyzer from '../components/analyzer/JDAnalyzer';
import AnalyzerHistory from '../components/analyzer/AnalyzerHistory';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  DocumentMagnifyingGlassIcon,
  SparklesIcon,
  ClockIcon,
  StarIcon,
  LightBulbIcon,
  ChartBarIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-indigo-50/30">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <DocumentMagnifyingGlassIcon className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                JD Skill Analyzer
              </h1>
            </div>
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/20 to-rose-50/30">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-red-200/50 p-8">
            <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/50 rounded-xl p-6 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <CpuChipIcon className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-800">Unable to Load</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }    return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-indigo-50/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                <DocumentMagnifyingGlassIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  JD Skill Analyzer
                </h1>
                <p className="text-gray-600 mt-1">Analyze your resume against job descriptions with AI</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {aiStatus.isPro ? (
                <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-xl shadow-lg">
                  <StarIcon className="w-4 h-4" />
                  <span className="text-sm font-semibold">Pro Member</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-4 py-2 rounded-xl">
                  <CpuChipIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">{aiStatus.aiCredits} Credits Left</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-blue-200/50 p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Match Score</h3>
            </div>
            <p className="text-sm text-gray-600">Get a precise percentage match between your resume and the job requirements</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-amber-200/50 p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <LightBulbIcon className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Skill Gaps</h3>
            </div>
            <p className="text-sm text-gray-600">Identify missing skills and areas for improvement in your profile</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-green-200/50 p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">AI Suggestions</h3>
            </div>
            <p className="text-sm text-gray-600">Receive intelligent recommendations to optimize your resume</p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl p-6 mb-8">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <DocumentMagnifyingGlassIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">How it works</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                Our AI analyzes your resume against job descriptions to determine your match score, identify skill gaps, and suggest improvements. 
                {!aiStatus.isPro && ` Each analysis costs 1 AI credit. You have ${aiStatus.aiCredits} credits remaining.`}
              </p>
            </div>
          </div>
        </div>
        
        {/* Enhanced Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden mb-8">
          <div className="border-b border-gray-200/50 bg-gray-50/50">
            <div className="flex space-x-1 p-2">
              <button
                onClick={() => setActiveTab('analyzer')}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === 'analyzer' 
                    ? 'bg-white text-purple-600 shadow-sm border border-purple-200/50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <DocumentMagnifyingGlassIcon className="w-4 h-4" />
                <span>Analyzer</span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === 'history' 
                    ? 'bg-white text-purple-600 shadow-sm border border-purple-200/50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <ClockIcon className="w-4 h-4" />
                <span>Analysis History</span>
              </button>
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'analyzer' ? (
              <JDAnalyzer 
                userProfile={userProfile} 
                preloadedAnalysis={specificAnalysis}
              />
            ) : (
              <AnalyzerHistory />
            )}
          </div>
        </div>
        
        {/* Pro Upgrade Banner */}
        {!aiStatus.isPro && (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-xl p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <StarIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Upgrade to Pro</h3>
                  <p className="text-purple-100 leading-relaxed">
                    Get unlimited JD analyses, cover letter generation, priority support, and exclusive AI features with Pro membership.
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-purple-100">
                    <li className="flex items-center space-x-2">
                      <SparklesIcon className="w-4 h-4" />
                      <span>Unlimited AI analyses</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <SparklesIcon className="w-4 h-4" />
                      <span>Advanced insights & recommendations</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <SparklesIcon className="w-4 h-4" />
                      <span>Priority customer support</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={() => navigate('/cover-letter')}
                  className="inline-flex items-center px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-200"
                >
                  <StarIcon className="w-4 h-4 mr-2" />
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JDAnalyzerPage;
