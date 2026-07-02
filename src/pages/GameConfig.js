import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function GameConfig() {
  const { user } = useAuth();
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('config');
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [currentGame, setCurrentGame] = useState(null);
  const [currentLoading, setCurrentLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PER_PAGE = 5;

  useEffect(() => { fetchConfig(); }, []);

  const fetchConfig = async () => {
    try {
      const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };
      const res = await axios.get(API + '/game/config/fast_bingo', { headers });
      if (res.data && res.data.roomId) setConfig(res.data);
    } catch { }
    setLoading(false);
  };





  

  useEffect(() => {
    if (activeTab === 'history') fetchHistory(1);
    if (activeTab === 'current') fetchCurrentGame();
  }, [activeTab]);

  const save = async () => {
    setSaving(true);
    try {
      const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };
      await axios.put(API + '/game/config/fast_bingo', config, { headers });
      toast.success('Configuration saved!');
    } catch { toast.error('Failed to save'); }
    setSaving(false);
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 80, color: '#1a1a1a', fontSize: 18, fontWeight: 600 }}>
      ⏳ Loading...
    </div>
  );

  const fields = [
    { key:'roomName', label:'Room Name' },
    { key:'cardPrice', label:'Card Price (coins)', type:'number' },
    { key:'maxCardsPerPlayer', label:'Max Cards Per Player', type:'number' },
    { key:'minPlayersToStart', label:'Min Players To Start', type:'number' },
    { key:'minCardsToStart', label:'Min Cards To Start', type:'number' },
    { key:'waitTimeSeconds', label:'Wait Timer (seconds)', type:'number' },
    { key:'drawIntervalSeconds', label:'Draw Interval (seconds)', type:'number' },
    { key:'commissionPercentage', label:'Commission %', type:'number' },
    { key:'gracePeriodSeconds', label:'Grace Period (seconds)', type:'number' },
  ];

  const toggleFields = [
    { key:'resetOnNoPlayers', label:'Reset Timer on 0 Players', trueLabel:'Yes - Reset timer', falseLabel:'No - Keep waiting' },
    { key:'voiceEnabled', label:'Voice Announcements', trueLabel:'Enabled', falseLabel:'Disabled' },
    { key:'autoMarkDefault', label:'Auto-Mark Numbers (Default)', trueLabel:'Enabled', falseLabel:'Disabled' },
    { key:'isActive', label:'Game Active', trueLabel:'Active', falseLabel:'Inactive' },
    { key:'autoGameActive', label:'Auto-Start New Games', trueLabel:'Auto', falseLabel:'Manual' },
    { key:'isLastNumberCalledBingo', label:'Last Number Auto BINGO', trueLabel:'ON - Auto BINGO', falseLabel:'OFF' },
    { key:'autoBingoEnabled', label:'Auto BINGO (No Button Press)', trueLabel:'ON - Auto Win', falseLabel:'OFF - Manual' },
  ];

  const styles = {
    container: { maxWidth: 1000, margin: '0 auto', padding: 24, fontFamily: "'Outfit', sans-serif" },
    header: { fontSize: 28, fontWeight: 800, color: '#1a1a1a', marginBottom: 4 },
    subtitle: { color: '#666', marginBottom: 24, fontSize: 13, fontWeight: 500 },
    tabs: { display: 'flex', gap: 4, marginBottom: 24, borderBottom: '2px solid #e0e0e0' },
    tab: (isActive) => ({
      padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
      border: 'none', background: 'none', color: isActive ? '#D4A017' : '#888',
      borderBottom: isActive ? '3px solid #D4A017' : '3px solid transparent',
      marginBottom: -2, transition: 'all 0.2s',
    }),
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 24 },
    fieldCard: { background: '#fff', padding: 18, borderRadius: 12, border: '2px solid #1a1a1a', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
    label: { color: '#888', fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
    input: { width: '100%', padding: 10, background: '#fff', color: '#1a1a1a', border: '2px solid #1a1a1a', borderRadius: 8, fontSize: 14, outline: 'none', fontWeight: 500 },
    select: { width: '100%', padding: 10, background: '#fff', color: '#1a1a1a', border: '2px solid #1a1a1a', borderRadius: 8, fontSize: 14, outline: 'none', cursor: 'pointer', fontWeight: 500 },
    saveBtn: { width: '100%', padding: 16, background: 'linear-gradient(135deg, #D4A017, #B8860B)', color: '#fff', border: '2px solid #1a1a1a', borderRadius: 12, cursor: 'pointer', fontSize: 16, fontWeight: 700, letterSpacing: 0.5 },
    statLabel: { fontSize: 10, color: '#888', textTransform: 'uppercase', fontWeight: 600, margin: '0 0 4px 0' },
    statValue: { fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: 0 },
    winnerLabel: { fontSize: 10, color: '#B8860B', textTransform: 'uppercase', fontWeight: 600, margin: '0 0 2px 0' },
    winnerValue: { fontSize: 13, fontWeight: 700, color: '#1a1a1a', margin: 0 },
    pagination: { display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 },
    pageBtn: (isActive) => ({
      padding: '8px 16px', border: isActive ? '2px solid #D4A017' : '2px solid #ddd',
      background: isActive ? '#D4A017' : '#fff', color: isActive ? '#fff' : '#333',
      borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 13,
    }),
    drawnNumber: { display: 'inline-block', width: 36, height: 36, borderRadius: '50%', background: '#1a1a1a', color: '#D4A017', textAlign: 'center', lineHeight: '36px', fontSize: 12, fontWeight: 700, margin: 3 },
  };

  const GameCard = ({ game }) => (
    <div style={{ background: '#fff', border: '2px solid #1a1a1a', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ background: '#1a1a1a', color: '#D4A017', padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: 14 }}>
        <span>🎱 Game #{game.gameNumber}</span>
        <span style={{ background: game.status === 'completed' ? '#2ED573' : game.status === 'in_progress' ? '#FFA502' : '#007AFF', color: '#fff', padding: '4px 12px', borderRadius: 6, fontSize: 11, textTransform: 'uppercase' }}>{game.status}</span>
      </div>
      <div style={{ padding: 18 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
          <div><p style={styles.statLabel}>Players</p><p style={styles.statValue}>{game.players?.length || 0}</p></div>
          <div><p style={styles.statLabel}>Cards Sold</p><p style={styles.statValue}>{game.totalCards || 0}</p></div>
          <div><p style={styles.statLabel}>Prize Pool</p><p style={styles.statValue}>{game.prizePool || 0} ETB</p></div>
          <div><p style={styles.statLabel}>Winners</p><p style={styles.statValue}>{game.winners?.length || 0}</p></div>
        </div>

        {/* Current game - show drawn numbers */}
        {game.status !== 'completed' && game.drawnNumbers && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontWeight: 700, color: '#D4A017', marginBottom: 8, fontSize: 13 }}>🔢 Drawn Numbers ({game.drawnNumbers.length})</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {game.drawnNumbers.map((dn, i) => (
                <span key={i} style={styles.drawnNumber}>{dn.number}</span>
              ))}
            </div>
          </div>
        )}

        {/* Current game - show timer */}
        {game.status === 'waiting' && game.timerStartedAt && (
          <div style={{ marginBottom: 16, padding: 12, background: '#FFF8E1', borderRadius: 8, border: '1px solid #D4A017' }}>
            <p style={{ fontWeight: 700, color: '#D4A017', margin: 0, fontSize: 13 }}>⏱️ Timer: {game.timerDuration}s</p>
          </div>
        )}

        {/* Winners */}
        {game.winners && game.winners.length > 0 && (
          <div>
            <p style={{ fontWeight: 700, color: '#D4A017', marginBottom: 10, fontSize: 13 }}>🏆 Winners</p>
            {game.winners.map((winner, idx) => (
              <div key={idx} style={{ background: '#FFF8E1', border: '1px solid #D4A017', borderRadius: 10, padding: 14, marginBottom: 8 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  <div><p style={styles.winnerLabel}>Name</p><p style={styles.winnerValue}>{winner.winnerName || 'N/A'}</p></div>
                  <div><p style={styles.winnerLabel}>Phone</p><p style={styles.winnerValue}>{winner.winnerPhone || 'N/A'}</p></div>
                  <div><p style={styles.winnerLabel}>Prize</p><p style={styles.winnerValue}>{winner.prizeAmount || 0} ETB</p></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 8 }}>
                  <div><p style={styles.winnerLabel}>Win Type</p><p style={styles.winnerValue}>{winner.winType || 'N/A'}</p></div>
                  <div><p style={styles.winnerLabel}>Card #</p><p style={styles.winnerValue}>#{winner.cardNumber || 'N/A'}</p></div>
                  <div><p style={styles.winnerLabel}>New Balance</p><p style={styles.winnerValue}>{winner.newBalance || 0} ETB</p></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {(!game.winners || game.winners.length === 0) && game.status === 'completed' && (
          <p style={{ color: '#888', fontSize: 13, fontStyle: 'italic' }}>No winners - all cards refunded</p>
        )}

        <div style={{ marginTop: 12, display: 'flex', gap: 20, fontSize: 11, color: '#888' }}>
          {game.startTime && <span>🕐 Started: {new Date(game.startTime).toLocaleString()}</span>}
          {game.endTime && <span>🏁 Ended: {new Date(game.endTime).toLocaleString()}</span>}
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>🎱 Fast Bingo Configuration</h1>
      <p style={styles.subtitle}>Changes take effect on the next game.</p>

      <div style={styles.tabs}>
        <button style={styles.tab(activeTab === 'config')} onClick={() => setActiveTab('config')}>⚙️ Configuration</button>
        <button style={styles.tab(activeTab === 'current')} onClick={() => setActiveTab('current')}>🎮 Current Game</button>
        <button style={styles.tab(activeTab === 'history')} onClick={() => setActiveTab('history')}>📋 History</button>
      </div>

      {/* Config Tab */}
      {activeTab === 'config' && (
        <>
          <div style={styles.grid}>
            {fields.map(f => (
              <div key={f.key} style={styles.fieldCard}>
                <label style={styles.label}>{f.label}</label>
                <input type={f.type || 'text'} value={config[f.key] ?? ''} 
                  onChange={e => setConfig({...config, [f.key]: f.type === 'number' ? (parseFloat(e.target.value) || 0) : e.target.value})}
                  style={styles.input} />
              </div>
            ))}
          </div>
          <div style={styles.grid}>
            {toggleFields.map(f => (
              <div key={f.key} style={styles.fieldCard}>
                <label style={styles.label}>{f.label}</label>
                <select value={config[f.key] ? 'true' : 'false'} 
                  onChange={e => setConfig({...config, [f.key]: e.target.value === 'true'})}
                  style={styles.select}>
                  <option value="true">{f.trueLabel}</option>
                  <option value="false">{f.falseLabel}</option>
                </select>
              </div>
            ))}
          </div>
          <button onClick={save} disabled={saving} style={{...styles.saveBtn, opacity: saving ? 0.7 : 1, cursor: saving ? 'wait' : 'pointer'}}>
            {saving ? '⏳ Saving...' : '💾 SAVE CONFIGURATION'}
          </button>
        </>
      )}

      {/* Current Game Tab */}
      {activeTab === 'current' && (
        <div>
          {currentLoading ? (
            <p style={{ textAlign: 'center', padding: 40, color: '#666' }}>Loading current game...</p>
          ) : !currentGame ? (
            <p style={{ textAlign: 'center', padding: 40, color: '#666' }}>No active game.</p>
          ) : (
            <GameCard game={currentGame} />
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div>
          {historyLoading ? (
            <p style={{ textAlign: 'center', padding: 40, color: '#666' }}>Loading history...</p>
          ) : history.length === 0 ? (
            <p style={{ textAlign: 'center', padding: 40, color: '#666' }}>No games played yet.</p>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {history.map((game) => (
                  <GameCard key={game._id} game={game} />
                ))}
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <div style={styles.pagination}>
                  <button style={styles.pageBtn(false)} onClick={() => fetchHistory(page - 1)} disabled={page === 1}>← Prev</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} style={styles.pageBtn(p === page)} onClick={() => fetchHistory(p)}>{p}</button>
                  ))}
                  <button style={styles.pageBtn(false)} onClick={() => fetchHistory(page + 1)} disabled={page === totalPages}>Next →</button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}