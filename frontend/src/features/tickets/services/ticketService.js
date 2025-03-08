import { api } from '../../../services/api';

export const ticketService = {
    getAllTickets: () => api.get('/tickets'),
    createTicket: (ticketData) => api.post('/tickets', ticketData),
    updateTicket: (id, ticketData) => api.put(`/tickets/${id}`, ticketData),
};
