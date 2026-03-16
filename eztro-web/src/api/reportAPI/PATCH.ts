import { apiService } from '../../service/apiService';
import { ApiResponse } from '../../types/common';

const reportV1Url = '/v1/reports';

export const reportPatchAPI = {
  updateStatus: async (reportId: string, data: { status: 'Pending' | 'InProgress' | 'Resolved' | 'Closed' }): Promise<ApiResponse<any>> => {
    try {
      const response = await apiService.patch<any>(`${reportV1Url}/${reportId}/status`, data);
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
