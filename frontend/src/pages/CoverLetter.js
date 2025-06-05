import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import CoverLetterGenerator from '../components/coverletter/CoverLetterGenerator';
import CoverLetterHistory from '../components/coverletter/CoverLetterHistory';
import CoverLetterEditor from '../components/coverletter/CoverLetterEditor';
import { useAuth } from '../context/AuthContext';

const CoverLetter = () => {
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
      const res = await axios.get('/api/ai/cover-letters');
      if (res.data.success) {
        setCoverLetters(res.data.data);
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
      const res = await axios.post('/api/ai/cover-letter', formData);
      
      if (res.data.success) {
        toast.success('Cover letter generated successfully!');
        
        // Add the new cover letter to the list
        setCoverLetters([res.data.data, ...coverLetters]);
        
        // Set the active cover letter to the newly generated one
        setActiveCoverLetter(res.data.data);
        
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
      const res = await axios.get('/api/users/ai-status');
      if (res.data.success) {
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
      const res = await axios.put(`/api/ai/cover-letters/${id}`, updatedData);
      
      if (res.data.success) {
        toast.success('Cover letter updated successfully!');
        
        // Update the cover letter in the list
        setCoverLetters(coverLetters.map(letter => 
          letter._id === id ? res.data.data : letter
        ));
        
        // Update the active cover letter if it's the one being edited
        if (activeCoverLetter && activeCoverLetter._id === id) {
          setActiveCoverLetter(res.data.data);
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
      const res = await axios.delete(`/api/ai/cover-letters/${id}`);
      
      if (res.data.success) {
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">AI Cover Letter Generator</h1>
        <p className="mt-2 text-gray-600">
          Create personalized cover letters tailored to your profile and specific job descriptions.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('generate')}
          className={`py-2 px-4 font-medium ${
            activeTab === 'generate' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'
          }`}
        >
          Generate
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`py-2 px-4 font-medium ${
            activeTab === 'history' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'
          }`}
        >
          History
        </button>
        {activeCoverLetter && (
          <button
            onClick={() => setActiveTab('editor')}
            className={`py-2 px-4 font-medium ${
              activeTab === 'editor' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'
            }`}
          >
            Editor
          </button>
        )}
      </div>

      {/* Tab Content */}
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
  );
};

export default CoverLetter;
