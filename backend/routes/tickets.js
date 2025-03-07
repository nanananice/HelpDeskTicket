import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET all tickets
router.get('/', async (req, res) => {
    try {
        const tickets = await prisma.ticket.findMany({
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

// POST new ticket
router.post('/', async (req, res) => {
    try {
        const { title, description, contactInfo, status } = req.body;
        
        // Log the received data
        console.log('Received data:', req.body);

        // Validate required fields
        if (!title || !description || !contactInfo || !status) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                required: ['title', 'description', 'contactInfo', 'status']
            });
        }

        const newTicket = await prisma.ticket.create({
            data: {
                title,
                description,
                contactInfo,
                status
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
