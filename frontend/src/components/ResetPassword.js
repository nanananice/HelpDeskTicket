import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

function ResetPassword() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        setError('');
        
        // Validate form
        if (!formData.email || !formData.password || !formData.confirmPassword) {
            setError('All fields are required');
            return;
        }
        
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return;
        }
        
        setLoading(true);
        
        try {
            // Log what's being sent (for debugging)
            console.log('Sending reset request with:', {
                email: formData.email,
                newPassword: formData.password.length > 0 ? '[REDACTED]' : 'empty'
            });
            
            // Call the API with the correct parameters
            await authService.resetPassword(formData.email, formData.password);
            setSuccess(true);
            
            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login?resetSuccess=true');
            }, 3000);
            
        } catch (err) {
            console.error('Password reset error:', err);
            
            // Display the specific error from the API if available
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Password reset failed. Please try again.');
            }
            
        } finally {
            setLoading(false);
        }
    };
    
    if (success) {
        return (
            <div className="login-container">
                <div className="login-form-container">
                    <h2>Reset Password</h2>
                    <div className="success-message">
                        <p>If your email exists in our system, your password has been reset successfully.</p>
                        <p>You will be redirected to the login page shortly.</p>
                        <p className="mt-3">
                            <Link to="/login">Return to Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="login-container">
            <div className="login-form-container">
                <h2>Reset Password</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">New Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            disabled={loading}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
                <div className="login-footer">
                    <p>Remember your password? <Link to="/login">Login</Link></p>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
