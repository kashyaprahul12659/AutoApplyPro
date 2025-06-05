import axios from 'axios';
import { getAPIBaseUrl } from '../config';

const API_URL = `${getAPIBaseUrl()}/job-tracker`;

/**
 * Get all job applications for the current user
 * @returns {Promise} Promise object with job applications data
 */
export const getAllJobApplications = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  try {
    const response = await axios.get(`${API_URL}/all`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching job applications:', error);
    throw error;
  }
};

/**
 * Add a new job application
 * @param {Object} jobData - Job application data
 * @returns {Promise} Promise object with created job application
 */
export const addJobApplication = async (jobData) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  try {
    const response = await axios.post(`${API_URL}/add`, jobData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error adding job application:', error);
    throw error;
  }
};

/**
 * Update job application status
 * @param {string} jobId - Job application ID
 * @param {string} status - New status
 * @returns {Promise} Promise object with updated job application
 */
export const updateJobStatus = async (jobId, status) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  try {
    const response = await axios.put(`${API_URL}/update-status/${jobId}`, { status }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error updating job status:', error);
    throw error;
  }
};

/**
 * Update job application details
 * @param {string} jobId - Job application ID
 * @param {Object} jobData - Updated job application data
 * @returns {Promise} Promise object with updated job application
 */
export const updateJobApplication = async (jobId, jobData) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  try {
    const response = await axios.put(`${API_URL}/${jobId}`, jobData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error updating job application:', error);
    throw error;
  }
};

/**
 * Delete job application
 * @param {string} jobId - Job application ID
 * @returns {Promise} Promise object with deletion status
 */
export const deleteJobApplication = async (jobId) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  try {
    const response = await axios.delete(`${API_URL}/${jobId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error deleting job application:', error);
    throw error;
  }
};
