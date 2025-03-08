import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET all tickets - requires authentication
router.get('/', authenticate, async (req, res) => {
    try {
        const tickets = await prisma.ticket.findMany({
            include: { status: true },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(tickets);
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ error: 'Failed to fetch tickets' });
    }
});

// POST new ticket - requires authentication
router.post('/', authenticate, async (req, res) => {
    try {
        const { title, description, statusId } = req.body;

        // Log the received data
        console.log('Received data:', req.body);

        // Validate required fields
        if (!title || !description || !statusId) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['title', 'description', 'statusId']
            });
        }

        // Use the authenticated user's ID
        const userId = req.user.id;

        const newTicket = await prisma.ticket.create({
            data: {
                title,
                description,
                statusId,
                userId,
                createdById: userId,
                updatedById: userId
            }
        });
        res.status(201).json(newTicket);
    } catch (error) {
        console.error('Error creating ticket:', error);
        res.status(500).json({
            error: 'Failed to create ticket',
            details: error.message
        });
    }
});

export default router;