import React, { useState, useRef } from 'react';
import { FiX } from 'react-icons/fi';
import { addJobApplication } from '../../services/jobTrackerService';
import LoadingButton from '../common/LoadingButton';
import AlertMessage from '../common/AlertMessage';

const AddJobModal = ({ onClose, onJobAdded }) => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    location: '',
    jdUrl: '',
    status: 'interested',
    notes: '',
    color: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const modalRef = useRef();
  
  // Color options for tagging
  const colorOptions = [
    { value: '#FF5733', label: 'Red', class: 'bg-red-500' },
    { value: '#FFC300', label: 'Yellow', class: 'bg-yellow-500' },
    { value: '#36A2EB', label: 'Blue', class: 'bg-blue-500' },
    { value: '#4BC0C0', label: 'Teal', class: 'bg-teal-500' },
    { value: '#9966FF', label: 'Purple', class: 'bg-purple-500' },
    { value: '#2ECC71', label: 'Green', class: 'bg-green-500' }
  ];

  // Handle background click (close modal when clicking outside)
  const handleBackgroundClick = (e) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle color selection
  const handleColorSelect = (color) => {
    setFormData(prev => ({ ...prev, color: color }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.jobTitle || !formData.company) {
      setError('Job title and company are required.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      await addJobApplication(formData);
      onJobAdded();
      onClose();
    } catch (err) {
      console.error('Error adding job application:', err);
      setError('Failed to add job application. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div 
      ref={modalRef}
      onClick={handleBackgroundClick}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">Add New Job</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          {error && (
            <AlertMessage
              type="error"
              message={error}
              onClose={() => setError(null)}
              className="mb-4"
            />
          )}
          
          <div className="mb-4">
            <label htmlFor="jobTitle" className="block text-gray-700 font-medium mb-2">
              Job Title *
            </label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Software Engineer"
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
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Acme Inc."
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="San Francisco, CA (Remote)"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="jdUrl" className="block text-gray-700 font-medium mb-2">
              Job Description URL
            </label>
            <input
              type="url"
              id="jdUrl"
              name="jdUrl"
              value={formData.jdUrl}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://company.com/careers/job-123"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="status" className="block text-gray-700 font-medium mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="interested">Interested</option>
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Color Tag (Optional)
            </label>
            <div className="flex space-x-2">
              <div 
                onClick={() => handleColorSelect('')}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer ${
                  formData.color === '' ? 'border-blue-500' : 'border-gray-300'
                }`}
                title="No color"
              >
                <FiX size={14} className="text-gray-500" />
              </div>
              
              {colorOptions.map(color => (
                <div 
                  key={color.value}
                  onClick={() => handleColorSelect(color.value)}
                  className={`w-6 h-6 rounded-full ${color.class} cursor-pointer ${
                    formData.color === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                  title={color.label}
                ></div>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="notes" className="block text-gray-700 font-medium mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add any notes about this job application..."
              rows={4}
            />
          </div>
          
          <div className="flex justify-end mt-6 space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <LoadingButton
              type="submit"
              isLoading={loading}
              loadingText="Adding..."
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Job
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobModal;
