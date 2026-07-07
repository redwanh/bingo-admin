import React, { useState } from 'react';
import { styles } from './login.styles';

// Eye icons as simple SVG
const EyeOpen = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeClosed = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

export default function LoginInput({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  disabled, 
  error,
  autoComplete,
  icon,
  isPhone = false 
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  if (isPhone) {
    return (
      <div style={styles.inputGroup}>
        <label style={styles.label}>
          {icon && <span style={{ marginRight: '6px' }}>{icon}</span>}
          {label}
        </label>
        <div style={{
          ...styles.phoneInputContainer,
          ...(isFocused ? styles.phoneInputContainerFocus : {}),
          ...(error ? styles.phoneInputContainerError : {}),
        }}>
          <span style={styles.countryCode}>+251</span>
          <input
            style={styles.phoneInput}
            type="tel"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete={autoComplete}
            maxLength={9}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />
        </div>
        {error && <span style={styles.errorText}>{error}</span>}
      </div>
    );
  }

  const inputStyle = {
    ...styles.input,
    ...(isFocused ? styles.inputFocus : {}),
    ...(error ? styles.inputError : {}),
    ...(isPassword ? { paddingRight: '45px' } : {}),
  };

  return (
    <div style={styles.inputGroup}>
      <label style={styles.label}>
        {icon && <span style={{ marginRight: '6px' }}>{icon}</span>}
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          style={inputStyle}
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => e.target.style.color = '#666'}
            onMouseLeave={(e) => e.target.style.color = '#999'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOpen /> : <EyeClosed />}
          </button>
        )}
      </div>
      {error && <span style={styles.errorText}>{error}</span>}
    </div>
  );
}