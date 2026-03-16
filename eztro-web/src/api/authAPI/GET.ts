import { apiService } from '../../service/apiService';

const userEndpoint = '/v1/users';

export const authGetAPI = {
  checkEmailExists: async (email: string) => {
    const response = await apiService.get(`${userEndpoint}/exist/${email}`);
    return response.data;
  },
};
