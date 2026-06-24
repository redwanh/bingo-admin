// pages/Transactions/components/DepositTable.jsx
import React from 'react';

const thStyle = { padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#A0A0B8', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '2px solid rgba(255,255,255,0.06)', whiteSpace: 'nowrap' };
const tdStyle = { padding: '12px 16px', fontSize: 13, color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.03)', whiteSpace: 'nowrap' };
const tdMuted = { ...tdStyle, color: '#A0A0B8' };

const StatusBadge = ({ status }) => {
  const c = { pending: '#FFA502', approved: '#2ED573', rejected: '#FF4757' };
  return <span style={{ padding: '4px 10px', borderRadius: 8, fontSize: 10, fontWeight: 700, background: c[status] + '20', color: c[status], textTransform: 'uppercase' }}>{status}</span>;
};

export default function DepositTable({ data, loading, onApprove }) {
  if (loading) return <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>Loading...</div>;
  if (data.length === 0) return <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>No deposit requests</div>;

  return (
    <div style={{ background: '#16213e', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#1a2940' }}>
            <th style={thStyle}>User</th>
            <th style={thStyle}>Phone</th>
            <th style={thStyle}>Amount</th>
            <th style={thStyle}>Account</th>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Status</th>
            <th style={{ ...thStyle, textAlign: 'center' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={d._id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,215,0,0.03)'}
              onMouseOut={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'}>
              <td style={tdStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #FFD700, #FF8C00)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a1a2e', fontWeight: 800, fontSize: 12 }}>
                    {(d.user?.fullName || 'U')[0]}
                  </div>
                  <span style={{ fontWeight: 600 }}>{d.user?.fullName || 'N/A'}</span>
                </div>
              </td>
              <td style={tdMuted}>{d.user?.phone || 'N/A'}</td>
              <td style={{ ...tdStyle, fontWeight: 700, color: '#2ED573' }}>{d.amount} ETB</td>
              <td style={tdMuted}>{d.paymentAccount?.type?.toUpperCase() || 'N/A'}</td>
              <td style={tdMuted}>{new Date(d.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
              <td style={tdStyle}><StatusBadge status={d.status} /></td>
              <td style={{ ...tdStyle, textAlign: 'center' }}>
                {d.status === 'pending' ? (
                  <button onClick={() => onApprove(d._id)} style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: '#2ED573', color: '#fff', fontWeight: 600, fontSize: 11, cursor: 'pointer' }}>Approve</button>
                ) : (
                  <span style={{ fontSize: 11, color: '#666' }}>—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
