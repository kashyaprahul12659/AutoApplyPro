import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiBriefcase } from 'react-icons/fi';

const CoverLetterEditor = ({ coverLetter, onUpdate, onNew }) => {
  const navigate = useNavigate();
  const [letterText, setLetterText] = useState(coverLetter.letterText);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTrackingJob, setIsTrackingJob] = useState(false);
  const [showTrackJobModal, setShowTrackJobModal] = useState(false);
  const [jobInfo, setJobInfo] = useState({
    jobTitle: '',
    company: ''
  });
  const textareaRef = useRef(null);
  
  // Try to extract job title and company from cover letter or job description
  useEffect(() => {
    if (coverLetter) {
      const extractJobInfo = () => {
        // Try to get job title from cover letter title
        if (coverLetter.jobTitle) {
          setJobInfo(prev => ({
            ...prev,
            jobTitle: coverLetter.jobTitle
          }));
        }
        
        // Try to extract company name from job description
        if (coverLetter.jobDescription) {
          const lines = coverLetter.jobDescription.split('\n');
          
          // Simple heuristic to find company name
          const companyLine = lines.find(line => 
            line.toLowerCase().includes('company:') || 
            line.toLowerCase().includes(' at ') ||
            line.toLowerCase().includes('with ')
          );
          
          if (companyLine) {
            const companyMatch = companyLine.match(/at\s+([^,\.]+)/i) || 
                              companyLine.match(/with\s+([^,\.]+)/i) ||
                              companyLine.match(/company:\s*([^,\.]+)/i);
            
            if (companyMatch && companyMatch[1]) {
              setJobInfo(prev => ({
                ...prev,
                company: companyMatch[1].trim()
              }));
            }
          }
        }
      };
      
      extractJobInfo();
    }
  }, [coverLetter]);

  const handleEdit = () => {
    setIsEditing(true);
    // Focus the textarea after state update
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 0);
  };

  const handleSave = async () => {
    if (!letterText.trim()) {
      toast.error('Cover letter cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      await onUpdate(coverLetter._id, { letterText });
      setIsEditing(false);
      toast.success('Cover letter saved successfully');
    } catch (error) {
      console.error('Error saving cover letter:', error);
      toast.error('Failed to save cover letter');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setLetterText(coverLetter.letterText);
    setIsEditing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letterText);
    toast.success('Cover letter copied to clipboard');
  };

  // Handle adding job to tracker
  const handleTrackJob = async () => {
    if (!jobInfo.jobTitle || !jobInfo.company) {
      toast.error('Job title and company are required');
      return;
    }
    
    setIsTrackingJob(true);
    
    try {
      // Create a new job application with the cover letter linked
      const response = await axios.post(
        '/api/job-tracker/add',
        {
          jobTitle: jobInfo.jobTitle,
          company: jobInfo.company,
          status: 'applied', // Set as applied since they have a cover letter
          linkedCoverLetterId: coverLetter._id,
          notes: `Cover letter created on ${format(new Date(coverLetter.createdAt), 'PPP')}`
        }
      );
      
      // Show success message
      toast.success('Job added to tracker successfully!');
      setShowTrackJobModal(false);
      
      // Ask if user wants to go to job tracker
      if (window.confirm('Job added to tracker. Would you like to view your job tracker?')) {
        navigate('/job-tracker');
      }
      
    } catch (error) {
      console.error('Error adding job to tracker:', error);
      toast.error(error.response?.data?.error || 'Failed to add job to tracker');
    } finally {
      setIsTrackingJob(false);
    }
  };
  
  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Format title
      const title = coverLetter.jobTitle || 'Cover Letter';
      const date = format(new Date(coverLetter.createdAt), 'MMMM d, yyyy');
      
      // Add title
      doc.setFontSize(18);
      doc.text(title, 20, 20);
      
      // Add date
      doc.setFontSize(12);
      doc.text(date, 20, 30);
      
      // Add content
      doc.setFontSize(12);
      
      // Split text to handle wrapping
      const textLines = doc.splitTextToSize(letterText, 170);
      doc.text(textLines, 20, 40);
      
      // Save the PDF
      doc.save(`${title.replace(/\s+/g, '_')}_${date.replace(/\s+/g, '_')}.pdf`);
      
      toast.success('Cover letter downloaded as PDF');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold">
            {coverLetter.jobTitle || 'Cover Letter'}
          </h3>
          <p className="text-gray-600 text-sm">
            Created: {format(new Date(coverLetter.createdAt), 'MMMM d, yyyy')}
          </p>
        </div>
      </div>

      <div className="mb-6">
        {isEditing ? (
          <div>
            <textarea
              ref={textareaRef}
              value={letterText}
              onChange={(e) => setLetterText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              rows="20"
            ></textarea>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        ) : (
          <div className="whitespace-pre-wrap bg-white border border-gray-200 rounded-md p-4 text-gray-800">
            {letterText}
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Copy
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Download PDF
          </button>
          <button
            onClick={() => setShowTrackJobModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center"
          >
            <FiBriefcase className="mr-2" />
            Track This Job
          </button>
          <button
            onClick={onNew}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
          >
            Create New
          </button>
        </div>
      )}

      {/* Track Job Modal */}
      {showTrackJobModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-semibold">Track This Job</h2>
              <button 
                onClick={() => setShowTrackJobModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4">
              <p className="text-gray-600 mb-4">
                Add this job to your application tracker with your cover letter attached.
              </p>
              
              <div className="mb-4">
                <label htmlFor="jobTitle" className="block text-gray-700 font-medium mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  id="jobTitle"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Software Engineer"
                  value={jobInfo.jobTitle}
                  onChange={(e) => setJobInfo({...jobInfo, jobTitle: e.target.value})}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="company" className="block text-gray-700 font-medium mb-2">
                  Company *
                </label>
                <input
                  type="text"
                  id="company"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Acme Inc."
                  value={jobInfo.company}
                  onChange={(e) => setJobInfo({...jobInfo, company: e.target.value})}
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowTrackJobModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleTrackJob}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center"
                  disabled={isTrackingJob}
                >
                  {isTrackingJob ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiBriefcase className="mr-2" />
                      Add to Tracker
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoverLetterEditor;
