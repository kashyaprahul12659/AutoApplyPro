import React from 'react';

const ResumeList = ({ resumes, isLoading, onSetPrimary, onDelete }) => {
  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get file icon based on type
  const getFileIcon = (fileType) => {
    if (fileType && fileType.includes('pdf')) {
      return (
        <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg">
          <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
          <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        </div>
      );
    }
  };

  // Show loading spinner
  if (isLoading && resumes.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show empty state
  if (resumes.length === 0) {
    return (
      <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No resumes</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by uploading a resume.</p>
      </div>
    );
  }

  // Show resume list
  return (
    <div className="space-y-4">
      {resumes.map(resume => (
        <div key={resume._id} className="flex items-start p-4 border rounded-lg hover:shadow-md transition-shadow">
          {/* File icon */}
          {getFileIcon(resume.fileType)}

          {/* Resume details */}
          <div className="ml-4 flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{resume.originalName}</h3>
                <p className="text-sm text-gray-500">
                  Uploaded on {formatDate(resume.uploadedAt)}
                  {resume.lastUsedAt && (
                    <span className="ml-2 text-xs text-blue-500">
                      • Last used {formatDate(resume.lastUsedAt)}
                    </span>
                  )}
                </p>
                <div className="mt-1 flex items-center">
                  {resume.isPrimary && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Primary Resume
                    </span>
                  )}
                  <span className="ml-2 text-xs text-gray-500">
                    {(resume.fileSize / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                {!resume.isPrimary && (
                  <button
                    onClick={() => onSetPrimary(resume._id)}
                    className="text-sm text-primary hover:text-blue-700 font-medium"
                  >
                    Set as Primary
                  </button>
                )}
                <button
                  onClick={() => onDelete(resume._id)}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResumeList;
