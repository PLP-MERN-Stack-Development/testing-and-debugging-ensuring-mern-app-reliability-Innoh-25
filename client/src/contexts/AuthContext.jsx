import React, { createContext, useState, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    // Delegate to authService so tests can mock the service
    const resp = await authService.login(email, password);
    // authService.login is expected to return { user, token }
    if (resp && resp.user) {
      setUser(resp.user);
      // store token if present
      if (resp.token) localStorage.setItem('token', resp.token);
      return resp;
    }
    return null;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    localStorage.removeItem('token');
  };

  const register = async (userData) => {
    const mockUser = { _id: '1', username: userData.username, email: userData.email };
    setUser(mockUser);
    return mockUser;
  };

  const value = {
    user,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    loading: false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;