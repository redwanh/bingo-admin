// pages/AppSettings/index.js
import React, { useState } from 'react';
import { useAppSettingsData } from './hooks/useAppSettingsData';
import { DARK_PRESETS, LIGHT_PRESETS } from '../../data/themes';
import ThemeCard from './components/ThemeCard';
import LogoSection from './components/LogoSection';
import LanguageSection from './components/LanguageSection';

export default function AppSettings() {
  const [activeTab, setActiveTab] = useState('presets');
  const {
    settings, loading, saving, uploading, colors,
    applyPreset, handleLogoUpload, handleSave, updateField,
  } = useAppSettingsData();

  if (loading) return <div style={{ textAlign: 'center', padding: 50 }}>Loading...</div>;

  const s = {
    card: { background: '#16213e', borderRadius: 16, padding: 24, marginBottom: 20, border: '1px solid rgba(255,255,255,0.06)' },
    cardTitle: { fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#FFD700' },
    btn: { padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14 },
    btnPrimary: { background: '#FFD700', color: '#1a1a2e' },
    btnOutline: { background: 'transparent', color: '#FFD700', border: '2px solid #FFD700' },
    input: { width: '100%', padding: 12, background: '#0f3460', color: '#fff', border: '1px solid #333', borderRadius: 10, fontSize: 14 },
    label: { display: 'block', color: '#A0A0B8', fontSize: 12, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
    tab: { padding: '10px 20px', border: 'none', background: 'transparent', color: '#A0A0B8', cursor: 'pointer', fontSize: 14, fontWeight: 600, borderBottom: '2px solid transparent' },
    tabActive: { color: '#FFD700', borderBottomColor: '#FFD700' },
  };

  const tabs = [
    { key: 'presets', label: '🎨 Themes' },
    { key: 'identity', label: '🏷️ Identity' },
    { key: 'logo', label: '🖼️ Logo' },
    { key: 'language', label: '🌍 Language' },
  ];

  return (
    <>
      <h1 style={{ marginBottom: 5, fontSize: 28 }}>⚙️ Application Settings</h1>
      <p style={{ color: '#888', marginBottom: 25 }}>Control theme, identity, logo & language</p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            style={{ ...s.tab, ...(activeTab === tab.key ? s.tabActive : {}) }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Themes Tab */}
      {activeTab === 'presets' && (
        <>
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <button onClick={() => updateField('themeMode', 'dark')}
              style={{ ...s.btn, ...(settings.themeMode === 'dark' ? s.btnPrimary : s.btnOutline) }}>
              🌙 Dark Themes
            </button>
            <button onClick={() => updateField('themeMode', 'light')}
              style={{ ...s.btn, ...(settings.themeMode === 'light' ? s.btnPrimary : s.btnOutline) }}>
              ☀️ Light Themes
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 14 }}>
            {(settings.themeMode === 'dark' ? DARK_PRESETS : LIGHT_PRESETS).map(preset => (
              <ThemeCard key={preset.id} preset={preset} mode={settings.themeMode}
                isActive={settings.activePreset === preset.id}
                onApply={applyPreset} />
            ))}
          </div>
        </>
      )}

      {/* Identity Tab */}
      {activeTab === 'identity' && (
        <div style={s.card}>
          <h3 style={s.cardTitle}>🏷️ Application Identity</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: 'App Name (English)', field: 'appName', placeholder: 'Lucky Night Bingo' },
              { label: 'App Name (አማርኛ)', field: 'appNameAm', placeholder: 'ላኪ ናይት ቢንጎ' },
              { label: 'App Name (ትግርኛ)', field: 'appNameTg', placeholder: 'ለኪ ናይት ቢንጎ' },
            ].map(f => (
              <div key={f.field}>
                <label style={s.label}>{f.label}</label>
                <input style={s.input} value={settings[f.field] || ''}
                  onChange={e => updateField(f.field, e.target.value)} placeholder={f.placeholder} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logo Tab */}
      {activeTab === 'logo' && (
        <div style={s.card}>
          <h3 style={s.cardTitle}>🖼️ Logo</h3>
          <LogoSection settings={settings} colors={colors}
            onUpdate={updateField} onUpload={handleLogoUpload} uploading={uploading} />
        </div>
      )}

      {/* Language Tab */}
      {activeTab === 'language' && (
        <div style={s.card}>
          <h3 style={s.cardTitle}>🌍 Default Language</h3>
          <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>Select the default language for the player app</p>
          <LanguageSection defaultLanguage={settings.defaultLanguage} onUpdate={updateField} />
        </div>
      )}

      {/* Save Button */}
      <button onClick={handleSave} disabled={saving} style={{
        width: '100%', padding: 16, border: 'none', borderRadius: 14,
        background: saving ? '#555' : 'linear-gradient(135deg, #FFD700, #FF8C00)',
        color: saving ? '#999' : '#1a1a2e', fontSize: 16, fontWeight: 700,
        cursor: saving ? 'wait' : 'pointer', marginTop: 20,
      }}>
        {saving ? '💾 Saving...' : '💾 SAVE ALL SETTINGS'}
      </button>
    </>
  );
}