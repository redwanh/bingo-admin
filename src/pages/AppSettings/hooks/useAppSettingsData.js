// pages/AppSettings/hooks/useAppSettingsData.js
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { DARK_PRESETS, LIGHT_PRESETS } from '../../../data/themes';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export function useAppSettingsData() {
  const { user, token } = useAuth();
  const [settings, setSettings] = useState({
    appName: 'Lucky Night Bingo', appNameAm: '?? ??? ???', appNameTg: '?? ??? ???',
    logo: null, logoText: '??', logoType: 'emoji',
    themeMode: 'dark', activePreset: 'midnight',
    dark: DARK_PRESETS[0].colors, light: LIGHT_PRESETS[0].colors,
    defaultLanguage: 'en',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const colors = settings.themeMode === 'dark' ? settings.dark : settings.light;

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(API + '/app-settings/config');
      if (res.data.settings) setSettings(prev => ({ ...prev, ...res.data.settings }));
    } catch (e) { toast.error('Failed to load settings'); }
    setLoading(false);
  };

  const applyPreset = async (preset, mode) => {
    try {
      const res = await axios.put(API + '/app-settings/apply-preset',
        { presetId: preset.id, mode },
        { headers: { Authorization: 'Bearer ' + token } }
      );
      setSettings(prev => ({ ...prev, ...res.data.settings, themeMode: mode, activePreset: preset.id }));
      toast.success('"' + preset.name + '" applied!');
    } catch (e) { toast.error('Failed to apply preset'); }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('logo', file);
    try {
      const res = await axios.post(API + '/app-settings/upload-logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: 'Bearer ' + token }
      });
      setSettings(prev => ({ ...prev, logo: res.data.logoUrl, logoType: 'image' }));
      toast.success('Logo uploaded!');
    } catch (e) { toast.error('Upload failed'); }
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(API + '/app-settings/config', settings,
        { headers: { Authorization: 'Bearer ' + token } }
      );
      
      // Save to localStorage for player app
      const appSettings = {
        companyName: settings.appName,
        logo: settings.logo,
        logoText: settings.logoText,
        logoType: settings.logoType,
        primaryColor: settings.dark?.primary || settings.light?.primary,
        secondaryColor: settings.dark?.secondary || settings.light?.secondary,
        headerBg: settings.dark?.headerBg || settings.light?.headerBg,
        headerTextColor: settings.dark?.headerTextColor || settings.light?.headerTextColor,
        accentColor: settings.dark?.accent || settings.light?.accent,
        backgroundColor: settings.dark?.background || settings.light?.background,
        cardBackground: settings.dark?.cardBg || settings.light?.cardBg,
        balanceLabel: 'ETB',
        defaultLanguage: settings.defaultLanguage
      };
      localStorage.setItem('appSettings', JSON.stringify(appSettings));
      
      toast.success('Settings saved!');
    } catch (e) { toast.error('Save failed'); }
    setSaving(false);
  };

  const updateField = (field, value) => setSettings(prev => ({ ...prev, [field]: value }));

  return {
    settings, loading, saving, uploading, colors,
    applyPreset, handleLogoUpload, handleSave, updateField,
  };
}


