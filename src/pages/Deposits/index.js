// pages/Deposits/index.js — Account Management
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const labelStyle = { display: 'block', color: '#A0A0B8', fontSize: 11, fontWeight: 600, marginBottom: 4, textTransform: 'uppercase' };
const inputStyle = { width: '100%', padding: 10, background: '#0f3460', color: '#fff', border: '1px solid #333', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' };

export default function Deposits() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editAccount, setEditAccount] = useState(null);
  const [activeLang, setActiveLang] = useState('en');

  useEffect(() => { fetchAccounts(); }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };
      const res = await axios.get(API + '/payments/admin/accounts', { headers });
      setAccounts(res.data.data || []);
    } catch (e) { toast.error('Failed to load accounts'); }
    setLoading(false);
  };

  const saveAccount = async (e) => {
    e.preventDefault();
    const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };
    try {
      if (editAccount?._id) {
        await axios.put(API + '/payments/admin/accounts/' + editAccount._id, editAccount, { headers });
        toast.success('Account updated!');
      } else {
        await axios.post(API + '/payments/admin/accounts', editAccount, { headers });
        toast.success('Account created!');
      }
      setEditAccount(null);
      fetchAccounts();
    } catch (e) { toast.error('Save failed'); }
  };

  const seedAccounts = async () => {
    try {
      const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };
      await axios.post(API + '/payments/seed', {}, { headers });
      toast.success('Sample accounts created!');
      fetchAccounts();
    } catch (e) { toast.error('Seed failed — accounts may already exist'); }
  };

  const deleteAccount = async (id) => {
    if (!window.confirm('Delete this account?')) return;
    try {
      const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };
      await axios.delete(API + '/payments/admin/accounts/' + id, { headers });
      toast.success('Account deleted');
      fetchAccounts();
    } catch (e) { toast.error('Delete failed'); }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h1 style={{ margin: 0, fontSize: 28 }}>?? Transaction Account Management</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={seedAccounts} style={{
            padding: '10px 18px', borderRadius: 10, border: '1px solid #FFD700',
            background: 'transparent', color: '#FFD700', cursor: 'pointer', fontSize: 13, fontWeight: 600,
          }}>?? Seed Sample Data</button>
          <button onClick={() => setEditAccount({
            type: 'telebirr', accountName: '', phone: '', accountNumber: '',
            instructionsEn: '', instructionsAm: '', instructionsTg: '',
            minDeposit: 50, maxDeposit: 50000,
          })} style={{
            padding: '10px 18px', borderRadius: 10, border: 'none',
            background: '#FFD700', color: '#1a1a2e', cursor: 'pointer', fontSize: 13, fontWeight: 700,
          }}>+ Add Account</button>
        </div>
      </div>

      <p style={{ color: '#888', marginBottom: 24, fontSize: 14 }}>
        Configure payment accounts for deposits — Telebirr and CBE with instructions in multiple languages.
      </p>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>?</div>
          <p style={{ color: '#A0A0B8' }}>Loading accounts...</p>
        </div>
      )}

      {/* Empty */}
      {!loading && accounts.length === 0 && (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>??</div>
          <p style={{ color: '#A0A0B8', fontSize: 15, fontWeight: 600, margin: '0 0 4px' }}>No payment accounts configured</p>
          <p style={{ color: '#666', fontSize: 13, margin: '0 0 16px' }}>Click "Seed Sample Data" or "Add Account" to create one.</p>
        </div>
      )}

      {/* Account Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 16, marginBottom: 24 }}>
        {accounts.map(acc => (
          <div key={acc._id} style={{
            background: '#16213e', borderRadius: 16, padding: 22,
            border: '1px solid rgba(255,255,255,0.06)',
            transition: 'all 0.2s',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
              <div>
                <span style={{
                  display: 'inline-block', padding: '5px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700,
                  background: acc.type === 'telebirr' ? 'rgba(0,180,216,0.12)' : 'rgba(46,213,115,0.12)',
                  color: acc.type === 'telebirr' ? '#00B4D8' : '#2ED573',
                  textTransform: 'uppercase', marginBottom: 8,
                }}>
                  {acc.type === 'telebirr' ? '?? Telebirr' : '?? CBE'}
                </span>
                <p style={{ fontWeight: 700, fontSize: 16, color: '#fff', margin: 0 }}>{acc.accountName}</p>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => setEditAccount(acc)} style={{
                  padding: '6px 12px', borderRadius: 6, border: 'none',
                  background: 'rgba(255,215,0,0.1)', color: '#FFD700', cursor: 'pointer', fontSize: 12,
                }}>?? Edit</button>
                <button onClick={() => deleteAccount(acc._id)} style={{
                  padding: '6px 12px', borderRadius: 6, border: 'none',
                  background: 'rgba(255,71,87,0.1)', color: '#FF4757', cursor: 'pointer', fontSize: 12,
                }}>???</button>
              </div>
            </div>

            {/* Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              {acc.type === 'telebirr' && (
                <div style={{ background: '#0f3460', padding: 10, borderRadius: 8 }}>
                  <p style={{ fontSize: 10, color: '#888', margin: '0 0 2px' }}>Phone Number</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#00B4D8', margin: 0, fontFamily: 'monospace' }}>
                    {acc.phone || '—'}
                  </p>
                </div>
              )}
              {acc.type === 'cbe' && (
                <div style={{ background: '#0f3460', padding: 10, borderRadius: 8 }}>
                  <p style={{ fontSize: 10, color: '#888', margin: '0 0 2px' }}>Account Number</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#2ED573', margin: 0, fontFamily: 'monospace' }}>
                    {acc.accountNumber || '—'}
                  </p>
                </div>
              )}
              <div style={{ background: '#0f3460', padding: 10, borderRadius: 8 }}>
                <p style={{ fontSize: 10, color: '#888', margin: '0 0 2px' }}>Deposit Limits</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#FFD700', margin: 0 }}>
                  {acc.minDeposit} – {acc.maxDeposit} ETB
                </p>
              </div>
            </div>

            {/* Instructions Preview */}
            
          </div>
        ))}
      </div>

      {/* Edit/Create Modal */}
      {editAccount && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', zIndex: 300,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }} onClick={() => setEditAccount(null)}>
          <div style={{
            background: '#16213e', borderRadius: 20, padding: 32, maxWidth: 600, width: '100%',
            maxHeight: '90vh', overflowY: 'auto',
            border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 20, color: '#FFD700' }}>
                {editAccount._id ? '?? Edit Account' : '? New Account'}
              </h2>
              <button onClick={() => setEditAccount(null)} style={{
                width: 32, height: 32, borderRadius: '50%', border: 'none',
                background: '#333', color: '#fff', cursor: 'pointer', fontSize: 16,
              }}>?</button>
            </div>

            <form onSubmit={saveAccount}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={labelStyle}>Type</label>
                  <select value={editAccount.type} onChange={e => setEditAccount({...editAccount, type: e.target.value})} style={inputStyle}>
                    <option value="telebirr">Telebirr</option>
                    <option value="cbe">CBE</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Account Name</label>
                  <input value={editAccount.accountName} onChange={e => setEditAccount({...editAccount, accountName: e.target.value})}
                    placeholder="Bingo Gaming PLC" style={inputStyle} />
                </div>
                {editAccount.type === 'telebirr' && (
                  <div>
                    <label style={labelStyle}>Phone Number</label>
                    <input value={editAccount.phone || ''} onChange={e => setEditAccount({...editAccount, phone: e.target.value})}
                      placeholder="+251912345678" style={inputStyle} />
                  </div>
                )}
                {editAccount.type === 'cbe' && (
                  <div>
                    <label style={labelStyle}>Account Number</label>
                    <input value={editAccount.accountNumber || ''} onChange={e => setEditAccount({...editAccount, accountNumber: e.target.value})}
                      placeholder="1000123456789" style={inputStyle} />
                  </div>
                )}
                <div>
                  <label style={labelStyle}>Min Deposit (ETB)</label>
                  <input type="number" value={editAccount.minDeposit} onChange={e => setEditAccount({...editAccount, minDeposit: parseInt(e.target.value)})} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Max Deposit (ETB)</label>
                  <input type="number" value={editAccount.maxDeposit} onChange={e => setEditAccount({...editAccount, maxDeposit: parseInt(e.target.value)})} style={inputStyle} />
                </div>
              </div>

              <label style={labelStyle}>Instructions (???? English)</label>
              <textarea value={editAccount.instructionsEn || ''} onChange={e => setEditAccount({...editAccount, instructionsEn: e.target.value})}
                rows={3} style={{...inputStyle, resize: 'vertical', marginBottom: 8}} placeholder="Step-by-step instructions..." />

              <label style={labelStyle}>Instructions (???? ????)</label>
              <textarea value={editAccount.instructionsAm || ''} onChange={e => setEditAccount({...editAccount, instructionsAm: e.target.value})}
                rows={3} style={{...inputStyle, resize: 'vertical', marginBottom: 8}} />

              <label style={labelStyle}>Instructions (???? ????)</label>
              <textarea value={editAccount.instructionsTg || ''} onChange={e => setEditAccount({...editAccount, instructionsTg: e.target.value})}
                rows={3} style={{...inputStyle, resize: 'vertical', marginBottom: 8}} />

              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button type="submit" style={{
                  flex: 1, padding: 14, borderRadius: 12, border: 'none',
                  background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
                  color: '#1a1a2e', fontWeight: 700, fontSize: 15, cursor: 'pointer',
                }}>?? Save Account</button>
                <button type="button" onClick={() => setEditAccount(null)} style={{
                  padding: '14px 24px', borderRadius: 12, border: '1px solid #333',
                  background: 'transparent', color: '#A0A0B8', cursor: 'pointer', fontSize: 14,
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

