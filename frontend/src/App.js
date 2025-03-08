import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './styles/global.css';
import './styles/layout.css';
import './styles/auth.css';
import './styles/tickets.css';
import Login from './components/Login';
import TicketList from './components/Tickets/TicketList';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/Home" element={
              <ProtectedRoute>
                <TicketList />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/Home" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
