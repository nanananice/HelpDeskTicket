import React from 'react';
import { useAuth } from '../../context/AuthContext';

function Tickets({ title, tickets, color, onTicketClick }) {
    const { currentUser } = useAuth();
    const isAdmin = currentUser?.role === 'ADMIN';

    return (
        <div className="status-box" style={{ borderTop: `4px solid ${color}` }}>
            <h3>{title}</h3>
            <div className="status-tickets">
                {tickets.length === 0 ? (
                    <p className="no-tickets">No tickets</p>
                ) : (
                    tickets.map(ticket => (
                        <div 
                            key={ticket.id} 
                            className={`ticket-card ${isAdmin ? 'admin-clickable' : ''}`}
                            onClick={() => onTicketClick(ticket)}
                        >
                            <h4>{ticket.title}</h4>
                            <p>{ticket.description}</p>
                            <span className="date">
                                    Created: {new Date(ticket.createdAt).toLocaleDateString()} {new Date(ticket.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                            <div className="ticket-footer">

                                <span className="date">{ticket.user.email}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Tickets;
