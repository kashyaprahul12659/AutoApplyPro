import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSpinner, FaTrash, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import EmptyState from '../common/EmptyState';

const AnalyzerHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const response = await axios.get('/api/ai/analyzer-history', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setHistory(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching analyzer history:', err);
        setError('Failed to load analysis history. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this analysis?')) {
      try {
        const token = localStorage.getItem('token');
        
        await axios.delete(`/api/ai/analyzer-history/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Remove from state
        setHistory(history.filter(item => item._id !== id));
      } catch (err) {
        console.error('Error deleting analysis:', err);
        setError('Failed to delete analysis. Please try again.');
      }
    }
  };

  const handleViewAnalysis = (id) => {
    // We could implement a detailed view page or modal
    // For now, we'll just navigate to the analyzer with the ID as a param
    navigate(`/jd-analyzer?id=${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <FaSpinner className="animate-spin text-3xl text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
        <p>{error}</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <EmptyState
        type="analyzer"
        title="No Analysis History"
        message="You haven't analyzed any job descriptions yet. Compare your resume with job descriptions to see how well you match the requirements."
        actionText="Analyze a Job Description"
        onAction={() => navigate('/jd-analyzer')}
      />
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-4">Your Analysis History</h3>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Match Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {history.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.jobTitle}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {item.descriptionSnippet}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium 
                      ${item.matchScore >= 70 ? 'text-green-600' : 
                        item.matchScore >= 40 ? 'text-yellow-600' : 'text-red-600'}`
                    }>
                      {item.matchScore}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => handleViewAnalysis(item._id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Analysis"
                      >
                        <FaEye />
                      </button>
                      <button 
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Analysis"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyzerHistory;
