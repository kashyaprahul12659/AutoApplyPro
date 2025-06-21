import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSpinner, FaCheck, FaTimes, FaRegLightbulb } from 'react-icons/fa';
import { FiBriefcase } from 'react-icons/fi';
import ProUpgradeModal from '../coverletter/ProUpgradeModal';
import ExportAnalysisButton from './ExportAnalysisButton';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const JDAnalyzer = ({ userProfile, preloadedAnalysis = null }) => {
  const navigate = useNavigate();
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [editableSuggestions, setEditableSuggestions] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [isTrackingJob, setIsTrackingJob] = useState(false);
  const [showTrackJobModal, setShowTrackJobModal] = useState(false);

  // Load preloaded analysis if provided
  useEffect(() => {
    if (preloadedAnalysis) {
      setResult(preloadedAnalysis);
      setEditableSuggestions(preloadedAnalysis.suggestions || []);
      setJobDescription(preloadedAnalysis.descriptionSnippet || '');

      // Try to extract job title and company from description
      if (preloadedAnalysis.descriptionSnippet) {
        const lines = preloadedAnalysis.descriptionSnippet.split('\n');
        const firstLine = lines[0] || '';

        // Simple heuristic - first line often contains job title
        if (firstLine.length > 0 && firstLine.length < 100) {
          setJobTitle(firstLine.trim());
        }

        // Try to find company name in first few lines
        const companyLine = lines.slice(0, 5).find(line =>
          line.toLowerCase().includes('company') ||
          line.toLowerCase().includes('at ') ||
          line.toLowerCase().includes('with ')
        );

        if (companyLine) {
          const companyMatch = companyLine.match(/at\s+([^,]+)/i) ||
                            companyLine.match(/with\s+([^,]+)/i) ||
                            companyLine.match(/company:\s*([^,]+)/i);

          if (companyMatch && companyMatch[1]) {
            setCompany(companyMatch[1].trim());
          }
        }
      }
    }
  }, [preloadedAnalysis]);

  // Handle adding job to tracker
  const handleTrackJob = async () => {
    if (!jobTitle || !company) {
      toast.error('Job title and company are required');
      return;
    }

    setIsTrackingJob(true);

    try {
      const token = localStorage.getItem('token');      // Create a new job application with the analyzer result linked
      await axios.post(
        '/api/job-tracker/add',
        {
          jobTitle,
          company,
          status: 'interested',
          linkedAnalyzerResultId: result._id,
          jdUrl: '', // Optional
          notes: `Match Score: ${result.matchScore}%\n\nKey Skills: ${result.matchedSkills.slice(0, 5).join(', ')}` // Add some useful notes
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!jobDescription || jobDescription.length < 50) {
      setError('Please provide a detailed job description (at least 50 characters).');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        '/api/ai/analyze-jd',
        { jobDescription },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setResult(response.data.data);
      setEditableSuggestions(response.data.data.suggestions);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);

      if (err.response && err.response.data.requiresUpgrade) {
        setShowUpgradeModal(true);
      } else {
        setError(err.response?.data?.error || 'Failed to analyze job description. Please try again.');
      }
    }
  };

  const handleModalClose = () => {
    setShowUpgradeModal(false);
  };

  const handleModalSuccess = () => {
    setShowUpgradeModal(false);
    // Retry analysis after successful upgrade
    handleSubmit({ preventDefault: () => {} });
  };

  const handleSuggestionChange = (index, value) => {
    const updatedSuggestions = [...editableSuggestions];
    updatedSuggestions[index] = value;
    setEditableSuggestions(updatedSuggestions);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">JD Skill Analyzer</h2>
        <p className="text-gray-600 mb-4">
          Paste a job description to analyze how well your resume matches the requirements.
          Get insights on skill gaps and suggestions to improve your application.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="jobDescription" className="block text-gray-700 font-medium mb-2">
              Job Description
            </label>
            <textarea
              id="jobDescription"
              rows="10"
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Paste the full job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              required
            ></textarea>
          </div>

          {error && (
            <div className="mb-4 text-red-500 p-2 bg-red-100 rounded-md">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              'Analyze Job Description'
            )}
          </button>
        </form>
      </div>

      {result && (
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Analysis results summary */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Analysis Results</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-blue-700 font-bold text-3xl mb-1">{result.matchScore}%</div>
                <div className="text-blue-600 font-medium">Resume Match</div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-green-700 font-bold text-3xl mb-1">{result.matchedSkills.length}</div>
                <div className="text-green-600 font-medium">Matched Skills</div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-red-700 font-bold text-3xl mb-1">{result.missingSkills.length}</div>
                <div className="text-red-600 font-medium">Missing Skills</div>
              </div>
            </div>

            {/* For job tracking */}
            <div className="mb-4 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-2">Job Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 text-sm mb-1">Job Title</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Software Engineer"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm mb-1">Company</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Acme Inc."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Skills comparison */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Skills Analysis</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="flex items-center text-green-700 font-medium mb-2">
                  <FaCheck className="mr-2" /> Matched Skills
                </h4>
                <ul className="space-y-1">
                  {result.matchedSkills.map((skill, index) => (
                    <li key={`matched-${index}`} className="bg-green-50 px-3 py-2 rounded text-green-800">
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="flex items-center text-red-700 font-medium mb-2">
                  <FaTimes className="mr-2" /> Missing Skills
                </h4>
                <ul className="space-y-1">
                  {result.missingSkills.map((skill, index) => (
                    <li key={`missing-${index}`} className="bg-red-50 px-3 py-2 rounded text-red-800">
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Improvement suggestions */}
          <div className="mb-6">
            <h3 className="flex items-center text-lg font-semibold mb-3">
              <FaRegLightbulb className="mr-2 text-yellow-500" /> Improvement Suggestions
            </h3>

            {editableSuggestions && editableSuggestions.length > 0 ? (
              <ul className="space-y-3">
                {editableSuggestions.map((suggestion, index) => (
                  <li key={`suggestion-${index}`} className="bg-yellow-50 p-3 rounded">
                    <textarea
                      value={suggestion}
                      onChange={(e) => handleSuggestionChange(index, e.target.value)}
                      className="w-full bg-transparent border-none focus:outline-none resize-none"
                      rows={2}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No suggestions available.</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap justify-end mt-4 gap-3">
            <button
              onClick={() => setShowTrackJobModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center"
            >
              <FiBriefcase className="mr-2" />
              Track This Job
            </button>

            <ExportAnalysisButton result={result} jobTitle={jobTitle} />

            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              onClick={() => setResult(null)}
            >
              Reset
            </button>

            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={() => {
                if (userProfile.hasPaidPlan) {
                  navigate('/cover-letter-generator', {
                    state: {
                      preloadedSkills: result.matchedSkills.join(', '),
                      jobDescription,
                      jobTitle
                    }
                  });
                } else {
                  setShowUpgradeModal(true);
                }
              }}
            >
              Generate Cover Letter
            </button>
          </div>
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
                Add this job to your application tracker. You'll be able to monitor your progress and keep track of all your applications in one place.
              </p>

              <div className="mb-4">
                <label htmlFor="modalJobTitle" className="block text-gray-700 font-medium mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  id="modalJobTitle"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Software Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="modalCompany" className="block text-gray-700 font-medium mb-2">
                  Company *
                </label>
                <input
                  type="text"
                  id="modalCompany"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Acme Inc."
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
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

      {showUpgradeModal && (
        <ProUpgradeModal
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
};

export default JDAnalyzer;
