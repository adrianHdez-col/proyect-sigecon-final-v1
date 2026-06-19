import { useState } from 'react';
import { AuthContext } from './authContextValue';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const getStoredUser = () => {
  const storedUser = localStorage.getItem('user');
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    console.error('Error parsing stored user:', error);
    localStorage.removeItem('user');
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const isAuthenticated = Boolean(user);

  const persistUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const payload = await response.json();

      if (!response.ok) {
        return { success: false, error: payload.message || 'Error en el login' };
      }

      const userData = {
        id: payload.data.id,
        email: payload.data.email,
        fullName: payload.data.fullName,
        role: payload.data.role,
        company: payload.data.company,
        token: payload.data.token,
      };

      persistUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'No se pudo conectar con el servidor' };
    }
  };

  const register = async (data) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const payload = await response.json();

      if (!response.ok) {
        return { success: false, error: payload.message || 'Error en el registro' };
      }

      const userData = {
        id: payload.data.id,
        email: payload.data.email,
        fullName: payload.data.fullName,
        role: payload.data.role,
        company: payload.data.company,
        token: payload.data.token,
      };

      persistUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: 'No se pudo conectar con el servidor' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    isAuthenticated,
    loading: false,
    login,
    register,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
