import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStatusColor } from '../../utils/statusUtils';

function Tickets({ title, tickets, color, onTicketClick }) {
    const { currentUser } = useAuth();
    const isAdmin = currentUser?.role === 'ADMIN';

    return (
        <div className="status-box" style={{ borderTop: `8px solid ${color}` }}>
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
                            style={{ borderLeftColor: getStatusColor(ticket.status.name) }}
                        >
                            <h4>{ticket.title}</h4>
                            <p>{ticket.description}</p>
                            <div className="ticket-footer">
                                <div className="ticket-dates">
                                    <span>
                                        <span className="date-label">Created:</span>
                                        {new Date(ticket.createdAt).toLocaleDateString()} {new Date(ticket.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                    <span>
                                        <span className="date-label">Updated:</span>
                                        {new Date(ticket.updatedAt).toLocaleDateString()} {new Date(ticket.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                                <div className="ticket-email">
                                    <div className="ticket-dates">
                                        <span className="email-info">Created by: {ticket.createdBy.email}</span>
                                        <span className="email-info">Updated by: {ticket.updatedBy.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Tickets;
