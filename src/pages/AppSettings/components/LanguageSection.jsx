// pages/AppSettings/components/LanguageSection.jsx
import React from 'react';
import { LANGUAGES } from '../../../data/themes';

export default function LanguageSection({ defaultLanguage, onUpdate }) {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      {LANGUAGES.map(lang => (
        <button key={lang.code} onClick={() => onUpdate('defaultLanguage', lang.code)} style={{
          flex: 1, padding: 20, borderRadius: 14,
          border: '2px solid ' + (defaultLanguage === lang.code ? '#FFD700' : '#333'),
          background: defaultLanguage === lang.code ? 'rgba(255,215,0,0.08)' : '#16213e',
          color: '#fff', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
        }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>{lang.flag}</div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{lang.name}</div>
          {defaultLanguage === lang.code && (
            <div style={{ color: '#FFD700', fontSize: 12, marginTop: 4 }}>✅ Default</div>
          )}
        </button>
      ))}
    </div>
  );
}
