import { apiService } from '../../service/apiService';
import { ApiResponse } from '../../types/common';

const mailV1Url = '/v1/mail';

export const mailPostAPI = {
  sendMail: async (email: string): Promise<ApiResponse<{ token: string }>> => {
    try {
      const response = await apiService.post<any>(`${mailV1Url}/token`, {
        email,
      });
      const backendPayload = response?.data;
      return {
        status: backendPayload?.status ?? 'error',
        message: backendPayload?.message,
        data: backendPayload?.data,
        error_log: backendPayload?.error_log,
        timestamp: backendPayload?.timestamp || new Date().toISOString(),
      };
    } catch (err) {
      throw err;
    }
  },

  verifyEmailTokenForRegister: async (
    email: string
  ): Promise<ApiResponse<{ token: string }>> => {
    try {
      const response = await apiService.post<any>(`${mailV1Url}/token/verify`, {
        email,
      });
      const backendPayload = response?.data;
      return {
        status: backendPayload?.status ?? 'error',
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
