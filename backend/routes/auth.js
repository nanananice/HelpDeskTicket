import express from 'express';
import { authService } from '../services/authService.js';

const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await authService.loginUser(email, password);
    
    // Return token and user info
    res.status(200).json({
      message: 'Login successful',
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    console.error('Login error:', error);
    
    // Send appropriate status based on error
    if (error.message === 'Invalid user' || error.message === 'Invalid password') {
      return res.status(401).json({ message: error.message });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;