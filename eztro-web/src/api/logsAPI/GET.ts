import { apiService } from '../../service/apiService';

const logsEndpoint = '/v1/logs';

export const logsGetAPI = {
  getAllLogs: async (filters?: any) => {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.method) params.append('method', filters.method);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.minDuration) params.append('minDuration', filters.minDuration);
    if (filters?.maxDuration) params.append('maxDuration', filters.maxDuration);
    if (filters?.ip) params.append('ip', filters.ip);
    if (filters?.url) params.append('url', filters.url);

    const queryString = params.toString();
    const url = queryString ? `${logsEndpoint}?${queryString}` : logsEndpoint;
    const response = await apiService.get(url);
    return response.data;
  },

  getLogById: async (id: string) => {
    const response = await apiService.get(`${logsEndpoint}/${id}`);
    return response.data;
  },
};
