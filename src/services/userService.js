import api from './api';

const candidateEndpoints = ['/users', '/user', '/auth/users'];

const userService = {
  getAll: async () => {
    for (const endpoint of candidateEndpoints) {
      try {
        const response = await api.get(endpoint);
        return response.data;
      } catch (error) {
        if (error?.response?.status && error.response.status !== 404) {
          throw error;
        }
      }
    }

    return { data: [] };
  },
};

export default userService;
