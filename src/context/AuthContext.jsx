import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import authService from '../services/authService';
import { normalizeUser } from '../utils/modelMapper';

const AuthContext = createContext();
const SESSION_FLAG_KEY = 'session_active';

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
      const hasStoredUser = !!getStoredUser();
      const hasSessionHint = localStorage.getItem(SESSION_FLAG_KEY) === '1';

      if (!hasStoredUser && !hasSessionHint) {
        setLoading(false);
        return;
      }

      try {
        const response = await authService.getProfile();
        setUser(normalizeUser(response.data || response.user));
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem(SESSION_FLAG_KEY);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    let normalizedUser = normalizeUser(response.data?.user || response.user);

    if (!normalizedUser) {
      try {
        const profileResponse = await authService.getProfile();
        normalizedUser = normalizeUser(profileResponse.data || profileResponse.user);
      } catch {
        // Keep the original response handling if profile fetch is unavailable.
      }
    }

    setUser(normalizedUser);
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
        isAuthenticated: !!user || !!getStoredUser() || localStorage.getItem(SESSION_FLAG_KEY) === '1',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;