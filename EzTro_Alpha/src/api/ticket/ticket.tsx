import { apiService } from '../../service/apiService';
import { ITicket } from '../../types/ticket';
export const getTicketApi = {
  // Landlord APIs
  getAllTicketsByLandlord: async () => {
    return await apiService.get('/v1/tickets/landlord/my-tickets');
  },

  createTicketByLandlord: async (data: {
    title: string;
    description: string;
    categories: string[];
    houseId: string;
    roomId: string;
  }) => {
    return await apiService.post('/v1/tickets/landlord', data);
  },

  // Tenant APIs
  getAllTicketsByTenant: async () => {
    return await apiService.get('/v1/tickets/tenant/my-tickets');
  },

  createTicketByTenant: async (data: {
    title: string;
    description: string;
    categories: string[];
  }) => {
    return await apiService.post('/v1/tickets/tenant', data);
  },

  // Common APIs
  getTicketById: async (id: string) => {
    return await apiService.get(`/v1/tickets/${id}`);
  },

  getTicketsByHouse: async (houseId: string) => {
    return await apiService.get(`/v1/tickets/house/${houseId}`);
  },

  getTicketsByRoom: async (roomId: string) => {
    return await apiService.get(`/v1/tickets/room/${roomId}`);
  },

  addReply: async (ticketId: string, content: string) => {
    return await apiService.post(`/v1/tickets/${ticketId}/reply`, { content });
  },

  updateStatus: async (ticketId: string, status: 'pending' | 'processing' | 'completed') => {
    return await apiService.patch(`/v1/tickets/${ticketId}/status`, { status });
  },

  deleteTicket: async (id: string) => {
    return await apiService.delete(`/v1/tickets/${id}`);
  },
};
