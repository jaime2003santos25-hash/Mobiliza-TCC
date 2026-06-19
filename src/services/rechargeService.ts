import api from './api';

const rechargeService = {
  recharge: async (data: any) => {
    return api.post('/saldos/recarregar', data);
  },
};

export default rechargeService;
