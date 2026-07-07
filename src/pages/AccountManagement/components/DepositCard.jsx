import React from 'react';
import '../AccountManagement.css';

export default function DepositCard({ deposit, onApprove, onReject }) {
  const d = deposit;
  const user = d.user || {};
  const account = d.paymentAccount || {};
  const isPending = d.status === 'pending';

  return (
    <div className={`deposit-card ${isPending ? 'pending' : ''}`}>
      {/* Header */}
      <div className="deposit-card-header">
        <div className="deposit-card-user">
          <div className="deposit-card-avatar">
            {(user.fullName || 'U')[0].toUpperCase()}
          </div>
          <div>
            <p className="deposit-card-name">{user.fullName || 'Unknown'}</p>
            <p className="deposit-card-phone">{user.phone || 'N/A'}</p>
          </div>
        </div>
        <span className={`deposit-status-badge deposit-status-${d.status}`}>
          {d.status}
        </span>
      </div>

      {/* Details */}
      <div className="deposit-card-details">
        <div className="deposit-detail-item">
          <span className="deposit-detail-label">Amount</span>
          <span className="deposit-detail-value amount">{d.amount} ETB</span>
        </div>
        <div className="deposit-detail-item">
          <span className="deposit-detail-label">Account</span>
          <span className="deposit-detail-value">{account.type?.toUpperCase() || 'N/A'}</span>
        </div>
        {d.senderPhone && (
          <div className="deposit-detail-item">
            <span className="deposit-detail-label">Sender Phone</span>
            <span className="deposit-detail-value mono">{d.senderPhone}</span>
          </div>
        )}
        {d.transactionId && (
          <div className="deposit-detail-item">
            <span className="deposit-detail-label">Transaction ID</span>
            <span className="deposit-detail-value mono">{d.transactionId}</span>
          </div>
        )}
        {d.cbeReference && (
          <div className="deposit-detail-item">
            <span className="deposit-detail-label">CBE Reference</span>
            <span className="deposit-detail-value mono">{d.cbeReference}</span>
          </div>
        )}
        <div className="deposit-detail-item">
          <span className="deposit-detail-label">Date</span>
          <span className="deposit-detail-value">
            {new Date(d.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Actions */}
      {isPending && (
        <div className="deposit-card-actions">
          <button className="dp-action-btn dp-action-approve" onClick={() => onApprove(d._id)}>
            ✅ Approve
          </button>
          <button className="dp-action-btn dp-action-reject" onClick={() => onReject(d._id)}>
            ❌ Reject
          </button>
        </div>
      )}

      {/* Reviewer */}
      {d.reviewedBy && (
        <p className="deposit-reviewer">
          {d.status === 'approved' ? '✅' : '❌'} Reviewed by {d.reviewedBy.fullName || 'Admin'}
          {d.reviewNote && ` • ${d.reviewNote}`}
        </p>
      )}
    </div>
  );
}