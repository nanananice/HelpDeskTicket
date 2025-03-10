import axios from 'axios';
import { API_BASE_URL } from '../constants/config';

export const api = axios.create({
    baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const ticketService = {
    getAllTickets: (params) => api.get('/tickets', { params }),
    createTicket: (ticketData) => api.post('/tickets', ticketData),
    updateTicket: (id, ticketData) => api.put(`/tickets/${id}`, ticketData),
};

export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    resetPassword: (email, newPassword) => api.post('/auth/reset-password', { email, newPassword }),
};
