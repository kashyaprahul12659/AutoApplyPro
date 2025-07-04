import { createApiCall } from '../utils/apiUtils';

const API_URL = '/resume-builder';
const AI_API_URL = '/resume-ai';

// Create a new resume
export const createResume = async (resumeData) => {
  return await createApiCall('post', `${API_URL}/create`, resumeData);
};

// Get all resumes for the current user with defensive programming
export const getAllResumes = async () => {
  try {
    // Add defensive check for createApiCall
    if (typeof createApiCall !== 'function') {
      console.warn('createApiCall is not a function:', createApiCall);
      return { error: true, message: 'API call function is not available', data: [] };
    }
    
    const result = await createApiCall('get', `${API_URL}/all`);
    return result || { error: false, data: [] };
  } catch (error) {
    console.error('Error in getAllResumes:', error);
    return { error: true, message: error.message || 'Failed to fetch resumes', data: [] };
  }
};

// Get a specific resume by ID with defensive programming
export const getResumeById = async (resumeId) => {
  try {
    if (!resumeId) {
      console.warn('Invalid resumeId provided:', resumeId);
      return { error: true, message: 'Invalid resume ID', data: null };
    }
    
    // Add defensive check for createApiCall
    if (typeof createApiCall !== 'function') {
      console.warn('createApiCall is not a function:', createApiCall);
      return { error: true, message: 'API call function is not available', data: null };
    }
    
    const result = await createApiCall('get', `${API_URL}/${resumeId}`);
    return result || { error: false, data: null };
  } catch (error) {
    console.error('Error in getResumeById:', error);
    return { error: true, message: error.message || 'Failed to fetch resume', data: null };
  }
};

// Update an existing resume
export const updateResume = async (resumeId, updateData) => {
  return await createApiCall('put', `${API_URL}/update/${resumeId}`, updateData);
};

// Delete a resume
export const deleteResume = async (resumeId) => {
  return await createApiCall('delete', `${API_URL}/${resumeId}`);
};

// Duplicate an existing resume
export const duplicateResume = async (resumeId) => {
  return await createApiCall('post', `${API_URL}/duplicate/${resumeId}`, {});
};

// Improve a resume block with AI
export const improveResumeBlock = async (blockType, content, targetRole = '') => {
  return await createApiCall('post', `${AI_API_URL}/improve-resume-block`, {
    blockType,
    content,
    targetRole
  });
};
