import { apiService } from '../../service/apiService';

const ticketApi = 'v1/tickets';

export const deleteTicketApi = {
  deleteTicket: async (id: string) => {
    return await apiService.delete(`${ticketApi}/${id}`);
  },
};
