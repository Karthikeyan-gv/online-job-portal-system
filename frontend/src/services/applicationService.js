import api from './api';

export const applicationService = {
  applyForJob: async (data) => {
    return await api.post('/jobseeker/applications', data);
  },

  getSeekerApplications: async (params) => {
    return await api.get('/jobseeker/applications', { params });
  },

  withdrawApplication: async (id) => {
    return await api.delete(`/jobseeker/applications/${id}/withdraw`);
  },

  getApplicationHistory: async (id) => {
    return await api.get(`/jobseeker/applications/${id}/history`);
  },

  // Employer APIs
  getEmployerApplications: async (jobId) => {
    const url = jobId ? `/employer/applications?jobId=${jobId}` : '/employer/applications';
    return await api.get(url);
  },

  updateCandidateStatus: async (applicationId, status, remarks) => {
    return await api.put(`/employer/applications/${applicationId}/status`, { status, remarks });
  }
};
