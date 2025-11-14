const authController = require('../../../src/controllers/authController');
const User = require('../../../src/models/User');
const { generateToken } = require('../../../src/utils/auth');

// Mock dependencies
jest.mock('../../../src/models/User');
jest.mock('../../../src/utils/auth');

describe('Auth Controller', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      body: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      mockReq.body = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      };

      User.findOne.mockResolvedValue(null);
      User.prototype.save = jest.fn().mockResolvedValue({
        _id: '507f1f77bcf86cd799439011',
        username: 'newuser',
        email: 'new@example.com',
      });
      generateToken.mockReturnValue('mock-jwt-token');

      await authController.register(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User registered successfully',
        user: {
          _id: '507f1f77bcf86cd799439011',
          username: 'newuser',
          email: 'new@example.com',
        },
        token: 'mock-jwt-token',
      });
    });

    it('should return 400 if user already exists', async () => {
      mockReq.body = {
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'password123',
      };

      User.findOne.mockResolvedValue({
        email: 'existing@example.com',
        username: 'existinguser',
      });

      await authController.register(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Email already registered',
      });
    });

    it('should handle validation errors', async () => {
      mockReq.body = {
        username: 'ab', // Too short
        email: 'invalid-email',
        password: '123', // Too short
      };

      const validationError = {
        name: 'ValidationError',
        errors: {
          username: { message: 'Username must be at least 3 characters long' },
          email: { message: 'Please enter a valid email' },
          password: { message: 'Password must be at least 6 characters long' },
        },
      };

      User.findOne.mockResolvedValue(null);
      User.prototype.save = jest.fn().mockRejectedValue(validationError);

      await authController.register(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        username: 'testuser',
        email: 'test@example.com',
        comparePassword: jest.fn().mockResolvedValue(true),
      };

      User.findOne.mockResolvedValue(mockUser);
      generateToken.mockReturnValue('mock-jwt-token');

      await authController.login(mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Login successful',
        user: {
          _id: '507f1f77bcf86cd799439011',
          username: 'testuser',
          email: 'test@example.com',
        },
        token: 'mock-jwt-token',
      });
    });

    it('should return 401 for invalid credentials', async () => {
      mockReq.body = {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      };

      User.findOne.mockResolvedValue(null);

      await authController.login(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Invalid email or password',
      });
    });
  });
});