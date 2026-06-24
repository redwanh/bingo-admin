// pages/Users/components/UserToolbar.jsx
import React from 'react';

export default function UserToolbar({
  search, onSearch, totalUsers,
  roleFilter, onRoleFilter,
  statusFilter, onStatusFilter,
  sortBy, onSortBy,
}) {
  const btnStyle = (active) => ({
    padding: '8px 16px', borderRadius: 8, border: 'none',
    background: active ? 'rgba(255,215,0,0.12)' : 'transparent',
    color: active ? '#FFD700' : '#A0A0B8',
    fontWeight: active ? 700 : 500, fontSize: 12, cursor: 'pointer',
    transition: 'all 0.15s',
  });

  return (
    <div style={{ marginBottom: 20 }}>
      {/* Search + Stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>
            🔍
          </span>
          <input
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Search by name, phone, or username..."
            style={{
              width: '100%', padding: '14px 16px 14px 44px',
              borderRadius: 12, border: '2px solid rgba(255,255,255,0.08)',
              background: '#16213e', color: '#fff', fontSize: 14,
              outline: 'none', transition: 'border-color 0.2s',
              boxSizing: 'border-box',
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#FFD700'}
            onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
          />
        </div>
        <div style={{
          padding: '10px 16px', borderRadius: 12, background: '#16213e',
          border: '1px solid rgba(255,255,255,0.06)', color: '#FFD700',
          fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap',
        }}>
          {totalUsers} users
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ color: '#666', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
          Role:
        </span>
        {['all', 'superadmin', 'admin', 'finance', 'game', 'user'].map(r => (
          <button key={r} onClick={() => onRoleFilter(r)} style={btnStyle(roleFilter === r)}>
            {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
          </button>
        ))}

        <span style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)', margin: '0 4px' }} />

        <span style={{ color: '#666', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
          Status:
        </span>
        {['all', 'active', 'blocked'].map(s => (
          <button key={s} onClick={() => onStatusFilter(s)} style={btnStyle(statusFilter === s)}>
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}

        <span style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)', margin: '0 4px' }} />

        <span style={{ color: '#666', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
          Sort:
        </span>
        {[
          { key: 'newest', label: 'Newest' },
          { key: 'oldest', label: 'Oldest' },
          { key: 'name', label: 'Name' },
          { key: 'balance', label: 'Balance' },
        ].map(s => (
          <button key={s.key} onClick={() => onSortBy(s.key)} style={btnStyle(sortBy === s.key)}>
            {s.label} {sortBy === s.key ? '↓' : ''}
          </button>
        ))}
      </div>
    </div>
  );
}

