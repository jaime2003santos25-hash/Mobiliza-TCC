import api from './api';

const authService = {
  login: async (data: any) => {
    return api.post('/auth/login', data);
  },
  signUp: async (data: any) => {
    return api.post('/auth/register', data);
  },
};

export default authService;
