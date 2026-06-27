import React from 'react';
import './TableStyles.css';

const typeIcons = { deposit: '💰', withdrawal: '💸', card_purchase: '🎴', prize: '🏆', commission: '📊', refund: '↩️', bonus: '🎁', cash: '💵', adjustment: '⚙️' };
const typeColors = { deposit: '#065f46', withdrawal: '#991b1b', card_purchase: '#0369a1', prize: '#b8962f', commission: '#6d28d9', refund: '#d97706', bonus: '#d97706', cash: '#065f46', adjustment: '#6b7280' };

export default function JournalTable({ data, loading, typeFilter, onTypeFilter, userFilter, onUserFilter, page, totalPages, onPageChange }) {
  const types = ['all', 'deposit', 'withdrawal', 'card_purchase', 'prize', 'commission', 'refund', 'bonus', 'cash'];

  return (
    <div>
      {/* Filters */}
      <div className="journal-filters">
        <input
          type="text"
          value={userFilter}
          onChange={e => onUserFilter(e.target.value)}
          placeholder="🔍 Search by user name or phone..."
          className="search-input"
        />
        <div className="filter-buttons">
          {types.map(t => (
            <button
              key={t}
              onClick={() => onTypeFilter(t)}
              className={`filter-btn ${typeFilter === t ? 'active' : ''}`}
              style={typeFilter === t ? { color: typeColors[t] || '#b8962f', borderColor: typeColors[t] || '#b8962f' } : {}}
            >
              {typeIcons[t] || '📌'} {t === 'all' ? 'All' : t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="loading-state">Loading...</div>
      ) : data.length === 0 ? (
        <div className="empty-state">No transactions found</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Phone</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Balance After</th>
                <th>Description</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.map((tx, i) => {
                const userName = tx.user?.fullName || tx.userId?.fullName || 'N/A';
                const userPhone = tx.user?.phone || tx.userId?.phone || 'N/A';
                return (
                  <tr key={tx._id} className={i % 2 === 0 ? 'even' : 'odd'}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar small gold">
                          {userName[0]}
                        </div>
                        <span className="user-name">{userName}</span>
                      </div>
                    </td>
                    <td className="muted-cell">{userPhone}</td>
                    <td>
                      <span className="type-icon">{typeIcons[tx.type] || '📌'}</span>
                      <span className="type-label" style={{ color: typeColors[tx.type] || '#1a1a2e' }}>
                        {tx.type?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className={`amount-cell ${tx.direction === 'credit' ? 'credit' : 'debit'}`}>
                      {tx.direction === 'credit' ? '+' : '-'}{tx.amount} ETB
                    </td>
                    <td className="balance-cell">{tx.balanceAfter?.toFixed(0) || '—'} ETB</td>
                    <td className="muted-cell description">{tx.description || '—'}</td>
                    <td className="muted-cell date-cell">{new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-bar">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="page-btn"
          >
            ← Prev
          </button>
          <span className="page-info">Page {page} of {totalPages}</span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="page-btn"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}