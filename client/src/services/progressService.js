import { api } from './api.js';

export const progressService = {
  async getCourseProgress(courseId) {
    const res = await api.get(`/courses/${courseId}/progress`);
    return res.data;
  },

  async completeLesson(lessonId) {
    const res = await api.post(`/lessons/${lessonId}/complete`);
    return res.data;
  },

  async updateCurrentLesson(courseId, lessonId) {
    const res = await api.patch(`/courses/${courseId}/progress/current`, { lessonId });
    return res.data?.progress;
  },

  async getStudentStats() {
    const res = await api.get('/me/stats');
    return res.data?.stats;
  },

  async getMyProgress() {
    const res = await api.get('/me/progress');
    return res.data;
  }
};
