import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './AccountManagement.css';

import telebirrLogo from '../../assets/telebirr-logo.png';  // or .png
import cbeLogo from '../../assets/cbe-logo.png';  

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function AccountManagement() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editAccount, setEditAccount] = useState(null);

  useEffect(() => { fetchAccounts(); }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };
      const res = await axios.get(API + '/payments/admin/accounts', { headers });
      setAccounts(res.data.data || []);
    } catch (e) {
      toast.error('Failed to load accounts');
    }
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
    } catch (e) {
      toast.error('Save failed');
    }
  };

  const seedAccounts = async () => {
    try {
      const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };
      await axios.post(API + '/payments/seed', {}, { headers });
      toast.success('Sample accounts created!');
      fetchAccounts();
    } catch (e) {
      toast.error('Seed failed — accounts may already exist');
    }
  };

  const deleteAccount = async (id) => {
    if (!window.confirm('Delete this account?')) return;
    try {
      const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };
      await axios.delete(API + '/payments/admin/accounts/' + id, { headers });
      toast.success('Account deleted');
      fetchAccounts();
    } catch (e) {
      toast.error('Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="acc-loading">
        <div className="acc-spinner" />
        <span>Loading accounts...</span>
      </div>
    );
  }

  return (
    <div className="acc-container">
      {/* Header */}
      <div className="acc-header">
        <div>
          <h1 className="acc-title">💳 Payment Accounts</h1>
          <p className="acc-subtitle">Manage Telebirr & CBE accounts for deposits</p>
        </div>
        <div className="acc-header-actions">
          <button className="acc-btn acc-btn-outline" onClick={seedAccounts}>
            🌱 Seed Sample
          </button>
          <button
            className="acc-btn acc-btn-primary"
            onClick={() =>
              setEditAccount({
                type: 'telebirr',
                accountName: '',
                phone: '',
                accountNumber: '',
                instructionsEn: '',
                instructionsAm: '',
                instructionsTg: '',
                minDeposit: 50,
                maxDeposit: 50000,
              })
            }
          >
            + Add Account
          </button>
        </div>
      </div>

      {/* Empty State */}
      {accounts.length === 0 && (
        <div className="acc-empty">
          <span className="acc-empty-icon">🏦</span>
          <p className="acc-empty-title">No payment accounts configured</p>
          <p className="acc-empty-text">Click "Seed Sample" or "Add Account" to create one.</p>
        </div>
      )}

      {/* Accounts Grid */}
      {accounts.length > 0 && (
        <div className="acc-grid">
          {accounts.map((acc) => (
            <div key={acc._id} className="acc-card">
              {/* Card Header */}
              <div className="acc-card-header">
                <div>
                  <span className={`acc-type-badge ${acc.type}`}>
      {acc.type === 'telebirr' ? (
        <img src={telebirrLogo} alt="Telebirr" className="acc-type-icon" />
      ) : (
        <img src={cbeLogo} alt="CBE" className="acc-type-icon" />
      )}
      {acc.type === 'telebirr' ? 'Telebirr' : 'CBE'}
    </span>
                  <p className="acc-card-name">{acc.accountName}</p>
                </div>
                <div className="acc-card-actions">
                  <button className="acc-icon-btn acc-edit-btn" onClick={() => setEditAccount(acc)}>
                    ✏️
                  </button>
                  <button className="acc-icon-btn acc-delete-btn" onClick={() => deleteAccount(acc._id)}>
                    🗑️
                  </button>
                </div>
              </div>

              {/* Card Details */}
              <div className="acc-card-details">
                {acc.type === 'telebirr' && (
                  <div className="acc-detail-item">
                    <span className="acc-detail-label">Phone Number</span>
                    <span className="acc-detail-value mono">{acc.phone || '—'}</span>
                  </div>
                )}
                {acc.type === 'cbe' && (
                  <div className="acc-detail-item">
                    <span className="acc-detail-label">Account Number</span>
                    <span className="acc-detail-value mono">{acc.accountNumber || '—'}</span>
                  </div>
                )}
                <div className="acc-detail-item">
                  <span className="acc-detail-label">Deposit Limits</span>
                  <span className="acc-detail-value">
                    {acc.minDeposit} – {acc.maxDeposit} ETB
                  </span>
                </div>
                {acc.instructionsEn && (
                  <div className="acc-detail-item acc-detail-full">
                    <span className="acc-detail-label">Instructions (EN)</span>
                    <span className="acc-detail-text">{acc.instructionsEn}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Create Modal */}
      {editAccount && (
        <div className="acc-modal-overlay" onClick={() => setEditAccount(null)}>
          <div className="acc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="acc-modal-header">
              <h2 className="acc-modal-title">
                {editAccount._id ? '✏️ Edit Account' : '➕ New Account'}
              </h2>
              <button className="acc-modal-close" onClick={() => setEditAccount(null)}>
                ✕
              </button>
            </div>

            <form onSubmit={saveAccount} className="acc-form">
              <div className="acc-form-row">
                <div className="acc-form-group">
                  <label className="acc-form-label">Type</label>
                  <select
                    className="acc-form-input"
                    value={editAccount.type}
                    onChange={(e) => setEditAccount({ ...editAccount, type: e.target.value })}
                  >
                    <option value="telebirr">Telebirr</option>
                    <option value="cbe">CBE</option>
                  </select>
                </div>
                <div className="acc-form-group">
                  <label className="acc-form-label">Account Name</label>
                  <input
                    className="acc-form-input"
                    value={editAccount.accountName}
                    onChange={(e) => setEditAccount({ ...editAccount, accountName: e.target.value })}
                    placeholder="Bingo Gaming PLC"
                  />
                </div>
              </div>

              {editAccount.type === 'telebirr' && (
                <div className="acc-form-group">
                  <label className="acc-form-label">Phone Number</label>
                  <input
                    className="acc-form-input"
                    value={editAccount.phone || ''}
                    onChange={(e) => setEditAccount({ ...editAccount, phone: e.target.value })}
                    placeholder="+251912345678"
                  />
                </div>
              )}

              {editAccount.type === 'cbe' && (
                <div className="acc-form-group">
                  <label className="acc-form-label">Account Number</label>
                  <input
                    className="acc-form-input"
                    value={editAccount.accountNumber || ''}
                    onChange={(e) => setEditAccount({ ...editAccount, accountNumber: e.target.value })}
                    placeholder="1000123456789"
                  />
                </div>
              )}

              <div className="acc-form-row">
                <div className="acc-form-group">
                  <label className="acc-form-label">Min Deposit (ETB)</label>
                  <input
                    className="acc-form-input"
                    type="number"
                    value={editAccount.minDeposit}
                    onChange={(e) => setEditAccount({ ...editAccount, minDeposit: parseInt(e.target.value) })}
                  />
                </div>
                <div className="acc-form-group">
                  <label className="acc-form-label">Max Deposit (ETB)</label>
                  <input
                    className="acc-form-input"
                    type="number"
                    value={editAccount.maxDeposit}
                    onChange={(e) => setEditAccount({ ...editAccount, maxDeposit: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="acc-form-group">
                <label className="acc-form-label">Instructions (🇬🇧 English)</label>
                <textarea
                  className="acc-form-textarea"
                  value={editAccount.instructionsEn || ''}
                  onChange={(e) => setEditAccount({ ...editAccount, instructionsEn: e.target.value })}
                  rows={3}
                  placeholder="Step-by-step instructions..."
                />
              </div>

              <div className="acc-form-group">
                <label className="acc-form-label">Instructions (🇪🇹 አማርኛ)</label>
                <textarea
                  className="acc-form-textarea"
                  value={editAccount.instructionsAm || ''}
                  onChange={(e) => setEditAccount({ ...editAccount, instructionsAm: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="acc-form-group">
                <label className="acc-form-label">Instructions (🇪🇹 ትግርኛ)</label>
                <textarea
                  className="acc-form-textarea"
                  value={editAccount.instructionsTg || ''}
                  onChange={(e) => setEditAccount({ ...editAccount, instructionsTg: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="acc-modal-actions">
                <button type="button" className="acc-btn acc-btn-ghost" onClick={() => setEditAccount(null)}>
                  Cancel
                </button>
                <button type="submit" className="acc-btn acc-btn-primary">
                  💾 Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}