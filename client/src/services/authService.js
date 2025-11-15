import api from './api.js';

const authService = {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      // assume response.data contains { user, token }
      const data = (response && response.data) ? response.data : response;

      // If API returned an error payload in data, throw
      if (data && data.error) {
        throw new Error(data.error);
      }

      if (data && data.token) {
        localStorage.setItem('token', data.token);
      }

      return data;
    } catch (err) {
      // If axios-style error object was provided, extract message
      const message = err && err.response && err.response.data && err.response.data.error
        ? err.response.data.error
        : (err && err.message) || 'Login failed';
      throw new Error(message);
    }
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    const data = response.data || response;
    if (data.token) localStorage.setItem('token', data.token);
    return data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('token');
    return true;
  },

  getToken() {
    return localStorage.getItem('token') || null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (e) {
      return null;
    }
  },
};

export default authService;