import axios from 'axios';

// Create an instance of axios with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Authentication APIs
export const authAPI = {
  register: userData => api.post('/auth/register', userData),
  login: userData => api.post('/auth/login', userData),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: userData => api.put('/users/profile', userData),
  updatePassword: passwordData => api.put('/users/password', passwordData)
};

// Resume APIs
export const resumeAPI = {
  uploadResume: formData => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
    return api.post('/resumes', formData, config);
  },
  getResumes: () => api.get('/resumes'),
  getResume: id => api.get(`/resumes/${id}`),
  deleteResume: id => api.delete(`/resumes/${id}`),
  setPrimaryResume: id => api.put(`/resumes/${id}/primary`)
};

// History APIs
export const historyAPI = {
  createHistory: historyData => api.post('/history', historyData),
  getHistory: () => api.get('/history'),
  getHistoryItem: id => api.get(`/history/${id}`),
  deleteHistory: id => api.delete(`/history/${id}`)
};

export default api;