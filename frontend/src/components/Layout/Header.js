import React from 'react';
import { useAuth } from '../../context/AuthContext';

function Header() {
    const { currentUser, logout } = useAuth();

    return (
        <header className="main-header">
            <h1>Help Desk Tickets</h1>
            <div className="user-controls">
                <p>Welcome, {currentUser?.username}</p>
                <button onClick={logout} className="logout-button">Logout</button>
            </div>
        </header>
    );
}

export default Header;
