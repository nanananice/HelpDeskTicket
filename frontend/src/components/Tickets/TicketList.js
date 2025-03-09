import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ticketService } from '../../services/api';
import AddTicketForm from './AddTicketForm';
import MainLayout from '../Layout/MainLayout';
import EditTicketDialog from './EditTicketDialog';
import { 
    getStatusColor, 
    STATUS_MAP, 
    SORT_OPTIONS, 
    getStatusDisplayName 
} from '../../utils/statusUtils';

function TicketList() {
    const [tickets, setTickets] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();
    const [showAddForm, setShowAddForm] = useState(false);
    const isAdmin = currentUser?.role === 'ADMIN';
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [sortBy, setSortBy] = useState(SORT_OPTIONS.UPDATED);
    const [statusFilter, setStatusFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        fetchTickets();
    }, [sortBy, statusFilter, sortOrder]);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            
            // Prepare query params for backend filtering and sorting
            const params = {
                sortBy,
                sortOrder
            };
            
            // Only add statusId if a filter is selected
            if (statusFilter) {
                params.statusId = statusFilter;
            }
            
            const response = await ticketService.getAllTickets(params);
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

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
    };
    
    const handleSortOrderChange = () => {
        setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
    };

    const handleEditSave = async (ticketId, updatedData) => {
        try {
            // Validate statusId if present
            if (updatedData.statusId !== undefined) {
                const parsedStatusId = parseInt(updatedData.statusId, 10);
                if (isNaN(parsedStatusId)) {
                    throw new Error('Invalid status ID');
                }
                // Ensure we're sending a number, not a string
                updatedData.statusId = parsedStatusId;
            }
            
            const response = await ticketService.updateTicket(ticketId, updatedData);
            
            // Refresh tickets after update
            fetchTickets();
            setSelectedTicket(null);
            return response.data;
        } catch (error) {
            console.error('Error updating ticket:', error);
            throw error;
        }
    };

    return (
        <MainLayout>
            <div className="ticket-list-container">
                {loading && <div className="loading">Loading tickets...</div>}
                {error && <div className="error-message">{error}</div>}

                <div className="actions-bar">
                    <div className="filter-controls">
                        <div className="filter-group">
                            <label htmlFor="statusFilter">Filter by Status:</label>
                            <select 
                                id="statusFilter" 
                                value={statusFilter} 
                                onChange={handleStatusFilterChange}
                            >
                                <option value="">All Statuses</option>
                                {Object.entries(STATUS_MAP).map(([name, id]) => (
                                    <option key={id} value={id}>
                                        {getStatusDisplayName(name)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="filter-group">
                            <label htmlFor="sortBy">Sort by:</label>
                            <select 
                                id="sortBy" 
                                value={sortBy} 
                                onChange={handleSortChange}
                            >
                                <option value={SORT_OPTIONS.UPDATED}>Last Updated</option>
                                <option value={SORT_OPTIONS.CREATED}>Created Date</option>
                                <option value={SORT_OPTIONS.STATUS}>Status</option>
                                <option value={SORT_OPTIONS.TITLE}>Title</option>
                            </select>
                            <button 
                                className="sort-order-btn" 
                                onClick={handleSortOrderChange}
                                aria-label={`Sort ${sortOrder === 'asc' ? 'ascending' : 'descending'}`}
                            >
                                {sortOrder === 'asc' ? '↑' : '↓'}
                            </button>
                        </div>
                    </div>
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

                <div className="tickets-container">
                    <div className="all-tickets-box">
                        <h3>All Tickets {tickets.length > 0 && <span className="ticket-count">({tickets.length})</span>}</h3>
                        <div className="status-tickets">
                            {tickets.length === 0 ? (
                                <p className="no-tickets">{!loading ? "No tickets available" : "Loading tickets..."}</p>
                            ) : (
                                tickets.map(ticket => (
                                    <div 
                                        key={ticket.id} 
                                        className={`ticket-card ${isAdmin ? 'admin-clickable' : ''}`}
                                        onClick={() => handleTicketClick(ticket)}
                                    >
                                        <h4>{ticket.title}</h4>
                                        <p>{ticket.description}</p>
                                        <div className="ticket-status-badge" style={{backgroundColor: getStatusColor(ticket.status.name)}}>
                                            {getStatusDisplayName(ticket.status.name)}
                                        </div>
                                        <div className="ticket-footer">
                                            <div className="ticket-dates">
                                                <span className="date-info">
                                                    <span className="date-label">Created:</span>
                                                    {new Date(ticket.createdAt).toLocaleDateString()} {new Date(ticket.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </span>
                                                <span className="date-info">
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
