import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useUser } from '../hooks/useUniversalAuth';
import { useApiWithAuth } from '../hooks/useApiWithAuth';
import ResumeUploader from '../components/resume/ResumeUploader';
import ResumeList from '../components/resume/ResumeList';
import ParsedResumeData from '../components/resume/ParsedResumeData';
import FinalProfileCard from '../components/profile/FinalProfileCard';
import ExtensionDetector from '../components/extension/ExtensionDetector';
import AICoverLetterCard from '../components/dashboard/AICoverLetterCard';
import ResumeBuilderWidget from '../components/dashboard/ResumeBuilderWidget';

const Dashboard = () => {
  const { user } = useUser();
  const apiCall = useApiWithAuth();
  
  // Profile state
  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  });
  
  // Resume state
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Resume parsing state
  const [showParseModal, setShowParseModal] = useState(false);
  const [lastUploadedResumeId, setLastUploadedResumeId] = useState(null);
  const [hasParsedData, setHasParsedData] = useState(false);
  const [parsedProfileData, setParsedProfileData] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
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
  }, [apiCall]);
    // Check if user has parsed resume data
  useEffect(() => {
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
  }, []);
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
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('profile')}
          className={`py-2 px-4 font-medium ${activeTab === 'profile' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('resumes')}
          className={`py-2 px-4 font-medium ${activeTab === 'resumes' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
        >
          Resumes
        </button>
        {hasParsedData && (
          <button
            onClick={() => setActiveTab('parsedData')}
            className={`py-2 px-4 font-medium ${activeTab === 'parsedData' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
          >
            Resume Data
          </button>
        )}
        {hasParsedData && (
          <button
            onClick={() => setActiveTab('finalProfile')}
            className={`py-2 px-4 font-medium ${activeTab === 'finalProfile' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
          >
            Autofill Profile
          </button>
        )}
      </div>

      {/* Extension Status */}
      <div className="mb-6">
        <ExtensionDetector />
      </div>
      
      {/* AI Cover Letter Feature */}
      {hasParsedData && (
        <div className="mb-6">
          <AICoverLetterCard />
        </div>
      )}
      
      {/* Resume Builder Widget */}
      <div className="mb-6">
        <ResumeBuilderWidget />
      </div>
      
      {/* Parse Resume Modal */}
      {showParseModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            {/* Background overlay */}
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowParseModal(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            {/* Modal content */}
            <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl overflow-hidden z-50 transform transition-all">
              <div className="px-6 py-4 bg-primary text-white flex justify-between items-center">
                <h3 className="text-lg font-medium">Resume Data Extracted</h3>
                <button 
                  onClick={() => setShowParseModal(false)}
                  className="text-white hover:text-gray-200"
                >
                  &times;
                </button>
              </div>
              
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
      )}
      
      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div>
          {/* Resume summary in profile section */}
          {resumes.some(resume => resume.isPrimary) && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-1">
                  <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-gray-700">Current Resume</h3>
                  <div className="mt-1 text-sm text-gray-600 flex justify-between items-center">
                    {(() => {
                      const primaryResume = resumes.find(r => r.isPrimary);
                      return primaryResume ? (
                        <>
                          <span className="truncate">
                            {primaryResume.originalName} - {new Date(primaryResume.uploadedAt).toLocaleDateString()}
                          </span>
                          <button 
                            onClick={() => setActiveTab('resumes')} 
                            className="text-primary hover:text-blue-700 text-sm font-medium ml-2"
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
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
            
            <form onSubmit={handleProfileSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Full Name</label>
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
              
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
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
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-yellow-800">No resume uploaded</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>You haven't uploaded a resume yet. Upload your resume to use the auto-fill feature.</p>
                      <button 
                        onClick={() => setActiveTab('resumes')} 
                        className="mt-2 text-primary hover:text-blue-700 font-medium"
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
        <div>
          {/* Resume Summary */}
          {resumes.some(resume => resume.isPrimary) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Primary Resume</h3>
                  <div className="mt-1 text-sm text-blue-700">
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
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Upload Resume</h2>
            <p className="text-gray-600 mb-4">
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
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Resumes</h2>
              <span className="text-sm text-gray-500">{resumes.length} {resumes.length === 1 ? 'resume' : 'resumes'}</span>
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
        <div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Resume Data</h3>
                <div className="mt-1 text-sm text-blue-700">
                  Edit your parsed resume data to ensure accurate autofill when applying for jobs.
                </div>
              </div>
            </div>
          </div>
          
          <ParsedResumeData onClose={refreshProfileData} />
        </div>
      )}
      
      {/* Final Autofill Profile Tab */}
      {activeTab === 'finalProfile' && (
        <div>
          {editingProfile ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Edit Autofill Profile</h2>
                <button 
                  onClick={() => setEditingProfile(false)}
                  className="text-sm text-gray-500 hover:text-gray-700"
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
            <FinalProfileCard 
              profileData={parsedProfileData} 
              onEditClick={() => setEditingProfile(true)}
              refreshData={refreshProfileData}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
