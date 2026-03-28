import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { PlusCircle, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
  const [electors, setElectors] = useState([]);
  const [name, setName] = useState('');
  const [party, setParty] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');
  
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

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name || !party || !age) return setError('Please fill all fields');
    if (age < 18) return setError('Age must be 18+');

    try {
      await axios.post('/electors', { name, party, age: Number(age) }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setName(''); setParty(''); setAge(''); setError('');
      fetchElectors();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add elector');
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete this elector?')) return;
    try {
      await axios.delete(`/electors/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchElectors();
    } catch (err) {
      setError('Failed to delete elector');
    }
  };

  return (
    <div>
      <h1 className="page-title">Admin Dashboard</h1>
      
      {error && <div className="error-msg">{error}</div>}

      <div className="grid-layout">
        {/* ADD FORM */}
        <div className="glass-card" style={{ alignSelf: 'start' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Add New Elector</h2>
          <form onSubmit={handleAdd}>
            <div className="input-group">
              <label>Candidate Name</label>
              <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="John Doe" />
            </div>
            <div className="input-group">
              <label>Party Affiliation</label>
              <input value={party} onChange={e => setParty(e.target.value)} type="text" placeholder="Independent Party" />
            </div>
            <div className="input-group">
              <label>Age</label>
              <input value={age} onChange={e => setAge(e.target.value)} type="number" placeholder="45" min="18" />
            </div>
            <button className="btn" style={{ width: '100%' }}>
              <PlusCircle size={18} /> Add Candidate
            </button>
          </form>
        </div>

        {/* LIST */}
        <div className="glass-card table-wrapper">
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-dark)' }}>Registered Candidates</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Party</th>
                <th>Age</th>
                <th>Votes</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {electors.map(e => (
                <tr key={e._id}>
                  <td><strong>{e.name}</strong></td>
                  <td>{e.party}</td>
                  <td>{e.age}</td>
                  <td><span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>{e.voteCount}</span></td>
                  <td>
                    <button onClick={() => handleDelete(e._id)} className="btn btn-danger btn-small">
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {electors.length === 0 && (
                <tr>
                   <td colSpan="5" style={{ textAlign: 'center' }}>No candidates found. Add one!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
