// components/AdminLayout.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
  { icon: '📊', label: 'Dashboard', path: '/dashboard' },
    { icon: '👥', label: 'Users', path: '/users' },
    { icon: '💰', label: 'Transactions', path: '/transactions', roles: ['superadmin', 'admin', 'finance'] },
    { icon: '💳', label: 'Accounts', path: '/deposits', roles: ['superadmin', 'admin', 'finance'] },
    { icon: '🎮', label: 'Fast Bingo', path: '/game-config' },

    { icon: '🎯', label: 'Rules', path: '/main-bingo-rules' },
    { icon: '📡', label: 'Monitor', path: '/main-bingo-monitor' },
    { icon: '🔊', label: 'Voice', path: '/voice-manager' },
    { icon: '📋', label: 'History', path: '/game-monitor' },


    { icon: '⚙️', label: 'Settings', path: '/app-settings', roles: ['superadmin', 'admin'] },
    
    { icon: '**', label: 'CMS', path: '/cms', roles: ['superadmin', 'admin'] },

  ];

  // Filter nav items by role
  const visibleItems = navItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role);
  });

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Outfit, Inter, sans-serif' }}>
      {/* SIDEBAR */}
      <aside style={{
        width: 250, minWidth: 250, background: '#16213e', padding: '20px 0',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        position: 'sticky', top: 0, height: '100vh', overflowY: 'auto'
      }}>
        <div style={{ padding: '0 20px' }}>
          {/* Logo */}
          <h2 style={{
            color: '#FFD700', marginBottom: 24, fontSize: 20, fontWeight: 800,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8
          }} onClick={() => navigate('/dashboard')}>
            ?? Bingo Admin
          </h2>

          {/* Navigation */}
          <nav>
            {visibleItems.map(item => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', padding: '12px 14px', marginBottom: 4,
                  background: isActive(item.path) ? 'rgba(255,215,0,0.12)' : 'transparent',
                  color: isActive(item.path) ? '#FFD700' : '#A0A0B8',
                  border: 'none', borderRadius: 10, cursor: 'pointer',
                  fontSize: 14, fontWeight: isActive(item.path) ? 600 : 400,
                  textAlign: 'left', transition: 'all 0.15s'
                }}
              >
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span>{item.label}</span>
                {isActive(item.path) && (
                  <div style={{
                    marginLeft: 'auto', width: 4, height: 4,
                    borderRadius: '50%', background: '#FFD700'
                  }} />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* User + Logout */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '16px 20px', marginTop: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#1a1a2e', fontWeight: 800, fontSize: 14
            }}>
              {(user?.fullName || 'A')[0].toUpperCase()}
            </div>
            <div>
              <p style={{ color: '#fff', fontSize: 13, fontWeight: 600, margin: 0 }}>
                {user?.fullName || 'Admin'}
              </p>
              <p style={{ color: '#888', fontSize: 11, margin: '2px 0 0' }}>
                {user?.role || 'admin'}
              </p>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            style={{
              width: '100%', padding: 10,
              background: 'rgba(255,255,255,0.04)',
              color: '#FF6B6B', border: '1px solid rgba(255,107,107,0.2)',
              borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500,
              transition: 'all 0.15s'
            }}
          >
            ?? Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{
        flex: 1, padding: 30, background: '#0f0f1a',
        color: '#fff', overflowY: 'auto', minHeight: '100vh'
      }}>
        {children}
      </main>
    </div>
  );
}





