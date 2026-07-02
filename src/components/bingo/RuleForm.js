import React from 'react';
import RuleConfigForm from './RuleConfigForm';

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  modal: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '30px',
    maxWidth: '750px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    border: '2px solid #000000',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
    position: 'relative',
    zIndex: 201,
  },
  title: {
    margin: '0 0 20px 0',
    fontSize: '22px',
    fontWeight: 700,
    color: '#1a1a2e',
  },
  label: {
    fontSize: '12px',
    color: '#6b7280',
    display: 'block',
    marginBottom: '6px',
    marginTop: '12px',
    fontWeight: 500,
  },
  input: {
    width: '100%',
    padding: '12px',
    background: '#f9fafb',
    color: '#1a1a2e',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '12px',
    background: '#f9fafb',
    color: '#1a1a2e',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  saveBtn: {
    width: '100%',
    marginTop: '24px',
    padding: '14px',
    background: 'linear-gradient(135deg, #d4af37, #b8962f)',
    color: '#fff',
    border: '2px solid #000000',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '15px',
    boxShadow: '0 4px 16px rgba(212,175,55,0.25)',
    transition: 'all 0.3s ease',
    position: 'relative',
    zIndex: 202,
  },
  closeBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '2px solid #e5e7eb',
    background: '#fff',
    color: '#6b7280',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 203,
  },
};

export default function RuleForm({ editingRule, form, onChange, onSave, onClose }) {
  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('💾 [SAVE] Button clicked');
    onSave();
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        
        {/* Close button */}
        <button style={styles.closeBtn} onClick={onClose}>✕</button>
        
        <h2 style={styles.title}>
          {editingRule ? '✎ Edit Rule' : '✨ Create New Rule'}
        </h2>
        
        <label style={styles.label}>Rule Name *</label>
        <input 
          value={form.name || ''} 
          onChange={e => onChange({ ...form, name: e.target.value })} 
          placeholder="e.g., Triple Bingo" 
          style={styles.input} 
        />
        
        <label style={styles.label}>Description</label>
        <input 
          value={form.description || ''} 
          onChange={e => onChange({ ...form, description: e.target.value })} 
          placeholder="Describe this rule..." 
          style={styles.input} 
        />
        
        <label style={styles.label}>Method</label>
        <select 
          value={form.method || 'rule'} 
          onChange={e => onChange({ ...form, method: e.target.value })} 
          style={styles.select}
        >
          <option value="rule">Rule-Based</option>
          <option value="pattern">Pattern-Based</option>
        </select>
        
        <RuleConfigForm 
  config={form.ruleConfig || {}}
  onChange={(newConfig) => {
    // Just pass everything through - let the parent handle it
    onChange({ 
      ...form, 
      ruleConfig: newConfig,
      patterns: newConfig.patterns || form.patterns || []
    });
  }}
  patterns={form.patterns || []}
  method={form.method || 'rule'}
/>
        
        <button onClick={handleSave} style={styles.saveBtn}>
          💾 {editingRule ? 'Update Rule' : 'Create Rule'}
        </button>
      </div>
    </div>
  );
}