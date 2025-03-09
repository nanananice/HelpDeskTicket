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
    },
    
    async registerUser(userData) {
        try {
            const { username, email, password } = userData;
            
            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });
            
            if (existingUser) {
                throw new Error('User with this email already exists');
            }
            
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // Create user with default USER role (2)
            const newUser = await prisma.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword,
                    roleId: 2 // User role
                },
                include: { role: true }
            });
            
            // Create user object without password for token
            const userForToken = {
                id: newUser.id,
                email: newUser.email,
                username: newUser.username,
                role: newUser.role.name
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
    },
    
    async resetPassword(email, newPassword) {
        try {
            // Find the user by email
            const user = await prisma.user.findUnique({
                where: { email }
            });
            
            if (!user) {
                throw new Error('No user with this email exists');
            }
            
            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            
            // Update the user's password
            await prisma.user.update({
                where: { id: user.id },
                data: { password: hashedPassword }
            });
            
            return { message: 'Password reset successful' };
        } catch (error) {
            throw error;
        }
    }
};
