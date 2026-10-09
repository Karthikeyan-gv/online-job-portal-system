import api from './api';

export const notificationService = {
  getNotifications: async () => {
    return await api.get('/notifications');
  },

  getUnreadCount: async () => {
    return await api.get('/notifications/unread-count');
  },

  markAsRead: async (id) => {
    return await api.put(`/notifications/${id}/read`);
  },

  markAllAsRead: async () => {
    return await api.put('/notifications/read-all');
  }
};
