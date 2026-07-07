import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icons from './icons';
import { navItems } from './NavItems';
import { styles } from './AdminLayout.styles';

export default function Sidebar({ 
  isOpen, 
  onClose, 
  user, 
  onLogout,
  isMobile 
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = React.useState(null);
  const [logoutHovered, setLogoutHovered] = React.useState(false);
  const [loggingOut, setLoggingOut] = React.useState(false); // ← NEW

  const visibleItems = navItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role);
  });

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) onClose();
  };

  // 🔥 FIXED: Wait for logout to complete before redirecting
  const handleLogout = async () => {
    if (loggingOut) return; // Prevent double-click
    setLoggingOut(true);
    
    try {
      await onLogout(); // Wait for logout to complete
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoggingOut(false);
      onClose();
    }
  };

  const sidebarStyle = {
    ...styles.sidebar,
    ...(isMobile ? {
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
      zIndex: 999,
    } : {}),
  };

  return (
    <aside style={sidebarStyle}>
      <div style={styles.sidebarContent}>
        {/* Logo */}
        <div style={styles.sidebarLogo}>
          <span style={styles.logoIcon}>🎯</span>
          <span style={{ ...styles.logoText, color: '#000000' }}>Bingo Admin</span>
        </div>

        {/* Navigation */}
        <nav style={styles.nav}>
          {visibleItems.map((item) => (
            <button
              key={item.path}
              style={{
                ...styles.navItem,
                ...(isActive(item.path) ? styles.navItemActive : {}),
                ...(hoveredItem === item.path && !isActive(item.path) ? styles.navItemHover : {}),
                ...(isActive(item.path) ? {
                  borderBottom: '1px solid rgba(0,0,0,0.1)',
                  borderTop: '1px solid rgba(0,0,0,0.1)',
                } : {}),
              }}
              onClick={() => handleNavigation(item.path)}
              onMouseEnter={() => setHoveredItem(item.path)}
              onMouseLeave={() => setHoveredItem(null)}
              aria-current={isActive(item.path) ? 'page' : undefined}
            >
              <span style={styles.navIcon}><item.icon /></span>
              <div style={styles.navLabel}>
                <span style={styles.navTitle}>{item.label}</span>
                <span style={styles.navDescription}>{item.description}</span>
              </div>
              {isActive(item.path) && <span style={styles.navIndicator} />}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div style={styles.sidebarFooter}>
          <div style={styles.userProfile}>
            <div style={styles.userAvatar}>
              {(user?.fullName || 'A')[0].toUpperCase()}
            </div>
            <div style={styles.userInfo}>
              <p style={styles.userName}>{user?.fullName || 'Admin'}</p>
              <p style={styles.userRole}>{user?.role || 'admin'}</p>
            </div>
          </div>
          <button 
            style={{
              ...styles.logoutBtn,
              ...(logoutHovered ? styles.logoutBtnHover : {}),
              ...(loggingOut ? { opacity: 0.6, cursor: 'not-allowed' } : {}),
            }}
            onClick={handleLogout}
            onMouseEnter={() => setLogoutHovered(true)}
            onMouseLeave={() => setLogoutHovered(false)}
            disabled={loggingOut} // ← Disable while logging out
          >
            <Icons.Logout />
            <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}