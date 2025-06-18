import React, { useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { 
  PencilIcon, 
  TrashIcon, 
  MapPinIcon, 
  DocumentTextIcon, 
  TrophyIcon, 
  EyeIcon,
  ClockIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { deleteJobApplication } from '../../services/jobTrackerService';
import JobDetailsModal from './JobDetailsModal';
import EditJobModal from './EditJobModal';
import AlertMessage from '../common/AlertMessage';

const JobCard = ({ job, onRefresh, isDragging = false }) => {
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

  // Get status color and styling
  const getStatusStyling = (status) => {
    const styles = {
      interested: {
        bg: 'bg-gradient-to-r from-blue-500 to-indigo-600',
        text: 'text-blue-700',
        dot: 'bg-blue-500'
      },
      applied: {
        bg: 'bg-gradient-to-r from-purple-500 to-violet-600',
        text: 'text-purple-700',
        dot: 'bg-purple-500'
      },
      interview: {
        bg: 'bg-gradient-to-r from-amber-500 to-orange-600',
        text: 'text-amber-700',
        dot: 'bg-amber-500'
      },
      offer: {
        bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
        text: 'text-green-700',
        dot: 'bg-green-500'
      },
      rejected: {
        bg: 'bg-gradient-to-r from-red-500 to-rose-600',
        text: 'text-red-700',
        dot: 'bg-red-500'
      }
    };
    return styles[status] || styles.interested;
  };

  const statusStyle = getStatusStyling(job.status);

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
      <div className={`
        bg-white rounded-xl shadow-sm border border-gray-200/50 
        hover:shadow-lg hover:border-gray-300/50 transition-all duration-300 
        ${isDragging ? 'shadow-2xl ring-2 ring-blue-300 ring-opacity-50' : ''}
        overflow-hidden group cursor-pointer
      `}>
        {error && (
          <AlertMessage
            type="error"
            message={error}
            onClose={() => setError(null)}
          />
        )}
        
        {/* Status indicator bar */}
        <div className={`h-1 ${statusStyle.bg}`}></div>
        
        <div className="p-4">
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate group-hover:text-gray-700 transition-colors">
                {job.jobTitle}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
                <p className="text-gray-600 text-sm truncate">{job.company}</p>
              </div>
            </div>
            
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEditModal(true);
                }}
                className="text-gray-400 hover:text-blue-500 p-1.5 rounded-lg hover:bg-blue-50 transition-all"
                title="Edit job"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-all"
                title="Delete job"
                disabled={isDeleting}
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Location and Salary */}
          <div className="space-y-2 mb-4">
            {job.location && (
              <div className="flex items-center text-xs text-gray-500">
                <MapPinIcon className="w-3 h-3 mr-1.5" />
                <span>{job.location}</span>
              </div>
            )}
            {job.salary && (
              <div className="flex items-center text-xs text-gray-500">
                <CurrencyDollarIcon className="w-3 h-3 mr-1.5" />
                <span>{job.salary}</span>
              </div>
            )}
          </div>
          
          {/* Tags and Links */}
          <div className="flex flex-wrap gap-2 mb-4">
            {job.linkedAnalyzerResultId && (
              <div 
                className="flex items-center text-xs bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg px-2 py-1 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-all border border-blue-200/50"
                title={`JD Match Score: ${job.linkedAnalyzerResultId.matchScore || '?'}% - Click to view analysis`}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`/jd-analyzer/${job.linkedAnalyzerResultId._id}`, '_blank');
                }}
              >
                <TrophyIcon className="w-3 h-3 mr-1" />
                <span className="font-medium">{job.linkedAnalyzerResultId.matchScore || '?'}% Match</span>
              </div>
            )}
            
            {job.linkedCoverLetterId && (
              <div 
                className="flex items-center text-xs bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-lg px-2 py-1 cursor-pointer hover:from-green-100 hover:to-emerald-100 transition-all border border-green-200/50"
                title="Click to view cover letter"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`/coverletter/${job.linkedCoverLetterId._id}`, '_blank');
                }}
              >
                <DocumentTextIcon className="w-3 h-3 mr-1" />
                <span className="font-medium">Cover Letter</span>
              </div>
            )}
            
            {job.color && (
              <div 
                className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: job.color }}
                title="Custom tag"
              ></div>
            )}
          </div>
          
          {/* Footer */}
          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <div className="flex items-center text-xs text-gray-500">
              <ClockIcon className="w-3 h-3 mr-1" />
              <span>Updated {formatDate(job.lastStatusUpdate || job.updatedAt)}</span>
            </div>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowDetails(true);
              }}
              className="flex items-center text-xs text-blue-600 hover:text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg transition-all"
            >
              <EyeIcon className="w-3 h-3 mr-1" />
              Details
            </button>
          </div>
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
