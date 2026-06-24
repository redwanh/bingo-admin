// pages/Deposits/components/DepositCard.jsx
import React from 'react';

const StatusBadge = ({ status }) => {
  const colors = {
    pending: { bg: 'rgba(255,165,2,0.12)', color: '#FFA502', border: 'rgba(255,165,2,0.3)' },
    approved: { bg: 'rgba(46,213,115,0.12)', color: '#2ED573', border: 'rgba(46,213,115,0.3)' },
    rejected: { bg: 'rgba(255,71,87,0.12)', color: '#FF4757', border: 'rgba(255,71,87,0.3)' },
  };
  const c = colors[status] || colors.pending;
  return (
    <span style={{
      padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700,
      background: c.bg, color: c.color, border: '1px solid ' + c.border,
    }}>
      {status.toUpperCase()}
    </span>
  );
};

export default function DepositCard({ deposit, onApprove, onReject }) {
  const d = deposit;
  const user = d.user || {};
  const account = d.paymentAccount || {};
  const isPending = d.status === 'pending';

  return (
    <div style={{
      background: '#16213e', borderRadius: 14, padding: 20,
      border: '1px solid ' + (isPending ? 'rgba(255,165,2,0.3)' : 'rgba(255,255,255,0.06)'),
      transition: 'all 0.2s',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#1a1a2e', fontWeight: 800, fontSize: 15,
          }}>
            {(user.fullName || 'U')[0].toUpperCase()}
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 14, color: '#fff', margin: 0 }}>
              {user.fullName || 'Unknown'}
            </p>
            <p style={{ fontSize: 11, color: '#888', margin: '2px 0 0' }}>
              {user.phone || 'N/A'}
            </p>
          </div>
        </div>
        <StatusBadge status={d.status} />
      </div>

      {/* Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        <div style={{ background: '#0f3460', padding: 10, borderRadius: 8 }}>
          <p style={{ fontSize: 10, color: '#888', margin: '0 0 2px' }}>Amount</p>
          <p style={{ fontSize: 18, fontWeight: 800, color: '#FFD700', margin: 0 }}>{d.amount} ETB</p>
        </div>
        <div style={{ background: '#0f3460', padding: 10, borderRadius: 8 }}>
          <p style={{ fontSize: 10, color: '#888', margin: '0 0 2px' }}>Account</p>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: 0, textTransform: 'uppercase' }}>
            {account.type || 'N/A'}
          </p>
        </div>
        {d.senderPhone && (
          <div style={{ background: '#0f3460', padding: 10, borderRadius: 8 }}>
            <p style={{ fontSize: 10, color: '#888', margin: '0 0 2px' }}>Sender Phone</p>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#00B4D8', margin: 0, fontFamily: 'monospace' }}>
              {d.senderPhone}
            </p>
          </div>
        )}
        {d.transactionId && (
          <div style={{ background: '#0f3460', padding: 10, borderRadius: 8 }}>
            <p style={{ fontSize: 10, color: '#888', margin: '0 0 2px' }}>Transaction ID</p>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#A0A0B8', margin: 0, fontFamily: 'monospace' }}>
              {d.transactionId}
            </p>
          </div>
        )}
        {d.cbeReference && (
          <div style={{ background: '#0f3460', padding: 10, borderRadius: 8 }}>
            <p style={{ fontSize: 10, color: '#888', margin: '0 0 2px' }}>CBE Reference</p>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#A0A0B8', margin: 0, fontFamily: 'monospace' }}>
              {d.cbeReference}
            </p>
          </div>
        )}
        <div style={{ background: '#0f3460', padding: 10, borderRadius: 8 }}>
          <p style={{ fontSize: 10, color: '#888', margin: '0 0 2px' }}>Date</p>
          <p style={{ fontSize: 11, color: '#A0A0B8', margin: 0 }}>
            {new Date(d.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      {/* Reviewed by */}
      {d.reviewedBy && (
        <p style={{ fontSize: 11, color: '#666', marginBottom: 12 }}>
          {d.status === 'approved' ? '✅' : '❌'} Reviewed by {d.reviewedBy.fullName || 'Admin'} • {d.reviewNote || ''}
        </p>
      )}

      {/* Actions */}
      {isPending && (
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => onApprove(d._id)} style={{
            flex: 1, padding: 12, borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg, #2ED573, #059669)',
            color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
          }}>
            ✅ Approve & Credit
          </button>
          <button onClick={() => onReject(d._id)} style={{
            flex: 1, padding: 12, borderRadius: 10, border: 'none',
            background: 'rgba(255,71,87,0.1)', color: '#FF4757',
            fontWeight: 700, fontSize: 13, cursor: 'pointer',
            border: '1px solid rgba(255,71,87,0.3)',
          }}>
            ❌ Reject
          </button>
        </div>
      )}
    </div>
  );
}
