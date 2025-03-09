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

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ 
        message: 'Username, email and password are required' 
      });
    }
    
    // Validate password strength (at least 6 characters)
    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      });
    }
    
    const result = await authService.registerUser({ username, email, password });
    
    res.status(201).json({
      message: 'Registration successful',
      token: result.token,
      user: result.user
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.message === 'User with this email already exists') {
      return res.status(409).json({ message: error.message });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Request password reset endpoint
router.post('/reset-request', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    const result = await authService.requestPasswordReset(email);
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Password reset request error:', error);
    
    if (error.message === 'No user with this email exists') {
      // For security reasons, don't reveal that the email doesn't exist
      return res.status(200).json({ 
        message: 'If your email exists in our system, you will receive reset instructions.' 
      });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Simplified reset password endpoint
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    
    if (!email || !newPassword) {
      return res.status(400).json({ 
        message: 'Email and new password are required' 
      });
    }
    
    // Validate password strength
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      });
    }
    
    const result = await authService.resetPassword(email, newPassword);
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Password reset error:', error);
    
    if (error.message === 'No user with this email exists') {
      // For security, don't reveal if email exists or not
      return res.status(200).json({ 
        message: 'If your email exists in our system, your password has been reset.' 
      });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;