import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../features/auth/services/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const res = await authApi.getMe(token);
          if (res.success) {
            setCurrentUser(res.data.user);
            setRole(res.data.user.role);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Failed to restore session:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    if (res.success) {
      localStorage.setItem('accessToken', res.data.tokens.accessToken);
      localStorage.setItem('refreshToken', res.data.tokens.refreshToken);
      setCurrentUser(res.data.user);
      setRole(res.data.user.role);
      setIsAuthenticated(true);
      return res.data.user;
    }
  };

  const register = async (data) => {
    return await authApi.register(data);
  };

  const logout = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        await authApi.logout(token);
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setCurrentUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  const updateUser = (data) => {
    setCurrentUser(prev => ({ ...prev, ...data }));
  };

  const verifyOtp = async (data) => {
    const res = await authApi.verifyOtp(data);
    if (res.success && res.data && res.data.tokens) {
      localStorage.setItem('accessToken', res.data.tokens.accessToken);
      localStorage.setItem('refreshToken', res.data.tokens.refreshToken);
      setCurrentUser(res.data.user);
      setRole(res.data.user.role);
      setIsAuthenticated(true);
    }
    return res;
  };

  const resendOtp = async (data) => {
    return await authApi.resendOtp(data);
  };

  const forgotPassword = async (data) => {
    return await authApi.forgotPassword(data);
  };

  const resetPassword = async (data) => {
    return await authApi.resetPassword(data);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, role, loading, login, register, logout, verifyOtp, resendOtp, forgotPassword, resetPassword, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
