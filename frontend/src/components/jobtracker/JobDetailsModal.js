import React, { useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { FiX, FiMapPin, FiCalendar, FiLink, FiFileText, FiAward } from 'react-icons/fi';

const JobDetailsModal = ({ job, onClose }) => {
  const modalRef = useRef();
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  // Get status label and color
  const getStatusInfo = (status) => {
    const statusMap = {
      interested: { label: 'Interested', color: 'bg-blue-100 text-blue-800' },
      applied: { label: 'Applied', color: 'bg-purple-100 text-purple-800' },
      interview: { label: 'Interview', color: 'bg-amber-100 text-amber-800' },
      offer: { label: 'Offer', color: 'bg-green-100 text-green-800' },
      rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' }
    };
    
    return statusMap[status] || { label: 'Unknown', color: 'bg-gray-100 text-gray-800' };
  };
  
  // Handle background click (close modal when clicking outside)
  const handleBackgroundClick = (e) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };
  
  // Add escape key listener to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const statusInfo = getStatusInfo(job.status);
  
  return (
    <div 
      ref={modalRef}
      onClick={handleBackgroundClick}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">Job Details</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <h3 className="text-xl font-medium text-gray-800">{job.jobTitle}</h3>
            <p className="text-lg text-gray-600">{job.company}</p>
            
            {job.location && (
              <div className="flex items-center mt-2 text-gray-600">
                <FiMapPin className="mr-2" />
                <span>{job.location}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
            
            {job.color && (
              <div 
                className="w-4 h-4 rounded-full ml-2" 
                style={{ backgroundColor: job.color }}
                title="Custom color tag"
              ></div>
            )}
          </div>
          
          <div className="space-y-4 mb-4">
            {job.jdUrl && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                  <FiLink className="mr-1" /> Job Posting URL
                </h4>
                <a 
                  href={job.jdUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                >
                  {job.jdUrl}
                </a>
              </div>
            )}
            
            {job.linkedAnalyzerResultId && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                  <FiAward className="mr-1" /> JD Analyzer Result
                </h4>
                <div className="flex items-center">
                  <span className="text-blue-700 font-medium">
                    {job.linkedAnalyzerResultId.matchScore || '?'}% Match
                  </span>
                  <a 
                    href={`/jd-analyzer/${job.linkedAnalyzerResultId._id}`}
                    className="ml-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    View Analysis
                  </a>
                </div>
              </div>
            )}
            
            {job.linkedCoverLetterId && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                  <FiFileText className="mr-1" /> Cover Letter
                </h4>
                <a 
                  href={`/cover-letter/${job.linkedCoverLetterId._id}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  View Cover Letter
                </a>
              </div>
            )}
            
            {job.notes && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Notes</h4>
                <div className="bg-gray-50 p-3 rounded border border-gray-200 whitespace-pre-wrap">
                  {job.notes}
                </div>
              </div>
            )}
          </div>
          
          <div className="border-t pt-4 text-sm text-gray-500">
            <div className="flex items-center">
              <FiCalendar className="mr-1" />
              <span>Created: {formatDate(job.createdAt)}</span>
            </div>
            <div className="flex items-center mt-1">
              <FiCalendar className="mr-1" />
              <span>Last Updated: {formatDate(job.updatedAt)}</span>
            </div>
            {job.lastStatusUpdate && (
              <div className="flex items-center mt-1">
                <FiCalendar className="mr-1" />
                <span>Status Changed: {formatDate(job.lastStatusUpdate)}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;
