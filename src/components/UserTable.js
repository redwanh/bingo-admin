import React from 'react';
import './UserTable.css';

export default function UserTable({ users, loading, onToggle, onAddBalance, userRole }) {
  if (loading) {
    return (
      <div className="table-loading">
        <div className="loading-spinner-small"></div>
        <span>Loading users...</span>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="table-empty">
        <span className="empty-icon">📭</span>
        <p className="empty-text">No users found</p>
        <p className="empty-subtext">Try adjusting your search or filters</p>
      </div>
    );
  }

  const isAdmin = userRole === 'superadmin' || userRole === 'admin';

  return (
    <div className="table-container">
      <div className="table-scroll">
        <table className="user-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Balance</th>
              <th>Status</th>
              {isAdmin && <th className="actions-col">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar-small">
                      {(user.fullName || 'U')[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="user-name">{user.fullName || 'Unknown'}</div>
                      <div className="user-email">{user.email || user.username || ''}</div>
                    </div>
                  </div>
                </td>
                <td className="phone-cell">{user.phone || '—'}</td>
                <td>
                  <span className={`role-badge role-${user.role || 'user'}`}>
                    {user.role || 'user'}
                  </span>
                </td>
                <td className="balance-cell">
                  <span className="balance-amount">
                    ${(user.balance || 0).toFixed(2)}
                  </span>
                </td>
                <td>
                  <button
                    className={`status-toggle ${user.isActive !== false ? 'active' : 'inactive'}`}
                    onClick={() => onToggle(user._id)}
                    disabled={!isAdmin}
                  >
                    {user.isActive !== false ? 'Active' : 'Inactive'}
                  </button>
                </td>
                {isAdmin && (
                  <td className="actions-col">
                    <button
                      className="action-btn add-balance"
                      onClick={() => onAddBalance(user)}
                    >
                      💰 Add Balance
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}