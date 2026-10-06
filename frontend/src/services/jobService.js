import api from './api';

export const jobService = {
  getJobs: async (params) => {
    return await api.get('/jobs', { params });
  },

  getJobById: async (id) => {
    return await api.get(`/jobs/${id}`);
  },

  getCategories: async () => {
    return await api.get('/categories');
  },

  getSkills: async () => {
    return await api.get('/skills');
  },

  // Employer APIs
  postJob: async (jobData) => {
    return await api.post('/employer/jobs', jobData);
  },

  updateJob: async (id, jobData) => {
    return await api.put(`/employer/jobs/${id}`, jobData);
  },

  deleteJob: async (id) => {
    return await api.delete(`/employer/jobs/${id}`);
  },

  toggleJobStatus: async (id) => {
    return await api.put(`/employer/jobs/${id}/toggle-status`);
  },

  getEmployerJobs: async (params) => {
    return await api.get('/employer/jobs', { params });
  }
};
