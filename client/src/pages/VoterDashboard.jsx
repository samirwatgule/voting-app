import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, BarChart3, Users } from 'lucide-react';

const VoterDashboard = () => {
  const [electors, setElectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [votingId, setVotingId] = useState(null);

  const { user, updateProfile } = useContext(AuthContext);

  const fetchElectors = async () => {
    try {
      const { data } = await axios.get('/votes/count');
      setElectors(data);
    } catch (err) {
      setError('Failed to fetch elector list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElectors();
  }, []);

  const totalVotes = electors.reduce((sum, e) => sum + e.voteCount, 0);
  const maxVotes = Math.max(...electors.map((e) => e.voteCount), 1);

  const handleVote = async (electorId) => {
    if (!window.confirm('Are you sure? You cannot change your vote later.')) return;

    try {
      setError('');
      setSuccess('');
      setVotingId(electorId);
      await axios.post(`/votes/${electorId}`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setSuccess('Your vote has been successfully cast! 🎉');
      updateProfile({ isVoted: true });
      fetchElectors();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cast vote');
    } finally {
      setVotingId(null);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading election data...</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <h1 className="page-title">
        <BarChart3 size={32} /> Live Election Dashboard
      </h1>

      <div className="stats-bar">
        <div className="stat-item">
          <Users size={20} />
          <span>{electors.length} Candidates</span>
        </div>
        <div className="stat-item">
          <CheckCircle size={20} />
          <span>{totalVotes} Total Votes</span>
        </div>
      </div>

      {error && <div className="error-msg">{error}</div>}
      {success && <div className="success-msg">{success}</div>}

      {user.isVoted && !success && (
        <div className="info-msg">
          <CheckCircle size={18} />
          <span>You have already cast your vote. Thank you for participating!</span>
        </div>
      )}

      <div className="grid-layout">
        {electors.map((elector, index) => (
          <div key={elector._id} className="glass-card elector-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="elector-rank">#{index + 1}</div>
            <h3 className="elector-name">{elector.name}</h3>
            <p className="elector-party">{elector.party}</p>
            <div className="vote-count">{elector.voteCount}</div>
            <p className="vote-label">Votes Received</p>

            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${(elector.voteCount / maxVotes) * 100}%` }}
              ></div>
            </div>

            <button
              className="btn vote-btn"
              style={{ width: '100%', marginTop: '1rem' }}
              disabled={user.isVoted || votingId === elector._id}
              onClick={() => handleVote(elector._id)}
            >
              {votingId === elector._id
                ? 'Casting...'
                : user.isVoted
                ? '✓ Voted'
                : '🗳️ Cast Your Vote'}
            </button>
          </div>
        ))}
        {electors.length === 0 && (
          <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>No candidates have been registered yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoterDashboard;
