import { useState } from 'react';
import { AuthContext } from './authContextValue';

const getStoredUser = () => {
  const storedUser = localStorage.getItem('user');
  if (!storedUser) return null;

  try {
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role === 'candidate') {
      return { ...parsedUser, role: 'aspirant', profile: 'Aspirante' };
    }
    return parsedUser;
  } catch (error) {
    console.error('Error parsing stored user:', error);
    localStorage.removeItem('user');
    return null;
  }
};

const roleProfiles = {
  admin: 'Administrador',
  recruiter: 'Reclutador',
  evaluator: 'Evaluador',
  aspirant: 'Aspirante',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const isAuthenticated = Boolean(user);

  const login = (email, password) => {
    const mockUsers = {
      'admin@sigecon.com': {
        id: 1,
        email: 'admin@sigecon.com',
        name: 'Administrador',
        role: 'admin',
        profile: roleProfiles.admin,
      },
      'hr@sigecon.com': {
        id: 2,
        email: 'hr@sigecon.com',
        name: 'Gerente de RRHH',
        role: 'recruiter',
        profile: roleProfiles.recruiter,
      },
      'evaluador@sigecon.com': {
        id: 3,
        email: 'evaluador@sigecon.com',
        name: 'Laura Evaluadora',
        role: 'evaluator',
        profile: roleProfiles.evaluator,
      },
      'aspirante@sigecon.com': {
        id: 4,
        email: 'aspirante@sigecon.com',
        name: 'Juan Perez',
        role: 'aspirant',
        profile: roleProfiles.aspirant,
      },
    };

    if (mockUsers[email] && password === 'password123') {
      const userData = mockUsers[email];
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, user: userData };
    }

    return { success: false, error: 'Email o contrasena invalida' };
  };

  const register = (data) => {
    const userData = {
      id: Date.now(),
      email: data.email,
      name: data.fullName,
      role: data.role,
      profile: roleProfiles[data.role],
      company: data.company,
    };

    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return { success: true };
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
