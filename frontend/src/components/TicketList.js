import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function TicketList() {
    const [tickets, setTickets] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { currentUser, logout } = useAuth();

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:3001/api/tickets', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setTickets(response.data);
                setError(null);
            } catch (err) {
                console.error('Error:', err);
                if (err.response?.status === 401) {
                    // Token expired or invalid
                    logout();
                } else {
                    setError('Failed to fetch tickets');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, [logout]);

    return (
        <div className="ticket-list-container">
            <header>
                <h1>Help Desk Tickets</h1>
                <p>Welcome, {currentUser?.username}</p>
                <button onClick={logout} className="logout-button">Logout</button>
            </header>

            {loading && <div className="loading">Loading tickets...</div>}
            {error && <div className="error-container">{error}</div>}

            <div className="ticket-list">
                <h2>Your Tickets</h2>
                {tickets.length === 0 && !loading ? (
                    <p>No tickets found</p>
                ) : (
                    <ul>
                        {tickets.map(ticket => (
                            <li key={ticket.id} className={`ticket status-${ticket.status.name.toLowerCase()}`}>
                                <h3>{ticket.title}</h3>
                                <p>{ticket.description}</p>
                                <p className="status">Status: {ticket.status.name}</p>
                                <p className="date">Created: {new Date(ticket.createdAt).toLocaleDateString()}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default TicketList;