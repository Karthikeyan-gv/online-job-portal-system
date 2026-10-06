import api from './api';

export const adminService = {
  getDashboardStats: async () => {
    return await api.get('/admin/dashboard');
  },

  getAllUsers: async (params) => {
    return await api.get('/admin/users', { params });
  },

  toggleUserBlock: async (id) => {
    return await api.put(`/admin/users/${id}/toggle-block`);
  },

  getPendingJobs: async (params) => {
    return await api.get('/admin/jobs/pending', { params });
  },

  approveJob: async (id) => {
    return await api.put(`/admin/jobs/${id}/approve`);
  },

  rejectJob: async (id) => {
    return await api.put(`/admin/jobs/${id}/reject`);
  },

  createCategory: async (category) => {
    return await api.post('/admin/categories', category);
  },

  deleteCategory: async (id) => {
    return await api.delete(`/admin/categories/${id}`);
  },

  createSkill: async (skill) => {
    return await api.post('/admin/skills', skill);
  },

  deleteSkill: async (id) => {
    return await api.delete(`/admin/skills/${id}`);
  }
};
