import api from './api';
import { normalizeUser } from '../utils/modelMapper';

const findFirstByKeys = (value, keys, depth = 0) => {
  if (depth > 4 || value === null || value === undefined) {
    return undefined;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const result = findFirstByKeys(item, keys, depth + 1);
      if (result !== undefined) {
        return result;
      }
    }

    return undefined;
  }

  if (typeof value !== 'object') {
    return undefined;
  }

  for (const key of keys) {
    if (value[key] !== undefined && value[key] !== null && value[key] !== '') {
      return value[key];
    }
  }

  for (const nestedValue of Object.values(value)) {
    const result = findFirstByKeys(nestedValue, keys, depth + 1);
    if (result !== undefined) {
      return result;
    }
  }

  return undefined;
};

const extractBearerToken = (authorization = '') => {
  if (typeof authorization !== 'string' || !authorization.trim()) {
    return '';
  }

  return authorization.toLowerCase().startsWith('bearer ')
    ? authorization.slice(7).trim()
    : authorization.trim();
};

const decodeJwtPayload = (token = '') => {
  try {
    const parts = token.split('.');
    if (parts.length < 2) {
      return null;
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');

    if (typeof atob !== 'function') {
      return null;
    }

    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
};

const buildUserFromToken = (token = '') => {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const roleFromArray = Array.isArray(payload.roles) ? payload.roles[0] : payload.roles;

  return normalizeUser({
    id: payload.id ?? payload.ID ?? payload.user_id ?? payload.uid,
    email: payload.email ?? payload.Email ?? payload.sub,
    role: payload.role ?? payload.Role ?? roleFromArray,
    nama: payload.nama ?? payload.Nama ?? payload.name,
  });
};

const extractAuthFromResponse = (responseData = {}, responseHeaders = {}) => {
  const rawToken = findFirstByKeys(responseData, [
    'token',
    'access_token',
    'accessToken',
    'jwt',
  ]);

  const headerToken = extractBearerToken(
    responseHeaders?.authorization || responseHeaders?.Authorization || ''
  );

  const token = rawToken || headerToken || '';

  const userCandidates = [
    responseData?.data?.user,
    responseData?.user,
    responseData?.data?.account,
    responseData?.account,
    responseData?.data?.profile,
    responseData?.profile,
    responseData?.data,
    responseData,
  ];

  const rawUser = userCandidates.find((candidate) => {
    if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
      return false;
    }

    return (
      candidate.Role !== undefined ||
      candidate.role !== undefined ||
      candidate.roles !== undefined ||
      candidate.Email !== undefined ||
      candidate.email !== undefined ||
      candidate.ID !== undefined ||
      candidate.id !== undefined ||
      candidate.Nama !== undefined ||
      candidate.nama !== undefined
    );
  });

  const user = normalizeUser(rawUser);

  return { token, user };
};

const authService = {
  register: async (data) => {
    const nama = data.Nama || data.nama || data.name || '';
    const email = data.Email || data.email || '';
    const password = data.Password || data.password || '';
    const noTelp = data.NoTelp || data.noTelp || data.no_telp || '';
    const alamat = data.Alamat || data.alamat || '';
    const role = data.Role || data.role || 'user';

    const payload = {
      // Keep multiple aliases to support different Gin binding/json tag styles.
      Nama: nama,
      nama,
      Email: email,
      email,
      Password: password,
      password,
      NoTelp: noTelp,
      noTelp,
      no_telp: noTelp,
      Alamat: alamat,
      alamat,
      Role: role,
      role,
    };

    const response = await api.post('/auth/register', payload);
    return response.data;
  },

  login: async (data) => {
    const email = data.Email || data.email || '';
    const password = data.Password || data.password || '';

    const payload = {
      Email: email,
      email,
      Password: password,
      password,
    };

    const response = await api.post('/auth/login', payload);

    let { token, user } = extractAuthFromResponse(response.data, response.headers);

    // Persist token first so any follow-up /auth/profile request includes Authorization.
    if (token) {
      localStorage.setItem('token', token);
    }

    if (token && !user) {
      try {
        const profileResponse = await api.get('/auth/profile');
        user = normalizeUser(
          profileResponse.data?.data ||
            profileResponse.data?.user ||
            profileResponse.data
        );
      } catch {
        // Ignore profile fallback failure and continue with login response data.
      }
    }

    if (token && !user) {
      user = buildUserFromToken(token);
    }

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }

    return {
      ...response.data,
      data: {
        ...(response.data?.data || {}),
        token,
        user,
      },
      user,
      token,
    };
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');

    const user = normalizeUser(
      response.data?.data || response.data?.user || response.data
    );

    return {
      ...response.data,
      data: user,
      user,
    };
  },

  updateProfile: async (data) => {
    const payload = {
      Nama: data.Nama || data.nama || '',
      Email: data.Email || data.email || '',
      NoTelp: data.NoTelp || data.noTelp || data.no_telp || '',
      Alamat: data.Alamat || data.alamat || '',
    };

    const response = await api.put('/auth/profile', payload);

    const user = normalizeUser(
      response.data?.data || response.data?.user || response.data
    );

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }

    return {
      ...response.data,
      data: user,
      user,
    };
  },
};

export default authService;