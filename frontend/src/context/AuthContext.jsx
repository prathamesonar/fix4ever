import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/api.js';  

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);  

   const addNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
     setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

   useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
    setLoading(false);
  }, []);

   const updateUserInfo = (newData) => {
    setUserInfo(prev => {
        if (!prev) return null;
        const updatedInfo = { ...prev, ...newData };
        localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
        return updatedInfo;
    });
  };

   const login = async (email, password, isAdminLogin = false) => {  
    try {
      const { data } = await api.post('/auth/login', { email, password, isAdminLogin });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUserInfo(data);
      addNotification('Login successful!', 'success');
      return data; 
    } catch (error) {
      addNotification(error.response?.data?.message || 'Login failed', 'error');
      console.error('Login failed:', error);
      throw error;  
    }
  };

   const register = async (name, email, password, role, specialty) => {
    try {
      const { data } = await api.post('/auth/register', {
        name, email, password, role, specialty,
      });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUserInfo(data);
      addNotification('Registration successful!', 'success');
      return data;  
    } catch (error) {
       addNotification(error.response?.data?.message || 'Registration failed', 'error');
      console.error('Registration failed:', error);
      throw error;  
    }
  };

   const logout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    addNotification('Logged out successfully.');  
  };

  const value = {
    userInfo,
    loading,
    login,
    register,
    logout,
    notifications,  
    addNotification,  
    updateUserInfo,  
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};