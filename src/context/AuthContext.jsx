import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import authService from '../services/authService';
import { normalizeUser } from '../utils/modelMapper';

const AuthContext = createContext();

const getStoredUser = () => {
  try {
    return normalizeUser(JSON.parse(localStorage.getItem('user')));
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authService.getProfile();
        setUser(normalizeUser(response.data || response.user));
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    setUser(normalizeUser(response.data?.user || response.user));
    return response;
  };

  const register = async (data) => {
    return await authService.register(data);
  };

  const updateProfile = async (data) => {
    const response = await authService.updateProfile(data);
    setUser(normalizeUser(response.data || response.user));
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        updateProfile,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;