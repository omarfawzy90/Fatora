import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api.js';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        setAuthState({
          token: token,
          user: { name: 'Logged In User' }, 
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setAuthState({ ...authState, isLoading: false });
      }
    };
    loadToken();
  }, []);

  const register = async (firstName, lastName, email, password, passwordConfirmation) => {
    try {
      const response = await api.post('/register', {
        first_name: firstName,
        second_name: lastName,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      await login(email, password);
    } catch (error) {
      console.error('Registration failed:', error.response.data);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      const { access_token, user } = response.data;
      await AsyncStorage.setItem('auth_token', access_token);
      setAuthState({
        token: access_token,
        user: user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Login failed:', error.response.data);
      throw error;
    }
  };

  const logout = async () => {
    try {
        await api.post('/logout');
    } catch(error) {
        console.error("Logout failed:", error.response.data);
    } finally {
        await AsyncStorage.removeItem('auth_token');
        setAuthState({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
    }
  };

  return (
    <AuthContext.Provider value={{ authState, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };