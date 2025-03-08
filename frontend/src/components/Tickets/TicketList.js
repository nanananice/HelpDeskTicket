import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ticketService } from '../../services/api';
import AddTicketForm from './AddTicketForm';
import MainLayout from '../Layout/MainLayout';
import StatusBox from './StatusBox';
import EditTicketDialog from './EditTicketDialog';

function TicketList() {
    const [tickets, setTickets] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { currentUser, logout } = useAuth();
    const [showAddForm, setShowAddForm] = useState(false);
    const isAdmin = currentUser?.role === 'ADMIN';
    const [selectedTicket, setSelectedTicket] = useState(null);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const response = await ticketService.getAllTickets();
            setTickets(response.data);
            setError(null);
        } catch (err) {
            console.error('Error:', err);
            setError('Failed to fetch tickets');
        } finally {
            setLoading(false);
        }
    };

    const handleAddSuccess = () => {
        setShowAddForm(false);
        fetchTickets();
    };

    const handleTicketClick = (ticket) => {
        setSelectedTicket(ticket);
    };

    const handleEditClose = () => {
        setSelectedTicket(null);
    };

    const handleEditSave = async (ticketId, updatedData) => {
        try {
            const response = await ticketService.updateTicket(ticketId, updatedData);
            // Update local state with the updated ticket
            setTickets(tickets.map(ticket => 
                ticket.id === ticketId ? response.data : ticket
            ));
            setSelectedTicket(null);
            return response.data;
        } catch (error) {
            console.error('Error updating ticket:', error);
            throw error;
        }
    };

    const groupTicketsByStatus = () => {
        const grouped = {
            PENDING: tickets.filter(t => t.status.name === 'PENDING'),
            ACCEPTED: tickets.filter(t => t.status.name === 'ACCEPTED'),
            RESOLVED: tickets.filter(t => t.status.name === 'RESOLVED'),
            REJECTED: tickets.filter(t => t.status.name === 'REJECTED')
        };
        return grouped;
    };

    return (
        <MainLayout>
            <div className="ticket-list-container">
                {loading && <div className="loading">Loading tickets...</div>}
                {error && <div className="error-message">{error}</div>}

                <div className="actions-bar">
                    <button
                        className="add-ticket-button"
                        onClick={() => setShowAddForm(!showAddForm)}
                    >
                        {showAddForm ? 'Cancel' : 'Add New Ticket'}
                    </button>
                </div>

                {showAddForm && (
                    <AddTicketForm 
                        onSuccess={handleAddSuccess}
                        onCancel={() => setShowAddForm(false)}
                    />
                )}

                <div className="status-boxes">
                    <StatusBox
                        title="Pending"
                        tickets={groupTicketsByStatus().PENDING}
                        color="#FFA500"
                        onTicketClick={handleTicketClick}
                    />
                    <StatusBox
                        title="Accepted"
                        tickets={groupTicketsByStatus().ACCEPTED}
                        color="#0066cc"
                        onTicketClick={handleTicketClick}
                    />
                    <StatusBox
                        title="Resolved"
                        tickets={groupTicketsByStatus().RESOLVED}
                        color="#008000"
                        onTicketClick={handleTicketClick}
                    />
                    <StatusBox
                        title="Rejected"
                        tickets={groupTicketsByStatus().REJECTED}
                        color="#FF0000"
                        onTicketClick={handleTicketClick}
                    />
                </div>

                {selectedTicket && (
                    <EditTicketDialog
                        ticket={selectedTicket}
                        onClose={handleEditClose}
                        onSave={handleEditSave}
                        isAdmin={isAdmin}
                    />
                )}
            </div>
        </MainLayout>
    );
}

export default TicketList;
