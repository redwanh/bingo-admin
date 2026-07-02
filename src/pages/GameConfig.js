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

  useEffect(() => { fetchConfig(); }, []);

  const fetchConfig = async () => {
    try {
      const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };
      const res = await axios.get(API + '/game/config/fast_bingo', { headers });
      if (res.data && res.data.roomId) setConfig(res.data);
    } catch { }
    setLoading(false);
  };

  const save = async () => {
    setSaving(true);
    try {
      const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };
      await axios.put(API + '/game/config/fast_bingo', config, { headers });
      toast.success('Saved!');
    } catch { toast.error('Failed'); }
    setSaving(false);
  };

  if (loading) return <div style={{ textAlign:'center',padding:50,color:'#fff' }}>Loading...</div>;

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
     { key:'autoBingoEnabled', label:'Auto BINGO (No Button Press)', trueLabel:'ON - Auto Win', falseLabel:'OFF - Manual' }, // 🔥 ADD THIS LINE
  ];

  return (
    <div style={{ maxWidth:900, margin:'0 auto', padding:20 }}>
      <h1 style={{ marginBottom:8, color:'#fff', fontSize:24 }}>Fast Bingo Configuration</h1>
      <p style={{ color:'#888', marginBottom:24, fontSize:13 }}>Changes take effect on the next game.</p>
      
      {/* Number fields */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(250px, 1fr))', gap:12, marginBottom:20 }}>
        {fields.map(f => (
          <div key={f.key} style={{ background:'#16213e', padding:16, borderRadius:12, border:'1px solid #1a3a5c' }}>
            <label style={{ color:'#aaa', fontSize:11, display:'block', marginBottom:6, textTransform:'uppercase', letterSpacing:0.5 }}>
              {f.label}
            </label>
            <input 
              type={f.type || 'text'} 
              value={config[f.key] ?? ''} 
              onChange={e => setConfig({
                ...config, 
                [f.key]: f.type === 'number' ? (parseFloat(e.target.value) || 0) : e.target.value
              })}
              style={{ 
                width:'100%', padding:10, background:'#0f3460', color:'#fff', 
                border:'1px solid #333', borderRadius:8, fontSize:14, outline:'none' 
              }}
            />
          </div>
        ))}
      </div>

      {/* Toggle fields */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(250px, 1fr))', gap:12, marginBottom:20 }}>
        {toggleFields.map(f => (
          <div key={f.key} style={{ background:'#16213e', padding:16, borderRadius:12, border:'1px solid #1a3a5c' }}>
            <label style={{ color:'#aaa', fontSize:11, display:'block', marginBottom:6, textTransform:'uppercase', letterSpacing:0.5 }}>
              {f.label}
            </label>
            <select 
              value={config[f.key] ? 'true' : 'false'} 
              onChange={e => setConfig({...config, [f.key]: e.target.value === 'true'})}
              style={{ 
                width:'100%', padding:10, background:'#0f3460', color:'#fff', 
                border:'1px solid #333', borderRadius:8, fontSize:14, outline:'none', cursor:'pointer' 
              }}
            >
              <option value="true">{f.trueLabel}</option>
              <option value="false">{f.falseLabel}</option>
            </select>
          </div>
        ))}
      </div>
      

      {/* Save button */}
      <button 
        onClick={save} 
        disabled={saving} 
        style={{ 
          width:'100%', padding:'14px', background: saving ? '#555' : '#FF4757', 
          color:'#fff', border:'none', borderRadius:12, cursor: saving ? 'wait' : 'pointer', 
          fontSize:16, fontWeight:700, letterSpacing:0.5,
          transition:'all 0.2s'
        }}
      >
        {saving ? '⏳ Saving...' : '💾 SAVE CONFIGURATION'}
      </button>
    </div>
  );
}