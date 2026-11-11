import { api } from './api.js';

export const authService = {
  async register({ name, email, password, role }) {
    const res = await api.post('/auth/register', { name, email, password, role });
    if (res.data?.token) {
      localStorage.setItem('lms_token', res.data.token);
      localStorage.setItem('lms_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async login({ email, password }) {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.token) {
      localStorage.setItem('lms_token', res.data.token);
      localStorage.setItem('lms_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async getMe() {
    const res = await api.get('/auth/me');
    return res.data?.user;
  },

  logout() {
    localStorage.removeItem('lms_token');
    localStorage.removeItem('lms_user');
  },

  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('lms_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('lms_token');
  }
};
