import api from './api';

export const companyService = {
  getAllCompanies: async (params) => {
    return await api.get('/companies', { params });
  },

  getCompanyById: async (id) => {
    return await api.get(`/companies/${id}`);
  },

  saveEmployerCompany: async (companyData) => {
    return await api.post('/employer/company', companyData);
  },

  uploadLogo: async (companyId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return await api.post(`/employer/company/${companyId}/logo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};
