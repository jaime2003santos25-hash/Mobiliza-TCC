import api from './api';

export interface SaldoResponse {
  saldo: number;
  numeroCartao: string;
}

const cardService = {
  getMeuSaldo: async (): Promise<SaldoResponse> => {
    const response = await api.get<SaldoResponse>('saldos/meu-saldo');
    return response.data;
  },
};

export default cardService;