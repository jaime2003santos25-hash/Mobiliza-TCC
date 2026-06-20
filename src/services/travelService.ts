import api from './api';

export interface ViagemResponse {
  id: number;
  dataHora: string;
  valor: number;
}

const travelService = {
  getHistorico: async (): Promise<ViagemResponse[]> => {
    const response = await api.get<ViagemResponse[]>('/viagens/historico');
    return response.data;
  },
};

export default travelService;