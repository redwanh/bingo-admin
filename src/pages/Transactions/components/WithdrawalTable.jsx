// pages/Transactions/components/WithdrawalTable.jsx
import React, { useState } from 'react';
import ActionModal from './ActionModal';

const thStyle = { padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#A0A0B8', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '2px solid rgba(255,255,255,0.06)', whiteSpace: 'nowrap' };
const tdStyle = { padding: '12px 16px', fontSize: 13, color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.03)', whiteSpace: 'nowrap' };
const tdMuted = { ...tdStyle, color: '#A0A0B8' };

const StatusBadge = ({ status }) => {
  const c = { pending: '#FFA502', approved: '#2ED573', rejected: '#FF4757' };
  return <span style={{ padding: '4px 10px', borderRadius: 8, fontSize: 10, fontWeight: 700, background: c[status] + '20', color: c[status], textTransform: 'uppercase' }}>{status}</span>;
};

export default function WithdrawalTable({ data, loading, onApprove, onReject }) {
  const [modal, setModal] = useState(null);

  if (loading) return <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>Loading...</div>;
  if (data.length === 0) return <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>No withdrawal requests</div>;

  return (
    <>
      <div style={{ background: '#16213e', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#1a2940' }}>
              <th style={thStyle}>User</th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>Amount</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Status</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((w, i) => (
              <tr key={w._id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,215,0,0.03)'}
                onMouseOut={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'}>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #FF4757, #E11D48)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 12 }}>
                      {(w.user?.fullName || 'U')[0]}
                    </div>
                    <span style={{ fontWeight: 600 }}>{w.user?.fullName || 'N/A'}</span>
                  </div>
                </td>
                <td style={tdMuted}>{w.user?.phone || 'N/A'}</td>
                <td style={{ ...tdStyle, fontWeight: 700, color: '#FF4757' }}>{w.amount} ETB</td>
                <td style={tdMuted}>{new Date(w.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                <td style={tdStyle}><StatusBadge status={w.status} /></td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  {w.status === 'pending' ? (
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                      <button onClick={() => setModal({ type: 'approve', withdrawal: w })} style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: '#2ED573', color: '#fff', fontWeight: 600, fontSize: 11, cursor: 'pointer' }}>Approve</button>
                      <button onClick={() => setModal({ type: 'reject', withdrawal: w })} style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #FF4757', background: 'transparent', color: '#FF4757', fontWeight: 600, fontSize: 11, cursor: 'pointer' }}>Reject</button>
                    </div>
                  ) : (
                    <span style={{ fontSize: 11, color: '#666' }}>{w.reviewedBy?.fullName || 'Admin'}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <ActionModal
          type={modal.type}
          withdrawal={modal.withdrawal}
          onClose={() => setModal(null)}
          onConfirm={(value) => {
            if (modal.type === 'approve') onApprove(modal.withdrawal._id, value);
            else onReject(modal.withdrawal._id, value);
            setModal(null);
          }}
        />
      )}
    </>
  );
}
