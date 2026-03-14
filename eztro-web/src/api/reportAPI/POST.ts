import { apiService } from '../../service/apiService';
import { ApiResponse } from '../../types/common';

const reportV1Url = '/v1/reports';

export const reportPostAPI = {
  createReport: async (data: {
    typeReport: 'Help' | 'Bug' | 'Advice';
    title: string;
    description: string;
  }): Promise<ApiResponse<any>> => {
    try {
      const response = await apiService.post<any>(`${reportV1Url}`, data);
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

  addReply: async (reportId: string, data: { message: string }): Promise<ApiResponse<any>> => {
    try {
      const response = await apiService.post<any>(`${reportV1Url}/${reportId}/reply`, data);
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
