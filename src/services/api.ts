import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 10.0.2.2 = endereço especial para emulador Android acessar o localhost do PC
// 192.168.15.21 = IP do PC na rede Wi-Fi (usar quando testar no celular físico)
const BASE_URL = 'http://192.168.15.21:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Injeta o token JWT automaticamente em toda requisição
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@mobiliza:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;