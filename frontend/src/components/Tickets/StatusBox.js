import React from 'react';
import { useAuth } from '../../context/AuthContext';

function StatusBox({ title, tickets, color, onTicketClick }) {
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
                            <div className="ticket-footer">
                                <span className="date">
                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                </span>
                                <span className="contact">{ticket.user.email}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default StatusBox;
