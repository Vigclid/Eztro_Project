import { apiService } from '../../service/apiService';

const ticketApi = 'v1/tickets';

export const postTicketApi = {
  // Landlord APIs
  createTicketByLandlord: async (data: {
    title: string;
    description: string;
    categories: string[];
    houseId: string;
    roomId: string;
  }) => {
    return await apiService.post(`${ticketApi}/landlord`, data);
  },

  // Tenant APIs
  createTicketByTenant: async (data: {
    title: string;
    description: string;
    categories: string[];
  }) => {
    return await apiService.post(`${ticketApi}/tenant`, data);
  },

  // Common APIs
  addReply: async (ticketId: string, content: string) => {
    return await apiService.post(`${ticketApi}/${ticketId}/reply`, { content });
  },
};
