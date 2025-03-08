import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authService = {
    async loginUser(email, password) {
        try {
            // Find user by email
            const user = await prisma.user.findUnique({
                where: { email },
                include: { role: true },
            });

            // Check if user exists
            if (!user) {
                throw new Error('Invalid user');
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid password');
            }

            // Create user object without password for token
            const userForToken = {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role.name,
            };

            // Generate JWT token
            const token = jwt.sign(userForToken, JWT_SECRET, { expiresIn: '24h' });

            return {
                token,
                user: userForToken
            };
        } catch (error) {
            throw error;
        }
    }
};
