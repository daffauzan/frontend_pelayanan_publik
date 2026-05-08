import api from './api';
import { normalizeUser } from '../utils/modelMapper';

const SESSION_FLAG_KEY = 'session_active';
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const extractAuthFromResponse = (responseData = {}) => {
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

  const fallbackRawUser =
    rawUser ||
    (responseData?.data && typeof responseData.data === 'object' && !Array.isArray(responseData.data)
      ? responseData.data
      : null) ||
    (responseData && typeof responseData === 'object' && !Array.isArray(responseData)
      ? responseData
      : null);

  const user = normalizeUser(fallbackRawUser);

  return { user };
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
    localStorage.setItem(SESSION_FLAG_KEY, '1');

    let { user } = extractAuthFromResponse(response.data);

    if (!user) {
      const retryDelays = [0, 150, 300];

      for (const delay of retryDelays) {
        if (delay > 0) {
          await wait(delay);
        }

        try {
          const profileResponse = await api.get('/auth/profile');
          user = normalizeUser(
            profileResponse.data?.data ||
              profileResponse.data?.user ||
              profileResponse.data
          );

          if (user) {
            break;
          }
        } catch {
          // Retry shortly because some backends persist session cookie asynchronously.
        }
      }
    }

    if (!user) {
      user = normalizeUser({ role: 'user' });
    }

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }

    return {
      ...response.data,
      data: {
        ...(response.data?.data || {}),
        user,
      },
      user,
    };
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore logout API failures and clear local auth state anyway.
    }

    localStorage.removeItem('user');
    localStorage.removeItem(SESSION_FLAG_KEY);
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