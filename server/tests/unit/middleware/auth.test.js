// Ensure the User model is mocked before any requires that import it
jest.mock('../../../src/models/User');

const jwt = require('jsonwebtoken');
const { authenticate } = require('../../../src/middleware/auth');
const User = require('../../../src/models/User');

describe('Authentication Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      header: jest.fn(),
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    
    // Clear all mocks
    jest.clearAllMocks();
    // Ensure User.findById is a mock function (some environments don't auto-mock Mongoose statics)
    if (!User.findById || !User.findById.mock) {
      User.findById = jest.fn();
    }
  });

  test('should call next with user when valid token is provided', async () => {
    const mockUser = {
      _id: '507f1f77bcf86cd799439011',
      username: 'testuser',
      email: 'test@example.com',
    };
    
  const token = jwt.sign({ userId: mockUser._id }, process.env.JWT_SECRET || 'fallback-secret');
  mockReq.header.mockReturnValue(`Bearer ${token}`);
  // Mock a Mongoose query: findById(...).select(...)
  User.findById = jest.fn(() => ({ select: jest.fn().mockResolvedValue(mockUser) }));

    await authenticate(mockReq, mockRes, mockNext);

    expect(mockReq.user).toEqual(mockUser);
    expect(mockNext).toHaveBeenCalled();
  });

  test('should return 401 when no token is provided', async () => {
    mockReq.header.mockReturnValue(null);

    await authenticate(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Access denied. No token provided.',
    });
  });

  test('should return 401 when invalid token is provided', async () => {
    mockReq.header.mockReturnValue('Bearer invalid-token');

    await authenticate(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Invalid token.',
    });
  });

  test('should return 401 when user not found', async () => {
  const token = jwt.sign({ userId: '507f1f77bcf86cd799439011' }, process.env.JWT_SECRET || 'fallback-secret');
  mockReq.header.mockReturnValue(`Bearer ${token}`);
  // Return a query that resolves to null
  User.findById = jest.fn(() => ({ select: jest.fn().mockResolvedValue(null) }));

    await authenticate(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'User not found.',
    });
  });

  test('should handle database errors', async () => {
  const token = jwt.sign({ userId: '507f1f77bcf86cd799439011' }, process.env.JWT_SECRET || 'fallback-secret');
    mockReq.header.mockReturnValue(`Bearer ${token}`);
    
  // Simulate a database error that occurs when selecting fields from the query
  User.findById = jest.fn(() => ({ select: jest.fn(() => Promise.reject(new Error('Database connection failed'))) }));

    await authenticate(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Server error during authentication.',
    });
  });
});