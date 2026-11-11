import { api } from './api.js';

export const courseService = {
  async getCourses(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.level && params.level !== 'All') query.append('level', params.level);

    const queryString = query.toString();
    const endpoint = `/courses${queryString ? `?${queryString}` : ''}`;
    const res = await api.get(endpoint);
    return res.data?.courses || [];
  },

  async getCourseById(idOrSlug) {
    const res = await api.get(`/courses/${idOrSlug}`);
    return res.data?.course;
  },

  async createCourse(courseData) {
    const res = await api.post('/courses', courseData);
    return res.data?.course;
  },

  async updateCourse(id, courseData) {
    const res = await api.patch(`/courses/${id}`, courseData);
    return res.data?.course;
  },

  async deleteCourse(id) {
    return await api.delete(`/courses/${id}`);
  },

  async getAdminCourses() {
    const res = await api.get('/admin/courses');
    return res.data?.courses || [];
  },

  // Modules
  async addModule(courseId, moduleData) {
    const res = await api.post(`/courses/${courseId}/modules`, moduleData);
    return res.data?.module;
  },

  async updateModule(moduleId, moduleData) {
    const res = await api.patch(`/modules/${moduleId}`, moduleData);
    return res.data?.module;
  },

  async deleteModule(moduleId) {
    return await api.delete(`/modules/${moduleId}`);
  },

  // Lessons
  async getLesson(lessonId) {
    const res = await api.get(`/lessons/${lessonId}`);
    return res.data?.lesson;
  },

  async addLesson(moduleId, lessonData) {
    const res = await api.post(`/modules/${moduleId}/lessons`, lessonData);
    return res.data?.lesson;
  },

  async updateLesson(lessonId, lessonData) {
    const res = await api.patch(`/lessons/${lessonId}`, lessonData);
    return res.data?.lesson;
  },

  async deleteLesson(lessonId) {
    return await api.delete(`/lessons/${lessonId}`);
  },

  // Curriculum Reordering
  async reorderCurriculum(courseId, { modules, lessons }) {
    return await api.patch(`/courses/${courseId}/reorder`, { modules, lessons });
  }
};
