import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../../contexts/AuthContext';
import authService from '../../../services/authService';

// Mock the auth service
jest.mock('../../../services/authService');

describe('useAuth Hook', () => {
  const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should initialize with null user', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should login user successfully', async () => {
    const mockUser = { _id: '1', username: 'testuser', email: 'test@example.com' };
    const mockToken = 'mock-jwt-token';
    
    authService.login.mockResolvedValue({ user: mockUser, token: mockToken });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('should handle login failure', async () => {
    const errorMessage = 'Invalid credentials';
    authService.login.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      try {
        await result.current.login('test@example.com', 'wrongpassword');
      } catch (error) {
        expect(error.message).toBe(errorMessage);
      }
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should logout user', async () => {
    const mockUser = { _id: '1', username: 'testuser' };
    const mockToken = 'mock-jwt-token';
    
    authService.login.mockResolvedValue({ user: mockUser, token: mockToken });
    authService.logout.mockResolvedValue();

    const { result } = renderHook(() => useAuth(), { wrapper });

    // First login
    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    expect(result.current.isAuthenticated).toBe(true);

    // Then logout
    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(authService.logout).toHaveBeenCalled();
  });
});