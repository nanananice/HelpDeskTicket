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
                        },
                        createdBy: {
                            select: {
                                id: true,
                                username: true,
                                email: true
                            }
                        },
                        updatedBy: {
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
                        },
                        createdBy: {
                            select: {
                                id: true,
                                username: true,
                                email: true
                            }
                        },
                        updatedBy: {
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

            // Create the update data object with validated fields
            const updateData = {
                updatedById: userId
            };

            // Only add statusId if it's a valid number
            if (ticketData.statusId !== undefined && ticketData.statusId !== null) {
                const parsedStatusId = parseInt(ticketData.statusId, 10);
                if (!isNaN(parsedStatusId)) {
                    updateData.statusId = parsedStatusId;
                } else {
                    throw new Error('Invalid status ID: must be a number');
                }
            }

            // Add title and description if provided
            if (ticketData.title !== undefined) {
                updateData.title = ticketData.title;
            }
            
            if (ticketData.description !== undefined) {
                updateData.description = ticketData.description;
            }

            return await prisma.ticket.update({
                where: { id: ticketId },
                data: updateData,
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
