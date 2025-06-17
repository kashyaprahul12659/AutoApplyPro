import { createApiCall } from '../utils/apiUtils';

const API_URL = '/api/resume-builder';
const AI_API_URL = '/api/resume-ai';

// Create a new resume
export const createResume = async (resumeData) => {
  return await createApiCall('post', `${API_URL}/create`, resumeData);
};

// Get all resumes for the current user
export const getAllResumes = async () => {
  return await createApiCall('get', `${API_URL}/all`);
};

// Get a specific resume by ID
export const getResumeById = async (resumeId) => {
  return await createApiCall('get', `${API_URL}/${resumeId}`);
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
