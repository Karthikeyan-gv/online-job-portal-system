import api from './api';

export const resumeService = {
  getResumes: async () => {
    return await api.get('/jobseeker/resumes');
  },

  uploadResume: async (file, isPrimary = false) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('isPrimary', isPrimary);
    return await api.post('/jobseeker/resumes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  deleteResume: async (id) => {
    return await api.delete(`/jobseeker/resumes/${id}`);
  },

  setPrimary: async (id) => {
    return await api.put(`/jobseeker/resumes/${id}/primary`);
  }
};
