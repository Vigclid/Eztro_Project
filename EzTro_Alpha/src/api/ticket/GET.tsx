import { apiService } from '../../service/apiService';

const ticketApi = 'v1/tickets';

export const getTicketApi = {
  // Landlord APIs
  getAllTicketsByLandlord: async () => {
    return await apiService.get(`${ticketApi}/landlord/my-tickets`);
  },

  // Tenant APIs
  getAllTicketsByTenant: async () => {
    return await apiService.get(`${ticketApi}/tenant/my-tickets`);
  },

  // Common APIs
  getTicketById: async (id: string) => {
    return await apiService.get(`${ticketApi}/${id}`);
  },

  getTicketsByHouse: async (houseId: string) => {
    return await apiService.get(`${ticketApi}/house/${houseId}`);
  },

  getTicketsByRoom: async (roomId: string) => {
    return await apiService.get(`${ticketApi}/room/${roomId}`);
  },
};
