import { apiService } from '../../service/apiService';

const ticketApi = 'v1/tickets';

export const putTicketApi = {
  updateStatus: async (ticketId: string, status: 'pending' | 'processing' | 'completed') => {
    return await apiService.patch(`${ticketApi}/${ticketId}/status`, { status });
  },
};
