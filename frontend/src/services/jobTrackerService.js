import { createApiCall } from '../utils/apiUtils';

/**
 * Get all job applications for the current user
 * @returns {Promise} Promise object with job applications data
 */
export const getAllJobApplications = async () => {
  return await createApiCall('GET', '/job-tracker/all');
};

/**
 * Add a new job application
 * @param {Object} jobData - Job application data
 * @returns {Promise} Promise object with created job application
 */
export const addJobApplication = async (jobData) => {
  return await createApiCall('POST', '/job-tracker/add', jobData);
};

/**
 * Update job application status
 * @param {string} jobId - Job application ID
 * @param {string} status - New status
 * @returns {Promise} Promise object with updated job application
 */
export const updateJobStatus = async (jobId, status) => {
  return await createApiCall('PUT', `/job-tracker/update-status/${jobId}`, { status });
};

/**
 * Update job application details
 * @param {string} jobId - Job application ID
 * @param {Object} jobData - Updated job application data
 * @returns {Promise} Promise object with updated job application
 */
export const updateJobApplication = async (jobId, jobData) => {
  return await createApiCall('PUT', `/job-tracker/${jobId}`, jobData);
};

/**
 * Delete job application
 * @param {string} jobId - Job application ID
 * @returns {Promise} Promise object with deletion status
 */
export const deleteJobApplication = async (jobId) => {
  return await createApiCall('DELETE', `/job-tracker/${jobId}`);
};
