import { apiService } from '../../service/apiService';

const userEndpoint = '/v1/users';

export const userGetAPI = {
  getAllUsers: async () => {
    const response = await apiService.get(userEndpoint);
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await apiService.get(`${userEndpoint}/${id}`);
    return response.data;
  },

  getAllTenants: async (phone?: string) => {
    const params = phone ? `?phone=${phone}` : '';
    const response = await apiService.get(`${userEndpoint}/tenants${params}`);
    return response.data;
  },

  checkEmailExists: async (email: string) => {
    const response = await apiService.get(`${userEndpoint}/exist/${email}`);
    return response.data;
  },

  getUserCount: async () => {
    const response = await apiService.get(`${userEndpoint}/count`);
    return response.data;
  },

  searchUsers: async (query: string) => {
    const response = await apiService.get(`${userEndpoint}/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  getStaffAndAdmins: async () => {
    const response = await apiService.get(`${userEndpoint}/staff/list`);
    return response.data;
  },
};
