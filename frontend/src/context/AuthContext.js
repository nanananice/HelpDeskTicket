import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Load user from localStorage on initial load
    useEffect(() => {
        const loadUser = () => {
            try {
                const token = localStorage.getItem('token');
                const user = JSON.parse(localStorage.getItem('user'));

                if (token && user) {
                    // Set default authorization header
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    setCurrentUser(user);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Error loading user:', error);
                // Clear potentially corrupt data
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    // Login function
    const login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:3001/api/auth/login', { email, password });
            const { token, user } = response.data;

            // Save token and user in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // Set default authorization header
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setCurrentUser(user);
            setIsAuthenticated(true);

            return { success: true, user };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            };
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setCurrentUser(null);
        setIsAuthenticated(false);
    };

    const value = {
        currentUser,
        isAuthenticated,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}