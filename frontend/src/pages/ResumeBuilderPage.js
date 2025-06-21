import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiFolder, FiTrash2, FiCopy, FiEdit } from 'react-icons/fi';
import { toast } from 'react-toastify';
import * as resumeBuilderService from '../services/resumeBuilderService';
import Loader from '../components/common/Loader';

const ResumeBuilderPage = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [duplicating, setDuplicating] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const response = await resumeBuilderService.getAllResumes();

      if (response.success) {
        setResumes(response.data);
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    navigate('/resume-builder');
  };

  const handleEdit = (id) => {
    navigate(`/resume-builder/${id}`);
  };

  const handleDuplicate = async (id) => {
    try {
      setDuplicating(id);
      const response = await resumeBuilderService.duplicateResume(id);

      if (response.success) {
        toast.success('Resume duplicated successfully');
        fetchResumes();
      }
    } catch (error) {
      console.error('Error duplicating resume:', error);
      toast.error('Failed to duplicate resume');
    } finally {
      setDuplicating(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        setDeleting(id);
        const response = await resumeBuilderService.deleteResume(id);

        if (response.success) {
          toast.success('Resume deleted successfully');
          setResumes(resumes.filter(resume => resume._id !== id));
        }
      } catch (error) {
        console.error('Error deleting resume:', error);
        toast.error('Failed to delete resume');
      } finally {
        setDeleting(null);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      </div>
    );
  }
  return (
    <div className="ai-resume container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Resumes</h1>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <FiPlus className="mr-2" />
          Create New Resume
        </button>
      </div>

      {resumes.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-6xl text-gray-300 flex justify-center mb-4">
            <FiFolder />
          </div>
          <h2 className="text-xl font-semibold mb-2">No Resumes Found</h2>
          <p className="text-gray-600 mb-6">
            Create your first resume to get started with AutoApply Pro's Resume Builder
          </p>
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center"
          >
            <FiPlus className="mr-2" />
            Create New Resume
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map(resume => (
            <div
              key={resume._id}
              className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div
                className="p-4 border-b border-gray-100 cursor-pointer"
                onClick={() => handleEdit(resume._id)}
              >
                <h3 className="font-semibold text-lg">{resume.title}</h3>
                <p className="text-sm text-gray-500">
                  Updated: {formatDate(resume.updatedAt)}
                </p>
              </div>
              <div className="p-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {resume.blocks?.length || 0} sections
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(resume._id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    title="Edit Resume"
                  >
                    <FiEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDuplicate(resume._id)}
                    disabled={duplicating === resume._id}
                    className="p-2 text-green-600 hover:bg-green-50 rounded"
                    title="Duplicate Resume"
                  >
                    {duplicating === resume._id ? (
                      <span className="animate-spin">⟳</span>
                    ) : (
                      <FiCopy size={16} />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(resume._id)}
                    disabled={deleting === resume._id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="Delete Resume"
                  >
                    {deleting === resume._id ? (
                      <span className="animate-spin">⟳</span>
                    ) : (
                      <FiTrash2 size={16} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeBuilderPage;
