import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { LogIn, UserPlus, Vote, Eye, EyeOff } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [aadhar, setAadhar] = useState('');
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
    if (!aadhar || !password) {
      return setError('Please fill all fields');
    }

    if (!/^\d{12}$/.test(aadhar)) {
      return setError('Aadhar Card must be exactly 12 digits');
    }

    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/users/signin' : '/users/signup';
      const { data } = await axios.post(endpoint, {
        aadharCardNumber: aadhar,
        password,
      });

      login(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-card auth-card">
        <div className="auth-icon voter-icon">
          <Vote size={36} />
        </div>
        <h2 className="auth-title">{isLogin ? 'Voter Sign In' : 'Voter Registration'}</h2>
        <p className="auth-subtitle">
          {isLogin ? 'Access your voting dashboard' : 'Register with your Aadhar number'}
        </p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Aadhar Number</label>
            <input
              type="text"
              placeholder="Enter 12-digit Aadhar number"
              value={aadhar}
              onChange={(e) => setAadhar(e.target.value)}
              maxLength={12}
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
          <button type="submit" className="btn" style={{ width: '100%' }} disabled={loading}>
            {loading
              ? 'Please wait...'
              : isLogin
              ? <><LogIn size={18} /> Login</>
              : <><UserPlus size={18} /> Register</>
            }
          </button>
        </form>

        <p className="auth-footer">
          {isLogin ? "Don't have an account? " : 'Already registered? '}
          <span
            className="auth-link"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
