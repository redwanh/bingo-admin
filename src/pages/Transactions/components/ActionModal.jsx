// pages/Transactions/components/ActionModal.jsx
import React, { useState } from 'react';

export default function ActionModal({ type, withdrawal, onClose, onConfirm }) {
  const [value, setValue] = useState('');
  const isApprove = type === 'approve';
  const user = withdrawal?.user || {};
  const amount = withdrawal?.amount || 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onConfirm(value);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.85)', zIndex: 400,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }} onClick={onClose}>
      <div style={{
        background: '#16213e', borderRadius: 20, padding: 32, maxWidth: 440, width: '100%',
        border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
      }} onClick={e => e.stopPropagation()}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 20, color: isApprove ? '#2ED573' : '#FF4757' }}>
            {isApprove ? '✅ Approve Withdrawal' : '❌ Reject Withdrawal'}
          </h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: '#333', color: '#fff', cursor: 'pointer', fontSize: 16 }}>✕</button>
        </div>

        {/* User Info */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: 14,
          background: '#0f3460', borderRadius: 12, marginBottom: 20,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#1a1a2e', fontWeight: 800, fontSize: 16,
          }}>{(user.fullName || 'U')[0]}</div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 15, color: '#fff', margin: 0 }}>{user.fullName}</p>
            <p style={{ fontSize: 12, color: '#888', margin: '2px 0 0' }}>{user.phone}</p>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <p style={{ fontSize: 10, color: '#888', margin: 0 }}>Amount</p>
            <p style={{ fontSize: 20, fontWeight: 800, color: '#FF4757', margin: 0 }}>{amount} ETB</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', color: '#A0A0B8', fontSize: 12, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {isApprove ? 'Transaction ID' : 'Rejection Reason'}
          </label>
          
          {isApprove ? (
            <input
              type="text" value={value} onChange={e => setValue(e.target.value)}
              placeholder="Enter transaction reference ID..."
              autoFocus
              style={{ width: '100%', padding: 14, background: '#0f3460', color: '#fff', border: '2px solid #333', borderRadius: 12, fontSize: 14, marginBottom: 20, outline: 'none', boxSizing: 'border-box' }}
            />
          ) : (
            <textarea
              value={value} onChange={e => setValue(e.target.value)}
              placeholder="Reason for rejection..."
              autoFocus rows={3}
              style={{ width: '100%', padding: 14, background: '#0f3460', color: '#fff', border: '2px solid #333', borderRadius: 12, fontSize: 14, marginBottom: 20, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
            />
          )}

          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" style={{
              flex: 1, padding: 14, borderRadius: 12, border: 'none',
              background: isApprove ? 'linear-gradient(135deg, #2ED573, #059669)' : 'linear-gradient(135deg, #FF4757, #E11D48)',
              color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer',
            }}>
              {isApprove ? '✅ Confirm Approval' : '❌ Confirm Rejection'}
            </button>
            <button type="button" onClick={onClose} style={{
              padding: '14px 24px', borderRadius: 12, border: '1px solid #333',
              background: 'transparent', color: '#A0A0B8', cursor: 'pointer', fontSize: 14,
            }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
