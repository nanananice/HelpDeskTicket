import React, { useState } from 'react';
import { ticketService } from '../../services/api';

function AddTicketForm({ onSuccess, onCancel }) {
    const [newTicket, setNewTicket] = useState({
        title: '',
        description: '',
        statusId: 1
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewTicket(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await ticketService.createTicket(newTicket);
            setNewTicket({ title: '', description: '', statusId: 1 });
            onSuccess();
        } catch (err) {
            console.error('Error adding ticket:', err);
        }
    };

    return (
        <div className="add-ticket-form">
            <h3>Add New Ticket</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={newTicket.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={newTicket.description}
                        onChange={handleChange}
                        required
                        rows="4"
                    />
                </div>
                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">Add New Ticket</button>
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default AddTicketForm;
