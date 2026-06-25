import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * CONFIGURAÇÃO DE ACESSO UNIVERSAL:
 * Para que o APK funcione em qualquer rede, o backend deve estar em um IP fixo ou visível.
 * O IP abaixo (192.168.15.33) é o IP atual do seu computador na sua rede Wi-Fi.
 * Certifique-se de que o computador e o celular estejam na MESMA REDE.
 */
const BASE_URL = 'http://192.168.15.33:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout para evitar travamentos
});

// Injeta o token JWT automaticamente em toda requisição
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('@mobiliza:token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.error('Erro ao buscar token', e);
  }
  return config;
});

// Tratamento global de erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Opcional: Deslogar usuário se o token expirar
    }
    return Promise.reject(error);
  }
);

export default api;
