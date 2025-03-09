import React, { useState } from 'react';

function EditTicketDialog({ ticket, onClose, onSave, isAdmin }) {
    const [editedTicket, setEditedTicket] = useState({
        ...ticket,
        statusId: ticket.status.id
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // For statusId, ensure it's stored as a number
        if (name === 'statusId') {
            const parsedValue = parseInt(value, 10);
            setEditedTicket(prev => ({
                ...prev,
                [name]: isNaN(parsedValue) ? '' : parsedValue
            }));
        } else {
            setEditedTicket(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const statusMap = {
        'PENDING': 1,
        'ACCEPTED': 2,
        'RESOLVED': 3,
        'REJECTED': 4
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            // Prepare update data based on user role
            const updateData = {};
            
            if (isAdmin) {
                // Ensure statusId is a valid number
                if (!editedTicket.statusId || isNaN(parseInt(editedTicket.statusId, 10))) {
                    setError('Please select a valid status');
                    return;
                }
                updateData.statusId = parseInt(editedTicket.statusId, 10);
            } else {
                // For regular users
                updateData.title = editedTicket.title;
                updateData.description = editedTicket.description;
            }
            
            await onSave(ticket.id, updateData);
        } catch (err) {
            console.error("Error in edit form:", err);
            setError(err.response?.data?.error || 'Failed to update ticket');
        }
    };

    return (
        <div className="dialog-overlay">
            <div className="dialog-content">
                <h2>Edit Ticket</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            name="title"
                            value={editedTicket.title}
                            onChange={handleChange}
                            disabled={isAdmin}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={editedTicket.description}
                            onChange={handleChange}
                            disabled={isAdmin}
                            required
                            rows="4"
                        />
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <select
                            name="statusId"
                            value={editedTicket.statusId}
                            onChange={handleChange}
                            disabled={!isAdmin}
                        >
                            {Object.entries(statusMap).map(([status, id]) => (
                                <option key={status} value={id}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">
                            Save Changes
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditTicketDialog;
