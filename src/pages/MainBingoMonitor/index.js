// src/pages/MainBingoMonitor/index.js
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import './MainBingoMonitor.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function MainBingoMonitor() {
  const { user } = useAuth();
  const [rules, setRules] = useState([]);
  const [monitor, setMonitor] = useState(null);
  const [form, setForm] = useState({ 
    ruleId: '', 
    cardPrice: 50, 
    maxCardsPerPlayer: 10, 
    prizeAmount: 0,
    callIntervalSeconds: 5,
    isLastNumberCalledBingo: false,
    gracePeriodSeconds: 10,
    gameStartingSeconds: 30,
    noOfPlayersToStart: 2,
    minimumCardsToStart: 1,
    minimumPrizeThreshold: 100
  });
  const [commissionPercent, setCommissionPercent] = useState(10);
  const [loading, setLoading] = useState(true);
  const [prizeLoading, setPrizeLoading] = useState(false);
  const [prizeInitialized, setPrizeInitialized] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetMode, setResetMode] = useState('clear'); // 'clear' or 'delete'
  
  // Collapsible sections state
  const [showTiming, setShowTiming] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showCommission, setShowCommission] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    fetchRules();
    fetchMonitor();
    const interval = setInterval(fetchMonitor, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!prizeInitialized && monitor?.config?.prizeAmount !== undefined) {
      setForm(prev => ({ 
        ...prev, 
        prizeAmount: monitor.config.prizeAmount || 0,
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
      minPlayers: {
        passed: playerCount >= minPlayersRequired,
        required: minPlayersRequired,
        current: playerCount,
      },
      minCards: {
        passed: totalCards >= minCardsRequired,
        required: minCardsRequired,
        current: totalCards,
      },
      prizeSet: {
        passed: prizeSet,
        required: '> 0 ETB',
        current: currentPrize || form.prizeAmount,
      },
      gameStatus: {
        passed: monitor?.game?.status === 'setup',
        required: 'setup',
        current: monitor?.game?.status || 'unknown',
      }
    };
    
    const allPassed = Object.values(checks).every(check => check.passed);
    const passedCount = Object.values(checks).filter(c => c.passed).length;
    const totalCount = Object.keys(checks).length;
    
    return {
      allPassed,
      passedCount,
      totalCount,
      checks,
      failedChecks: Object.entries(checks)
        .filter(([_, check]) => !check.passed)
        .map(([key, check]) => ({ key, ...check }))
    };
  }, [playerCount, totalCards, currentPrize, form.prizeAmount, form.noOfPlayersToStart, form.minimumCardsToStart, monitor]);

  const fetchRules = async () => {
    try {
      const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };
      const res = await axios.get(API + '/main-bingo-rules', { headers });
      setRules(res.data.rules || []);
    } catch {}
  };

  const fetchMonitor = async () => {
    try {
      const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };
      const res = await axios.get(API + '/main-bingo/monitor', { headers });
      setMonitor(res.data);
    } catch {}
    setLoading(false);
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

  // UPDATED: Reset Cards Function - Now resets actual cards in DB
 // Updated resetCards function
const resetCards = async () => {
  setResetLoading(true);
  try {
    const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };
    
    // Send the reset mode with game info
    const res = await axios.post(API + '/main-bingo/reset-cards', { 
      mode: resetMode, // 'clear', 'delete', or 'full-reset'
      gameId: monitor?.game?._id || monitor?.game?.id,
      force: true // Force reset even if 0 cards
    }, { headers });
    
    const messages = {
      'delete': `Deleted ${res.data.affectedCards || 0} cards from database`,
      'clear': `Cleared ${res.data.affectedCards || 0} cards to initial state`,
      'full-reset': `Full database reset completed`
    };
    
    toast.success(messages[resetMode] || 'Reset completed');
    setShowResetConfirm(false);
    setPrizeInitialized(false);
    fetchMonitor();
  } catch (e) {
    toast.error(e.response?.data?.error || 'Failed to reset cards');
    console.error('Reset cards error:', e);
  } finally {
    setResetLoading(false);
  }
};

  const calculatePrizeFromCommission = () => {
    const minPrizeThreshold = form.minimumPrizeThreshold || 100;
    
    if (totalAmount <= 0) {
      toast.error(`No cards sold yet! (${totalCards} cards × ${cardPrice} ETB = ${totalAmount} ETB)`);
      return;
    }
    const commission = (totalAmount * commissionPercent) / 100;
    const netAmount = totalAmount - commission;
    const roundedPrize = Math.floor(netAmount / minPrizeThreshold) * minPrizeThreshold;
    
    if (roundedPrize <= 0) {
      toast.error(`Not enough revenue! Total: ${totalAmount.toLocaleString()} ETB, Commission (${commissionPercent}%): ${commission.toLocaleString()} ETB, Net: ${netAmount.toLocaleString()} ETB. Need at least ${minPrizeThreshold} ETB after commission.`);
      return;
    }
    setForm({ ...form, prizeAmount: roundedPrize });
    toast.success(`Prize set to ${roundedPrize.toLocaleString()} ETB (${commissionPercent}% commission: ${commission.toLocaleString()} ETB)`);
  };

  const startGame = async () => {
    if (!startGameValidation.allPassed) {
      return toast.error(startGameValidation.failedChecks[0]?.message || 'Requirements not met');
    }
    
    try {
      const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };
      
      const countdownSeconds = monitor?.config?.gameStartingSeconds || form.gameStartingSeconds || 30;
      
      await axios.post(API + '/main-bingo/start', { 
        gameStartingSeconds: countdownSeconds 
      }, { headers });
      
      toast.success(`Game starting in ${countdownSeconds}s!`);
      fetchMonitor();
    } catch (e) { 
      toast.error(e.response?.data?.error || 'Failed to start game'); 
    }
  };

  if (loading) return (
    <div className="monitor-loading">
      <div className="monitor-spinner"></div>
      <p>Loading monitor...</p>
    </div>
  );

  const hasActive = monitor?.active && monitor?.game?.status !== 'completed';
  const isSetup = monitor?.game?.status === 'setup';
  const isCountdown = monitor?.game?.status === 'countdown';
  const isLive = monitor?.game?.status === 'in_progress';

 return (
  <div className="monitor-container">
    {/* HEADER */}
    <div className="monitor-header">
      <h1 className="monitor-title">🎱 Main Bingo Monitor</h1>
      <div className="header-actions">
        {hasActive && (
          <span className={`status-pill ${isLive ? 'pill-live' : isCountdown ? 'pill-countdown' : 'pill-setup'}`}>
            {isLive ? '🔴 LIVE' : isCountdown ? '⏳ STARTING' : '⚙️ SETUP'}
          </span>
        )}
        
        {/* Reset button: Show during setup OR when no game exists */}
        {(isSetup || !monitor?.game) && (
          <button 
            onClick={() => setShowResetConfirm(true)} 
            className="btn-reset-cards"
            title="Reset all cards in database (Debug/Test)"
          >
            🔄 Reset Cards DB {totalCards > 0 ? `(${totalCards})` : ''}
          </button>
        )}
      </div>
    </div>

      {/* ============ SETUP MODE ============ */}
      {!hasActive && (
        <div className="setup-card">
          <h3 className="setup-title">Create New Game</h3>
          
          {/* BASIC SETTINGS */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Game Type</label>
              <select 
                value={form.ruleId} 
                onChange={e => setForm({...form, ruleId: e.target.value})} 
                className="form-select"
              >
                <option value="">Select rule...</option>
                {rules.map(r => <option key={r._id} value={r._id}>{r.name} ({r.method})</option>)}
              </select>
            </div>
            <div className="form-group form-group-sm">
              <label className="form-label">Price (ETB)</label>
              <input type="number" value={form.cardPrice} onChange={e => setForm({...form, cardPrice: parseInt(e.target.value)||0})} className="form-input" />
            </div>
            <div className="form-group form-group-sm">
              <label className="form-label">Max Cards/Player</label>
              <input type="number" value={form.maxCardsPerPlayer} onChange={e => setForm({...form, maxCardsPerPlayer: parseInt(e.target.value)||10})} className="form-input" />
            </div>
          </div>

          {/* ADVANCED SETTINGS */}
          <div className="advanced-settings">
            {/* Timing Settings */}
            <button 
              className={`collapse-trigger ${showTiming ? 'open' : ''}`}
              onClick={() => setShowTiming(!showTiming)}
            >
              <span>⏱️ Game Timing</span>
              <span className="collapse-arrow">{showTiming ? '▲' : '▼'}</span>
            </button>
            {showTiming && (
              <div className="collapse-content">
                <div className="form-row">
                  <div className="form-group form-group-sm">
                    <label className="form-label">Call Interval (s)</label>
                    <input type="number" value={form.callIntervalSeconds} onChange={e => setForm({...form, callIntervalSeconds: parseInt(e.target.value)||5})} min="1" max="60" className="form-input" />
                  </div>
                  <div className="form-group form-group-sm">
                    <label className="form-label">Countdown (s)</label>
                    <input type="number" value={form.gameStartingSeconds} onChange={e => setForm({...form, gameStartingSeconds: parseInt(e.target.value)||30})} min="5" max="120" className="form-input" />
                  </div>
                  <div className="form-group form-group-sm">
                    <label className="form-label">Grace Period (s)</label>
                    <input type="number" value={form.gracePeriodSeconds} onChange={e => setForm({...form, gracePeriodSeconds: parseInt(e.target.value)||10})} min="0" max="120" className="form-input" />
                  </div>
                </div>
              </div>
            )}

            {/* Game Rules */}
            <button 
              className={`collapse-trigger ${showRules ? 'open' : ''}`}
              onClick={() => setShowRules(!showRules)}
            >
              <span>🎯 Game Rules</span>
              <span className="collapse-arrow">{showRules ? '▲' : '▼'}</span>
            </button>
            {showRules && (
              <div className="collapse-content">
                <div className="form-row">
                  <div className="form-group form-group-sm">
                    <label className="form-label">Min Players</label>
                    <input type="number" value={form.noOfPlayersToStart} onChange={e => setForm({...form, noOfPlayersToStart: parseInt(e.target.value)||2})} min="1" className="form-input" />
                  </div>
                  <div className="form-group form-group-sm">
                    <label className="form-label">Min Cards</label>
                    <input type="number" value={form.minimumCardsToStart} onChange={e => setForm({...form, minimumCardsToStart: parseInt(e.target.value)||1})} min="1" className="form-input" />
                  </div>
                  <div className="form-group form-group-sm">
                    <label className="form-label">Prize Round To</label>
                    <input type="number" value={form.minimumPrizeThreshold} onChange={e => setForm({...form, minimumPrizeThreshold: parseInt(e.target.value)||100})} min="10" max="10000" className="form-input" />
                  </div>
                  <div className="form-group form-group-sm">
                    <label className="form-label">Auto BINGO</label>
                    <div className="toggle-inline">
                      <label className="toggle-switch toggle-sm">
                        <input type="checkbox" checked={form.isLastNumberCalledBingo} onChange={e => setForm({...form, isLastNumberCalledBingo: e.target.checked})} />
                        <span className="toggle-slider"></span>
                      </label>
                      <span className="toggle-text">{form.isLastNumberCalledBingo ? 'ON' : 'OFF'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button onClick={setupGame} className="btn-setup">🎯 Setup Game</button>
        </div>
      )}

      {/* ============ LIVE MODE ============ */}
      {hasActive && (
        <div className="live-card">
          {/* STATS ROW */}
          <div className="stats-row">
            <div className="stat-mini">
              <span className="stat-mini-label">Players</span>
              <span className="stat-mini-value">{playerCount}</span>
            </div>
            <div className="stat-mini stat-mini-gold">
              <span className="stat-mini-label">Cards Sold</span>
              <span className="stat-mini-value">{totalCards}</span>
            </div>
            <div className="stat-mini stat-mini-green">
              <span className="stat-mini-label">Price</span>
              <span className="stat-mini-value">{cardPrice}</span>
            </div>
            <div className="stat-mini stat-mini-pink">
              <span className="stat-mini-label">Revenue</span>
              <span className="stat-mini-value">{totalAmount.toLocaleString()}</span>
            </div>
            <div className="stat-mini stat-mini-purple">
              <span className="stat-mini-label">Prize</span>
              <span className="stat-mini-value">{currentPrize.toLocaleString()}</span>
            </div>
            <div className={`stat-mini ${profit >= 0 ? 'stat-mini-green' : 'stat-mini-red'}`}>
              <span className="stat-mini-label">Profit</span>
              <span className="stat-mini-value">{profit.toLocaleString()}</span>
            </div>
          </div>

          {/* PRIZE SECTION - Only during setup */}
          {isSetup && (
            <div className="prize-section-compact">
              <div className="prize-row-compact">
                <div className="prize-input-group">
                  <label className="prize-label-compact">💰 Prize (ETB)</label>
                  <input 
                    type="number" 
                    value={form.prizeAmount} 
                    onChange={e => setForm({...form, prizeAmount: parseInt(e.target.value)||0})} 
                    className="prize-input-compact"
                  />
                </div>
                <button onClick={setPrize} disabled={prizeLoading} className="btn-prize-compact">
                  {prizeLoading ? '⏳' : '💾 Save'}
                </button>
                <button 
                  onClick={() => setShowCommission(!showCommission)} 
                  className="btn-commission-toggle"
                >
                  🧮 {showCommission ? 'Hide' : 'Calc'}
                </button>
              </div>

              {/* Commission Calculator */}
              {showCommission && (
                <div className="commission-compact">
                  <div className="commission-row-compact">
                    <label>Commission:</label>
                    <input type="number" value={commissionPercent} onChange={e => setCommissionPercent(parseFloat(e.target.value)||0)} min="0" max="100" className="commission-input-compact" />
                    <span>%</span>
                  </div>
                  <div className="commission-details-compact">
                    <div className="calc-row">
                      <span>Cards Sold:</span>
                      <span><b>{totalCards}</b> × {cardPrice} ETB</span>
                    </div>
                    <div className="calc-row">
                      <span>Total Revenue:</span>
                      <span><b>{totalAmount.toLocaleString()}</b> ETB</span>
                    </div>
                    <div className="calc-row">
                      <span>Commission ({commissionPercent}%):</span>
                      <span><b>{commissionAmount.toLocaleString()}</b> ETB</span>
                    </div>
                    <div className="calc-row calc-highlight">
                      <span>Net After Commission:</span>
                      <span><b>{netAfterCommission.toLocaleString()}</b> ETB</span>
                    </div>
                    <div className="calc-row">
                      <span>Rounded Prize (↓{form.minimumPrizeThreshold || 100}s):</span>
                      <span><b>{Math.floor(netAfterCommission / (form.minimumPrizeThreshold || 100)) * (form.minimumPrizeThreshold || 100)}</b> ETB</span>
                    </div>
                    {totalAmount <= 0 && (
                      <div className="calc-warning">
                        ⚠️ No cards sold yet. Prize will be 0 until players buy cards.
                      </div>
                    )}
                  </div>
                  <button onClick={calculatePrizeFromCommission} className="btn-calculate-compact">
                    Apply Suggested Prize
                  </button>
                </div>
              )}
            </div>
          )}

          {/* VALIDATION */}
          {isSetup && (
            <div className="validation-compact">
              <div className="validation-row">
                <span className={`validation-dot ${startGameValidation.checks.minPlayers.passed ? 'dot-green' : 'dot-red'}`} />
                <span>Players: {startGameValidation.checks.minPlayers.current}/{startGameValidation.checks.minPlayers.required}</span>
                <span className={`validation-dot ${startGameValidation.checks.minCards.passed ? 'dot-green' : 'dot-red'}`} />
                <span>Cards: {startGameValidation.checks.minCards.current}/{startGameValidation.checks.minCards.required}</span>
                <span className={`validation-dot ${startGameValidation.checks.prizeSet.passed ? 'dot-green' : 'dot-red'}`} />
                <span>Prize: {startGameValidation.checks.prizeSet.passed ? '✅' : '❌'}</span>
              </div>
              <div className="validation-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(startGameValidation.passedCount / startGameValidation.totalCount) * 100}%` }}
                  />
                </div>
                <span className="progress-text">{startGameValidation.passedCount}/{startGameValidation.totalCount} met</span>
              </div>
            </div>
          )}

          {/* CONFIG SUMMARY */}
          <button 
            className={`collapse-trigger collapse-trigger-sm ${showConfig ? 'open' : ''}`}
            onClick={() => setShowConfig(!showConfig)}
          >
            <span>⚙️ Configuration</span>
            <span className="collapse-arrow">{showConfig ? '▲' : '▼'}</span>
          </button>
          {showConfig && (
            <div className="config-grid-compact">
              <span>⏱️ {monitor.config?.callIntervalSeconds || 5}s interval</span>
              <span>🚀 {monitor.config?.gameStartingSeconds || 30}s countdown</span>
              <span>⏳ {monitor.config?.gracePeriodSeconds || 10}s grace</span>
              <span>👥 Min {monitor.config?.noOfPlayersToStart || 2} players</span>
              <span>🎫 Min {monitor.config?.minimumCardsToStart || 1} cards</span>
              <span>🎯 Auto BINGO: {monitor.config?.isLastNumberCalledBingo ? 'Yes' : 'No'}</span>
            </div>
          )}

          {/* START BUTTON */}
          {isSetup && (
            <button 
              onClick={startGame} 
              className={`btn-start-compact ${startGameValidation.allPassed ? '' : 'btn-disabled'}`}
              disabled={!startGameValidation.allPassed}
            >
              {startGameValidation.allPassed 
                ? `▶️ START GAME (${monitor?.config?.gameStartingSeconds || form.gameStartingSeconds || 30}s Countdown)` 
                : `🔒 ${startGameValidation.passedCount}/${startGameValidation.totalCount} Requirements Met`}
            </button>
          )}

          {/* COUNTDOWN INDICATOR */}
          {isCountdown && (
            <div className="countdown-compact">
              <span className="countdown-pulse">⏳</span> 
              Game starting in {monitor?.config?.gameStartingSeconds || 30} seconds...
            </div>
          )}

          {/* LIVE INDICATOR */}
          {isLive && (
            <div className="live-indicator-compact">
              <span className="live-dot-sm"></span> LIVE - Drawing numbers every {monitor.config?.callIntervalSeconds || 5}s
            </div>
          )}
        </div>
      )}

      {/* UPDATED: Reset Cards Confirmation Modal */}
      {/* Updated Reset Cards Confirmation Modal */}
{showResetConfirm && (
  <div className="modal-overlay">
    <div className="modal-card">
      <h3 className="modal-title">🔧 Reset Cards Database</h3>
      
      <div className="modal-stats">
        <div className="modal-stat">
          <span>Cards in DB:</span>
          <strong>{totalCards}</strong>
        </div>
        <div className="modal-stat">
          <span>Players:</span>
          <strong>{playerCount}</strong>
        </div>
        <div className="modal-stat">
          <span>Revenue:</span>
          <strong>{totalAmount.toLocaleString()} ETB</strong>
        </div>
      </div>

      {totalCards === 0 && (
        <div className="modal-info-banner">
          ℹ️ No cards currently exist. This will still reset the database state.
        </div>
      )}

      <div className="reset-mode-selector">
        <label className="mode-label">Select Reset Operation:</label>
        <div className="mode-options">
          <button 
            className={`mode-btn ${resetMode === 'clear' ? 'mode-active' : ''}`}
            onClick={() => setResetMode('clear')}
          >
            <span className="mode-icon">🔄</span>
            <div className="mode-info">
              <strong>Clear All Cards</strong>
              <span>Reset marked numbers to initial state</span>
              <span className="mode-detail">Cards remain in DB, all marks cleared</span>
            </div>
          </button>
          
          <button 
            className={`mode-btn ${resetMode === 'delete' ? 'mode-active' : ''}`}
            onClick={() => setResetMode('delete')}
          >
            <span className="mode-icon">🗑️</span>
            <div className="mode-info">
              <strong>Delete All Cards</strong>
              <span>Remove all cards from database</span>
              <span className="mode-detail">Complete cleanup - fresh start</span>
            </div>
          </button>

          <button 
            className={`mode-btn ${resetMode === 'full-reset' ? 'mode-active' : ''}`}
            onClick={() => setResetMode('full-reset')}
          >
            <span className="mode-icon">💣</span>
            <div className="mode-info">
              <strong>Full Database Reset</strong>
              <span>Drop and recreate cards collection</span>
              <span className="mode-detail">Complete reset including indexes (Debug)</span>
            </div>
          </button>
        </div>
      </div>

      <div className="modal-warning-box">
        <span className="warning-icon">⚠️</span>
        <p>This is a destructive debug operation. All card data will be reset permanently.</p>
      </div>

      <div className="modal-actions">
        <button 
          onClick={() => {
            setShowResetConfirm(false);
            setResetMode('clear');
          }} 
          className="btn-cancel"
          disabled={resetLoading}
        >
          Cancel
        </button>
        <button 
          onClick={resetCards} 
          className="btn-confirm-danger"
          disabled={resetLoading}
        >
          {resetLoading ? (
            <>⏳ Processing...</>
          ) : (
            <>
              {resetMode === 'delete' && '🗑️ Delete All Cards'}
              {resetMode === 'clear' && '🔄 Clear All Cards'}
              {resetMode === 'full-reset' && '💣 Full Database Reset'}
            </>
          )}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}