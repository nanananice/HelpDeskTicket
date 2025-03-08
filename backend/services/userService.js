import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const userService = {
    async getUserById(id) {
        try {
            return await prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    role: true,
                    createdAt: true
                }
            });
        } catch (error) {
            throw new Error(`Error fetching user: ${error.message}`);
        }
    },
    
    async createUser(userData) {
        try {
            const { username, email, password, roleId = 2 } = userData; // Default to USER role (2)
            
            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });
            
            if (existingUser) {
                throw new Error('User with this email already exists');
            }
            
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // Create user
            const newUser = await prisma.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword,
                    roleId: parseInt(roleId)
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    roleId: true,
                    createdAt: true
                }
            });
            
            return newUser;
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }
};
