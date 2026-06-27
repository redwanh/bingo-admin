import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUsers } from './hooks/useUsers';
import UserToolbar from './components/UserToolbar';
import UserTable from './components/UserTable';
import BalanceModal from './components/BalanceModal';
import Pagination from './components/Pagination';
import './Users.css';

export default function Users() {
  const { user: authUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);

  const {
    users, search, page, totalPages, totalUsers, loading,
    roleFilter, statusFilter, sortBy,
    setPage, handleSearch, setRoleFilter, setStatusFilter, setSortBy,
    toggleStatus, fetchUsers,
  } = useUsers();

  return (
    <div className="users-container">
      {/* Header */}
      <div className="users-header">
        <div className="users-title-group">
          <h1 className="users-title">👥 User Management</h1>
          <span className="users-subtitle">Manage and monitor all platform users</span>
        </div>
        <div className="users-stats">
          <div className="users-stat-badge">
            <span className="stat-number">{totalUsers}</span>
            <span className="stat-label">Total Users</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <UserToolbar
        search={search}
        onSearch={handleSearch}
        totalUsers={totalUsers}
        roleFilter={roleFilter}
        onRoleFilter={setRoleFilter}
        statusFilter={statusFilter}
        onStatusFilter={setStatusFilter}
        sortBy={sortBy}
        onSortBy={setSortBy}
      />

      {/* Table */}
      <UserTable
        users={users}
        loading={loading}
        onToggle={toggleStatus}
        onAddBalance={setSelectedUser}
        userRole={authUser?.role}
      />

      {/* Pagination */}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Modal */}
      {selectedUser && (
        <BalanceModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSuccess={fetchUsers}
        />
      )}
    </div>
  );
}
