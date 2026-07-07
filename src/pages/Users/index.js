import React, { useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUsers } from './hooks/useUsers';
import UserToolbar from './components/UserToolbar';
import UserTable from './components/UserTable';
import BalanceModal from './components/BalanceModal';
import Pagination from './components/Pagination';
import './UsersNew.css';

export default function Users() {
  const { user: authUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);

  const {
    users,
    search,
    page,
    totalPages,
    totalUsers,
    loading,
    roleFilter,
    statusFilter,
    sortBy,
    setPage,
    handleSearch,
    setRoleFilter,
    setStatusFilter,
    setSortBy,
    toggleStatus,
    addBalance,
    fetchUsers,
  } = useUsers();

  const canManageUsers = ['admin', 'superadmin'].includes(authUser?.role);

  const handleAddBalance = useCallback((user) => setSelectedUser(user), []);
  const handleBalanceSuccess = useCallback(() => { setSelectedUser(null); fetchUsers(); }, [fetchUsers]);
  const handleCloseModal = useCallback(() => setSelectedUser(null), []);

  return (
    <div className="um-container">
      <div className="um-header">
        <div>
          <h1 className="um-title">User Management</h1>
          <span className="um-subtitle">Total {totalUsers} registered user{totalUsers !== 1 ? 's' : ''}</span>
        </div>
        <div className="um-stat-badge">
          <span className="um-stat-number">{totalUsers}</span>
          <span className="um-stat-label">Total Users</span>
        </div>
      </div>

      <UserToolbar
        search={search}
        onSearch={handleSearch}
        roleFilter={roleFilter}
        onRoleFilter={setRoleFilter}
        statusFilter={statusFilter}
        onStatusFilter={setStatusFilter}
        sortBy={sortBy}
        onSortBy={setSortBy}
      />

      <UserTable
        users={users}
        loading={loading}
        onToggle={toggleStatus}
        onAddBalance={handleAddBalance}
        canManage={canManageUsers}
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {selectedUser && (
        <BalanceModal
          user={selectedUser}
          onClose={handleCloseModal}
          onSubmit={addBalance}
          onSuccess={handleBalanceSuccess}
        />
      )}
    </div>
  );
}