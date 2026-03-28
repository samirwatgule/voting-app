import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Save, User, Shield, CheckCircle, Clock, KeyRound } from 'lucide-react';

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
    if (newPassword.length < 6) return setError('New password must be at least 6 characters');

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await axios.put('/users/change-password', { oldPassword, newPassword }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSuccess('Password updated successfully! 🎉');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container fade-in">
      <div className="glass-card profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.role === 'admin' ? <Shield size={36} /> : <User size={36} />}
          </div>
          <h2 className="auth-title">Your Profile</h2>
          <p className="auth-subtitle">Manage your account settings</p>
        </div>

        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}

        <div className="profile-info">
          <div className="profile-info-row">
            <span className="profile-label"><User size={16} /> Aadhar Reference</span>
            <span className="profile-value">{user.aadharCardNumber}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-label"><Shield size={16} /> Role</span>
            <span className="profile-value">
              <span className={`role-pill ${user.role}`}>
                {user.role === 'admin' ? '🛡️ Administrator' : '🗳️ Voter'}
              </span>
            </span>
          </div>
          {user.role === 'voter' && (
            <div className="profile-info-row">
              <span className="profile-label">
                {user.isVoted ? <CheckCircle size={16} /> : <Clock size={16} />} Voting Status
              </span>
              <span className="profile-value">
                <span className={`status-pill ${user.isVoted ? 'voted' : 'pending'}`}>
                  {user.isVoted ? '✅ Voted' : '⏳ Pending'}
                </span>
              </span>
            </div>
          )}
        </div>

        <div className="password-section">
          <h3 className="section-title"><KeyRound size={18} /> Change Password</h3>
          <form onSubmit={handleUpdate}>
            <div className="input-group">
              <label>Current Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>
            <div className="input-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 chars)"
              />
            </div>
            <button type="submit" disabled={loading} className="btn" style={{ width: '100%' }}>
              {loading ? 'Updating...' : <><Save size={18} /> Update Password</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
