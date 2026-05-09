import axios from 'axios';

const SESSION_FLAG_KEY = 'session_active';

const envApiBaseUrl = import.meta.env.PUBLIC_API_URL || import.meta.env.VITE_API_URL;
const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const apiBaseUrl = envApiBaseUrl || (isLocalhost ? 'http://localhost:8080/api' : '/api');

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = String(error?.config?.url || '');
    const isLoginOrRegister = /\/auth\/(login|register)(?:\?|$)/.test(requestUrl);
    const isProfileEndpoint = /\/auth\/profile(?:\?|$)/.test(requestUrl);
    const currentPath = window.location.pathname;
    const isProtectedPath = currentPath.startsWith('/user') || currentPath.startsWith('/admin');

    if (error?.response?.status !== 401 || isLoginOrRegister) {
      return Promise.reject(error);
    }

    if (isProfileEndpoint) {
      localStorage.removeItem('user');
      localStorage.removeItem(SESSION_FLAG_KEY);

      if (isProtectedPath) {
        window.location.replace('/login');
      }
    }

    return Promise.reject(error);
  }
);

export default api;