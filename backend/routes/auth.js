import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use environment variable in production

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid user' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
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

    // Return token and user info
    res.status(200).json({
      message: 'Login successful',
      token,
      user: userForToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;