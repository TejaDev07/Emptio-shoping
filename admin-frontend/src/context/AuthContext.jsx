import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('token');
    const adminUser = localStorage.getItem('adminUser');
    
    if (token && adminUser) {
      // User is already logged in
      try {
        const userData = JSON.parse(adminUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing admin user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('adminUser');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await adminApi.login(email, password);
      const { user, token } = response;
      
      setUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('adminUser', JSON.stringify(user));
      
      return { user, token };
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminUser');
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};