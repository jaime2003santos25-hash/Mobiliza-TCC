import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * CONFIGURAÇÃO DE ACESSO UNIVERSAL:
 * No Android Emulator, o IP 10.0.2.2 aponta para o localhost do seu computador.
 */
 const BASE_URL = 'http://10.0.2.2:8080/api/';

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
})

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