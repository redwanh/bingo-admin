import React, { useState } from 'react';
import ActionModal from './ActionModal';
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

export default function WithdrawalTable({ data, loading, onApprove, onReject }) {
  const [modal, setModal] = useState(null);

  if (loading) return <div className="loading-state">Loading...</div>;
  if (data.length === 0) return <div className="empty-state">No withdrawal requests</div>;

  return (
    <>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Phone</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th className="action-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((w, i) => (
              <tr key={w._id} className={i % 2 === 0 ? 'even' : 'odd'}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar small red">
                      {(w.user?.fullName || 'U')[0]}
                    </div>
                    <span className="user-name">{w.user?.fullName || 'N/A'}</span>
                  </div>
                </td>
                <td className="muted-cell">{w.user?.phone || 'N/A'}</td>
                <td className="amount-cell debit">{w.amount} ETB</td>
                <td className="muted-cell date-cell">{new Date(w.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                <td><StatusBadge status={w.status} /></td>
                <td className="action-col">
                  {w.status === 'pending' ? (
                    <div className="action-buttons">
                      <button
                        className="action-btn approve"
                        onClick={() => setModal({ type: 'approve', withdrawal: w })}
                      >
                        Approve
                      </button>
                      <button
                        className="action-btn reject"
                        onClick={() => setModal({ type: 'reject', withdrawal: w })}
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="muted-cell">{w.reviewedBy?.fullName || 'Admin'}</span>
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