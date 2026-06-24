// pages/Users/components/UserTable.jsx
import React from 'react';

const StatusBadge = ({ isActive }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700,
    background: isActive ? 'rgba(46,213,115,0.12)' : 'rgba(255,71,87,0.12)',
    color: isActive ? '#2ED573' : '#FF4757',
    border: '1px solid ' + (isActive ? 'rgba(46,213,115,0.3)' : 'rgba(255,71,87,0.3)'),
  }}>
    <span style={{ width: 6, height: 6, borderRadius: '50%', background: isActive ? '#2ED573' : '#FF4757' }} />
    {isActive ? 'Active' : 'Blocked'}
  </span>
);

const RoleBadge = ({ role }) => {
  const colors = {
    superadmin: { bg: 'rgba(255,215,0,0.12)', color: '#FFD700', border: 'rgba(255,215,0,0.3)', icon: '👑' },
    admin: { bg: 'rgba(124,92,252,0.12)', color: '#7C5CFC', border: 'rgba(124,92,252,0.3)', icon: '⚙️' },
    finance: { bg: 'rgba(46,213,115,0.12)', color: '#2ED573', border: 'rgba(46,213,115,0.3)', icon: '💰' },
    game: { bg: 'rgba(0,180,216,0.12)', color: '#00B4D8', border: 'rgba(0,180,216,0.3)', icon: '🎮' },
    user: { bg: 'rgba(160,160,184,0.12)', color: '#A0A0B8', border: 'rgba(160,160,184,0.3)', icon: '👤' },
  };
  const c = colors[role] || colors.user;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700,
      background: c.bg, color: c.color, border: '1px solid ' + c.border,
      textTransform: 'capitalize',
    }}>
      <span style={{ fontSize: 13 }}>{c.icon}</span>
      {role}
    </span>
  );
};

const SkeletonRow = () => (
  <div style={{ display: 'flex', padding: '16px 20px', borderBottom: '1px solid #0f3460', alignItems: 'center', gap: 12 }}>
    {[1,2,3,4,5,6].map(i => (
      <div key={i} style={{ flex: i <= 3 ? 2 : 1, height: 16, background: '#1a2940', borderRadius: 8, animation: 'pulse 1.5s infinite' }} />
    ))}
  </div>
);

export default function UserTable({ users, loading, onToggle, onAddBalance, userRole }) {
  const canManageBalance = userRole === 'superadmin' || userRole === 'admin' || userRole === 'finance';

  return (
    <div style={{
      background: '#16213e', borderRadius: 16, overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.06)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', padding: '16px 20px',
        background: 'linear-gradient(180deg, #1a2940 0%, #16213e 100%)',
        fontWeight: 700, fontSize: 12, color: '#A0A0B8',
        textTransform: 'uppercase', letterSpacing: 0.5,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <span style={{ flex: 2 }}>User</span>
        <span style={{ flex: 1.5 }}>Phone</span>
        <span style={{ flex: 1 }}>Role</span>
        <span style={{ flex: 1 }}>Status</span>
        <span style={{ flex: 1, textAlign: 'right' }}>Balance</span>
        <span style={{ width: 100, textAlign: 'center' }}>Actions</span>
      </div>

      {/* Loading */}
      {loading && (
        <>
          <SkeletonRow /><SkeletonRow /><SkeletonRow /><SkeletonRow />
        </>
      )}

      {/* Empty */}
      {!loading && users.length === 0 && (
        <div style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👻</div>
          <p style={{ color: '#A0A0B8', fontSize: 15, fontWeight: 600, margin: '0 0 4px' }}>No users found</p>
          <p style={{ color: '#666', fontSize: 13, margin: 0 }}>Try adjusting your search or filters</p>
        </div>
      )}

      {/* Rows */}
      {users.map((u, i) => (
        <div key={u._id} style={{
          display: 'flex', padding: '14px 20px', alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.03)',
          background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
          transition: 'background 0.15s',
        }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(255,215,0,0.03)'}
          onMouseOut={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'}
        >
          {/* User Info */}
          <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#1a1a2e', fontWeight: 800, fontSize: 15,
              boxShadow: '0 3px 10px rgba(255,215,0,0.15)',
            }}>
              {(u.fullName || 'U')[0].toUpperCase()}
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 14, color: '#fff', margin: 0 }}>
                {u.fullName || 'Unknown'}
              </p>
              <p style={{ fontSize: 11, color: '#666', margin: '2px 0 0' }}>
                @{u.username || 'user'}
              </p>
            </div>
          </div>

          {/* Phone */}
          <span style={{ flex: 1.5, fontSize: 13, color: '#A0A0B8', fontFamily: 'monospace', fontWeight: 500 }}>
            {u.phone}
          </span>

          {/* Role */}
          <span style={{ flex: 1 }}><RoleBadge role={u.role} /></span>

          {/* Status */}
          <span style={{ flex: 1 }}><StatusBadge isActive={u.isActive} /></span>

          {/* Balance */}
          <span style={{
            flex: 1, textAlign: 'right', fontWeight: 700, fontSize: 14,
            color: u.walletBalance > 0 ? '#2ED573' : '#A0A0B8',
            fontFamily: 'monospace',
          }}>
            {u.walletBalance?.toFixed(0) || '0'} ETB
          </span>

          {/* Actions */}
          <div style={{ width: 100, display: 'flex', justifyContent: 'center', gap: 6 }}>
            {canManageBalance && (
              <button
                onClick={() => onAddBalance(u)}
                title="Add balance"
                style={{
                  width: 36, height: 36, borderRadius: 10, border: 'none',
                  background: 'rgba(255,215,0,0.1)', color: '#FFD700',
                  cursor: 'pointer', fontSize: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,215,0,0.2)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,215,0,0.1)'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                💰
              </button>
            )}
            <button
              onClick={() => onToggle(u._id, u.isActive, u.fullName)}
              title={u.isActive ? 'Block user' : 'Activate user'}
              style={{
                width: 36, height: 36, borderRadius: 10, border: 'none',
                background: u.isActive ? 'rgba(255,71,87,0.1)' : 'rgba(46,213,115,0.1)',
                color: u.isActive ? '#FF4757' : '#2ED573',
                cursor: 'pointer', fontSize: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = u.isActive ? 'rgba(255,71,87,0.2)' : 'rgba(46,213,115,0.2)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = u.isActive ? 'rgba(255,71,87,0.1)' : 'rgba(46,213,115,0.1)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {u.isActive ? '🔒' : '🔓'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
