import api from './api';

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  codigo: string;
  novaSenha: string;
}

export interface LoginResponse {
  token: string;
  email: string;
}

export interface RegisterResponse {
  mensagem: string;
  email: string;
}

const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('auth/login', data);
    return response.data;
  },

  signUp: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>('auth/register', data);
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<{ mensagem: string }> => {
    const response = await api.post('auth/esqueci-senha', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<{ mensagem: string }> => {
    const response = await api.post('auth/redefinir-senha', data);
    return response.data;
  },
};

export default authService;
