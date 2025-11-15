import api from './api.js';

const bugService = {
  async getBugs(params = {}) {
    // params will be turned into query string, e.g., { mine: true }
    const response = await api.get('/bugs', { params });
    return response.data;
  },

  async getBugById(id) {
    const response = await api.get(`/bugs/${id}`);
    return response.data;
  },

  async createBug(bugData) {
    const response = await api.post('/bugs', bugData);
    return response.data;
  },

  async updateBug(id, bugData) {
    const response = await api.put(`/bugs/${id}`, bugData);
    return response.data;
  },

  async deleteBug(id) {
    const response = await api.delete(`/bugs/${id}`);
    return response.data;
  },
};

export default bugService;