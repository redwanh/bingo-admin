// pages/Users/index.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUsers } from './hooks/useUsers';
import UserToolbar from './components/UserToolbar';
import UserTable from './components/UserTable';
import BalanceModal from './components/BalanceModal';
import Pagination from './components/Pagination';

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
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h1 style={{ margin: 0, fontSize: 28 }}>👥 User Management</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{
            padding: '8px 16px', borderRadius: 10, background: '#16213e',
            border: '1px solid rgba(255,255,255,0.06)', color: '#FFD700',
            fontWeight: 700, fontSize: 13,
          }}>
            Total: {totalUsers}
          </div>
        </div>
      </div>

      <UserToolbar
        search={search} onSearch={handleSearch}
        totalUsers={totalUsers}
        roleFilter={roleFilter} onRoleFilter={setRoleFilter}
        statusFilter={statusFilter} onStatusFilter={setStatusFilter}
        sortBy={sortBy} onSortBy={setSortBy}
      />

      <UserTable
        users={users}
        loading={loading}
        onToggle={toggleStatus}
        onAddBalance={setSelectedUser}
        userRole={authUser?.role}
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {selectedUser && (
        <BalanceModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSuccess={fetchUsers}
        />
      )}
    </>
  );
}

