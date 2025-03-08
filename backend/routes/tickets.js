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
        const tickets = await ticketService.getAllTickets(req.user.id, req.user.role);
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
        
        // Verify user role
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Only admins can update tickets' });
        }

        // Validate request body
        if (!req.body.statusId) {
            return res.status(400).json({ error: 'Status ID is required' });
        }

        const updatedTicket = await ticketService.updateTicket(ticketId, req.body, req.user.id);
        console.log('Updated ticket:', updatedTicket); // Debug log
        res.json(updatedTicket);
    } catch (error) {
        console.error('Error updating ticket:', error);
        if (error.message === 'Ticket not found') {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        res.status(500).json({ error: 'Failed to update ticket', details: error.message });
    }
});

export default router;