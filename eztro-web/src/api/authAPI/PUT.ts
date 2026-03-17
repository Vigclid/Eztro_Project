import { apiService } from '../../service/apiService';

const userEndpoint = '/v1/users';

export const authPutAPI = {
  changePassword: async (oldPassword: string, password: string) => {
    const response = await apiService.put(`${userEndpoint}/me/password`, {
      oldPassword,
      password,
    });
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await apiService.put(`${userEndpoint}/me/profile`, data);
    return response.data;
  },

  uploadAvatar: async (avatar: string) => {
    const response = await apiService.put(`${userEndpoint}/me/avatar`, { avatar });
    return response.data;
  },
};
