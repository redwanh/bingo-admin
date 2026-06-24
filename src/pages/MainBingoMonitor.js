import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function MainBingoMonitor() {
  const { user } = useAuth();
  const [rules, setRules] = useState([]);
  const [monitor, setMonitor] = useState(null);
  const [form, setForm] = useState({ ruleId: '', cardPrice: 50, maxCardsPerPlayer: 10, prizeAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [prizeInitialized, setPrizeInitialized] = useState(false);
  const [commissionPercent, setCommissionPercent] = useState(10);
  const [countdown, setCountdown] = useState(30);
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    fetchRules();
    fetchMonitor();
    const interval = setInterval(fetchMonitor, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let timer;
    if (monitor?.game?.status === 'countdown') {
      setCountdown(30);
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [monitor?.game?.status]);

// Replace the called numbers useEffect with this:
useEffect(() => {
  if (monitor) {
    console.log('Checking for called numbers in:', Object.keys(monitor));
    console.log('Game object:', monitor.game);
    console.log('Full monitor:', monitor);
    
    // Check ALL possible field names
    const numbers = monitor?.calledNumbers || 
                    monitor?.drawnNumbers || 
                    monitor?.game?.calledNumbers || 
                    monitor?.game?.drawnNumbers ||
                    monitor?.gameData?.calledNumbers ||
                    monitor?.gameData?.drawnNumbers ||
                    monitor?.numbers ||
                    [];
    
    console.log('Found numbers:', numbers);
    
    if (Array.isArray(numbers) && numbers.length > 0) {
      setCalledNumbers(numbers);
    }
  }
  
  // Winner check
  const winnerData = monitor?.winner || 
                     monitor?.game?.winner || 
                     monitor?.gameData?.winner;
  if (winnerData) {
    setWinner(winnerData);
  }
}, [monitor]);

  const totalCards = monitor?.totalCards || 0;
  const cardPrice = monitor?.config?.cardPrice || 0;
  const totalAmount = totalCards * cardPrice;
  const currentPrize = monitor?.config?.prizeAmount || monitor?.game?.prizeAmount || 0;
  const commissionAmount = (totalAmount * commissionPercent) / 100;
  const netAfterCommission = totalAmount - commissionAmount;
  const profit = totalAmount - currentPrize;

  const bingoGrid = {
    B: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
    I: [16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
    N: [31,32,33,34,35,36,37,38,39,40,41,42,43,44,45],
    G: [46,47,48,49,50,51,52,53,54,55,56,57,58,59,60],
    O: [61,62,63,64,65,66,67,68,69,70,71,72,73,74,75]
  };

  const latestNumber = calledNumbers.length > 0 ? calledNumbers[calledNumbers.length - 1] : null;

  const roundDown = (num) => {
    if (num >= 10000) return Math.floor(num / 10000) * 10000;
    if (num >= 1000) return Math.floor(num / 1000) * 1000;
    if (num >= 100) return Math.floor(num / 100) * 100;
    if (num >= 10) return Math.floor(num / 10) * 10;
    return Math.floor(num);
  };

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
      console.log('Monitor:', {
        status: res.data?.game?.status,
        calledCount: res.data?.calledNumbers?.length || res.data?.drawnNumbers?.length || 0,
        fullData: res.data
      });
      setMonitor(res.data);
      if (!prizeInitialized && res.data.config?.prizeAmount > 0) { 
        setForm(prev => ({ ...prev, prizeAmount: res.data.config.prizeAmount })); 
        setPrizeInitialized(true); 
      }
    } catch (err) {
      console.error('Monitor fetch error:', err);
    }
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
    try {
      const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };
      await axios.put(API + '/main-bingo/prize', { prizeAmount: Number(form.prizeAmount) }, { headers });
      toast.success('Prize set!');
      fetchMonitor();
    } catch (e) { toast.error('Failed'); }
  };

  const calculatePrize = () => {
    if (totalAmount <= 0) return toast.error('No cards sold yet!');
    const net = totalAmount - (totalAmount * commissionPercent) / 100;
    const rounded = roundDown(net);
    if (rounded <= 0) return toast.error('Not enough revenue');
    setForm({ ...form, prizeAmount: rounded });
    toast.success(`Prize: ${rounded.toLocaleString()} ETB`);
  };

  const startGame = async () => {
    try {
      const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };
      await axios.post(API + '/main-bingo/start', {}, { headers });
      toast.success('Game starting in 30s');
      setCountdown(30);
      fetchMonitor();
    } catch (e) { toast.error(e.response?.data?.error || 'Failed'); }
  };

  const renderBingoCard = (card, isWinner = false) => {
    if (!card || !card.numbers) return null;
    return (
      <div style={{ 
        background: isWinner ? 'rgba(46,213,115,0.1)' : '#0f3460',
        padding:10, borderRadius:8,
        border: isWinner ? '2px solid #2ED573' : '1px solid #333',
        position: 'relative'
      }}>
        {isWinner && (
          <div style={{
            position: 'absolute', top: -10, right: -10,
            background: '#2ED573', color: '#000',
            padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 800
          }}>WINNER</div>
        )}
        <div style={{ display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:3,marginBottom:3 }}>
          {['B','I','N','G','O'].map(letter => (
            <div key={letter} style={{ textAlign:'center',fontWeight:800,fontSize:12,color:'#FFD700',padding:3 }}>{letter}</div>
          ))}
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:2 }}>
          {card.numbers.map((row, rowIdx) => (
            <React.Fragment key={rowIdx}>
              {row.map((num, colIdx) => {
                const isCalled = calledNumbers.includes(num);
                const isLatest = num === latestNumber;
                return (
                  <div key={`${rowIdx}-${colIdx}`} style={{ 
                    textAlign:'center', padding:3, fontSize:11,
                    fontWeight: isCalled ? 700 : 400,
                    color: isCalled ? '#fff' : '#555',
                    background: isLatest ? '#2ED573' : isCalled ? '#7C5CFC' : 'rgba(255,255,255,0.03)',
                    borderRadius:2
                  }}>{num}</div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  if (loading) return <div style={{ textAlign:'center',padding:50,color:'#fff' }}>Loading...</div>;

  const hasActive = monitor?.active && monitor?.game?.status !== 'completed';
  
  // FIXED: Include "in_progress" status
  const gameStatus = monitor?.game?.status;
  const showCalledNumbers = gameStatus === 'countdown' || 
                            gameStatus === 'playing' || 
                            gameStatus === 'in_progress';

  return (
    <div style={{ maxWidth:1000,margin:'0 auto',padding:20 }}>
      <h1 style={{ color:'#fff',fontSize:24,marginBottom:20 }}>Main Bingo Monitor</h1>

      {/* DEBUG BAR */}
      <div style={{ background:'#000',padding:8,marginBottom:10,borderRadius:5,fontSize:10,color:'#0f0',fontFamily:'monospace' }}>
        Status: {gameStatus} | Called: {calledNumbers.length} | ShowGrid: {String(showCalledNumbers)} | Winner: {winner ? 'YES' : 'NO'}
      </div>

      {!hasActive && (
        <div style={{ background:'#16213e',padding:20,borderRadius:12 }}>
          <h3 style={{ color:'#fff',fontSize:16,marginBottom:15 }}>New Game</h3>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>
            <select value={form.ruleId} onChange={e => setForm({...form, ruleId: e.target.value})}
              style={{ padding:10,background:'#0f3460',color:'#fff',border:'1px solid #333',borderRadius:6 }}>
              <option value="">Select rule</option>
              {rules.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
            </select>
            <input type="number" placeholder="Card price" value={form.cardPrice} 
              onChange={e => setForm({...form, cardPrice: parseInt(e.target.value)||0})}
              style={{ padding:10,background:'#0f3460',color:'#fff',border:'1px solid #333',borderRadius:6 }} />
            <input type="number" placeholder="Max cards" value={form.maxCardsPerPlayer} 
              onChange={e => setForm({...form, maxCardsPerPlayer: parseInt(e.target.value)||10})}
              style={{ padding:10,background:'#0f3460',color:'#fff',border:'1px solid #333',borderRadius:6 }} />
          </div>
          <button onClick={setupGame}
            style={{ width:'100%',marginTop:12,padding:12,background:'#FF4757',color:'#fff',border:'none',borderRadius:8,cursor:'pointer',fontWeight:600 }}>
            Setup Game
          </button>
        </div>
      )}

      {hasActive && (
        <div style={{ display:'grid',gridTemplateColumns:'1fr 350px',gap:15 }}>
          <div style={{ background:'#16213e',padding:20,borderRadius:12 }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:15 }}>
              <span style={{ color:'#fff',fontWeight:600 }}>{monitor.config?.ruleName || 'Game'}</span>
              <span style={{ 
                padding:'4px 12px',borderRadius:12,fontSize:11,fontWeight:700,
                background: gameStatus==='countdown'?'#FFA502':
                           gameStatus==='playing'||gameStatus==='in_progress'?'#2ED573':'#7C5CFC',color:'#000'
              }}>
                {(gameStatus || 'SETUP').toUpperCase().replace('_', ' ')}
              </span>
            </div>

            {gameStatus === 'countdown' && (
              <div style={{ textAlign:'center',padding:15,marginBottom:15,
                background:'linear-gradient(135deg, #FFA502, #FF6348)',borderRadius:10 }}>
                <div style={{ fontSize:14,color:'#fff',marginBottom:5,fontWeight:600 }}>⏳ Game Starting In</div>
                <div style={{ fontSize:40,fontWeight:900,color:'#fff' }}>{countdown}</div>
              </div>
            )}

            {(gameStatus === 'playing' || gameStatus === 'in_progress') && (
              <div style={{ textAlign:'center',padding:12,marginBottom:15,
                background:'rgba(46,213,115,0.15)',borderRadius:8,
                border:'1px solid rgba(46,213,115,0.3)' }}>
                <span style={{ color:'#2ED573',fontWeight:700,fontSize:14 }}>🎲 Game In Progress</span>
              </div>
            )}

            <div style={{ display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:8,marginBottom:15 }}>
              {[
                { label:'Players', value:monitor.playerCount||0, color:'#fff' },
                { label:'Cards', value:totalCards, color:'#FFA502' },
                { label:'Price', value:cardPrice, color:'#2ED573' },
                { label:'Total', value:totalAmount.toLocaleString(), color:'#E84393' },
                { label:'Prize', value:currentPrize.toLocaleString(), color:'#7C5CFC' },
              ].map((s, i) => (
                <div key={i} style={{ background:'#0f3460',padding:10,borderRadius:6,textAlign:'center' }}>
                  <div style={{ fontSize:10,color:'#888' }}>{s.label}</div>
                  <div style={{ fontSize:16,fontWeight:800,color:s.color,marginTop:4 }}>{s.value}</div>
                </div>
              ))}
            </div>

            <div style={{ padding:10,background:'#0f3460',borderRadius:6,marginBottom:12,
              display:'flex',justifyContent:'space-between',alignItems:'center' }}>
              <span style={{ fontSize:12,color:'#888' }}>Profit</span>
              <span style={{ fontSize:16,fontWeight:800,color: profit>=0?'#2ED573':'#FF4757' }}>
                {profit.toLocaleString()} ETB
              </span>
            </div>

            {gameStatus === 'setup' && (
              <div style={{ marginBottom:12 }}>
                <div style={{ display:'flex',gap:8,marginBottom:10 }}>
                  <input type="number" value={form.prizeAmount} 
                    onChange={e => setForm({...form, prizeAmount: parseInt(e.target.value)||0})} 
                    placeholder="Prize amount"
                    style={{ flex:1,padding:10,background:'#0f3460',color:'#fff',border:'1px solid #333',borderRadius:6,fontWeight:600 }} />
                  <button onClick={setPrize}
                    style={{ padding:'10px 16px',background:'#7C5CFC',color:'#fff',border:'none',borderRadius:6,cursor:'pointer',fontWeight:600 }}>Set</button>
                </div>
                <div style={{ background:'#0f3460',padding:12,borderRadius:6 }}>
                  <div style={{ display:'flex',gap:8,alignItems:'center',marginBottom:8 }}>
                    <span style={{ fontSize:11,color:'#888' }}>Commission</span>
                    <input type="number" value={commissionPercent} 
                      onChange={e => setCommissionPercent(parseFloat(e.target.value)||0)} 
                      style={{ width:50,padding:6,background:'#1a1a2e',color:'#fff',border:'1px solid #7C5CFC',borderRadius:4,fontWeight:700,textAlign:'center',fontSize:13 }} />
                    <span style={{ fontSize:11,color:'#888' }}>%</span>
                  </div>
                  <div style={{ fontSize:11,color:'#888',marginBottom:8 }}>
                    <div style={{ display:'flex',justifyContent:'space-between',marginBottom:3 }}>
                      <span>Revenue</span><span style={{ color:'#E84393' }}>{totalAmount.toLocaleString()}</span></div>
                    <div style={{ display:'flex',justifyContent:'space-between',marginBottom:3 }}>
                      <span>Commission</span><span style={{ color:'#FFA502' }}>-{commissionAmount.toLocaleString()}</span></div>
                    <div style={{ display:'flex',justifyContent:'space-between',marginBottom:3 }}>
                      <span>Net</span><span style={{ color:'#2ED573' }}>{netAfterCommission.toLocaleString()}</span></div>
                    <div style={{ display:'flex',justifyContent:'space-between' }}>
                      <span>Rounded</span><span style={{ color:'#7C5CFC',fontWeight:700 }}>{roundDown(netAfterCommission).toLocaleString()}</span></div>
                  </div>
                  <button onClick={calculatePrize} disabled={totalAmount <= 0}
                    style={{ width:'100%',padding:8,fontSize:12,background: totalAmount>0?'#E84393':'#555',color:'#fff',border:'none',borderRadius:6,cursor: totalAmount>0?'pointer':'not-allowed',fontWeight:600 }}>
                    Calculate Prize
                  </button>
                </div>
              </div>
            )}

            {gameStatus === 'setup' && (
              <button onClick={startGame}
                style={{ width:'100%',padding:12,background:'#2ED573',color:'#fff',border:'none',borderRadius:8,cursor:'pointer',fontWeight:600 }}>
                Start Game
              </button>
            )}
            {gameStatus === 'countdown' && (
              <button disabled
                style={{ width:'100%',padding:12,background:'#FFA502',color:'#fff',border:'none',borderRadius:8,fontWeight:600,opacity:0.7 }}>
                Game Starting...
              </button>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display:'flex',flexDirection:'column',gap:15 }}>
            {showCalledNumbers && (
              <div style={{ background:'#16213e',padding:15,borderRadius:12 }}>
                <div style={{ fontSize:12,color:'#888',marginBottom:8 }}>
                  Called Numbers ({calledNumbers.length}/75)
                </div>
                
                {latestNumber && (gameStatus === 'playing' || gameStatus === 'in_progress') && (
                  <div style={{ textAlign:'center',padding:8,marginBottom:8,
                    background:'rgba(46,213,115,0.15)',borderRadius:8 }}>
                    <span style={{ fontSize:10,color:'#888' }}>Latest</span>
                    <div style={{ fontSize:24,fontWeight:900,color:'#2ED573' }}>{latestNumber}</div>
                  </div>
                )}

                <div style={{ display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:2 }}>
                  {['', 'B', 'I', 'N', 'G', 'O'].map((letter, i) => (
                    <div key={i} style={{ textAlign:'center',padding:3,fontWeight:800,fontSize:11,
                      color: letter === '' ? '#888' : '#FFD700' }}>{letter}</div>
                  ))}
                  {Array.from({ length: 15 }, (_, rowIndex) => (
                    <React.Fragment key={rowIndex}>
                      <div style={{ textAlign:'center',padding:2,fontSize:9,color:'#666' }}>{rowIndex + 1}</div>
                      {['B', 'I', 'N', 'G', 'O'].map(letter => {
                        const number = bingoGrid[letter][rowIndex];
                        const isCalled = calledNumbers.includes(number);
                        const isLatest = number === latestNumber;
                        return (
                          <div key={`${letter}-${number}`} style={{ 
                            textAlign:'center',padding:2,fontSize:10,
                            fontWeight: isCalled ? 700 : 400,
                            color: isCalled ? '#fff' : '#444',
                            background: isLatest ? '#2ED573' : isCalled ? '#7C5CFC' : 'transparent',
                            borderRadius:2
                          }}>{number}</div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {winner && (
              <div style={{ background:'#16213e',padding:15,borderRadius:12,border:'2px solid #2ED573' }}>
                <div style={{ textAlign:'center',marginBottom:12,
                  background:'linear-gradient(135deg, #FFD700, #FFA502)',padding:10,borderRadius:8 }}>
                  <div style={{ fontSize:14,fontWeight:800,color:'#000' }}>🎉 BINGO! 🎉</div>
                </div>
                <div style={{ marginBottom:12 }}>
                  <div style={{ fontSize:10,color:'#888',marginBottom:4 }}>Winner</div>
                  <div style={{ fontSize:14,fontWeight:700,color:'#fff' }}>
                    {winner.playerName || winner.username || 'Player'}
                  </div>
                  <div style={{ fontSize:12,color:'#2ED573',marginTop:4 }}>
                    Prize: {currentPrize.toLocaleString()} ETB
                  </div>
                </div>
                <div style={{ fontSize:10,color:'#888',marginBottom:6 }}>Winning Card</div>
                {winner.card && renderBingoCard(winner.card, true)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}