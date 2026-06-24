import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function ScheduledGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    ruleId: '',
    startTime: '',
    cardPrice: 10,
    prize: 100,
    maxPlayers: 50
  });
  const [rules, setRules] = useState([]);

  useEffect(() => {
    fetchGames();
    fetchRules();
  }, []);

  const headers = () => ({ Authorization: 'Bearer ' + localStorage.getItem('token') });

  const fetchGames = async () => {
    try {
      const res = await axios.get(API + '/scheduled-games', { headers: headers() });
      setGames(res.data.games || []);
    } catch { toast.error('Failed to load games'); }
    setLoading(false);
  };

  const fetchRules = async () => {
    try {
      const res = await axios.get(API + '/main-bingo-rules', { headers: headers() });
      setRules(res.data.rules || []);
    } catch { /* ignore */ }
  };

  const createGame = async () => {
    try {
      await axios.post(API + '/scheduled-games', form, { headers: headers() });
      toast.success('Game scheduled!');
      setShowForm(false);
      setForm({ name: '', ruleId: '', startTime: '', cardPrice: 10, prize: 100, maxPlayers: 50 });
      fetchGames();
    } catch (e) { toast.error(e.response?.data?.error || 'Failed'); }
  };

  const deleteGame = async (id) => {
    if (!window.confirm('Delete this scheduled game?')) return;
    try {
      await axios.delete(API + '/scheduled-games/' + id, { headers: headers() });
      toast.success('Deleted!');
      fetchGames();
    } catch { toast.error('Failed'); }
  };

  const resetGame = async (id) => {
    if (!window.confirm('Reset this game?')) return;
    try {
      await axios.post(API + '/scheduled-games/' + id + '/reset', {}, { headers: headers() });
      toast.success('Game reset!');
      fetchGames();
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 20, color: '#888' }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 20 }}>📅 Scheduled Games</h2>
        <button onClick={() => setShowForm(!showForm)} style={{
          padding: '10px 20px', background: '#FFA502', color: '#000',
          border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700
        }}>
          {showForm ? '✕ Cancel' : '+ Schedule Game'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div style={{ background: '#16213e', padding: 20, borderRadius: 12, marginBottom: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Game Name</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} 
                placeholder="e.g., Friday Special" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Rule</label>
              <select value={form.ruleId} onChange={e => setForm({...form, ruleId: e.target.value})} style={inputStyle}>
                <option value="">Select Rule</option>
                {rules.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Start Time</label>
              <input type="datetime-local" value={form.startTime} 
                onChange={e => setForm({...form, startTime: e.target.value})} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Card Price</label>
              <input type="number" value={form.cardPrice} 
                onChange={e => setForm({...form, cardPrice: parseInt(e.target.value)})} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Prize</label>
              <input type="number" value={form.prize} 
                onChange={e => setForm({...form, prize: parseInt(e.target.value)})} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Max Players</label>
              <input type="number" value={form.maxPlayers} 
                onChange={e => setForm({...form, maxPlayers: parseInt(e.target.value)})} style={inputStyle} />
            </div>
          </div>
          <button onClick={createGame} style={{
            width: '100%', marginTop: 15, padding: 12, background: '#2ED573', color: '#000',
            border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700
          }}>
            💾 Schedule Game
          </button>
        </div>
      )}

      {/* Games List */}
      <div style={{ display: 'grid', gap: 12 }}>
        {games.length === 0 && <p style={{ color: '#888', textAlign: 'center' }}>No scheduled games</p>}
        {games.map(game => (
          <div key={game._id} style={{
            background: '#16213e', padding: 16, borderRadius: 12,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <h4 style={{ margin: 0, color: '#FFA502' }}>{game.name}</h4>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#888' }}>
                Rule: {game.rule?.name || 'N/A'} | 
                Start: {new Date(game.startTime).toLocaleString()} | 
                Price: {game.cardPrice} | Prize: {game.prize}
              </p>
              <span style={{
                fontSize: 10, padding: '2px 8px', borderRadius: 10,
                background: game.status === 'scheduled' ? '#FFA502' : game.status === 'active' ? '#2ED573' : '#888',
                color: '#000', fontWeight: 600
              }}>
                {game.status}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => resetGame(game._id)} style={btnStyle('#FFA502', '#000')}>🔄 Reset</button>
              <button onClick={() => deleteGame(game._id)} style={btnStyle('#3a0a0a', '#FF4757')}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const labelStyle = { fontSize: 11, color: '#888', display: 'block', marginBottom: 4 };
const inputStyle = { width: '100%', padding: 10, background: '#0f3460', color: '#fff', border: '1px solid #333', borderRadius: 6, fontSize: 13 };
const btnStyle = (bg, color) => ({ padding: '8px 14px', background: bg, color, border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 });