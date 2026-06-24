// pages/Transactions/components/JournalTable.jsx
import React from 'react';

const thStyle = { padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#A0A0B8', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '2px solid rgba(255,255,255,0.06)', whiteSpace: 'nowrap' };
const tdStyle = { padding: '12px 16px', fontSize: 13, color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.03)', whiteSpace: 'nowrap' };
const tdMuted = { ...tdStyle, color: '#A0A0B8' };

const typeIcons = { deposit: '💰', withdrawal: '💸', card_purchase: '🎴', prize: '🏆', commission: '📊', refund: '↩️', bonus: '🎁', cash: '💵', adjustment: '⚙️' };
const typeColors = { deposit: '#2ED573', withdrawal: '#FF4757', card_purchase: '#00B4D8', prize: '#FFD700', commission: '#A855F7', refund: '#F59E0B', bonus: '#FFA502', cash: '#2ED573', adjustment: '#A0A0B8' };

export default function JournalTable({ data, loading, typeFilter, onTypeFilter, userFilter, onUserFilter, page, totalPages, onPageChange }) {
  const types = ['all', 'deposit', 'withdrawal', 'card_purchase', 'prize', 'commission', 'refund', 'bonus', 'cash'];

  return (
    <div>
      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <input 
          type="text" value={userFilter} onChange={e => onUserFilter(e.target.value)}
          placeholder="🔍 Search by user name or phone..."
          style={{ flex: 1, minWidth: 200, padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: '#16213e', color: '#fff', fontSize: 13, outline: 'none' }}
        />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {types.map(t => (
            <button key={t} onClick={() => onTypeFilter(t)} style={{
              padding: '8px 14px', borderRadius: 20, border: 'none',
              background: typeFilter === t ? (typeColors[t] || '#FFD700') + '20' : '#16213e',
              color: typeFilter === t ? typeColors[t] || '#FFD700' : '#A0A0B8',
              fontWeight: typeFilter === t ? 700 : 500, fontSize: 11, cursor: 'pointer',
              border: '1px solid ' + (typeFilter === t ? typeColors[t] || '#FFD700' : 'transparent'),
            }}>{typeIcons[t] || '📌'} {t === 'all' ? 'All' : t.replace('_', ' ')}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>Loading...</div>
      ) : data.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>No transactions found</div>
      ) : (
        <div style={{ background: '#16213e', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#1a2940' }}>
                <th style={thStyle}>User</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Amount</th>
                <th style={thStyle}>Balance After</th>
                <th style={thStyle}>Description</th>
                <th style={thStyle}>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.map((tx, i) => {
                const userName = tx.user?.fullName || tx.userId?.fullName || 'N/A';
                const userPhone = tx.user?.phone || tx.userId?.phone || 'N/A';
                return (
                  <tr key={tx._id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(255,215,0,0.03)'}
                    onMouseOut={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'}>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg, #FFD700, #FF8C00)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a1a2e', fontWeight: 800, fontSize: 11 }}>
                          {userName[0]}
                        </div>
                        <span style={{ fontWeight: 600 }}>{userName}</span>
                      </div>
                    </td>
                    <td style={tdMuted}>{userPhone}</td>
                    <td style={tdStyle}>
                      <span style={{ marginRight: 6 }}>{typeIcons[tx.type] || '📌'}</span>
                      <span style={{ color: typeColors[tx.type] || '#fff', fontWeight: 600, textTransform: 'capitalize' }}>{tx.type?.replace('_', ' ')}</span>
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 700, color: tx.direction === 'credit' ? '#2ED573' : '#FF4757' }}>
                      {tx.direction === 'credit' ? '+' : '-'}{tx.amount} ETB
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 600, fontFamily: 'monospace' }}>{tx.balanceAfter?.toFixed(0) || '—'} ETB</td>
                    <td style={{ ...tdMuted, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.description || '—'}</td>
                    <td style={tdMuted}>{new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
          <button onClick={() => onPageChange(page - 1)} disabled={page === 1} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: page === 1 ? '#1a1a2e' : '#FF4757', color: page === 1 ? '#555' : '#fff', cursor: page === 1 ? 'default' : 'pointer', fontWeight: 600, fontSize: 12 }}>← Prev</button>
          <span style={{ color: '#888', fontSize: 13, padding: '8px 0' }}>Page {page} of {totalPages}</span>
          <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: page === totalPages ? '#1a1a2e' : '#FF4757', color: page === totalPages ? '#555' : '#fff', cursor: page === totalPages ? 'default' : 'pointer', fontWeight: 600, fontSize: 12 }}>Next →</button>
        </div>
      )}
    </div>
  );
}
