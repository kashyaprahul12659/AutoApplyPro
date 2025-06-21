import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import CoverLetterGenerator from '../components/coverletter/CoverLetterGenerator';
import CoverLetterHistory from '../components/coverletter/CoverLetterHistory';
import CoverLetterEditor from '../components/coverletter/CoverLetterEditor';
import { useUser } from '../hooks/useUniversalAuth';
import { useApiWithAuth } from '../hooks/useApiWithAuth';
import {
  DocumentTextIcon,
  SparklesIcon,
  ClockIcon,
  PencilSquareIcon,
  RocketLaunchIcon,
  CpuChipIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

const CoverLetter = () => {
  const apiCall = useApiWithAuth();
  const [activeTab, setActiveTab] = useState('generate');
  const [coverLetters, setCoverLetters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeCoverLetter, setActiveCoverLetter] = useState(null);

  useEffect(() => {
    fetchCoverLetters();
  }, []);
  const fetchCoverLetters = async () => {
    try {
      setIsLoading(true);
      const res = await apiCall.get('/api/ai/cover-letters');
      if (res.success) {
        setCoverLetters(res.data);
      }
    } catch (err) {
      console.error('Error fetching cover letters:', err);
      toast.error('Failed to fetch cover letters');
    } finally {
      setIsLoading(false);
    }
  };
  const handleGenerateCoverLetter = async (formData) => {
    try {
      setIsGenerating(true);
      const res = await apiCall.post('/api/ai/cover-letter', formData);

      if (res.success) {
        toast.success('Cover letter generated successfully!');

        // Add the new cover letter to the list
        setCoverLetters([res.data, ...coverLetters]);

        // Set the active cover letter to the newly generated one
        setActiveCoverLetter(res.data);

        // Switch to the editor tab
        setActiveTab('editor');

        // Refresh AI credits after generation
        fetchAIStatus();
      }
    } catch (err) {
      console.error('Error generating cover letter:', err);

      // Check if it's a credit-related error
      if (err.response?.status === 403 && err.response?.data?.requiresUpgrade) {
        // This is handled in the CoverLetterGenerator component now
      } else {
        toast.error(err.response?.data?.error || 'Failed to generate cover letter');
      }
    } finally {
      setIsGenerating(false);
    }
  };
  const fetchAIStatus = async () => {
    try {
      const res = await apiCall.get('/api/users/ai-status');
      if (res.success) {
        // This data is used in the CoverLetterGenerator component
        // but we call this to refresh the status after generation
      }
    } catch (error) {
      console.error('Error fetching AI status:', error);
    }
  };
  const handleUpdateCoverLetter = async (id, updatedData) => {
    try {
      setIsLoading(true);
      const res = await apiCall.put(`/api/ai/cover-letters/${id}`, updatedData);

      if (res.success) {
        toast.success('Cover letter updated successfully!');

        // Update the cover letter in the list
        setCoverLetters(coverLetters.map(letter =>
          letter._id === id ? res.data : letter
        ));

        // Update the active cover letter if it's the one being edited
        if (activeCoverLetter && activeCoverLetter._id === id) {
          setActiveCoverLetter(res.data);
        }
      }
    } catch (err) {
      console.error('Error updating cover letter:', err);
      toast.error('Failed to update cover letter');
    } finally {
      setIsLoading(false);
    }
  };
  const handleDeleteCoverLetter = async (id) => {
    try {
      setIsLoading(true);
      const res = await apiCall.delete(`/api/ai/cover-letters/${id}`);

      if (res.success) {
        toast.success('Cover letter deleted successfully!');

        // Remove the cover letter from the list
        setCoverLetters(coverLetters.filter(letter => letter._id !== id));

        // Clear the active cover letter if it's the one being deleted
        if (activeCoverLetter && activeCoverLetter._id === id) {
          setActiveCoverLetter(null);
          setActiveTab('generate');
        }
      }
    } catch (err) {
      console.error('Error deleting cover letter:', err);
      toast.error('Failed to delete cover letter');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewCoverLetter = (letter) => {
    setActiveCoverLetter(letter);
    setActiveTab('editor');
  };

  const handleNewCoverLetter = () => {
    setActiveCoverLetter(null);
    setActiveTab('generate');
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-teal-50/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center">
                <DocumentTextIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  AI Cover Letter Generator
                </h1>
                <p className="text-gray-600 mt-1">Create personalized cover letters tailored to your profile and job descriptions</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-4 py-2 rounded-xl">
                <CpuChipIcon className="w-4 h-4" />
                <span className="text-sm font-medium">AI Powered</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-emerald-200/50 p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900">AI-Generated</h3>
            </div>
            <p className="text-sm text-gray-600">Intelligent cover letters tailored to your experience and the job requirements</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-teal-200/50 p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                <DocumentDuplicateIcon className="w-5 h-5 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Personalized</h3>
            </div>
            <p className="text-sm text-gray-600">Each letter is customized based on your profile and the specific job posting</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-blue-200/50 p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <PencilSquareIcon className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Editable</h3>
            </div>
            <p className="text-sm text-gray-600">Fine-tune and customize your cover letters with our built-in editor</p>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
          <div className="border-b border-gray-200/50 bg-gray-50/50">
            <div className="flex space-x-1 p-2">
              <button
                onClick={() => setActiveTab('generate')}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === 'generate'
                    ? 'bg-white text-emerald-600 shadow-sm border border-emerald-200/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <RocketLaunchIcon className="w-4 h-4" />
                <span>Generate</span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === 'history'
                    ? 'bg-white text-emerald-600 shadow-sm border border-emerald-200/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <ClockIcon className="w-4 h-4" />
                <span>History</span>
              </button>
              {activeCoverLetter && (
                <button
                  onClick={() => setActiveTab('editor')}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === 'editor'
                      ? 'bg-white text-emerald-600 shadow-sm border border-emerald-200/50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <PencilSquareIcon className="w-4 h-4" />
                  <span>Editor</span>
                </button>
              )}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'generate' && (
              <CoverLetterGenerator
                onGenerate={handleGenerateCoverLetter}
                isGenerating={isGenerating}
              />
            )}

            {activeTab === 'history' && (
              <CoverLetterHistory
                coverLetters={coverLetters}
                isLoading={isLoading}
                onView={handleViewCoverLetter}
                onDelete={handleDeleteCoverLetter}
              />
            )}

            {activeTab === 'editor' && activeCoverLetter && (
              <CoverLetterEditor
                coverLetter={activeCoverLetter}
                onUpdate={handleUpdateCoverLetter}
                onNew={handleNewCoverLetter}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverLetter;
