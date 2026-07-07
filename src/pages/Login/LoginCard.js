import React from 'react';
import { styles } from './login.styles';

export default function LoginCard({ children }) {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>🎯</div>
          <h1 style={styles.title}>Admin Login</h1>
          <p style={styles.subtitle}>Sign in to your dashboard</p>
        </div>
        {children}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}