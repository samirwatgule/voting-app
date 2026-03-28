import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { UserCheck } from 'lucide-react';

const VoterDashboard = () => {
  const [electors, setElectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
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

  const handleVote = async (electorId) => {
    if (!window.confirm('Are you sure? You cannot change your vote later.')) return;
    
    try {
      setError('');
      setSuccess('');
      await axios.post(`/votes/${electorId}`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      setSuccess('Your vote has been successfully cast!');
      updateProfile({ isVoted: true });
      fetchElectors(); // refresh count
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cast vote');
    }
  };

  if (loading) return <h2>Loading dashboard...</h2>;

  return (
    <div>
      <h1 className="page-title">Live Election Dashboard</h1>
      
      {error && <div className="error-msg">{error}</div>}
      {success && <div className="success-msg">{success}</div>}

      {user.isVoted && !success && (
        <div className="success-msg" style={{ background: '#e0f2f1', color: '#00695c', borderLeftColor: '#00695c' }}>
          <strong>Notice: </strong> You have already cast your vote. Thank you for participating!
        </div>
      )}

      <div className="grid-layout">
        {electors.map((elector) => (
          <div key={elector._id} className="glass-card elector-card">
            <div>
              <h3>{elector.name}</h3>
              <p>Party: <strong>{elector.party}</strong></p>
              <div className="vote-count">{elector.voteCount}</div>
              <p style={{ fontSize: '0.85rem' }}>Current Votes</p>
            </div>
            
            <button 
              className="btn" 
              style={{ width: '100%', marginTop: '1rem' }}
              disabled={user.isVoted}
              onClick={() => handleVote(elector._id)}
            >
               <UserCheck size={18} /> {user.isVoted ? 'Voted' : 'Cast Vote'}
            </button>
          </div>
        ))}
        {electors.length === 0 && <p style={{ color: 'white' }}>No electors have been registered yet.</p>}
      </div>
    </div>
  );
};

export default VoterDashboard;
