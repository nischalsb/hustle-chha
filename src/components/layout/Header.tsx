import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { logOut } from '../../services/authServices';

const Header: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/auth');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <header className="app-header">
      <div className="logo">
        <h1>HustleChha<span className="accent">.</span></h1>
      </div>
      <nav className="nav-menu">
        <ul>
          <li>
            <Link to="/">Dashboard</Link>
          </li>
          <li>
            <Link to="/tasks">Tasks</Link>
          </li>
          <li>
            <Link to="/pomodoro">Pomodoro</Link>
          </li>
          <li>
            <Link to="/analytics">Analytics</Link>
          </li>
          {currentUser && (
            <li>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header; 