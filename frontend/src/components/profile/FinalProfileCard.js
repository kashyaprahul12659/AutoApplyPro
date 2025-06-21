import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const FinalProfileCard = ({ profileData, onEditClick, refreshData }) => {
  const navigate = useNavigate();

  const handleSetAsActive = async () => {
    try {
      const response = await axios.post('/api/resumes/profile/set-active', { active: true });      if (response.data.success) {
        toast.success('Profile set as active for autofill');
        if (refreshData) {
          refreshData();
        }
      }
    } catch (error) {
      toast.error('Failed to set profile as active');
      console.error(error);
    }
  };

  const handleExportJson = () => {
    // Create a JSON string of the profile data
    const dataStr = JSON.stringify(profileData, null, 2);

    // Create a blob with the data
    const blob = new Blob([dataStr], { type: 'application/json' });

    // Create an anchor element and trigger download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `autofill-profile-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Profile data exported successfully');
  };

  // Handle no profile data
  if (!profileData) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No profile data available</h3>
          <p className="mt-1 text-sm text-gray-500">
            Upload your resume and confirm the parsed data to see your profile here.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn btn-primary"
            >
              Upload Resume
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Header with active status */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Autofill Profile</h2>
          <p className="text-blue-100 text-sm mt-1">Your confirmed resume data for job applications</p>
        </div>
        {profileData.isActive ? (
          <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
            Ready for Autofill
          </span>
        ) : (
          <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
            Not Active
          </span>
        )}
      </div>

      {/* Profile content */}
      <div className="p-6">
        {/* Basic Information */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-semibold text-gray-900">{profileData.name}</h3>
              <div className="flex flex-wrap items-center mt-1 text-sm text-gray-600">
                {profileData.email && (
                  <div className="flex items-center mr-4 mb-1">
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {profileData.email}
                  </div>
                )}
                {profileData.phone && (
                  <div className="flex items-center mb-1">
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {profileData.phone}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        {profileData.skills && profileData.skills.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {profileData.skills.map((skill, index) => (
                <span key={index} className="bg-blue-50 text-blue-700 text-sm font-medium rounded-full px-3 py-1">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {profileData.education && profileData.education.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Education</h4>
            <div className="space-y-3">
              {/* Sort education by year in descending order */}
              {[...profileData.education].sort((a, b) => {
                const yearA = parseInt(a.year, 10) || 0;
                const yearB = parseInt(b.year, 10) || 0;
                return yearB - yearA;
              })
                .map((edu, index) => (
                  <div key={index} className="border-l-2 border-blue-200 pl-4 py-1">
                    <div className="font-medium text-gray-900">{edu.degree}</div>
                    <div className="text-sm text-gray-600">{edu.institution}</div>
                    {edu.year && <div className="text-sm text-gray-500">{edu.year}</div>}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {profileData.experience && profileData.experience.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Work Experience</h4>
            <div className="space-y-4">
              {/* Sort experience by most recent first (based on duration) */}
              {profileData.experience.map((exp, index) => (
                <div key={index} className="border-l-2 border-blue-200 pl-4 py-1">
                  <div className="font-medium text-gray-900">{exp.role}</div>
                  <div className="text-sm text-gray-600">{exp.company}</div>
                  {exp.duration && <div className="text-sm text-gray-500">{exp.duration}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={handleSetAsActive}
            className={`btn ${profileData.isActive ? 'btn-outline' : 'btn-primary'}`}
            disabled={profileData.isActive}
          >
            {profileData.isActive ? 'Active for Autofill' : 'Use for Autofill'}
          </button>

          <button
            onClick={onEditClick}
            className="btn btn-outline"
          >
            Edit Profile
          </button>

          <button
            onClick={handleExportJson}
            className="btn btn-outline flex items-center"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download as JSON
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinalProfileCard;
