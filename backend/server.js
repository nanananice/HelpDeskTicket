import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import ticketRoutes from './routes/tickets.js';

const app = express();
const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',  // Allow frontend requests
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Routes
app.use('/tickets', ticketRoutes);

app.get('/', (req, res) => {
    res.send('Helpdesk API is running');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
