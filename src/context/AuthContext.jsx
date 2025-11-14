// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Восстанавливаем пользователя из localStorage
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Сохраняем пользователя в localStorage при изменении
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (loginValue, password) => {
    setIsLoading(true);
    try {
      const data = await apiLogin(loginValue, password);
      setUser(data.user);
      return data.user;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const hasRole = (requiredRole) => {
    if (!user) return false;
    
    const roles = {
      'user': 1,
      'employee': 2,
      'leader': 3,
      'admin': 4
    };
    return roles[user.role] >= roles[requiredRole];
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    setUser,
    login,
    hasRole,
    logout,
    isLoading,
    setIsLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};