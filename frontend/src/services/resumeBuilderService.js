import axios from 'axios';

const API_URL = '/api/resume-builder';
const AI_API_URL = '/api/resume-ai';

// Get auth token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Create a new resume
export const createResume = async (resumeData) => {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}/create`, resumeData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to create resume' };
  }
};

// Get all resumes for the current user
export const getAllResumes = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/all`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch resumes' };
  }
};

// Get a specific resume by ID
export const getResumeById = async (resumeId) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/${resumeId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch resume' };
  }
};

// Update an existing resume
export const updateResume = async (resumeId, updateData) => {
  try {
    const token = getToken();
    const response = await axios.put(`${API_URL}/update/${resumeId}`, updateData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to update resume' };
  }
};

// Delete a resume
export const deleteResume = async (resumeId) => {
  try {
    const token = getToken();
    const response = await axios.delete(`${API_URL}/${resumeId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to delete resume' };
  }
};

// Duplicate an existing resume
export const duplicateResume = async (resumeId) => {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}/duplicate/${resumeId}`, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to duplicate resume' };
  }
};

// Improve a resume block with AI
export const improveResumeBlock = async (blockType, content, targetRole = '') => {
  try {
    const token = getToken();
    const response = await axios.post(`${AI_API_URL}/improve-resume-block`, {
      blockType,
      content,
      targetRole
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to improve resume block with AI' };
  }
};
