import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Shield, Lock, Eye, EyeOff } from 'lucide-react';

const AdminLoginPage = () => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!adminId || !password) {
      return setError('Please fill all fields');
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post('/users/admin-signin', {
        adminId,
        password,
      });
      login(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-card auth-card">
        <div className="auth-icon admin-icon">
          <Shield size={40} />
        </div>
        <h2 className="auth-title">Admin Portal</h2>
        <p className="auth-subtitle">Authorized personnel only</p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Admin ID</label>
            <input
              type="text"
              placeholder="Enter Admin ID"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-admin" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Authenticating...' : <><Lock size={18} /> Admin Sign In</>}
          </button>
        </form>

        <p className="auth-footer">
          Are you a voter?{' '}
          <Link to="/login" className="auth-link">
            Voter Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
