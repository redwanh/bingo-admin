// pages/Transactions/components/CardPurchaseTable.jsx
import React from 'react';

const thStyle = { padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#A0A0B8', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '2px solid rgba(255,255,255,0.06)', whiteSpace: 'nowrap' };
const tdStyle = { padding: '12px 16px', fontSize: 13, color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.03)', whiteSpace: 'nowrap' };
const tdMuted = { ...tdStyle, color: '#A0A0B8' };

export default function CardPurchaseTable({ data, loading }) {
  if (loading) return <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>Loading...</div>;
  if (data.length === 0) return <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>No card purchase data</div>;

  return (
    <div style={{ background: '#16213e', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#1a2940' }}>
            <th style={thStyle}>Type</th>
            <th style={thStyle}>Count</th>
            <th style={thStyle}>Total Amount</th>
            <th style={thStyle}>Credits</th>
            <th style={thStyle}>Debits</th>
            <th style={thStyle}>Net</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={item._id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
              <td style={tdStyle}>
                <span style={{ marginRight: 8 }}>🎴</span>
                <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{item._id?.replace('_', ' ')}</span>
              </td>
              <td style={tdMuted}>{item.count}</td>
              <td style={{ ...tdStyle, fontWeight: 700, color: '#00B4D8' }}>{item.totalAmount?.toFixed(0)} ETB</td>
              <td style={{ ...tdStyle, color: '#2ED573' }}>{item.creditTotal?.toFixed(0) || 0} ETB</td>
              <td style={{ ...tdStyle, color: '#FF4757' }}>{item.debitTotal?.toFixed(0) || 0} ETB</td>
              <td style={{ ...tdStyle, fontWeight: 700, color: (item.creditTotal - item.debitTotal) >= 0 ? '#2ED573' : '#FF4757' }}>
                {(item.creditTotal - item.debitTotal)?.toFixed(0) || 0} ETB
              </td>
            </tr>
          ))}
          <tr style={{ background: '#1a2940', fontWeight: 700 }}>
            <td style={{ ...tdStyle, fontWeight: 700 }}>TOTAL</td>
            <td style={tdStyle}>{data.reduce((s, i) => s + i.count, 0)}</td>
            <td style={{ ...tdStyle, fontWeight: 700, color: '#FFD700' }}>{data.reduce((s, i) => s + i.totalAmount, 0).toFixed(0)} ETB</td>
            <td style={{ ...tdStyle, color: '#2ED573' }}>{data.reduce((s, i) => s + i.creditTotal, 0).toFixed(0)} ETB</td>
            <td style={{ ...tdStyle, color: '#FF4757' }}>{data.reduce((s, i) => s + i.debitTotal, 0).toFixed(0)} ETB</td>
            <td style={{ ...tdStyle, fontWeight: 700, color: '#FFD700' }}>{data.reduce((s, i) => s + i.creditTotal - i.debitTotal, 0).toFixed(0)} ETB</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
