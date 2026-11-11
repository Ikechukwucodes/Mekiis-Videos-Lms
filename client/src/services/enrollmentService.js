import { api } from './api.js';

export const enrollmentService = {
  async enroll(courseId) {
    const res = await api.post(`/courses/${courseId}/enroll`);
    return res.data;
  },

  async getMyCourses() {
    const res = await api.get('/me/courses');
    return res.data?.courses || [];
  },

  async getAdminEnrollments() {
    const res = await api.get('/admin/enrollments');
    return res.data?.enrollments || [];
  }
};

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
