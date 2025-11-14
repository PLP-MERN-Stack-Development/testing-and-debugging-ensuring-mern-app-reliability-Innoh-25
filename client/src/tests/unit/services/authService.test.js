// Mock the api module before importing the service under test
jest.mock('../../../services/api');
const authService = require('../../../services/authService').default;
const api = require('../../../services/api');

describe('Auth Service', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    // ensure mocked api has expected methods
    if (!api.post) api.post = jest.fn();
    if (!api.get) api.get = jest.fn();
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const mockResponse = {
        data: {
          user: { id: 1, username: 'testuser' },
          token: 'test-token',
        },
      };
      api.post.mockResolvedValue(mockResponse);

      const result = await authService.login('test@example.com', 'password');

      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password',
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle login failure', async () => {
      const errorResponse = {
        response: { data: { error: 'Invalid credentials' } },
      };
      api.post.mockRejectedValue(errorResponse);

      await expect(authService.login('wrong@example.com', 'wrongpass'))
        .rejects.toThrow('Invalid credentials');
    });
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      localStorage.setItem('token', 'test-token');
      expect(authService.getToken()).toBe('test-token');
    });

    it('should return null when no token exists', () => {
      expect(authService.getToken()).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      localStorage.setItem('token', 'test-token');
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should return false when no token exists', () => {
      expect(authService.isAuthenticated()).toBe(false);
    });
  });
});