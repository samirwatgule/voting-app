import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { PlusCircle, Trash2, Users, BarChart3, Award } from 'lucide-react';

const AdminDashboard = () => {
  const [electors, setElectors] = useState([]);
  const [name, setName] = useState('');
  const [party, setParty] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { user } = useContext(AuthContext);

  const fetchElectors = async () => {
    try {
      const { data } = await axios.get('/electors');
      setElectors(data);
    } catch (err) {
      setError('Failed to fetch electors');
    }
  };

  useEffect(() => {
    fetchElectors();
  }, []);

  const totalVotes = electors.reduce((sum, e) => sum + e.voteCount, 0);
  const leadingCandidate = electors.length > 0
    ? [...electors].sort((a, b) => b.voteCount - a.voteCount)[0]
    : null;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name || !party || !age) return setError('Please fill all fields');
    if (age < 18) return setError('Age must be 18+');

    try {
      await axios.post('/electors', { name, party, age: Number(age) }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setName('');
      setParty('');
      setAge('');
      setError('');
      setSuccess('Candidate added successfully!');
      setTimeout(() => setSuccess(''), 3000);
      fetchElectors();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add elector');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this elector?')) return;
    try {
      await axios.delete(`/electors/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSuccess('Candidate removed successfully');
      setTimeout(() => setSuccess(''), 3000);
      fetchElectors();
    } catch (err) {
      setError('Failed to delete elector');
    }
  };

  return (
    <div className="fade-in">
      <h1 className="page-title">
        <Users size={32} /> Admin Dashboard
      </h1>

      {/* Stats Overview */}
      <div className="stats-bar">
        <div className="stat-item">
          <Users size={20} />
          <span>{electors.length} Candidates</span>
        </div>
        <div className="stat-item">
          <BarChart3 size={20} />
          <span>{totalVotes} Total Votes</span>
        </div>
        {leadingCandidate && (
          <div className="stat-item leading">
            <Award size={20} />
            <span>Leading: {leadingCandidate.name}</span>
          </div>
        )}
      </div>

      {error && <div className="error-msg">{error}</div>}
      {success && <div className="success-msg">{success}</div>}

      <div className="admin-grid">
        {/* ADD FORM */}
        <div className="glass-card form-card">
          <h2 className="card-title"><PlusCircle size={22} /> Add Candidate</h2>
          <form onSubmit={handleAdd}>
            <div className="input-group">
              <label>Candidate Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="John Doe" />
            </div>
            <div className="input-group">
              <label>Party Affiliation</label>
              <input value={party} onChange={(e) => setParty(e.target.value)} type="text" placeholder="Independent Party" />
            </div>
            <div className="input-group">
              <label>Age</label>
              <input value={age} onChange={(e) => setAge(e.target.value)} type="number" placeholder="45" min="18" />
            </div>
            <button className="btn" style={{ width: '100%' }}>
              <PlusCircle size={18} /> Add Candidate
            </button>
          </form>
        </div>

        {/* TABLE */}
        <div className="glass-card table-card">
          <h2 className="card-title"><Users size={22} /> Registered Candidates</h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Party</th>
                  <th>Age</th>
                  <th>Votes</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {electors.map((e, i) => (
                  <tr key={e._id} className="fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                    <td className="rank-cell">{i + 1}</td>
                    <td><strong>{e.name}</strong></td>
                    <td><span className="party-badge">{e.party}</span></td>
                    <td>{e.age}</td>
                    <td><span className="vote-badge">{e.voteCount}</span></td>
                    <td>
                      <button onClick={() => handleDelete(e._id)} className="btn btn-danger btn-small">
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {electors.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                      No candidates found. Add one!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
