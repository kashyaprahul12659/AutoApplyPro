import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';

const ResumeUploader = ({ onUpload, isUploading, uploadProgress, hasExistingResume }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Allowed file types
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Handle file input change
  const handleChange = (e) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Handle file selection click
  const handleClick = () => {
    fileInputRef.current.click();
  };

  // Process the selected file
  const handleFile = (file) => {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF or Word document only');
      return;
    }
    
    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }
    
    setSelectedFile(file);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }
    
    onUpload(selectedFile);
  };

  // Get file icon based on type
  const getFileIcon = (file) => {
    if (file.type === 'application/pdf') {
      return (
        <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      );
    } else {
      return (
        <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      );
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="w-full">
        {/* Drag & Drop Area */}
        <div 
          className={`border-2 border-dashed rounded-lg p-6 mb-4 text-center 
            ${dragActive ? 'border-primary bg-blue-50' : 'border-gray-300'} 
            ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            id="resume-upload"
            className="hidden"
            onChange={handleChange}
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            disabled={isUploading}
          />
          
          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mb-4"></div>
              <p className="text-gray-600">Uploading your resume...</p>
              
              {/* Progress bar */}
              <div className="w-full max-w-md mt-4">
                <div className="bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">{uploadProgress}% complete</p>
              </div>
            </div>
          ) : selectedFile ? (
            <div className="flex flex-col items-center">
              {getFileIcon(selectedFile)}
              <p className="mt-2 text-sm font-medium text-gray-900 truncate max-w-xs">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                  fileInputRef.current.value = '';
                }}
                className="mt-2 text-sm text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="mb-2 text-sm font-medium text-gray-900">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PDF or Word Document (MAX. 5MB)
              </p>
            </div>
          )}
        </div>
        
        {/* Upload Button */}
        {selectedFile && !isUploading && (
          <button 
            type="submit" 
            className="btn btn-primary w-full"
          >
            {hasExistingResume ? 'Replace Resume' : 'Upload Resume'}
          </button>
        )}
      </form>
    </div>
  );
};

export default ResumeUploader;
