import React from 'react';
import './TableStyles.css';

export default function CardPurchaseTable({ data, loading }) {
  if (loading) return <div className="loading-state">Loading...</div>;
  if (data.length === 0) return <div className="empty-state">No card purchase data</div>;

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Count</th>
            <th>Total Amount</th>
            <th>Credits</th>
            <th>Debits</th>
            <th>Net</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={item._id} className={i % 2 === 0 ? 'even' : 'odd'}>
              <td className="type-cell">
                <span className="type-icon">🎴</span>
                <span className="type-label">{item._id?.replace('_', ' ')}</span>
              </td>
              <td className="muted-cell">{item.count}</td>
              <td className="amount-cell gold">{item.totalAmount?.toFixed(0)} ETB</td>
              <td className="amount-cell credit">{item.creditTotal?.toFixed(0) || 0} ETB</td>
              <td className="amount-cell debit">{item.debitTotal?.toFixed(0) || 0} ETB</td>
              <td className={`amount-cell ${(item.creditTotal - item.debitTotal) >= 0 ? 'credit' : 'debit'}`}>
                {(item.creditTotal - item.debitTotal)?.toFixed(0) || 0} ETB
              </td>
            </tr>
          ))}
          <tr className="total-row">
            <td className="total-label">TOTAL</td>
            <td>{data.reduce((s, i) => s + i.count, 0)}</td>
            <td className="amount-cell gold">{data.reduce((s, i) => s + i.totalAmount, 0).toFixed(0)} ETB</td>
            <td className="amount-cell credit">{data.reduce((s, i) => s + i.creditTotal, 0).toFixed(0)} ETB</td>
            <td className="amount-cell debit">{data.reduce((s, i) => s + i.debitTotal, 0).toFixed(0)} ETB</td>
            <td className="amount-cell gold">{data.reduce((s, i) => s + i.creditTotal - i.debitTotal, 0).toFixed(0)} ETB</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}