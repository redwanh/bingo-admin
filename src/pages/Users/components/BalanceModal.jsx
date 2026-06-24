// pages/Users/components/BalanceModal.jsx
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function BalanceModal({ user, onClose, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('cash');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return toast.error('Enter a valid amount');
    
    setLoading(true);
    try {
      const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };
      
      const res = await axios.post(API + '/finance/users/' + user._id + '/add-balance', {
        amount: parseFloat(amount),
        type,
        description: description || 'Manual credit',
      }, { headers });
      
      // DEBUG: Log the response
      
      // Check if successful
      if (res.data && res.data.success) {
        toast.success('+ ' + amount + ' ETB added to ' + (user.fullName || 'User'));
        
        // Close modal after short delay
        setTimeout(() => {
          if (onSuccess) onSuccess();
          if (onClose) onClose();
        }, 500);
      } else {
        toast.error('Unexpected response from server');
      }
    } catch (err) {
      
      const msg = err.response?.data?.message || err.message || 'Transaction failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)', zIndex: 300,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }} onClick={onClose}>
      <div style={{
        background: '#16213e', borderRadius: 20, padding: 32, maxWidth: 440, width: '100%',
        border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
      }} onClick={e => e.stopPropagation()}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 20, color: '#FFD700' }}>?? Add Balance</h2>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: '50%', border: 'none',
            background: '#333', color: '#fff', cursor: 'pointer', fontSize: 16,
          }}>?</button>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: 14,
          background: '#0f3460', borderRadius: 12, marginBottom: 20,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#1a1a2e', fontWeight: 800, fontSize: 16,
          }}>
            {(user.fullName || 'U')[0].toUpperCase()}
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 15, color: '#fff', margin: 0 }}>{user.fullName}</p>
            <p style={{ fontSize: 12, color: '#888', margin: '2px 0 0' }}>
              {user.phone} • Balance: <span style={{ color: '#2ED573', fontWeight: 700 }}>{user.walletBalance || 0} ETB</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', color: '#A0A0B8', fontSize: 12, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>
            Amount (ETB)
          </label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
            placeholder="Enter amount..." autoFocus
            style={{ width: '100%', padding: 14, background: '#0f3460', color: '#fff', border: '2px solid #333', borderRadius: 12, fontSize: 20, fontWeight: 700, marginBottom: 14, outline: 'none', boxSizing: 'border-box' }} />

          <label style={{ display: 'block', color: '#A0A0B8', fontSize: 12, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>
            Transaction Type
          </label>
          <select value={type} onChange={e => setType(e.target.value)}
            style={{ width: '100%', padding: 12, background: '#0f3460', color: '#fff', border: '2px solid #333', borderRadius: 12, fontSize: 14, marginBottom: 14, outline: 'none' }}>
            <option value="cash">Cash</option>
            <option value="deposit">Deposit</option>
            <option value="bonus">Bonus</option>
            <option value="refund">Refund</option>
            <option value="adjustment">Adjustment</option>
          </select>

          <label style={{ display: 'block', color: '#A0A0B8', fontSize: 12, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>
            Note
          </label>
          <input type="text" value={description} onChange={e => setDescription(e.target.value)}
            placeholder="Reason for transaction..."
            style={{ width: '100%', padding: 12, background: '#0f3460', color: '#fff', border: '2px solid #333', borderRadius: 12, fontSize: 14, marginBottom: 20, outline: 'none', boxSizing: 'border-box' }} />

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: 14, border: 'none', borderRadius: 12,
            background: loading ? '#555' : 'linear-gradient(135deg, #2ED573, #059669)',
            color: '#fff', fontSize: 16, fontWeight: 700, cursor: loading ? 'wait' : 'pointer',
          }}>
            {loading ? '? Processing...' : '? Add ' + (amount || '0') + ' ETB'}
          </button>
        </form>
      </div>
    </div>
  );
}

