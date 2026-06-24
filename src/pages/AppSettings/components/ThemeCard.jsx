// pages/AppSettings/components/ThemeCard.jsx
import React from 'react';

export default function ThemeCard({ preset, mode, isActive, onApply, token }) {
  const c = preset.colors;
  
  return (
    <div
      onClick={() => onApply(preset, mode)}
      style={{
        background: isActive ? '#1a2940' : '#16213e',
        borderRadius: 14, padding: 16, cursor: 'pointer',
        border: '2px solid ' + (isActive ? '#FFD700' : 'transparent'),
        transition: 'all 0.2s', textAlign: 'center',
      }}
    >
      <div style={{ display: 'flex', gap: 5, marginBottom: 12, justifyContent: 'center' }}>
        {[c.primaryColor, c.secondaryColor, c.headerBg, c.accentColor, c.cardBg].map((col, i) => (
          <div key={i} style={{
            width: 24, height: 24, borderRadius: 6,
            background: col, boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
          }} />
        ))}
      </div>
      <p style={{ fontWeight: 700, fontSize: 15, color: '#fff', margin: '0 0 2px' }}>
        {preset.name}
      </p>
      <p style={{ fontSize: 11, color: '#888', margin: 0 }}>
        {preset.am} / {preset.tg}
      </p>
      {isActive && (
        <p style={{ color: '#FFD700', fontSize: 11, marginTop: 6, fontWeight: 600 }}>
          ✅ Active
        </p>
      )}
    </div>
  );
}
