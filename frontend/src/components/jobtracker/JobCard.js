import React, { useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { FiEdit, FiTrash2, FiMapPin, FiFileText, FiAward, FiEye } from 'react-icons/fi';
import { deleteJobApplication } from '../../services/jobTrackerService';
import JobDetailsModal from './JobDetailsModal';
import EditJobModal from './EditJobModal';
import AlertMessage from '../common/AlertMessage';

const JobCard = ({ job, onRefresh }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  // Format the date for last status update
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      interested: 'bg-blue-500',
      applied: 'bg-purple-500',
      interview: 'bg-amber-500',
      offer: 'bg-green-500',
      rejected: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  // Delete job application
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this job application?')) {
      try {
        setIsDeleting(true);
        await deleteJobApplication(job._id);
        onRefresh();
      } catch (err) {
        console.error('Error deleting job application:', err);
        setError('Failed to delete job application. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition-shadow">
        {error && (
          <AlertMessage
            type="error"
            message={error}
            onClose={() => setError(null)}
          />
        )}
        
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-800">{job.jobTitle}</h3>
            <p className="text-gray-600 text-sm">{job.company}</p>
          </div>
          
          <div className="flex space-x-1">
            <button 
              onClick={() => setShowEditModal(true)}
              className="text-gray-500 hover:text-blue-500 p-1 rounded hover:bg-gray-100"
              title="Edit job"
            >
              <FiEdit size={14} />
            </button>
            <button 
              onClick={handleDelete}
              className="text-gray-500 hover:text-red-500 p-1 rounded hover:bg-gray-100"
              title="Delete job"
              disabled={isDeleting}
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        </div>
        
        {job.location && (
          <div className="flex items-center mt-2 text-xs text-gray-500">
            <FiMapPin size={12} className="mr-1" />
            <span>{job.location}</span>
          </div>
        )}
        
        <div className="mt-3 flex flex-wrap gap-2">
          {job.linkedAnalyzerResultId && (
            <div 
              className="flex items-center text-xs bg-blue-50 text-blue-700 rounded px-2 py-1 cursor-pointer hover:bg-blue-100"
              title={`JD Match Score: ${job.linkedAnalyzerResultId.matchScore || '?'}% - Click to view analysis`}
              onClick={(e) => {
                e.stopPropagation();
                window.open(`/jd-analyzer/${job.linkedAnalyzerResultId._id}`, '_blank');
              }}
            >
              <FiAward size={12} className="mr-1" />
              <span>{job.linkedAnalyzerResultId.matchScore || '?'}% Match</span>
            </div>
          )}
          
          {job.linkedCoverLetterId && (
            <div 
              className="flex items-center text-xs bg-green-50 text-green-700 rounded px-2 py-1 cursor-pointer hover:bg-green-100"
              title="Click to view cover letter"
              onClick={(e) => {
                e.stopPropagation();
                window.open(`/coverletter/${job.linkedCoverLetterId._id}`, '_blank');
              }}
            >
              <FiFileText size={12} className="mr-1" />
              <span>Cover Letter</span>
            </div>
          )}
          
          {job.color && (
            <div 
              className={`w-4 h-4 rounded-full`}
              style={{ backgroundColor: job.color }}
              title="Custom tag"
            ></div>
          )}
        </div>
        
        <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
          <span>Updated {formatDate(job.lastStatusUpdate || job.updatedAt)}</span>
          
          <button 
            onClick={() => setShowDetails(true)} 
            className="flex items-center text-blue-500 hover:text-blue-700"
          >
            <FiEye size={12} className="mr-1" />
            Details
          </button>
        </div>
      </div>

      {showDetails && (
        <JobDetailsModal
          job={job}
          onClose={() => setShowDetails(false)}
        />
      )}

      {showEditModal && (
        <EditJobModal
          job={job}
          onClose={() => setShowEditModal(false)}
          onJobUpdated={onRefresh}
        />
      )}
    </>
  );
};

export default JobCard;
