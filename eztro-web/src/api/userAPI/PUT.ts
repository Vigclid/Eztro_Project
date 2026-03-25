import { apiService } from '../../service/apiService';

const userEndpoint = '/v1/users';

export const userPutAPI = {
  lockAccount: async (id: string) => {
    const response = await apiService.put(`${userEndpoint}/${id}/lock`);
    return response.data;
  },

  unlockAccount: async (id: string) => {
    const response = await apiService.put(`${userEndpoint}/${id}/unlock`);
    return response.data;
  },

  assignRole: async (id: string, roleName: string) => {
    const response = await apiService.put(`${userEndpoint}/${id}/role`, { roleName });
    return response.data;
  },

  removeRole: async (id: string) => {
    const response = await apiService.put(`${userEndpoint}/${id}/role/remove`);
    return response.data;
  },
};
