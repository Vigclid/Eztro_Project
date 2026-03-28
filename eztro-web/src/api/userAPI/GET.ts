import { apiService } from '../../service/apiService';
import { ApiResponse } from '../../types/common';

const userEndpoint = '/v1/users';

interface BackendResponse {
  status: string;
  message: string;
  data: any;
  error_log?: any;
  timestamp?: string;
}

export const userGetAPI = {
  getAllUsers: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await apiService.get(userEndpoint);
      
      const backendPayload = response?.data as BackendResponse;
      
      const result = {
        status: backendPayload?.status ?? "error",
        message: backendPayload?.message,
        data: backendPayload?.data,
        error_log: backendPayload?.error_log,
        timestamp: backendPayload?.timestamp || new Date().toISOString(),
      };
      return result;
    } catch (err) {
      throw err;
    }
  },

  getUserById: async (id: string): Promise<ApiResponse<any>> => {
    try {
      const response = await apiService.get(`${userEndpoint}/${id}`);
      const backendPayload = response?.data as BackendResponse;
      return {
        status: backendPayload?.status ?? "error",
        message: backendPayload?.message,
        data: backendPayload?.data,
        error_log: backendPayload?.error_log,
        timestamp: backendPayload?.timestamp || new Date().toISOString(),
      };
    } catch (err) {
      throw err;
    }
  },

  getAllTenants: async (phone?: string): Promise<ApiResponse<any>> => {
    try {
      const params = phone ? `?phone=${phone}` : '';
      const response = await apiService.get(`${userEndpoint}/tenants${params}`);
      const backendPayload = response?.data as BackendResponse;
      return {
        status: backendPayload?.status ?? "error",
        message: backendPayload?.message,
        data: backendPayload?.data,
        error_log: backendPayload?.error_log,
        timestamp: backendPayload?.timestamp || new Date().toISOString(),
      };
    } catch (err) {
      throw err;
    }
  },

  checkEmailExists: async (email: string): Promise<ApiResponse<any>> => {
    try {
      const response = await apiService.get(`${userEndpoint}/exist/${email}`);
      const backendPayload = response?.data as BackendResponse;
      return {
        status: backendPayload?.status ?? "error",
        message: backendPayload?.message,
        data: backendPayload?.data,
        error_log: backendPayload?.error_log,
        timestamp: backendPayload?.timestamp || new Date().toISOString(),
      };
    } catch (err) {
      throw err;
    }
  },

  getUserCount: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await apiService.get(`${userEndpoint}/count`);
      const backendPayload = response?.data as BackendResponse;
      return {
        status: backendPayload?.status ?? "error",
        message: backendPayload?.message,
        data: backendPayload?.data,
        error_log: backendPayload?.error_log,
        timestamp: backendPayload?.timestamp || new Date().toISOString(),
      };
    } catch (err) {
      throw err;
    }
  },

  searchUsers: async (query: string): Promise<ApiResponse<any>> => {
    try {
      const response = await apiService.get(`${userEndpoint}/search?q=${encodeURIComponent(query)}`);
      const backendPayload = response?.data as BackendResponse;
      return {
        status: backendPayload?.status ?? "error",
        message: backendPayload?.message,
        data: backendPayload?.data,
        error_log: backendPayload?.error_log,
        timestamp: backendPayload?.timestamp || new Date().toISOString(),
      };
    } catch (err) {
      throw err;
    }
  },

  getStaffAndAdmins: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await apiService.get(`${userEndpoint}/staff/list`);
      const backendPayload = response?.data as BackendResponse;
      return {
        status: backendPayload?.status ?? "error",
        message: backendPayload?.message,
        data: backendPayload?.data,
        error_log: backendPayload?.error_log,
        timestamp: backendPayload?.timestamp || new Date().toISOString(),
      };
    } catch (err) {
      throw err;
    }
  },
};
