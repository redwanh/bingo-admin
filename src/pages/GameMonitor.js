import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function MainBingoMonitor() {
  const { user } = useAuth();
  const [rules, setRules] = useState([]);
  const [monitor, setMonitor] = useState(null);
  const [form, setForm] = useState({ 
    ruleId: '', 
    cardPrice: 50, 
    maxCardsPerPlayer: 10, 
    prizeAmount: 0 
  });
  const [commissionPercent, setCommissionPercent] = useState(10);
  const [loading, setLoading] = useState(true);
  const [prizeLoading, setPrizeLoading] = useState(false);
  const [prizeInitialized, setPrizeInitialized] = useState(false);

  useEffect(() => {
    fetchRules();
    fetchMonitor();
    const interval = setInterval(fetchMonitor, 5000);
    return () => clearInterval(interval);
  }, []);

  // Update form when monitor loads
  useEffect(() => {
    if (!prizeInitialized && monitor?.config?.prizeAmount !== undefined) {
      setForm(prev => ({ ...prev, prizeAmount: monitor.config.prizeAmount || 0 }));
      setPrizeInitialized(true);
    }
  }, [monitor?.config?.prizeAmount, prizeInitialized]);

  // Calculate totals
  const totalCards = monitor?.totalCards || 0;
  const cardPrice = monitor?.config?.cardPrice || 0;
  const totalAmount = totalCards * cardPrice;
  const currentPrize = monitor?.config?.prizeAmount || monitor?.game?.prizeAmount || 0;
  
  // Calculate commission and net
  const commissionAmount = (totalAmount * commissionPercent) / 100;
  const netAfterCommission = totalAmount - commissionAmount;
  const profit = totalAmount - currentPrize;

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

  const calculatePrizeFromCommission = () => {
    if (totalAmount <= 0) {
      toast.error('No cards sold yet!');
      return;
    }
    
    // Calculate commission
    const commission = (totalAmount * commissionPercent) / 100;
    const netAmount = totalAmount - commission;
    
    // Round down to nearest thousand
    const roundedPrize = Math.floor(netAmount / 1000) * 1000;
    
    if (roundedPrize <= 0) {
      toast.error('Not enough revenue after commission!');
      return;
    }
    
    setForm({ ...form, prizeAmount: roundedPrize });
    toast.success(`Prize calculated: ${roundedPrize.toLocaleString()} ETB (${commissionPercent}% commission: ${commission.toLocaleString()} ETB)`);
  };

  const startGame = async () => {
    try {
      const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };
      await axios.post(API + '/main-bingo/start', {}, { headers });
      toast.success('Game starting in 30 seconds!');
      fetchMonitor();
    } catch (e) { toast.error(e.response?.data?.error || 'Failed'); }
  };

  if (loading) return <div style={{ textAlign:'center',padding:50,color:'#fff' }}>Loading...</div>;

  const hasActive = monitor?.active && monitor?.game?.status !== 'completed';

  return (
    <>
      <h1 style={{ marginBottom:20, color:'#fff' }}>🖥️ Main Bingo Monitor</h1>

      {!hasActive && (
        <div style={{ background:'#16213e',padding:24,borderRadius:16,marginBottom:20 }}>
          <h3 style={{ marginBottom:15, color:'#fff' }}>Create New Game</h3>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
            <div>
              <label style={{ fontSize:11,color:'#888' }}>Game Type (Rule)</label>
              <select value={form.ruleId} onChange={e => setForm({...form, ruleId: e.target.value})} style={{ width:'100%',padding:10,background:'#0f3460',color:'#fff',border:'1px solid #333',borderRadius:8,marginTop:4 }}>
                <option value="">Select rule...</option>
                {rules.map(r => <option key={r._id} value={r._id}>{r.name} ({r.method})</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:11,color:'#888' }}>Card Price (ETB)</label>
              <input type="number" value={form.cardPrice} onChange={e => setForm({...form, cardPrice: parseInt(e.target.value)||0})} style={{ width:'100%',padding:10,background:'#0f3460',color:'#fff',border:'1px solid #333',borderRadius:8,marginTop:4 }} />
            </div>
            <div>
              <label style={{ fontSize:11,color:'#888' }}>Max Cards Per Player</label>
              <input type="number" value={form.maxCardsPerPlayer} onChange={e => setForm({...form, maxCardsPerPlayer: parseInt(e.target.value)||10})} style={{ width:'100%',padding:10,background:'#0f3460',color:'#fff',border:'1px solid #333',borderRadius:8,marginTop:4 }} />
            </div>
          </div>
          <button onClick={setupGame} style={{ marginTop:15,padding:'12px 30px',background:'#FF4757',color:'#fff',border:'none',borderRadius:8,cursor:'pointer',fontWeight:700,fontSize:14 }}>🎯 Setup Game</button>
        </div>
      )}

      {hasActive && (
        <div style={{ background:'#16213e',padding:24,borderRadius:16 }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:15 }}>
            <h3 style={{ margin:0, color:'#fff' }}>Live Game: {monitor.config?.ruleName || 'N/A'}</h3>
            <span style={{ padding:'6px 14px',borderRadius:20,background:monitor.game?.status==='countdown'?'#FFA502':'#2ED573',color:'#000',fontWeight:700,fontSize:12 }}>{monitor.game?.status?.toUpperCase()}</span>
          </div>
          
          {/* Stats Grid - Now 5 columns */}
          <div style={{ display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:12,marginBottom:20 }}>
            <div style={{ background:'#0f3460',padding:14,borderRadius:8,textAlign:'center' }}>
              <p style={{ fontSize:11,color:'#888' }}>Players</p>
              <p style={{ fontSize:28,fontWeight:800,color:'#fff',margin:0 }}>{monitor.playerCount||0}</p>
            </div>
            <div style={{ background:'#0f3460',padding:14,borderRadius:8,textAlign:'center' }}>
              <p style={{ fontSize:11,color:'#888' }}>Cards Sold</p>
              <p style={{ fontSize:28,fontWeight:800,color:'#FFA502',margin:0 }}>{totalCards}</p>
            </div>
            <div style={{ background:'#0f3460',padding:14,borderRadius:8,textAlign:'center' }}>
              <p style={{ fontSize:11,color:'#888' }}>Price/Card</p>
              <p style={{ fontSize:28,fontWeight:800,color:'#2ED573',margin:0 }}>{cardPrice}</p>
            </div>
            <div style={{ background:'#0f3460',padding:14,borderRadius:8,textAlign:'center' }}>
              <p style={{ fontSize:11,color:'#888' }}>Total Amount</p>
              <p style={{ fontSize:22,fontWeight:800,color:'#E84393',margin:0 }}>{totalAmount.toLocaleString()}</p>
            </div>
            <div style={{ background:'#0f3460',padding:14,borderRadius:8,textAlign:'center' }}>
              <p style={{ fontSize:11,color:'#888' }}>Prize</p>
              <p style={{ fontSize:28,fontWeight:800,color:'#7C5CFC',margin:0 }}>{currentPrize.toLocaleString()}</p>
            </div>
          </div>

          {/* Profit Box */}
          <div style={{ background:'linear-gradient(135deg, #2d3436, #636e72)',padding:16,borderRadius:10,marginBottom:15 }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
              <span style={{ fontSize:14,color:'#dfe6e9',fontWeight:600 }}>💰 Estimated Profit:</span>
              <span style={{ fontSize:24,fontWeight:800,color:profit >= 0 ? '#2ED573' : '#FF4757' }}>
                {profit.toLocaleString()} ETB
              </span>
            </div>
            <div style={{ marginTop:8,fontSize:11,color:'#b2bec3' }}>
              Total ({totalAmount.toLocaleString()}) - Prize ({currentPrize.toLocaleString()})
            </div>
          </div>
          
          {/* PRIZE SETTING - Always visible during setup/countdown */}
          {(monitor.game?.status === 'setup' || monitor.game?.status === 'countdown') && (
            <div style={{ background:'#0f3460',padding:16,borderRadius:10,marginTop:10 }}>
              <label style={{ fontSize:12,color:'#aaa',marginBottom:8,display:'block' }}>
                💰 Prize Amount: <b style={{ color:'#7C5CFC',fontSize:16 }}>{form.prizeAmount.toLocaleString()} ETB</b>
              </label>
              <div style={{ display:'flex',gap:10,marginBottom:10 }}>
                <input 
                  type="number" 
                  value={form.prizeAmount} 
                  onChange={e => setForm({...form, prizeAmount: parseInt(e.target.value)||0})} 
                  placeholder="Enter prize amount"
                  style={{ flex:1,padding:12,background:'#1a1a2e',color:'#fff',border:'1px solid #333',borderRadius:8,fontSize:16,fontWeight:700 }} 
                />
                <button 
                  onClick={setPrize} 
                  disabled={prizeLoading}
                  style={{ padding:'12px 24px',background:prizeLoading?'#555':'#7C5CFC',color:'#fff',border:'none',borderRadius:8,cursor:prizeLoading?'wait':'pointer',fontWeight:700,fontSize:14,whiteSpace:'nowrap' }}
                >
                  {prizeLoading ? '⏳' : '💰'} {prizeLoading ? 'Saving...' : 'Update Prize'}
                </button>
              </div>
              
              {/* Commission Section */}
              <div style={{ background:'#1a1a2e',padding:14,borderRadius:8 }}>
                <div style={{ display:'flex',gap:10,alignItems:'center',marginBottom:10 }}>
                  <label style={{ fontSize:12,color:'#aaa',whiteSpace:'nowrap' }}>Commission %:</label>
                  <input 
                    type="number" 
                    value={commissionPercent} 
                    onChange={e => setCommissionPercent(parseFloat(e.target.value)||0)} 
                    min="0"
                    max="100"
                    step="0.1"
                    style={{ width:80,padding:8,background:'#0f3460',color:'#fff',border:'1px solid #333',borderRadius:6,fontWeight:700,textAlign:'center' }} 
                  />
                  <span style={{ color:'#888',fontSize:11 }}>%</span>
                </div>
                
                <div style={{ display:'flex',justifyContent:'space-between',marginBottom:8,fontSize:12 }}>
                  <span style={{ color:'#888' }}>Total Revenue:</span>
                  <span style={{ color:'#E84393',fontWeight:600 }}>{totalAmount.toLocaleString()} ETB</span>
                </div>
                <div style={{ display:'flex',justifyContent:'space-between',marginBottom:8,fontSize:12 }}>
                  <span style={{ color:'#888' }}>Commission ({commissionPercent}%):</span>
                  <span style={{ color:'#FFA502',fontWeight:600 }}>{commissionAmount.toLocaleString()} ETB</span>
                </div>
                <div style={{ display:'flex',justifyContent:'space-between',marginBottom:12,fontSize:12 }}>
                  <span style={{ color:'#888' }}>Net After Commission:</span>
                  <span style={{ color:'#2ED573',fontWeight:600 }}>{netAfterCommission.toLocaleString()} ETB</span>
                </div>
                
                <button 
                  onClick={calculatePrizeFromCommission}
                  style={{ 
                    width:'100%',
                    padding:'10px',
                    background:'#E84393',
                    color:'#fff',
                    border:'none',
                    borderRadius:8,
                    cursor:'pointer',
                    fontWeight:700,
                    fontSize:13
                  }}
                >
                  🧮 Calculate Prize ({commissionPercent}% Commission → Round Down to 1000s)
                </button>
                
                {netAfterCommission > 0 && (
                  <div style={{ 
                    marginTop:8,
                    padding:8,
                    background:'rgba(126, 92, 252, 0.15)',
                    borderRadius:6,
                    textAlign:'center',
                    fontSize:12,
                    color:'#7C5CFC'
                  }}>
                    Suggested Prize: <b>{Math.floor(netAfterCommission / 1000) * 1000} ETB</b>
                    <br/>
                    <span style={{ fontSize:10,color:'#888' }}>
                      ({netAfterCommission.toLocaleString()} → rounded down)
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {(monitor.game?.status === 'setup' || monitor.game?.status === 'countdown') && (
            <button onClick={startGame} style={{ width:'100%',marginTop:15,padding:14,background:'#2ED573',color:'#fff',border:'none',borderRadius:10,cursor:'pointer',fontWeight:700,fontSize:16 }}>
              {monitor.game?.status === 'countdown' ? '⏳ Game Starting...' : '▶️ START GAME (30s Countdown)'}
            </button>
          )}
        </div>
      )}
    </>
  );
}