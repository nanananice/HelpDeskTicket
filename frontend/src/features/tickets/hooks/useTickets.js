import { useState, useEffect } from 'react';
import { ticketService } from '../services/ticketService';

export const useTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const response = await ticketService.getAllTickets();
            setTickets(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    return { tickets, loading, error, refetch: fetchTickets };
};
