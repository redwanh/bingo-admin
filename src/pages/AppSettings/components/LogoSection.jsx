// pages/AppSettings/components/LogoSection.jsx
import React from 'react';

export default function LogoSection({ settings, colors, onUpdate, onUpload, uploading, token }) {
  const s = {
    label: { display: 'block', color: '#A0A0B8', fontSize: 12, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
    input: { width: '100%', padding: 12, background: '#0f3460', color: '#fff', border: '1px solid #333', borderRadius: 10, fontSize: 14 },
  };

  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ background: '#0f3460', padding: 24, borderRadius: 16, textAlign: 'center', minWidth: 160 }}>
        <p style={{ fontSize: 11, color: '#888', marginBottom: 12 }}>CURRENT LOGO</p>
        {settings.logoType === 'image' && settings.logo ? (
          <img src={(process.env.REACT_APP_API_URL || 'http://localhost:5000/api') + settings.logo} alt="Logo"
            style={{ width: 80, height: 80, borderRadius: 16, objectFit: 'contain', background: '#0f3460' }} />
        ) : (
          <div style={{
            width: 80, height: 80, borderRadius: 16, margin: '0 auto',
            background: 'linear-gradient(135deg,' + colors.primaryColor + ',' + colors.secondaryColor + ')',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, color: '#fff',
          }}>
            {settings.logoText || '??'}
          </div>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 250 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[{ type: 'emoji', label: '?? Emoji', icon: '??' }, { type: 'text', label: '?? Text', icon: 'B' }, { type: 'image', label: '??? Image', icon: '???' }].map(opt => (
            <button key={opt.type} onClick={() => onUpdate('logoType', opt.type)} style={{
              flex: 1, padding: 12, borderRadius: 10,
              border: '2px solid ' + (settings.logoType === opt.type ? '#FFD700' : '#333'),
              background: settings.logoType === opt.type ? 'rgba(255,215,0,0.08)' : 'transparent',
              color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600,
            }}>{opt.icon} {opt.label}</button>
          ))}
        </div>

        {settings.logoType === 'emoji' && (
          <div style={{ marginBottom: 16 }}>
            <label style={s.label}>Choose Emoji</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['??','??','??','??','?','??','??','??','??','??','??','??'].map(emoji => (
                <button key={emoji} onClick={() => onUpdate('logoText', emoji)} style={{
                  width: 44, height: 44, borderRadius: 10,
                  border: '2px solid ' + (settings.logoText === emoji ? '#FFD700' : '#333'),
                  background: settings.logoText === emoji ? 'rgba(255,215,0,0.1)' : 'transparent',
                  fontSize: 22, cursor: 'pointer',
                }}>{emoji}</button>
              ))}
            </div>
          </div>
        )}

        {settings.logoType === 'text' && (
          <div style={{ marginBottom: 16 }}>
            <label style={s.label}>Logo Text (1-3 chars)</label>
            <input style={{ ...s.input, width: 100, fontSize: 24, textAlign: 'center', fontWeight: 800 }}
              value={settings.logoText} maxLength={3}
              onChange={e => onUpdate('logoText', e.target.value)} />
          </div>
        )}

        {settings.logoType === 'image' && (
          <div style={{ marginBottom: 16 }}>
            <label style={s.label}>Upload Logo Image</label>
            <input type="file" accept="image/*" onChange={onUpload} style={{ color: '#fff', fontSize: 13 }} />
            {uploading && <p style={{ color: '#FFD700', fontSize: 12, marginTop: 8 }}>Uploading...</p>}
            <p style={{ color: '#666', fontSize: 10, marginTop: 4 }}>PNG, JPG, WebP, SVG • Max 5MB</p>
          </div>
        )}
      </div>
    </div>
  );
}
