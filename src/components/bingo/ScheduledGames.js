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

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>📅 Scheduled Games</h2>
        <button onClick={() => setShowForm(!showForm)} style={styles.toggleBtn}>
          {showForm ? '✕ Cancel' : '+ Schedule Game'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div style={styles.formContainer}>
          <div style={styles.formGrid}>
            <div>
              <label style={styles.label}>Game Name</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} 
                placeholder="e.g., Friday Special" style={styles.input} />
            </div>
            <div>
              <label style={styles.label}>Rule</label>
              <select value={form.ruleId} onChange={e => setForm({...form, ruleId: e.target.value})} style={styles.input}>
                <option value="">Select Rule</option>
                {rules.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
              </select>
            </div>
            <div>
              <label style={styles.label}>Start Time</label>
              <input type="datetime-local" value={form.startTime} 
                onChange={e => setForm({...form, startTime: e.target.value})} style={styles.input} />
            </div>
            <div>
              <label style={styles.label}>Card Price (ETB)</label>
              <input type="number" value={form.cardPrice} 
                onChange={e => setForm({...form, cardPrice: parseInt(e.target.value)})} style={styles.input} />
            </div>
            <div>
              <label style={styles.label}>Prize (ETB)</label>
              <input type="number" value={form.prize} 
                onChange={e => setForm({...form, prize: parseInt(e.target.value)})} style={styles.input} />
            </div>
            <div>
              <label style={styles.label}>Max Players</label>
              <input type="number" value={form.maxPlayers} 
                onChange={e => setForm({...form, maxPlayers: parseInt(e.target.value)})} style={styles.input} />
            </div>
          </div>
          <button onClick={createGame} style={styles.submitBtn}>
            💾 Schedule Game
          </button>
        </div>
      )}

      {/* Games List */}
      <div style={styles.gamesList}>
        {games.length === 0 && (
          <p style={styles.emptyText}>No scheduled games</p>
        )}
        {games.map(game => {
          const statusColors = {
            scheduled: { bg: '#fef3c7', color: '#b8962f' },
            active: { bg: '#d1fae5', color: '#065f46' },
            completed: { bg: '#e5e7eb', color: '#6b7280' },
            cancelled: { bg: '#fee2e2', color: '#991b1b' }
          };
          const statusStyle = statusColors[game.status] || statusColors.scheduled;
          
          return (
            <div key={game._id} style={styles.gameCard}>
              <div>
                <h4 style={styles.gameName}>{game.name}</h4>
                <p style={styles.gameDetails}>
                  Rule: <span style={styles.gameDetailsHighlight}>{game.rule?.name || 'N/A'}</span> | 
                  Start: <span style={styles.gameDetailsHighlight}>{new Date(game.startTime).toLocaleString()}</span> | 
                  Price: <span style={styles.gameDetailsHighlight}>{game.cardPrice} ETB</span> | 
                  Prize: <span style={styles.gameDetailsHighlight}>{game.prize} ETB</span>
                </p>
                <span style={{
                  ...styles.statusBadge,
                  background: statusStyle.bg,
                  color: statusStyle.color,
                  border: `1px solid ${statusStyle.color}`,
                }}>
                  {game.status}
                </span>
              </div>
              <div style={styles.gameActions}>
                <button onClick={() => resetGame(game._id)} style={styles.resetBtn}>🔄 Reset</button>
                <button onClick={() => deleteGame(game._id)} style={styles.deleteBtn}>🗑</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// STYLES - White/Gold/Black Theme
// ============================================
const styles = {
  container: {
    background: '#ffffff',
    padding: '20px',
    borderRadius: '14px',
    border: '2px solid #000000',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 700,
    color: '#1a1a2e',
  },
  toggleBtn: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #d4af37, #b8962f)',
    color: '#fff',
    border: '2px solid #000000',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '13px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 16px rgba(212,175,55,0.25)',
  },
  formContainer: {
    background: '#f9fafb',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '20px',
    border: '1px solid #e5e7eb',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  label: {
    fontSize: '11px',
    color: '#6b7280',
    display: 'block',
    marginBottom: '4px',
    fontWeight: 500,
  },
  input: {
    width: '100%',
    padding: '10px',
    background: '#ffffff',
    color: '#1a1a2e',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '13px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  submitBtn: {
    width: '100%',
    marginTop: '15px',
    padding: '12px',
    background: 'linear-gradient(135deg, #d4af37, #b8962f)',
    color: '#fff',
    border: '2px solid #000000',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '14px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 16px rgba(212,175,55,0.25)',
  },
  gamesList: {
    display: 'grid',
    gap: '12px',
  },
  emptyText: {
    color: '#6b7280',
    textAlign: 'center',
    padding: '20px',
  },
  gameCard: {
    background: '#f9fafb',
    padding: '16px',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #e5e7eb',
    transition: 'all 0.2s ease',
  },
  gameName: {
    margin: 0,
    color: '#1a1a2e',
    fontSize: '16px',
    fontWeight: 700,
  },
  gameDetails: {
    margin: '4px 0 0',
    fontSize: '12px',
    color: '#6b7280',
  },
  gameDetailsHighlight: {
    color: '#1a1a2e',
    fontWeight: 600,
  },
  statusBadge: {
    fontSize: '10px',
    padding: '2px 10px',
    borderRadius: '12px',
    fontWeight: 600,
    display: 'inline-block',
  },
  gameActions: {
    display: 'flex',
    gap: '8px',
  },
  resetBtn: {
    padding: '8px 14px',
    background: '#fef3c7',
    color: '#b8962f',
    border: '1px solid #d4af37',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 600,
    transition: 'all 0.2s ease',
  },
  deleteBtn: {
    padding: '8px 14px',
    background: '#fee2e2',
    color: '#991b1b',
    border: '1px solid #ef4444',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 600,
    transition: 'all 0.2s ease',
  },
  loading: {
    textAlign: 'center',
    padding: '20px',
    color: '#6b7280',
  },
};