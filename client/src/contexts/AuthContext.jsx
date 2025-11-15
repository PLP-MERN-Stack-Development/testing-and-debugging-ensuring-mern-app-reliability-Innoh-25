import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService.js';

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
    // Call server to create user and get token
    const resp = await authService.register(userData);
    // authService.register stores token in localStorage (if returned)
    if (resp && resp.user) {
      setUser(resp.user);
      return resp;
    }
    return null;
  };

  // On mount, try to load current user from token (persist login)
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const current = await authService.getCurrentUser();
        if (mounted && current) setUser(current);
      } catch (e) {
        // token might be invalid; remove it
        localStorage.removeItem('token');
      }
    };
    init();
    return () => { mounted = false; };
  }, []);

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