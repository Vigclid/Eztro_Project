import { apiService } from '../../service/apiService';

const userEndpoint = '/v1/users';

export const authDeleteAPI = {
  deleteAccount: async (userId: string) => {
    const response = await apiService.delete(`${userEndpoint}/${userId}`);
    return response.data;
  },
};
