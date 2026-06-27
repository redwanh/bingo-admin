import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './BalanceModal.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function BalanceModal({ user, onClose, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API}/admin/users/${user._id}/balance`,  
        { amount: numAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Added $${numAmount.toFixed(2)} to ${user.fullName || 'user'}`);
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add balance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">💰 Add Balance</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="modal-body">
          <p className="modal-user">
            User: <strong>{user.fullName || 'Unknown'}</strong>
          </p>
          <p className="modal-current">
            Current Balance: <strong>${(user.balance || 0).toFixed(2)}</strong>
          </p>
          
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
              <label className="form-label">Amount ($)</label>
              <input
                className="form-input"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Enter amount..."
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
                disabled={loading}
              />
            </div>
            
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Balance'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}