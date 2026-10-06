import api from './api';

export const profileService = {
  getProfile: async () => {
    return await api.get('/jobseeker/profile');
  },

  updateProfile: async (data) => {
    return await api.put('/jobseeker/profile', data);
  },

  uploadPhoto: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return await api.post('/jobseeker/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  addEducation: async (edu) => {
    return await api.post('/jobseeker/education', edu);
  },

  deleteEducation: async (id) => {
    return await api.delete(`/jobseeker/education/${id}`);
  },

  addExperience: async (exp) => {
    return await api.post('/jobseeker/experience', exp);
  },

  deleteExperience: async (id) => {
    return await api.delete(`/jobseeker/experience/${id}`);
  },

  saveJob: async (jobId) => {
    return await api.post(`/jobseeker/saved-jobs/${jobId}`);
  },

  removeSavedJob: async (jobId) => {
    return await api.delete(`/jobseeker/saved-jobs/${jobId}`);
  },

  getSavedJobs: async (params) => {
    return await api.get('/jobseeker/saved-jobs', { params });
  },

  getRecommendations: async () => {
    return await api.get('/jobseeker/recommendations');
  }
};
