import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { LogIn, UserPlus } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [aadhar, setAadhar] = useState('');
  const [password, setPassword] = useState('');
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
    
    // Strict Aadhar Validation according to project specifications (Admin bypass)
    if (aadhar !== 'Admin' && (!/^\d{12}$/.test(aadhar))) {
       return setError('Aadhar Card must be exactly 12 digits');
    }

    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/users/signin' : '/users/signup';
      const { data } = await axios.post(endpoint, {
        aadharCardNumber: aadhar,
        password
      });

      login(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
          {isLogin ? 'Sign In' : 'Register Registration'}
        </h2>
        {error && <div className="error-msg">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Aadhar Number (or 'Admin')</label>
            <input 
              type="text" 
              placeholder="12-digit Aadhar"
              value={aadhar}
              onChange={(e) => setAadhar(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn" style={{ width: '100%' }} disabled={loading}>
            {isLogin ? <><LogIn size={18}/> Login</> : <><UserPlus size={18}/> Register</>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-light)' }}>
          {isLogin ? "Don't have an account? " : "Already registered? "}
          <span 
            style={{ color: 'var(--primary-color)', cursor: 'pointer', fontWeight: '500' }}
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
