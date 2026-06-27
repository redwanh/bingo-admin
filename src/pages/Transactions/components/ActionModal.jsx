import React, { useState } from 'react';
import './ActionModal.css';

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className={`modal-title ${isApprove ? 'approve' : 'reject'}`}>
            {isApprove ? '✅ Approve Withdrawal' : '❌ Reject Withdrawal'}
          </h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* User Info */}
        <div className="modal-user-info">
          <div className="modal-avatar">
            {(user.fullName || 'U')[0]}
          </div>
          <div className="modal-user-details">
            <p className="modal-user-name">{user.fullName}</p>
            <p className="modal-user-phone">{user.phone}</p>
          </div>
          <div className="modal-amount">
            <p className="modal-amount-label">Amount</p>
            <p className="modal-amount-value">{amount} ETB</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="modal-label">
            {isApprove ? 'Transaction ID' : 'Rejection Reason'}
          </label>
          
          {isApprove ? (
            <input
              type="text"
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="Enter transaction reference ID..."
              autoFocus
              className="modal-input"
            />
          ) : (
            <textarea
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="Reason for rejection..."
              autoFocus
              rows={3}
              className="modal-textarea"
            />
          )}

          <div className="modal-actions">
            <button
              type="submit"
              className={`modal-confirm ${isApprove ? 'approve' : 'reject'}`}
            >
              {isApprove ? '✅ Confirm Approval' : '❌ Confirm Rejection'}
            </button>
            <button
              type="button"
              className="modal-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}