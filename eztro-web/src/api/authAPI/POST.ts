import { apiService } from '../../service/apiService';
import { LoginRequest, RegisterRequest, ResetPasswordRequest } from '../../types/auth';

const authEndpoint = '';  // Auth routes không có prefix
const userEndpoint = '/v1/users';

export const authPostAPI = {
  login: async (data: LoginRequest) => {
    const response = await apiService.post(`${authEndpoint}/login`, data);
    return response.data;
  },

  logout: async () => {
    const response = await apiService.post(`${authEndpoint}/logout`);
    return response.data;
  },

  refreshToken: async () => {
    const response = await apiService.post(`${authEndpoint}/refresh`);
    return response.data;
  },

  loginWithGoogle: async (ggAccount: any) => {
    const response = await apiService.post(`${authEndpoint}/google`, { ggAccount });
    return response.data;
  },

  register: async (data: RegisterRequest) => {
    const response = await apiService.post(userEndpoint, data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest) => {
    const response = await apiService.post(`${userEndpoint}/me/password/reset`, data);
    return response.data;
  },
};
