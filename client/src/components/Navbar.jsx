import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getInitials = (username) => {
    return username ? username.charAt(0).toUpperCase() : 'U';
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          🐞 BugTracker
        </Link>
        
        <ul className="navbar-nav">
          <li>
            <Link 
              to="/bugs" 
              className={location.pathname === '/bugs' ? 'active' : ''}
            >
              Bugs
            </Link>
          </li>
          {user && (
            <li>
              <Link 
                to="/bugs/new" 
                className={location.pathname === '/bugs/new' ? 'active' : ''}
              >
                Report Bug
              </Link>
            </li>
          )}
        </ul>

        <div className="navbar-user">
          {user ? (
            <>
              <div className="user-info">
                <div className="user-avatar">
                  {getInitials(user.username)}
                </div>
                <span>Hello, {user.username}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;