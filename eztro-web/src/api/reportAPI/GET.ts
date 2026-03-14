import { apiService } from '../../service/apiService';
import { ApiResponse } from '../../types/common';

const reportV1Url = '/v1/reports';

export const reportGetAPI = {
  getAllReports: async (status?: string, page: number = 1, limit: number = 10): Promise<ApiResponse<any>> => {
    try {
      // Backend endpoint: GET /v1/reports/all (for Staff/Admin)
      const url = `${reportV1Url}/all`;
      const response = await apiService.get<any>(url);
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

  getReportById: async (reportId: string): Promise<ApiResponse<any>> => {
    try {
      const response = await apiService.get<any>(`${reportV1Url}/${reportId}`);
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
