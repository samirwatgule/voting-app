import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Vote, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        <Vote size={28} /> E-Voting
      </Link>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/profile" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <User size={18} /> Profile ({user.role})
            </Link>
            <button onClick={handleLogout} className="btn-secondary btn-small" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <span className="nav-link" style={{ color: 'var(--primary-color)' }}>Secure Voting Portal</span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
