import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { ticketService } from '../services/ticketService.js';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET all tickets - requires authentication
// Admin gets all tickets, regular users only get their own
router.get('/', authenticate, async (req, res) => {
    try {
        // Extract query parameters for filtering and sorting
        const { statusId, sortBy, sortOrder } = req.query;
        
        const options = {
            statusId,
            sortBy,
            sortOrder: sortOrder === 'asc' ? 'asc' : 'desc'
        };

        const tickets = await ticketService.getAllTickets(req.user.id, req.user.role, options);
        res.json(tickets);
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ error: 'Failed to fetch tickets' });
    }
});

// POST new ticket - requires authentication
router.post('/', authenticate, async (req, res) => {
    try {
        // Log the received data
        console.log('Received data:', req.body);

        // Use the authenticated user's ID
        const userId = req.user.id;
        const newTicket = await ticketService.createTicket(req.body, userId);
        
        res.status(201).json(newTicket);
    } catch (error) {
        console.error('Error creating ticket:', error);
        
        // Check if it's a validation error
        if (error.message.includes('Missing required fields')) {
            return res.status(400).json({
                error: error.message,
                required: ['title', 'description']
            });
        }
        
        res.status(500).json({
            error: 'Failed to create ticket',
            details: error.message
        });
    }
});

// PUT update ticket - requires authentication
router.put('/:id', authenticate, async (req, res) => {
    try {
        const ticketId = parseInt(req.params.id);
        console.log('Updating ticket:', ticketId, 'with data:', req.body); // Debug log
        
        let updatedFields = {};
        
        // Different permissions based on role
        if (req.user.role === 'ADMIN') {
            // Admin can only update status
            if (req.body.statusId !== undefined && req.body.statusId !== null) {
                const parsedStatusId = parseInt(req.body.statusId, 10);
                if (isNaN(parsedStatusId)) {
                    return res.status(400).json({ error: 'Status ID must be a valid number' });
                }
                updatedFields.statusId = parsedStatusId;
            } else {
                return res.status(400).json({ error: 'Status ID is required for admin updates' });
            }
        } else {
            // Regular users can only update title and description
            if (req.body.title) updatedFields.title = req.body.title;
            if (req.body.description) updatedFields.description = req.body.description;
            
            if (!updatedFields.title && !updatedFields.description) {
                return res.status(400).json({ error: 'Title or description is required for user updates' });
            }
        }

        const updatedTicket = await ticketService.updateTicket(ticketId, updatedFields, req.user.id);
        console.log('Updated ticket:', updatedTicket); // Debug log
        res.json(updatedTicket);
    } catch (error) {
        console.error('Error updating ticket:', error);
        if (error.message === 'Ticket not found') {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        if (error.message === 'Unauthorized') {
            return res.status(403).json({ error: 'You can only update your own tickets' });
        }
        if (error.message.includes('Invalid status ID')) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to update ticket', details: error.message });
    }
});

export default router;