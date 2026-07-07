import React from 'react';
import Icons from './icons';
import { styles } from './AdminLayout.styles';

export default function MobileHeader({ 
  isMenuOpen, 
  onToggleMenu, 
  user 
}) {
  return (
    <header style={{
      ...styles.mobileHeader,
      ...(window.innerWidth <= 768 ? { display: 'flex' } : { display: 'none' })
    }}>
      <button 
        style={styles.menuToggle}
        onClick={onToggleMenu}
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
      >
        {isMenuOpen ? <Icons.Close /> : <Icons.Menu />}
      </button>
      
      <div style={styles.mobileLogo}>
        <span style={styles.logoIcon}>🎯</span>
        <span style={styles.logoText}>Bingo Admin</span>
      </div>
      
      <div style={styles.mobileAvatar} title={user?.fullName}>
        {(user?.fullName || 'A')[0].toUpperCase()}
      </div>
    </header>
  );
}