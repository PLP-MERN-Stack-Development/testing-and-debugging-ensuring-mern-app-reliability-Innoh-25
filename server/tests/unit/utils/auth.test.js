const jwt = require('jsonwebtoken');
const { generateToken, verifyToken } = require('../../../src/utils/auth');

jest.mock('jsonwebtoken');

describe('Auth Utils', () => {
  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    username: 'testuser',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateToken', () => {
    it('should generate a token with correct payload and options', () => {
      const mockToken = 'mock.jwt.token';
      jwt.sign.mockReturnValue(mockToken);

      const token = generateToken(mockUser);

      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: mockUser._id },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '24h' }
      );
      expect(token).toBe(mockToken);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const mockToken = 'mock.jwt.token';
      const mockDecoded = { userId: mockUser._id };
      
      jwt.verify.mockReturnValue(mockDecoded);

      const decoded = verifyToken(mockToken);

      expect(jwt.verify).toHaveBeenCalledWith(
        mockToken,
        process.env.JWT_SECRET || 'fallback-secret'
      );
      expect(decoded).toEqual(mockDecoded);
    });

    it('should throw error for invalid token', () => {
      const mockToken = 'invalid.token';
      
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => {
        verifyToken(mockToken);
      }).toThrow('Invalid token');
    });
  });
});