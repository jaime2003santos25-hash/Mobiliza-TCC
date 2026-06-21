import api from './api';

export type FormaPagamento = 'PIX' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO';

export interface RecargaRequest {
  valor: number;
  formaPagamento: FormaPagamento;
}

export interface RecargaResponse {
  saldo: number;
  numeroCartao: string;
}

const rechargeService = {
  recharge: async (data: RecargaRequest): Promise<RecargaResponse> => {
    const response = await api.post<RecargaResponse>('/saldos/recarregar', data);
    return response.data;
  },
};

export default rechargeService;