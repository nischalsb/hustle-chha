import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        {children}
      </main>
      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} HustleChha<span className="accent">.</span> Elevate Your Productivity With Elegance</p>
      </footer>
    </div>
  );
};

export default Layout; 