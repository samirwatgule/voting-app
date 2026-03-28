import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Save } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) return setError('Fill out all fields');

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await axios.put('/users/change-password', {
        oldPassword, newPassword
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setSuccess('Password updated successfully');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5vh' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '500px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Security Profile</h2>
        
        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}

        <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.5)', borderRadius: '8px' }}>
          <p><strong>Aadhar Reference:</strong> {user.aadharCardNumber}</p>
          <p><strong>Privilege Role:</strong> <span style={{ textTransform: 'capitalize' }}>{user.role}</span></p>
          <p><strong>Voting Status:</strong> {user.isVoted ? <span style={{color: 'green'}}>Voted</span> : <span style={{color: 'orange'}}>Pending Vote</span>}</p>
        </div>

        <form onSubmit={handleUpdate}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Update Password</h3>
          <div className="input-group">
            <label>Current Password</label>
            <input 
              type="password" 
              value={oldPassword} 
              onChange={e => setOldPassword(e.target.value)} 
            />
          </div>
          <div className="input-group">
            <label>New Password</label>
            <input 
              type="password" 
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)} 
            />
          </div>
          <button type="submit" disabled={loading} className="btn" style={{ width: '100%' }}>
            <Save size={18} /> Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
