import React from 'react';
import RuleConfigForm from './RuleConfigForm';

const labelStyle = {
  fontSize: 12, color: '#888', display: 'block', marginBottom: 6, marginTop: 12
};

const inputStyle = {
  width: '100%', padding: 12, background: '#0f3460', color: '#fff', 
  border: '1px solid #333', borderRadius: 8, fontSize: 14, outline: 'none'
};

export default function RuleForm({ editingRule, form, onChange, onSave, onClose }) {
  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      background: 'rgba(0,0,0,0.9)', zIndex: 200, 
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 
    }} onClick={onClose}>
      <div style={{ 
        background: '#16213e', borderRadius: 20, padding: 30, 
        maxWidth: 750, width: '100%', maxHeight: '90vh', overflowY: 'auto', 
        border: '1px solid #1a1a3e'
      }} onClick={e => e.stopPropagation()}>
        
        <h2 style={{ margin: '0 0 20px 0', fontSize: 22 }}>
          {editingRule ? '✎ Edit Rule' : '✨ Create New Rule'}
        </h2>
        
        <label style={labelStyle}>Rule Name *</label>
        <input value={form.name} onChange={e => onChange({ ...form, name: e.target.value })} 
          placeholder="e.g., Triple Bingo" style={inputStyle} />
        
        <label style={labelStyle}>Description</label>
        <input value={form.description} onChange={e => onChange({ ...form, description: e.target.value })} 
          placeholder="Describe this rule..." style={inputStyle} />
        
        <label style={labelStyle}>Method</label>
        <select value={form.method} onChange={e => onChange({ ...form, method: e.target.value })} style={inputStyle}>
          <option value="rule">Rule-Based</option>
          <option value="pattern">Pattern-Based</option>
        </select>
        
        {/* Pass method and patterns to RuleConfigForm */}
        <RuleConfigForm 
          config={form.ruleConfig}
          onChange={(newConfig) => onChange({ ...form, ruleConfig: newConfig })}
          patterns={form.patterns || []}
          method={form.method}
        />
        
        <button onClick={onSave} style={{ 
          width: '100%', marginTop: 24, padding: 14, background: '#FF4757', 
          color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', 
          fontWeight: 700, fontSize: 15 
        }}>
          💾 {editingRule ? 'Update Rule' : 'Create Rule'}
        </button>
      </div>
    </div>
  );
}