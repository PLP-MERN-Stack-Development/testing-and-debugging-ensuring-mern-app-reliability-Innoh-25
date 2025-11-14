// Mock auth service for testing
const authService = {
  async login(email, password) {
    // Mock implementation
    return {
      user: { _id: '1', username: 'testuser', email: 'test@example.com' },
      token: 'mock-token'
    };
  },

  async register(userData) {
    return {
      user: { _id: '1', username: userData.username, email: userData.email },
      token: 'mock-token'
    };
  },

  async logout() {
    return true;
  },

  async getCurrentUser() {
    return { _id: '1', username: 'testuser', email: 'test@example.com' };
  }
};

export default authService;