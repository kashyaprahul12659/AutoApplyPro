import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiFileText, FiPlus } from 'react-icons/fi';
import * as resumeBuilderService from '../../services/resumeBuilderService';

const ResumeBuilderWidget = () => {
  const [recentResumes, setRecentResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentResumes = async () => {
      try {
        setLoading(true);
        const response = await resumeBuilderService.getAllResumes();

        if (response.success) {
          // Sort by updated date and take the 3 most recent
          const sorted = [...response.data].sort((a, b) =>
            new Date(b.updatedAt) - new Date(a.updatedAt)
          ).slice(0, 3);

          setRecentResumes(sorted);
        }
      } catch (error) {
        console.error('Error fetching recent resumes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentResumes();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCreateNew = () => {
    navigate('/resume-builder');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h2 className="font-semibold text-lg flex items-center">
          <FiFileText className="mr-2 text-primary" />
          Resume Builder
        </h2>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="h-32 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : recentResumes.length > 0 ? (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Resumes</h3>
            {recentResumes.map(resume => (
              <Link
                key={resume._id}
                to={`/resume-builder/${resume._id}`}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded group"
              >
                <div className="flex items-center">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded mr-3">
                    <FiFileText size={16} />
                  </div>
                  <div>
                    <div className="font-medium text-sm group-hover:text-primary transition-colors">{resume.title}</div>
                    <div className="text-xs text-gray-500">Updated {formatDate(resume.updatedAt)}</div>
                  </div>
                </div>
              </Link>
            ))}

            <div className="mt-3 pt-2 border-t border-gray-100">
              <Link
                to="/resumes"
                className="text-sm text-primary hover:text-primary-dark transition-colors"
              >
                View all resumes
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="bg-blue-50 text-blue-600 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
              <FiFileText size={24} />
            </div>
            <h3 className="font-medium mb-1">No resumes yet</h3>
            <p className="text-sm text-gray-500 mb-4">Create your first resume to tailor for job applications</p>
            <button
              onClick={handleCreateNew}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors flex items-center mx-auto"
            >
              <FiPlus className="mr-1" />
              Create Resume
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilderWidget;
