import React, { useState, useEffect, Suspense } from 'react';
import { useUser } from '../hooks/useUniversalAuth';
import withErrorBoundary from '../components/withErrorBoundary';
import { 
  DashboardSkeleton, 
  CardSkeleton, 
  ProfileSkeleton, 
  ListSkeleton,
  Skeleton
} from '../components/LoadingSkeletons';
import performanceMonitor from '../utils/performance';
import { useApi } from '../hooks/useApi';
import { toast } from 'react-toastify';

// Import icons
import {
  ChartBarIcon,
  BellIcon,
  MagnifyingGlassIcon,
  CogIcon,
  UserIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

// Import components
import DashboardStats from '../components/dashboard/DashboardStats';
import ExtensionDetector from '../components/extension/ExtensionDetector';
import AICoverLetterCard from '../components/dashboard/AICoverLetterCard';
import ResumeBuilderWidget from '../components/dashboard/ResumeBuilderWidget';
import ProgressTracker from '../components/dashboard/ProgressTracker';
import QuickActions from '../components/dashboard/QuickActions';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import ResumeUploader from '../components/resume/ResumeUploader';
import ResumeList from '../components/resume/ResumeList';
import ParsedResumeData from '../components/resume/ParsedResumeData';
import FinalProfileCard from '../components/profile/FinalProfileCard';

/**
 * Dashboard Page Component
 * Main entry point for the user dashboard
 */
const Dashboard = () => {
  const { user } = useUser();
  const { apiCall } = useApi();
  
  // State management
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({ name: '', email: '' });
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [hasParsedData, setHasParsedData] = useState(false);
  const [parsedProfileData, setParsedProfileData] = useState(null);
  const [showParseModal, setShowParseModal] = useState(false);
  const [lastUploadedResumeId, setLastUploadedResumeId] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  // Performance monitoring
  useEffect(() => {
    const measurement = performanceMonitor.startMeasurement('dashboard-page-load');
    return () => {
      measurement.end();
    };
  }, []);

  // Load user data into form when user state is available
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.fullName || '',
        email: user.primaryEmailAddress?.emailAddress || ''
      });
    }
  }, [user]);

  // Fetch user's resumes
  useEffect(() => {
    if (!user) return;
    
    const fetchResumes = async () => {
      try {
        setIsLoading(true);
        const res = await apiCall('/api/resumes');
        setResumes(res.data.data);
      } catch (err) {
        toast.error(err.response?.data?.error || 'Failed to fetch resumes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResumes();
  }, [apiCall, user]);

  // Check if user has parsed resume data
  useEffect(() => {
    if (!user) return;
    
    const checkParsedData = async () => {
      try {
        const res = await apiCall.get('/api/resumes/parsed-data');
        if (res.success) {
          setHasParsedData(true);
          setParsedProfileData(res.data);
        }
      } catch (err) {
        // No parsed data yet
        setHasParsedData(false);
        setParsedProfileData(null);
      }
    };
    
    checkParsedData();
  }, [apiCall, user]);

  // Show loading if user data is still being fetched
  if (!user) {
    return (      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton height="h-8" width="w-48" className="mb-4" />
          <div className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => <CardSkeleton key={i} />)}
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <CardSkeleton />
              <ListSkeleton />
            </div>
            <div className="space-y-8">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          </div>
        </div>
      </div>
    );  }

  // Function to refresh profile data
  const refreshProfileData = async () => {
    try {
      const res = await apiCall('/api/resumes/parsed-data');
      if (res.data.success) {
        setParsedProfileData(res.data.data);
        setHasParsedData(true);
      }
    } catch (err) {
      console.error('Error refreshing profile data:', err);
    }
  };

  // Handle profile form changes
  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  // Handle profile form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await apiCall('/api/users/profile', {
        method: 'PUT',
        data: profileData
      });
      if (result.data.success !== false) {
        toast.success('Profile updated successfully');
      } else {
        toast.error(result.data.error || 'Failed to update profile');
      }
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  // Handle resume upload with file data from the ResumeUploader component
  const handleResumeUpload = async (fileData) => {
    try {
      setIsLoading(true);
      setUploadProgress(0);
      
      const formData = new FormData();
      formData.append('resume', fileData);
        const res = await apiCall('/api/resumes', {
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      
      // Add the new resume to the state
      setResumes([res.data.data, ...resumes]);
      
      // Show success notification with filename
      toast.success(
        <div>
          <strong>Resume uploaded successfully!</strong>
          <p className="text-sm">{fileData.name}</p>
        </div>
      );
      
      // Set last uploaded resume ID for parsing
      setLastUploadedResumeId(res.data.data._id);
      
      // Show the parse modal
      setShowParseModal(true);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to upload resume');
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setUploadProgress(0);
      }, 600); // Small delay to ensure progress animation completes smoothly
    }
  };
  // Handle setting a resume as primary
  const handleSetPrimary = async (id) => {
    try {
      await apiCall(`/api/resumes/${id}/primary`, {
        method: 'PUT'
      });
      
      // Update local state
      setResumes(resumes.map(resume => ({
        ...resume,
        isPrimary: resume._id === id
      })));
      
      toast.success('Primary resume updated');
    } catch (err) {
      toast.error('Failed to update primary resume');
    }
  };

  // Handle resume deletion
  const handleDeleteResume = async (id) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await apiCall(`/api/resumes/${id}`, {
          method: 'DELETE'
        });
        
        // Remove from state
        setResumes(resumes.filter(resume => resume._id !== id));
        
        toast.success('Resume deleted successfully');
      } catch (err) {
        toast.error('Failed to delete resume');
      }
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <ChartBarIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Dashboard
                  </h1>
                  <p className="text-sm text-gray-600">Welcome back, {user?.fullName || 'User'}!</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
                <BellIcon className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
                <CogIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <div className="mb-8">
          <DashboardStats resumes={resumes} hasParsedData={hasParsedData} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Main Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Extension Status */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-all duration-300">
              <ExtensionDetector />
            </div>
            
            {/* AI Cover Letter Feature */}
            {hasParsedData && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-all duration-300">
                <AICoverLetterCard />
              </div>
            )}
            
            {/* Resume Builder Widget */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-all duration-300">
              <ResumeBuilderWidget />
            </div>

            {/* Progress Tracker */}
            <ProgressTracker 
              hasProfile={!!profileData.name && !!profileData.email}
              hasResume={resumes.length > 0}
              hasParsedData={hasParsedData}
              hasExtension={false} // You can add extension detection logic
            />
          </div>

          {/* Right Column - Quick Actions & Activity */}
          <div className="space-y-6">
            <QuickActions 
              onProfileClick={() => setActiveTab('profile')}
              onResumeClick={() => setActiveTab('resumes')}
              onDataClick={() => setActiveTab('parsedData')}
              onAutofillClick={() => setActiveTab('finalProfile')}
              hasParsedData={hasParsedData}
            />
            
            <ActivityFeed 
              resumes={resumes}
              hasParsedData={hasParsedData}
            />
          </div>
        </div>

        {/* Tabbed Content Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
          {/* Modern Tab Navigation */}
          <div className="border-b border-gray-200/50 bg-gray-50/50">
            <div className="flex space-x-1 p-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === 'profile' 
                    ? 'bg-white text-blue-600 shadow-sm border border-blue-200/50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => setActiveTab('resumes')}
                className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === 'resumes' 
                    ? 'bg-white text-blue-600 shadow-sm border border-blue-200/50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <DocumentTextIcon className="w-4 h-4" />
                <span>Resumes</span>
              </button>
              {hasParsedData && (
                <button
                  onClick={() => setActiveTab('parsedData')}
                  className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === 'parsedData' 
                      ? 'bg-white text-blue-600 shadow-sm border border-blue-200/50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <ChartBarIcon className="w-4 h-4" />
                  <span>Resume Data</span>
                </button>
              )}
              {hasParsedData && (
                <button
                  onClick={() => setActiveTab('finalProfile')}
                  className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === 'finalProfile' 
                      ? 'bg-white text-blue-600 shadow-sm border border-blue-200/50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <CogIcon className="w-4 h-4" />
                  <span>Autofill Profile</span>
                </button>
              )}
            </div>
          </div>          {/* Tab Content */}
          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Resume summary in profile section */}
                {resumes.some(resume => resume.isPrimary) && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-1">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-3 flex-1">
                        <h3 className="text-sm font-semibold text-blue-900">Current Resume</h3>
                        <div className="mt-1 text-sm text-blue-700 flex justify-between items-center">
                          {(() => {
                            const primaryResume = resumes.find(r => r.isPrimary);
                            return primaryResume ? (
                              <>
                                <span className="truncate">
                                  {primaryResume.originalName} - {new Date(primaryResume.uploadedAt).toLocaleDateString()}
                                </span>
                                <button 
                                  onClick={() => setActiveTab('resumes')} 
                                  className="text-blue-600 hover:text-blue-700 text-sm font-medium ml-2 px-3 py-1 bg-white rounded-lg hover:bg-blue-50 transition-all duration-200"
                                >
                                  Manage
                                </button>
                              </>
                            ) : null;
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Profile form */}
                <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-xl border border-gray-200/50 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Your Profile</h2>
                  
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="input"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="input"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        required
                      />
                    </div>
                    
                    <button type="submit" className="btn btn-primary">
                      Update Profile
                    </button>
                  </form>
                  
                  {!resumes.some(resume => resume.isPrimary) && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex items-start p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3 flex-1">
                          <h3 className="text-sm font-semibold text-yellow-800">No resume uploaded</h3>
                          <div className="mt-2 text-sm text-yellow-700">
                            <p>You haven't uploaded a resume yet. Upload your resume to use the auto-fill feature.</p>
                            <button 
                              onClick={() => setActiveTab('resumes')} 
                              className="mt-2 inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-all duration-200 font-medium text-sm"
                            >
                              Upload Resume
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Resumes Tab */}
            {activeTab === 'resumes' && (
              <div className="space-y-6">
                {/* Resume Summary */}
                {resumes.some(resume => resume.isPrimary) && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-xl p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <DocumentTextIcon className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-semibold text-green-900">Primary Resume</h3>
                        <div className="mt-1 text-sm text-green-700">
                          {(() => {
                            const primaryResume = resumes.find(r => r.isPrimary);
                            return primaryResume ? (
                              <span>
                                <strong>{primaryResume.originalName}</strong> - Last updated {new Date(primaryResume.uploadedAt).toLocaleDateString()}
                              </span>
                            ) : null;
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Upload area */}
                <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-xl border border-gray-200/50 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Upload Resume</h2>
                  <p className="text-gray-600 mb-6">
                    Upload your resume in PDF or DOCX format. Max file size: 5MB.
                  </p>
                  
                  <ResumeUploader 
                    onUpload={handleResumeUpload}
                    isUploading={isLoading}
                    uploadProgress={uploadProgress}
                    hasExistingResume={resumes.length > 0}
                  />
                </div>
                
                {/* Resumes list */}
                <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-xl border border-gray-200/50 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Your Resumes</h2>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      {resumes.length} {resumes.length === 1 ? 'resume' : 'resumes'}
                    </span>
                  </div>
                  
                  <ResumeList 
                    resumes={resumes}
                    isLoading={isLoading && resumes.length === 0}
                    onSetPrimary={handleSetPrimary}
                    onDelete={handleDeleteResume}
                  />
                </div>
              </div>
            )}
            
            {/* Parsed Resume Data Tab */}
            {activeTab === 'parsedData' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <ChartBarIcon className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-semibold text-blue-900">Resume Data</h3>
                      <div className="mt-1 text-sm text-blue-700">
                        Edit your parsed resume data to ensure accurate autofill when applying for jobs.
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-xl border border-gray-200/50 p-6">
                  <ParsedResumeData onClose={refreshProfileData} />
                </div>
              </div>
            )}
            
            {/* Final Autofill Profile Tab */}
            {activeTab === 'finalProfile' && (
              <div className="space-y-6">
                {editingProfile ? (
                  <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-xl border border-gray-200/50 p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Edit Autofill Profile</h2>
                      <button 
                        onClick={() => setEditingProfile(false)}
                        className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 hover:bg-gray-100 rounded-lg transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                    <ParsedResumeData 
                      onClose={() => {
                        refreshProfileData();
                        setEditingProfile(false);
                      }} 
                    />
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-xl border border-gray-200/50 p-6">
                    <FinalProfileCard 
                      profileData={parsedProfileData} 
                      onEditClick={() => setEditingProfile(true)}
                      refreshData={refreshProfileData}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>      {/* Parse Resume Modal */}
      {showParseModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            {/* Background overlay */}
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowParseModal(false)}>
              <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"></div>
            </div>
            
            {/* Modal content */}
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden z-50 transform transition-all">
              <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <ChartBarIcon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold">Resume Data Extracted</h3>
                </div>
                <button 
                  onClick={() => setShowParseModal(false)}
                  className="text-white/80 hover:text-white hover:bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                >
                  ✕
                </button>
              </div>
              
              <div className="max-h-[80vh] overflow-y-auto">
                <ParsedResumeData 
                  resumeId={lastUploadedResumeId} 
                  onClose={() => {
                    setShowParseModal(false);
                    setHasParsedData(true);
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
