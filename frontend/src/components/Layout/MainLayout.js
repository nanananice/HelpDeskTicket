import React from 'react';
import Header from './Header';

function MainLayout({ children }) {
    return (
        <div className="main-layout">
            <Header />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}

export default MainLayout;
