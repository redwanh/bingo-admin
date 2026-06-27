import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

// Icons as components for better performance
const Icons = {
  Dashboard: () => <span className="icon">📊</span>,
  Users: () => <span className="icon">👥</span>,
  Transactions: () => <span className="icon">💰</span>,
  Deposits: () => <span className="icon">💳</span>,
  Game: () => <span className="icon">🎮</span>,
  Rules: () => <span className="icon">📋</span>,
  Monitor: () => <span className="icon">📡</span>,
  Voice: () => <span className="icon">🔊</span>,
  History: () => <span className="icon">📋</span>,
  Settings: () => <span className="icon">⚙️</span>,
  CMS: () => <span className="icon">📄</span>,
  Logout: () => <span className="icon">🚪</span>,
  Menu: () => <span className="icon menu-icon">☰</span>,
  Close: () => <span className="icon">✕</span>,
};

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { 
      icon: Icons.Dashboard, 
      label: 'Dashboard', 
      path: '/dashboard',
      description: 'Overview'
    },
    { 
      icon: Icons.Users, 
      label: 'Users', 
      path: '/users',
      description: 'Manage users',
      roles: ['superadmin', 'admin']
    },
    { 
      icon: Icons.Transactions, 
      label: 'Transactions', 
      path: '/transactions',
      description: 'Financial history',
      roles: ['superadmin', 'admin', 'finance']
    },
    { 
      icon: Icons.Deposits, 
      label: 'Accounts', 
      path: '/deposits',
      description: 'Account management',
      roles: ['superadmin', 'admin', 'finance']
    },
    { 
      icon: Icons.Game, 
      label: 'Fast Bingo', 
      path: '/game-config',
      description: 'Game configuration'
    },
    { 
      icon: Icons.Rules, 
      label: 'Rules', 
      path: '/main-bingo-rules',
      description: 'Game rules'
    },
    { 
      icon: Icons.Monitor, 
      label: 'Monitor', 
      path: '/main-bingo-monitor',
      description: 'Live monitoring'
    },
    { 
      icon: Icons.Voice, 
      label: 'Voice', 
      path: '/voice-manager',
      description: 'Voice management'
    },
    { 
      icon: Icons.History, 
      label: 'History', 
      path: '/game-monitor',
      description: 'Game history'
    },
    { 
      icon: Icons.Settings, 
      label: 'Settings', 
      path: '/app-settings',
      description: 'Application settings',
      roles: ['superadmin', 'admin']
    },
    { 
      icon: Icons.CMS, 
      label: 'CMS', 
      path: '/cms',
      description: 'Content management',
      roles: ['superadmin', 'admin']
    },
  ];

  const visibleItems = navItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role);
  });

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="admin-layout">
      {/* Mobile Header */}
      <header className="mobile-header">
        <button 
          className="menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <Icons.Close /> : <Icons.Menu />}
        </button>
        <div className="mobile-logo">
          <span className="logo-icon">🎯</span>
          <span className="logo-text">Bingo Admin</span>
        </div>
        <div className="mobile-user">
          <div className="user-avatar small">
            {(user?.fullName || 'A')[0].toUpperCase()}
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div className="sidebar-overlay" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          {/* Desktop Logo */}
          <div className="sidebar-logo desktop-only">
            <span className="logo-icon">🎯</span>
            <span className="logo-text">Bingo Admin</span>
          </div>

          {/* Navigation */}
          <nav className="sidebar-nav">
            {visibleItems.map((item) => (
              <button
                key={item.path}
                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => handleNavigation(item.path)}
              >
                <item.icon />
                <div className="nav-label">
                  <span className="nav-title">{item.label}</span>
                  <span className="nav-description">{item.description}</span>
                </div>
                {isActive(item.path) && <span className="nav-indicator" />}
              </button>
            ))}
          </nav>

          {/* User Profile & Logout */}
          <div className="sidebar-footer">
            <div className="user-profile">
              <div className="user-avatar">
                {(user?.fullName || 'A')[0].toUpperCase()}
              </div>
              <div className="user-info">
                <p className="user-name">{user?.fullName || 'Admin'}</p>
                <p className="user-role">{user?.role || 'admin'}</p>
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <Icons.Logout />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
}