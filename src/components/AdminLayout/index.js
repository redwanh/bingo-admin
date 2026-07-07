import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import { styles } from './AdminLayout.styles';

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [touchStart, setTouchStart] = useState(null);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Swipe handlers
  const handleTouchStart = useCallback((e) => {
    setTouchStart(e.touches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (!touchStart) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (diff > 50) setIsMobileMenuOpen(false);
    setTouchStart(null);
  }, [touchStart]);

  const handleLogout = () => {
  
  localStorage.clear();
  sessionStorage.clear();

  logout();
  
  
  window.location.replace('/login');
};

  return (
    <div style={styles.layout}>
      {/* Mobile Header */}
      <MobileHeader
        isMenuOpen={isMobileMenuOpen}
        onToggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        user={user}
      />

      {/* Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div
          style={{ ...styles.overlay, display: 'block' }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Sidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          user={user}
          onLogout={handleLogout}
          isMobile={isMobile}
        />
      </div>

      {/* Main Content */}
      <main style={{
        ...styles.mainContent,
        ...(isMobile ? { paddingTop: '56px' } : {}),
      }}>
        <div style={{
          ...styles.contentWrapper,
          ...(isMobile ? { padding: '16px' } : {}),
        }}>
          {children}
        </div>
      </main>
    </div>
  );
}