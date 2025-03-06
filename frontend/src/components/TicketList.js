import { useState, useEffect } from 'react';
import axios from 'axios';

function TicketList() {
    const [tickets, setTickets] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get('http://localhost:3001/tickets');
                setTickets(response.data);
            } catch (err) {
                setError('Failed to fetch tickets');
                console.error('Error:', err);
            }
        };

        fetchTickets();
    }, []);

    return (
        <div className="App">
            <header>
                <h1>Help Desk Ticket System</h1>
            </header>
            
            {error && <div className="error-container">{error}</div>}
            
            <div className="ticket-list">
                <ul>
                    {tickets.map(ticket => (
                        <li key={ticket.id} className={`ticket status-${ticket.status.toLowerCase()}`}>
                            <h3>{ticket.title}</h3>
                            <p>{ticket.description}</p>
                            <p>Status: {ticket.status}</p>
                            <p>Contact: {ticket.contactInfo}</p>
                            <p>Created: {new Date(ticket.createdAt).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default TicketList;
