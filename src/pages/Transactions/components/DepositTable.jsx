import React from 'react';
import './TableStyles.css';

const StatusBadge = ({ status }) => {
  const colors = {
    pending: '#b8962f',
    approved: '#065f46',
    rejected: '#991b1b'
  };
  const bgColors = {
    pending: '#fef3c7',
    approved: '#d1fae5',
    rejected: '#fee2e2'
  };
  return (
    <span className={`status-badge ${status}`}>
      {status}
    </span>
  );
};

export default function DepositTable({ data, loading, onApprove }) {
  if (loading) return <div className="loading-state">Loading...</div>;
  if (data.length === 0) return <div className="empty-state">No deposit requests</div>;

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Phone</th>
            <th>Amount</th>
            <th>Account</th>
            <th>Date</th>
            <th>Status</th>
            <th className="action-col">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={d._id} className={i % 2 === 0 ? 'even' : 'odd'}>
              <td>
                <div className="user-cell">
                  <div className="user-avatar small gold">
                    {(d.user?.fullName || 'U')[0]}
                  </div>
                  <span className="user-name">{d.user?.fullName || 'N/A'}</span>
                </div>
              </td>
              <td className="muted-cell">{d.user?.phone || 'N/A'}</td>
              <td className="amount-cell credit">{d.amount} ETB</td>
              <td className="muted-cell">{d.paymentAccount?.type?.toUpperCase() || 'N/A'}</td>
              <td className="muted-cell">{new Date(d.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
              <td><StatusBadge status={d.status} /></td>
              <td className="action-col">
                {d.status === 'pending' ? (
                  <button className="action-btn approve" onClick={() => onApprove(d._id)}>
                    Approve
                  </button>
                ) : (
                  <span className="muted-cell">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}