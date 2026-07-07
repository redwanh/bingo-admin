import React from 'react';
import { styles } from './login.styles';
import LoginInput from './LoginInput';

export default function LoginForm({ 
  phone, 
  setPhone, 
  password, 
  setPassword, 
  loading, 
  errors, 
  onSubmit 
}) {
  return (
    <form onSubmit={onSubmit} style={styles.form}>
      <LoginInput
        label="Phone Number"
        type="tel"
        value={phone}
        onChange={e => {
          // Only allow digits, max 9 characters
          const value = e.target.value.replace(/\D/g, '').slice(0, 9);
          setPhone(value);
        }}
        placeholder="912 345 678"
        disabled={loading}
        error={errors.phone}
        autoComplete="tel"
        icon="📱"
        isPhone={true}
      />
      
      <LoginInput
        label="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Enter your password"
        disabled={loading}
        error={errors.password}
        autoComplete="current-password"
        icon="🔒"
      />
      
      <button 
        style={{
          ...styles.button,
          ...(loading ? styles.buttonDisabled : {}),
        }}
        type="submit" 
        disabled={loading}
        onMouseEnter={e => {
          if (!loading) Object.assign(e.target.style, styles.buttonHover);
        }}
        onMouseLeave={e => {
          if (!loading) {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }
        }}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}