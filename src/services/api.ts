import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 10.0.2.2 é o endereço especial que o emulador Android usa
// para acessar o "localhost" do seu computador.
const api = axios.create({
  baseURL: 'http://10.0.2.2:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adiciona o token JWT automaticamente em toda requisição,
// caso o usuário já esteja logado.
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@mobiliza:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;