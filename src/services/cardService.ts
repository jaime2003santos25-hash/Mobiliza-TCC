import api from './api';

const cardService = {
  getCards: async () => {
    return api.get('/cartoes');
  },
};

export default cardService;
