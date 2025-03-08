import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const ticketService = {
    async getAllTickets(userId, userRole) {
        try {
            if (userRole === 'ADMIN') {
                // Admin can see all tickets
                return await prisma.ticket.findMany({
                    include: {
                        status: true,
                        user: {
                            select: {
                                id: true,
                                username: true,
                                email: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
            } else {
                // Regular users can only see their own tickets
                return await prisma.ticket.findMany({
                    where: {
                        userId: userId
                    },
                    include: {
                        status: true,
                        user: {
                            select: {
                                id: true,
                                username: true,
                                email: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
            }
        } catch (error) {
            throw new Error(`Error fetching tickets: ${error.message}`);
        }
    },

    async createTicket(ticketData, userId) {
        try {
            const { title, description, statusId = 1 } = ticketData;

            if (!title || !description) {
                throw new Error('Missing required fields: title and description are required');
            }

            return await prisma.ticket.create({
                data: {
                    title,
                    description,
                    statusId: parseInt(statusId),
                    userId,
                    createdById: userId,
                    updatedById: userId
                }
            });
        } catch (error) {
            throw new Error(`Error creating ticket: ${error.message}`);
        }
    },

    async updateTicket(ticketId, ticketData, userId) {
        try {
            // Verify ticket exists
            const ticket = await prisma.ticket.findUnique({
                where: { id: ticketId }
            });

            if (!ticket) {
                throw new Error('Ticket not found');
            }

            return await prisma.ticket.update({
                where: { id: ticketId },
                data: {
                    statusId: parseInt(ticketData.statusId),
                    updatedById: userId
                },
                include: {
                    status: true,
                    user: {
                        select: {
                            id: true,
                            username: true,
                            email: true
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error in updateTicket:', error);
            throw error;
        }
    }
};
