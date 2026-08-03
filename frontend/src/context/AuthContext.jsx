import React, { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cake_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('cake_token'));
  const [loading, setLoading] = useState(false);

  const login = async (tendn, matkhau) => {
    setLoading(true);
    try {
      const res = await authApi.login({ tendn, matkhau });
      const { user: userData, token: jwtToken } = res.data;
      
      setUser(userData);
      setToken(jwtToken);
      
      localStorage.setItem('cake_user', JSON.stringify(userData));
      localStorage.setItem('cake_token', jwtToken);

      return userData;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authApi.register(userData);
      const { user: newUser, token: jwtToken } = res.data;

      setUser(newUser);
      setToken(jwtToken);

      localStorage.setItem('cake_user', JSON.stringify(newUser));
      localStorage.setItem('cake_token', jwtToken);

      return newUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cake_user');
    localStorage.removeItem('cake_token');
  };

  const userRole = user?.role ? user.role.toUpperCase() : '';
  const isAdmin = ['ADMIN', 'QUẢN LÝ', 'QUẢN TRỊ', 'NHÂN VIÊN'].includes(userRole);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
