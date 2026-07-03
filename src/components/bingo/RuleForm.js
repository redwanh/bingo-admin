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
    transition: 'border-color 0.2s',
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
  },
};

export default function RuleForm({ editingRule, form, onChange, onSave, onClose }) {
  
  // Handler to split multi-language fields from ruleConfig
  const handleConfigChange = (newConfig) => {
    // Extract multi-language fields
    const {
      nameAmharic, nameTigrinya, nameOromo, nameChinese, nameEnglish,
      descriptionAmharic, descriptionTigrinya, descriptionOromo, 
      descriptionChinese, descriptionEnglish,
      ...ruleConfigOnly
    } = newConfig;

    onChange({
      ...form,
      // Save language fields at form level (where API expects them)
      nameAmharic: nameAmharic || '',
      nameTigrinya: nameTigrinya || '',
      nameOromo: nameOromo || '',
      nameChinese: nameChinese || '',
      nameEnglish: nameEnglish || '',
      descriptionAmharic: descriptionAmharic || '',
      descriptionTigrinya: descriptionTigrinya || '',
      descriptionOromo: descriptionOromo || '',
      descriptionChinese: descriptionChinese || '',
      descriptionEnglish: descriptionEnglish || '',
      // Save only the actual rule config without language fields
      ruleConfig: ruleConfigOnly,
    });
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        
        <h2 style={styles.title}>
          {editingRule ? '✎ Edit Rule' : '✨ Create New Rule'}
        </h2>
        
        <label style={styles.label}>Rule Name *</label>
        <input 
          value={form.name} 
          onChange={e => onChange({ ...form, name: e.target.value })} 
          placeholder="e.g., Triple Bingo" 
          style={styles.input} 
        />
        
        <label style={styles.label}>Description</label>
        <input 
          value={form.description} 
          onChange={e => onChange({ ...form, description: e.target.value })} 
          placeholder="Describe this rule..." 
          style={styles.input} 
        />
        
        <label style={styles.label}>Method</label>
        <select 
          value={form.method} 
          onChange={e => onChange({ ...form, method: e.target.value })} 
          style={styles.select}
        >
          <option value="rule">Rule-Based</option>
          <option value="pattern">Pattern-Based</option>
        </select>
        
        <RuleConfigForm 
          config={{
            ...form.ruleConfig,
            // Pass language fields back into config so RuleConfigForm can edit them
            nameAmharic: form.nameAmharic,
            nameTigrinya: form.nameTigrinya,
            nameOromo: form.nameOromo,
            nameChinese: form.nameChinese,
            nameEnglish: form.nameEnglish,
            descriptionAmharic: form.descriptionAmharic,
            descriptionTigrinya: form.descriptionTigrinya,
            descriptionOromo: form.descriptionOromo,
            descriptionChinese: form.descriptionChinese,
            descriptionEnglish: form.descriptionEnglish,
          }}
          onChange={handleConfigChange}
          patterns={form.patterns || []}
          method={form.method}
        />
        
        <button onClick={onSave} style={styles.saveBtn}>
          💾 {editingRule ? 'Update Rule' : 'Create Rule'}
        </button>
      </div>
    </div>
  );
}