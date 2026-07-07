import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import './MainBingoMonitor.css';
import ScheduledGames from '../../components/bingo/ScheduledGames';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const tabStyles = {
  tabs: { display: 'flex', gap: 4, marginBottom: 20, borderBottom: '2px solid #e0e0e0' },
  tab: (active) => ({ padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer', border: 'none', background: 'none', color: active ? '#D4A017' : '#888', borderBottom: active ? '3px solid #D4A017' : '3px solid transparent', marginBottom: -2, transition: 'all 0.2s' }),
  section: { background: '#fff', border: '2px solid #1a1a1a', borderRadius: 14, padding: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 700, color: '#1a1a2e', marginBottom: 16 },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 12, overflow: 'hidden', border: '2px solid #1a1a1a' },
  th: { background: '#1a1a1a', color: '#D4A017', padding: 14, fontSize: 12, fontWeight: 700, textAlign: 'left' },
  td: { padding: 14, borderBottom: '1px solid #e0e0e0', fontSize: 13, color: '#333' },
  statGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 },
  statLabel: { fontSize: 10, color: '#888', textTransform: 'uppercase', fontWeight: 600, margin: '0 0 4px' },
  statValue: { fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: 0 },
};

export default function MainBingoMonitor() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('monitor');
  const [rules, setRules] = useState([]);
  const [monitor, setMonitor] = useState(null);
  const [form, setForm] = useState({ 
    ruleId: '', cardPrice: 50, maxCardsPerPlayer: 10, prizeAmount: 0,
    callIntervalSeconds: 5, isLastNumberCalledBingo: false, gracePeriodSeconds: 10,
    gameStartingSeconds: 30, noOfPlayersToStart: 2, minimumCardsToStart: 1, minimumPrizeThreshold: 100
  });
  const [commissionPercent, setCommissionPercent] = useState(10);
  const [loading, setLoading] = useState(true);
  const [prizeLoading, setPrizeLoading] = useState(false);
  const [prizeInitialized, setPrizeInitialized] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetMode, setResetMode] = useState('clear');
  const [showTiming, setShowTiming] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showCommission, setShowCommission] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // ============================================
  // ALL FUNCTIONS DEFINED FIRST
  // ============================================

  const fetchRules = async () => {
    try {
      const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };
      const res = await axios.get(API + '/main-bingo-rules', { headers });
      setRules(res.data.rules || []);
    } catch { toast.error('Failed to load rules'); }
    setLoading(false);
  };

  const fetchMonitor = async () => {
    try {
      const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };
      const res = await axios.get(API + '/main-bingo/monitor', { headers });
      setMonitor(res.data);
    } catch {}
    if (loading) setLoading(false);
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };
      const res = await axios.get(API + '/main-bingo/history', { headers });
      setHistory(res.data || []);
    } catch { toast.error('Failed to load history'); }
    setHistoryLoading(false);
  };

  const setupGame = async () => {
    if (!form.ruleId || !form.cardPrice) return toast.error('Select rule and set price');
    try {
      const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };
      await axios.post(API + '/main-bingo/setup', form, { headers });
      toast.success('Game setup!');
      setPrizeInitialized(false);
      fetchMonitor();
    } catch (e) { toast.error(e.response?.data?.error || 'Failed'); }
  };

  const setPrize = async () => {
    if (!form.prizeAmount || form.prizeAmount <= 0) return toast.error('Enter prize amount');
    setPrizeLoading(true);
    try {
      const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };
      await axios.put(API + '/main-bingo/prize', { prizeAmount: Number(form.prizeAmount) }, { headers });
      toast.success('Prize updated!');
      fetchMonitor();
    } catch (e) { toast.error('Failed'); }
    setPrizeLoading(false);
  };

  const resetCards = async () => {
    setResetLoading(true);
    try {
      const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };
      await axios.post(API + '/main-bingo/reset-cards', { mode: resetMode, gameId: monitor?.game?._id, force: true }, { headers });
      toast.success('Reset completed');
      setShowResetConfirm(false);
      setPrizeInitialized(false);
      fetchMonitor();
    } catch (e) { toast.error(e.response?.data?.error || 'Failed'); }
    setResetLoading(false);
  };

  const calculatePrizeFromCommission = () => {
    const minPrizeThreshold = form.minimumPrizeThreshold || 100;
    if (totalAmount <= 0) { toast.error('No cards sold yet!'); return; }
    const commission = (totalAmount * commissionPercent) / 100;
    const netAmount = totalAmount - commission;
    const roundedPrize = Math.floor(netAmount / minPrizeThreshold) * minPrizeThreshold;
    if (roundedPrize <= 0) { toast.error('Not enough revenue!'); return; }
    setForm({ ...form, prizeAmount: roundedPrize });
    toast.success(`Prize set to ${roundedPrize.toLocaleString()} ETB`);
  };

  const startGame = async () => {
    try {
      const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };
      const countdownSeconds = monitor?.config?.gameStartingSeconds || form.gameStartingSeconds || 30;
      await axios.post(API + '/main-bingo/start', { gameStartingSeconds: countdownSeconds }, { headers });
      toast.success(`Game starting in ${countdownSeconds}s!`);
      fetchMonitor();
    } catch (e) { toast.error(e.response?.data?.error || 'Failed'); }
  };

  // ============================================
  // EFFECTS
  // ============================================

  useEffect(() => {
    fetchRules();
    fetchMonitor();
    const interval = setInterval(fetchMonitor, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeTab === 'history') fetchHistory();
  }, [activeTab]);

  useEffect(() => {
    if (!prizeInitialized && monitor?.config?.prizeAmount !== undefined) {
      setForm(prev => ({ 
        ...prev, prizeAmount: monitor.config.prizeAmount || 0,
        callIntervalSeconds: monitor.config.callIntervalSeconds || 5,
        isLastNumberCalledBingo: monitor.config.isLastNumberCalledBingo || false,
        gracePeriodSeconds: monitor.config.gracePeriodSeconds || 10,
        gameStartingSeconds: monitor.config.gameStartingSeconds || 30,
        noOfPlayersToStart: monitor.config.noOfPlayersToStart || 2,
        minimumCardsToStart: monitor.config.minimumCardsToStart || 1,
        minimumPrizeThreshold: monitor.config.minimumPrizeThreshold || 100
      }));
      setPrizeInitialized(true);
    }
  }, [monitor?.config, prizeInitialized]);

  // ============================================
  // DERIVED STATE
  // ============================================

  const totalCards = monitor?.totalCards || 0;
  const cardPrice = monitor?.config?.cardPrice || 0;
  const totalAmount = totalCards * cardPrice;
  const currentPrize = monitor?.config?.prizeAmount || monitor?.game?.prizeAmount || 0;
  const playerCount = monitor?.playerCount || 0;
  const commissionAmount = (totalAmount * commissionPercent) / 100;
  const netAfterCommission = totalAmount - commissionAmount;
  const profit = totalAmount - currentPrize;

  const startGameValidation = useMemo(() => {
    const minPlayersRequired = monitor?.config?.noOfPlayersToStart || form.noOfPlayersToStart || 2;
    const minCardsRequired = monitor?.config?.minimumCardsToStart || form.minimumCardsToStart || 1;
    const prizeSet = currentPrize > 0 || form.prizeAmount > 0;
    const checks = {
      minPlayers: { passed: playerCount >= minPlayersRequired, required: minPlayersRequired, current: playerCount },
      minCards: { passed: totalCards >= minCardsRequired, required: minCardsRequired, current: totalCards },
      prizeSet: { passed: prizeSet, required: '> 0 ETB', current: currentPrize || form.prizeAmount },
      gameStatus: { passed: monitor?.game?.status === 'setup', required: 'setup', current: monitor?.game?.status || 'unknown' }
    };
    const allPassed = Object.values(checks).every(c => c.passed);
    return { allPassed, passedCount: Object.values(checks).filter(c => c.passed).length, totalCount: Object.keys(checks).length, checks };
  }, [playerCount, totalCards, currentPrize, form.prizeAmount, form.noOfPlayersToStart, form.minimumCardsToStart, monitor]);

  // ============================================
  // LOADING CHECK
  // ============================================

  if (loading) return (
    <div className="monitor-loading"><div className="monitor-spinner"></div><p>Loading monitor...</p></div>
  );

  const hasActive = monitor?.active && monitor?.game?.status !== 'completed';
  const isSetup = monitor?.game?.status === 'setup';
  const isCountdown = monitor?.game?.status === 'countdown';
  const isLive = monitor?.game?.status === 'in_progress';

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="monitor-container">
      <div className="monitor-header">
        <h1 className="monitor-title">🎱 Main Bingo Monitor</h1>
        {hasActive && (
          <span className={`status-pill ${isLive ? 'pill-live' : isCountdown ? 'pill-countdown' : 'pill-setup'}`}>
            {isLive ? '🔴 LIVE' : isCountdown ? '⏳ STARTING' : '⚙️ SETUP'}
          </span>
        )}
      </div>

      {/* 4 TABS */}
      <div style={tabStyles.tabs}>
        {['monitor', 'schedule', 'live', 'history'].map(key => (
          <button key={key} style={tabStyles.tab(activeTab === key)} onClick={() => setActiveTab(key)}>
            {{monitor:'🎮 Monitor',schedule:'📅 Schedule',live:'🔴 Live Game',history:'📋 History'}[key]}
          </button>
        ))}
      </div>

      {/* 🎮 MONITOR TAB */}
      {activeTab === 'monitor' && (
        <>
          {!hasActive ? (
            <div className="setup-card">
              <h3 className="setup-title">Create New Game</h3>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Game Type</label>
                  <select value={form.ruleId} onChange={e => setForm({...form, ruleId: e.target.value})} className="form-select">
                    <option value="">Select rule...</option>
                    {rules.map(r => <option key={r._id} value={r._id}>{r.name} ({r.method})</option>)}
                  </select>
                </div>
                <div className="form-group form-group-sm"><label className="form-label">Price (ETB)</label><input type="number" value={form.cardPrice} onChange={e => setForm({...form, cardPrice: parseInt(e.target.value)||0})} className="form-input" /></div>
                <div className="form-group form-group-sm"><label className="form-label">Max Cards/Player</label><input type="number" value={form.maxCardsPerPlayer} onChange={e => setForm({...form, maxCardsPerPlayer: parseInt(e.target.value)||10})} className="form-input" /></div>
              </div>
              
              {/* Advanced Settings */}
              <div className="advanced-settings">
                <button className={`collapse-trigger ${showTiming?'open':''}`} onClick={()=>setShowTiming(!showTiming)}><span>⏱️ Game Timing</span><span>{showTiming?'▲':'▼'}</span></button>
                {showTiming && <div className="collapse-content"><div className="form-row">
                  <div className="form-group form-group-sm"><label className="form-label">Call Interval (s)</label><input type="number" value={form.callIntervalSeconds} onChange={e=>setForm({...form,callIntervalSeconds:parseInt(e.target.value)||5})} className="form-input" /></div>
                  <div className="form-group form-group-sm"><label className="form-label">Countdown (s)</label><input type="number" value={form.gameStartingSeconds} onChange={e=>setForm({...form,gameStartingSeconds:parseInt(e.target.value)||30})} className="form-input" /></div>
                  <div className="form-group form-group-sm"><label className="form-label">Grace Period (s)</label><input type="number" value={form.gracePeriodSeconds} onChange={e=>setForm({...form,gracePeriodSeconds:parseInt(e.target.value)||10})} className="form-input" /></div>
                  <div className="form-group form-group-sm">
  <label className="form-label">Last Number = BINGO</label>
  <input 
    type="checkbox" 
    checked={form.isLastNumberCalledBingo} 
    onChange={e => setForm({...form, isLastNumberCalledBingo: e.target.checked})} 
    style={{ width: 20, height: 20, marginTop: 4 }}
  />
</div>
                </div></div>}
                
                <button className={`collapse-trigger ${showRules?'open':''}`} onClick={()=>setShowRules(!showRules)}><span>🎯 Game Rules</span><span>{showRules?'▲':'▼'}</span></button>
                {showRules && <div className="collapse-content"><div className="form-row">
                  <div className="form-group form-group-sm"><label className="form-label">Min Players</label><input type="number" value={form.noOfPlayersToStart} onChange={e=>setForm({...form,noOfPlayersToStart:parseInt(e.target.value)||2})} className="form-input" /></div>
                  <div className="form-group form-group-sm"><label className="form-label">Min Cards</label><input type="number" value={form.minimumCardsToStart} onChange={e=>setForm({...form,minimumCardsToStart:parseInt(e.target.value)||1})} className="form-input" /></div>
                  <div className="form-group form-group-sm"><label className="form-label">Prize Round To</label><input type="number" value={form.minimumPrizeThreshold} onChange={e=>setForm({...form,minimumPrizeThreshold:parseInt(e.target.value)||100})} className="form-input" /></div>
                </div></div>}
              </div>

              <button onClick={setupGame} className="btn-setup">🎯 Setup Game</button>
            </div>
          ) : (
            <div className="live-card">
              <div className="stats-row">
                <div className="stat-mini"><span className="stat-mini-label">Players</span><span className="stat-mini-value">{playerCount}</span></div>
                <div className="stat-mini stat-mini-gold"><span className="stat-mini-label">Cards</span><span className="stat-mini-value">{totalCards}</span></div>
                <div className="stat-mini stat-mini-green"><span className="stat-mini-label">Price</span><span className="stat-mini-value">{cardPrice}</span></div>
                <div className="stat-mini stat-mini-pink"><span className="stat-mini-label">Revenue</span><span className="stat-mini-value">{totalAmount.toLocaleString()}</span></div>
                <div className="stat-mini stat-mini-purple"><span className="stat-mini-label">Prize</span><span className="stat-mini-value">{currentPrize.toLocaleString()}</span></div>
                <div className={`stat-mini ${profit>=0?'stat-mini-green':'stat-mini-red'}`}><span className="stat-mini-label">Profit</span><span className="stat-mini-value">{profit.toLocaleString()}</span></div>
              </div>

              {isSetup && (
                <div className="prize-section-compact">
                  <div className="prize-row-compact">
                    <div className="prize-input-group"><label className="prize-label-compact">💰 Prize (ETB)</label><input type="number" value={form.prizeAmount} onChange={e=>setForm({...form,prizeAmount:parseInt(e.target.value)||0})} className="prize-input-compact" /></div>
                    <button onClick={setPrize} disabled={prizeLoading} className="btn-prize-compact">{prizeLoading?'⏳':'💾 Save'}</button>
                    <button onClick={()=>setShowCommission(!showCommission)} className="btn-commission-toggle">🧮 {showCommission?'Hide':'Calc'}</button>
                  </div>
                  {showCommission && (
                    <div className="commission-compact">
                      <div className="commission-row-compact"><label>Commission:</label><input type="number" value={commissionPercent} onChange={e=>setCommissionPercent(parseFloat(e.target.value)||0)} className="commission-input-compact" /><span>%</span></div>
                      <div className="commission-details-compact">
                        <div className="calc-row"><span>Revenue:</span><span><b>{totalAmount.toLocaleString()}</b> ETB</span></div>
                        <div className="calc-row"><span>Commission:</span><span><b>{commissionAmount.toLocaleString()}</b> ETB</span></div>
                        <div className="calc-row calc-highlight"><span>Net:</span><span><b>{netAfterCommission.toLocaleString()}</b> ETB</span></div>
                      </div>
                      <button onClick={calculatePrizeFromCommission} className="btn-calculate-compact">Apply Suggested Prize</button>
                    </div>
                  )}
                </div>
              )}

              {isSetup && (
                <div className="validation-compact">
                  <div className="validation-row">
                    <span className={`validation-dot ${startGameValidation.checks.minPlayers.passed?'dot-green':'dot-red'}`} /> Players: {startGameValidation.checks.minPlayers.current}/{startGameValidation.checks.minPlayers.required}
                    <span className={`validation-dot ${startGameValidation.checks.minCards.passed?'dot-green':'dot-red'}`} /> Cards: {startGameValidation.checks.minCards.current}/{startGameValidation.checks.minCards.required}
                    <span className={`validation-dot ${startGameValidation.checks.prizeSet.passed?'dot-green':'dot-red'}`} /> Prize: {startGameValidation.checks.prizeSet.passed?'✅':'❌'}
                  </div>
                  <div className="validation-progress"><div className="progress-bar"><div className="progress-fill" style={{width:`${(startGameValidation.passedCount/startGameValidation.totalCount)*100}%`}}/></div><span>{startGameValidation.passedCount}/{startGameValidation.totalCount} met</span></div>
                </div>
              )}

              {isSetup && <button onClick={startGame} className={`btn-start-compact ${startGameValidation.allPassed?'':'btn-disabled'}`} disabled={!startGameValidation.allPassed}>▶️ START GAME</button>}
              {isCountdown && <div className="countdown-compact"><span className="countdown-pulse">⏳</span> Game starting...</div>}
              {isLive && <div className="live-indicator-compact"><span className="live-dot-sm"></span> LIVE - Drawing numbers</div>}
            </div>
          )}
          {(isSetup || !monitor?.game) && <button onClick={()=>setShowResetConfirm(true)} className="btn-reset-cards">🔄 Reset Cards DB {totalCards>0?`(${totalCards})`:''}</button>}
        </>
      )}

      {/* 📅 SCHEDULE TAB */}
{activeTab === 'schedule' && (
  <div style={tabStyles.section}>
    <h3 style={tabStyles.sectionTitle}>📅 Scheduled Games</h3>
    <ScheduledGames />
  </div>
)}

      {/* 🔴 LIVE GAME TAB */}
      {activeTab === 'live' && (
        <div>
          {!hasActive ? <p style={{textAlign:'center',padding:40,color:'#666'}}>No active game.</p> : (
            <div style={tabStyles.section}>
              <h3 style={tabStyles.sectionTitle}>🔴 Live Game #{monitor?.game?.gameNumber||'N/A'}</h3>
              <div style={tabStyles.statGrid}>
                <div><p style={tabStyles.statLabel}>Players</p><p style={tabStyles.statValue}>{playerCount}</p></div>
                <div><p style={tabStyles.statLabel}>Cards Sold</p><p style={tabStyles.statValue}>{totalCards}</p></div>
                <div><p style={tabStyles.statLabel}>Prize Pool</p><p style={tabStyles.statValue}>{currentPrize} ETB</p></div>
                <div><p style={tabStyles.statLabel}>Numbers Drawn</p><p style={tabStyles.statValue}>{monitor?.game?.drawnNumbers?.length||0}/75</p></div>
              </div>
              {monitor?.game?.drawnNumbers?.length>0&&<div style={{marginTop:16}}><p style={{fontWeight:700,color:'#D4A017',marginBottom:8}}>🔢 Drawn Numbers</p><div style={{display:'flex',flexWrap:'wrap',gap:4}}>{monitor.game.drawnNumbers.map((dn,i)=><span key={i} style={{display:'inline-block',width:36,height:36,borderRadius:'50%',background:'#1a1a1a',color:'#D4A017',textAlign:'center',lineHeight:'36px',fontSize:12,fontWeight:700}}>{dn.number}</span>)}</div></div>}
              {monitor?.game?.winners?.length>0&&<div style={{marginTop:16}}><p style={{fontWeight:700,color:'#2ED573',marginBottom:8}}>🏆 Winners</p>{monitor.game.winners.map((w,i)=><div key={i} style={{padding:8,background:'#FFF8E1',borderRadius:8,marginBottom:4,border:'1px solid #D4A017'}}>{w.winnerName} - {w.winType} - {w.prizeAmount} ETB</div>)}</div>}
            </div>
          )}
        </div>
      )}

      {/* 📋 HISTORY TAB */}
      {activeTab === 'history' && (
        <div>
          {historyLoading ? <p style={{textAlign:'center',padding:40,color:'#666'}}>Loading...</p>
          : history.length===0 ? <p style={{textAlign:'center',padding:40,color:'#666'}}>No games played yet.</p>
          : <table style={tabStyles.table}><thead><tr><th style={tabStyles.th}>Game #</th><th style={tabStyles.th}>Status</th><th style={tabStyles.th}>Players</th><th style={tabStyles.th}>Cards</th><th style={tabStyles.th}>Prize</th><th style={tabStyles.th}>Winners</th><th style={tabStyles.th}>Date</th></tr></thead><tbody>{history.map(g=><tr key={g._id}><td style={tabStyles.td}>#{g.gameNumber}</td><td style={tabStyles.td}>{g.status}</td><td style={tabStyles.td}>{g.players?.length||0}</td><td style={tabStyles.td}>{g.totalCards||0}</td><td style={tabStyles.td}>{g.prizeAmount||0} ETB</td><td style={tabStyles.td}>{g.winners?.length||0}</td><td style={tabStyles.td}>{new Date(g.endTime||g.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table>}
        </div>
      )}

      {/* Reset Modal */}
      {showResetConfirm && (
        <div className="modal-overlay"><div className="modal-card">
          <h3 className="modal-title">🔧 Reset Cards Database</h3>
          <div className="modal-stats"><div className="modal-stat"><span>Cards:</span><strong>{totalCards}</strong></div><div className="modal-stat"><span>Players:</span><strong>{playerCount}</strong></div><div className="modal-stat"><span>Revenue:</span><strong>{totalAmount.toLocaleString()} ETB</strong></div></div>
          <div className="reset-mode-selector"><label className="mode-label">Select Reset Operation:</label><div className="mode-options">
            <button className={`mode-btn ${resetMode==='clear'?'mode-active':''}`} onClick={()=>setResetMode('clear')}><span className="mode-icon">🔄</span><div className="mode-info"><strong>Clear All Cards</strong><span>Reset marked numbers</span></div></button>
            <button className={`mode-btn ${resetMode==='delete'?'mode-active':''}`} onClick={()=>setResetMode('delete')}><span className="mode-icon">🗑️</span><div className="mode-info"><strong>Delete All Cards</strong><span>Remove from database</span></div></button>
            <button className={`mode-btn ${resetMode==='full-reset'?'mode-active':''}`} onClick={()=>setResetMode('full-reset')}><span className="mode-icon">💣</span><div className="mode-info"><strong>Full Database Reset</strong><span>Drop and recreate</span></div></button>
          </div></div>
          <div className="modal-warning-box"><span className="warning-icon">⚠️</span><p>This is a destructive debug operation.</p></div>
          <div className="modal-actions"><button onClick={()=>{setShowResetConfirm(false);setResetMode('clear');}} className="btn-cancel" disabled={resetLoading}>Cancel</button><button onClick={resetCards} className="btn-confirm-danger" disabled={resetLoading}>{resetLoading?'⏳ Processing...':resetMode==='delete'?'🗑️ Delete All Cards':resetMode==='clear'?'🔄 Clear All Cards':'💣 Full Database Reset'}</button></div>
        </div></div>
      )}
    </div>
  );
}