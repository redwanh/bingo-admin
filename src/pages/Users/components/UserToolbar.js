import React from 'react';
import './UserToolbar.css';

export default function UserToolbar({
  search,
  onSearch,
  totalUsers,
  roleFilter,
  onRoleFilter,
  statusFilter,
  onStatusFilter,
  sortBy,
  onSortBy,
}) {
  const roles = ['all', 'user', 'admin', 'superadmin'];
  const statuses = ['all', 'active', 'inactive'];

  return (
    <div className="toolbar-container">
      {/* Search */}
      <div className="toolbar-search">
        <span className="search-icon">🔍</span>
        <input
          className="search-input"
          type="text"
          placeholder="Search by name, phone, or email..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
        {search && (
          <button className="search-clear" onClick={() => onSearch('')}>
            ✕
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="toolbar-filters">
        <div className="filter-group">
          <label className="filter-label">Role</label>
          <select
            className="filter-select"
            value={roleFilter}
            onChange={(e) => onRoleFilter(e.target.value)}
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Status</label>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => onStatusFilter(e.target.value)}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Sort</label>
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => onSortBy(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="name">Name A-Z</option>
            <option value="role">Role</option>
          </select>
        </div>
      </div>
    </div>
  );
}
