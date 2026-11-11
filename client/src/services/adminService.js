import { api } from './api.js';

export const adminService = {
  async getAnalytics() {
    const res = await api.get('/admin/analytics');
    return res.data?.stats;
  },

  async getUsers() {
    const res = await api.get('/admin/users');
    return res.data?.users || [];
  },

  async getStudentProgress(userId, courseId) {
    const res = await api.get(`/admin/users/${userId}/courses/${courseId}/progress`);
    return res.data;
  }
};
