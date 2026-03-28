import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Vote, LogOut, User, LayoutDashboard, Shield } from 'lucide-react';

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
            {user.role === 'admin' ? (
              <Link to="/admin" className="nav-link">
                <LayoutDashboard size={18} /> Dashboard
              </Link>
            ) : (
              <Link to="/dashboard" className="nav-link">
                <LayoutDashboard size={18} /> Dashboard
              </Link>
            )}
            <Link to="/profile" className="nav-link">
              <User size={18} /> Profile
            </Link>
            <span className="role-badge">
              {user.role === 'admin' ? <><Shield size={14} /> Admin</> : `🗳️ Voter`}
            </span>
            <button onClick={handleLogout} className="btn-logout">
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <span className="nav-tagline">Secure Digital Elections</span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
