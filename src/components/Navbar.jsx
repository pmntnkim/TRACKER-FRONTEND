import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link className="navbar-brand" to="/">
          <span className="brand-logo" aria-hidden="true">🏃‍♀️</span>
          <span className="brand-text">MyFitBuddy</span>
        </Link>
        <div className="spacer" />
        <div className="navbar-links">
          <ul className="nav-list">
            {user ? (
              <>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/program">Program</Link></li>
                <li><Link to="/profile">Profile</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </>
            )}
          </ul>
          {user && (
            <div className="nav-cta">
              <button className="btn logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;