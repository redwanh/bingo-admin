import React, { useState } from 'react';

const styles = {
  section: { background: '#f9fafb', padding: '15px', borderRadius: '10px', marginTop: '15px', border: '1px solid #e5e7eb' },
  sectionTitle: { fontSize: '13px', color: '#b8962f', fontWeight: 700, marginBottom: '12px' },
  label: { fontSize: '11px', color: '#6b7280', display: 'block', marginBottom: '4px', marginTop: '10px' },
  input: { width: '100%', padding: '10px', background: '#ffffff', color: '#1a1a2e', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' },
  select: { width: '100%', padding: '10px', background: '#ffffff', color: '#1a1a2e', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' },
  flex: { display: 'flex', gap: '15px', flexWrap: 'wrap' },
  checkboxChip: (active) => ({ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '12px', background: active ? '#d4af37' : '#fff', color: active ? '#fff' : '#1a1a2e', border: active ? '2px solid #000' : '1px solid #e5e7eb', userSelect: 'none' }),
  fieldWrapper: { display: 'flex', flexDirection: 'column' },
  langCard: { marginBottom: 12, padding: 12, background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb' },
  deleteBtn: { background: '#fee2e2', color: '#991b1b', border: '1px solid #ef4444', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' },
  miniGrid: { display: 'inline-block', background: '#ffffff', padding: '8px', borderRadius: '8px', border: '1px solid #e5e7eb' },
  gridCell: { width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', borderRadius: '4px', cursor: 'pointer', background: '#f9fafb', color: '#6b7280', border: '1px solid #e5e7eb', fontWeight: 400 },
  gridCellSelected: { background: '#d4af37', color: '#ffffff', border: '2px solid #000000', fontWeight: 700 },
  headerCell: { textAlign: 'center', fontWeight: 700, fontSize: '10px', padding: '3px' },
  addBtn: { width: '100%', padding: '10px', marginTop: '10px', background: 'linear-gradient(135deg, #d4af37, #b8962f)', color: '#fff', border: '2px solid #000000', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '13px' },
  addBtnDisabled: { opacity: 0.5, cursor: 'not-allowed' },
  mixedRuleCard: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, marginBottom: 10 },
  mixedRuleHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  mixedRuleTitle: { fontSize: 13, fontWeight: 700, color: '#b8962f' },
  addMixedBtn: { padding: '10px 20px', background: '#1a1a2e', color: '#fff', border: '2px solid #000', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 12, marginTop: 10, width: '100%' },
};

const langNames = [
  { key: 'nameAmharic', descKey: 'descriptionAmharic', label: 'አማርኛ (Amharic)', flag: '🇪🇹', ph: 'የህግ ስም', dph: 'መግለጫ' },
  { key: 'nameTigrinya', descKey: 'descriptionTigrinya', label: 'ትግርኛ (Tigrinya)', flag: '🇪🇷', ph: 'ስም ሕጊ', dph: 'መግለጺ' },
  { key: 'nameOromo', descKey: 'descriptionOromo', label: 'Afaan Oromo', flag: '🇪🇹', ph: 'Maqaa seeraa', dph: 'Ibsa' },
  { key: 'nameChinese', descKey: 'descriptionChinese', label: '中文 (Chinese)', flag: '🇨🇳', ph: '规则名称', dph: '规则描述' },
  { key: 'nameEnglish', descKey: 'descriptionEnglish', label: 'English', flag: '🇬🇧', ph: 'Rule name', dph: 'Description' },
];

const defaultCountConfig = {
  linesToWin: 1, minRows: 0, minColumns: 0, minDiagonals: 0,
  minSquares: 0, minRectangles: 0,
  squareSize: 2, rectWidth: 3, rectHeight: 2,
  lineDirections: ['horizontal', 'vertical', 'diagonal'],
  allowOverlapping: true, freeSpaceCounts: true, cornersRequired: 0,
};

const defaultMixedSubRule = {
  type: 'count', countConfig: { ...defaultCountConfig }, patternIndex: 0, interception: 'canIntercept',
};

export default function RuleConfigForm({ config, onChange, patterns = [], method = 'rule', mixedRules = [], onMixedRulesChange }) {
  const [newPatternName, setNewPatternName] = useState('');
  const [selectedCells, setSelectedCells] = useState([]);

  const cfg = {
    linesToWin: 1, minRows: 0, minColumns: 0, minDiagonals: 0,
    minSquares: 0, minRectangles: 0, squareSize: 2, rectWidth: 3, rectHeight: 2,
    lineDirections: ['horizontal', 'vertical', 'diagonal'],
    allowOverlapping: true, freeSpaceCounts: true, cornersRequired: 0,
    specificLines: { topRow: false, bottomRow: false, leftColumn: false, rightColumn: false, mainDiagonal: false, antiDiagonal: false },
    ...config
  };

  const updateConfig = (key, value) => onChange({ ...cfg, [key]: value });
  const letterColors = ['#FF4757', '#FFA502', '#2ED573', '#FF6348', '#7C5CFC'];
  const letters = ['B', 'I', 'N', 'G', 'O'];

  // ═══ PATTERN HELPERS ═══
  const togglePatternCell = (row, col) => {
    setSelectedCells(prev => {
      const exists = prev.find(c => c[0] === row && c[1] === col);
      return exists ? prev.filter(c => !(c[0] === row && c[1] === col)) : [...prev, [row, col]];
    });
  };

  const savePattern = () => {
    if (!newPatternName || selectedCells.length === 0) return;
    const existingIndex = patterns.findIndex(p => p.name === newPatternName);
    let updatedPatterns;
    if (existingIndex >= 0) {
      updatedPatterns = [...patterns];
      updatedPatterns[existingIndex] = { name: newPatternName, cells: [...selectedCells] };
    } else {
      updatedPatterns = [...patterns, { name: newPatternName, cells: [...selectedCells] }];
    }
    onChange({ ...cfg, patterns: updatedPatterns });
    setNewPatternName('');
    setSelectedCells([]);
  };

  const editPattern = (pattern) => {
    setNewPatternName(pattern.name);
    setSelectedCells([...(pattern.cells || [])]);
  };

  const deletePattern = (index) => {
    if (!window.confirm(`Delete pattern "${patterns[index].name}"?`)) return;
    const updatedPatterns = patterns.filter((_, i) => i !== index);
    onChange({ ...cfg, patterns: updatedPatterns });
  };

  const cancelEdit = () => {
    setNewPatternName('');
    setSelectedCells([]);
  };

  // ═══ MIXED HELPERS ═══
  const addMixedRule = () => onMixedRulesChange?.([...(mixedRules || []), { ...defaultMixedSubRule }]);
  const removeMixedRule = (i) => onMixedRulesChange?.((mixedRules || []).filter((_, idx) => idx !== i));
  const updateMixedRule = (i, f, v) => { const u = [...(mixedRules || [])]; u[i] = { ...u[i], [f]: v }; onMixedRulesChange?.(u); };
  const updateMixedCount = (i, f, v) => { const u = [...(mixedRules || [])]; u[i] = { ...u[i], countConfig: { ...(u[i].countConfig || defaultCountConfig), [f]: v } }; onMixedRulesChange?.(u); };

  // ═══ RENDER HELPERS ═══
  const renderCountConfig = (c, updateFn) => (
    <>
      <div style={styles.grid3}>
        {[
          ['linesToWin', 'Lines to Win'], ['minRows', 'Min Rows'], ['minColumns', 'Min Columns'],
          ['minDiagonals', 'Min Diagonals'], ['minSquares', `Min Squares (${c.squareSize || 2}×${c.squareSize || 2})`], ['minRectangles', `Min Rect (${c.rectWidth || 3}×${c.rectHeight || 2})`],
        ].map(([key, label]) => (
          <div key={key} style={styles.fieldWrapper}><label style={styles.label}>{label}</label><input type="number" min={0} value={c[key] || 0} onChange={e => updateFn(key, parseInt(e.target.value) || 0)} style={styles.input} /></div>
        ))}
      </div>
      <div style={{ marginTop: 8 }}><label style={styles.label}>Line Directions</label>
        <div style={styles.flex}>
          {['horizontal', 'vertical', 'diagonal', 'square', 'rectangle'].map(dir => {
            const active = (c.lineDirections || []).includes(dir);
            return <div key={dir} onClick={() => { const cur = [...(c.lineDirections || ['horizontal','vertical','diagonal'])]; updateFn('lineDirections', active ? cur.filter(d => d !== dir) : [...cur, dir]); }} style={styles.checkboxChip(active)}>{active ? '✓ ' : ''}{dir.charAt(0).toUpperCase() + dir.slice(1)}</div>;
          })}
        </div>
      </div>
      <div style={styles.grid2}>
        <div style={styles.fieldWrapper}><label style={styles.label}>Overlap</label><select value={c.allowOverlapping !== false ? 'true' : 'false'} onChange={e => updateFn('allowOverlapping', e.target.value === 'true')} style={styles.select}><option value="true">Yes</option><option value="false">No</option></select></div>
        <div style={styles.fieldWrapper}><label style={styles.label}>Free Space</label><select value={c.freeSpaceCounts !== false ? 'true' : 'false'} onChange={e => updateFn('freeSpaceCounts', e.target.value === 'true')} style={styles.select}><option value="true">Counts</option><option value="false">Ignored</option></select></div>
      </div>
    </>
  );

  const renderPatternGrid = () => (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
      <div style={styles.miniGrid}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 2 }}>
          {letters.map((c, i) => <div key={c} style={{ ...styles.headerCell, color: letterColors[i] }}>{c}</div>)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 2, marginTop: 2 }}>
          {[0,1,2,3,4].map(row => [0,1,2,3,4].map(col => {
            const sel = selectedCells.some(c => c[0] === row && c[1] === col);
            return <div key={`${row}-${col}`} onClick={() => togglePatternCell(row, col)} style={{ ...styles.gridCell, ...(sel ? styles.gridCellSelected : {}) }}>{row * 5 + col + 1}</div>;
          }))}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* 🌐 Multi-Language */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>🌐 Multi-Language Names & Descriptions</h4>
        {langNames.map(lang => (
          <div key={lang.key} style={styles.langCard}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#1a1a2e', marginBottom: 8 }}>{lang.flag} {lang.label}</label>
            <div style={styles.grid2}>
              <div style={styles.fieldWrapper}><label style={{ fontSize: 10, color: '#6b7280', marginBottom: 4 }}>Name</label><input value={cfg[lang.key] || ''} onChange={e => updateConfig(lang.key, e.target.value)} placeholder={lang.ph} style={styles.input} /></div>
              <div style={styles.fieldWrapper}><label style={{ fontSize: 10, color: '#6b7280', marginBottom: 4 }}>Description</label><input value={cfg[lang.descKey] || ''} onChange={e => updateConfig(lang.descKey, e.target.value)} placeholder={lang.dph} style={styles.input} /></div>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ COUNT-BASED ═══ */}
      {method === 'rule' && (
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>🎯 Count-Based Rule Configuration</h4>
          {renderCountConfig(cfg, updateConfig)}
          <div style={styles.grid2}>
            <div style={styles.fieldWrapper}><label style={styles.label}>Corners Required</label><select value={cfg.cornersRequired || 0} onChange={e => updateConfig('cornersRequired', parseInt(e.target.value))} style={styles.select}><option value={0}>None</option><option value={1}>1</option><option value={2}>2</option><option value={3}>3</option><option value={4}>4</option></select></div>
          </div>
        </div>
      )}

      {/* ═══ PATTERN ═══ */}
      {method === 'pattern' && (
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>🎯 Pattern Configuration</h4>

          {/* Saved Patterns */}
          {patterns.length > 0 && (
            <div style={{ marginBottom: 15 }}>
              <label style={styles.label}>📋 Saved Patterns ({patterns.length})</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {patterns.map((p, i) => (
                  <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flexShrink: 0 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 12px)', gap: 1, background: '#f9fafb', padding: 3, borderRadius: 4, border: '1px solid #e5e7eb' }}>
                        {[0,1,2,3,4].map(row => [0,1,2,3,4].map(col => {
                          const marked = p.cells?.some(c => c[0] === row && c[1] === col);
                          return <div key={`${row}-${col}`} style={{ width: 12, height: 12, background: marked ? '#d4af37' : '#fff', border: marked ? '1px solid #b8962f' : '1px solid #e5e7eb', borderRadius: 1 }} />;
                        }))}
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{p.name}</div>
                      <div style={{ fontSize: 10, color: '#6b7280' }}>{p.cells?.length || 0} cells</div>
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => editPattern(p)} title="Edit" style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #3b82f6', background: '#eff6ff', color: '#3b82f6', cursor: 'pointer', fontSize: 12 }}>✏️</button>
                      <button onClick={() => deletePattern(i)} title="Delete" style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #ef4444', background: '#fef2f2', color: '#ef4444', cursor: 'pointer', fontSize: 12 }}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pattern Editor */}
          <div style={{ background: '#f9fafb', padding: 15, borderRadius: 10, border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={{ fontWeight: 700, fontSize: 12 }}>{newPatternName ? '✏️ Editing' : '➕ New Pattern'}</label>
              {newPatternName && <button onClick={cancelEdit} style={{ fontSize: 10, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Cancel</button>}
            </div>
            <label style={styles.label}>Pattern Name</label>
            <input value={newPatternName} onChange={e => setNewPatternName(e.target.value)} placeholder="e.g., T-Shape, Cross" style={styles.input} />
            <label style={{ ...styles.label, marginTop: 10 }}>Click cells ({selectedCells.length} selected)</label>
            {renderPatternGrid()}
            <button onClick={savePattern} disabled={!newPatternName || selectedCells.length === 0} style={{ ...styles.addBtn, ...(!newPatternName || selectedCells.length === 0 ? styles.addBtnDisabled : {}) }}>
              {patterns.some(p => p.name === newPatternName) ? '💾 Update Pattern' : '+ Add Pattern'}
            </button>
          </div>
        </div>
      )}

      {/* ═══ MIXED ═══ */}
     {/* ═══ MIXED ═══ */}
{method === 'mixed' && (
  <div style={styles.section}>
    <h4 style={styles.sectionTitle}>🔀 Mixed Rule Configuration</h4>
    <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 12 }}>Combine count + pattern rules. ALL must pass.</p>

    {/* 🔧 If no patterns exist, show pattern editor first */}
    {patterns.length === 0 && (
      <div style={{ 
        marginBottom: 15, padding: 15, background: '#fffbeb', 
        borderRadius: 10, border: '1px solid #fcd34d' 
      }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#92400e', margin: '0 0 10px' }}>
          ⚠️ You need at least one pattern to use Pattern-based sub-rules. Create one now:
        </p>
        
        {/* Pattern Editor (same as pattern mode) */}
        <div style={{ background: '#fff', padding: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <label style={{ fontWeight: 700, fontSize: 12 }}>{newPatternName ? '✏️ Editing' : '➕ New Pattern'}</label>
            {newPatternName && <button onClick={cancelEdit} style={{ fontSize: 10, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Cancel</button>}
          </div>
          <label style={styles.label}>Pattern Name</label>
          <input value={newPatternName} onChange={e => setNewPatternName(e.target.value)} placeholder="e.g., T-Shape, Cross" style={styles.input} />
          <label style={{ ...styles.label, marginTop: 10 }}>Click cells ({selectedCells.length} selected)</label>
          {renderPatternGrid()}
          <button onClick={savePattern} disabled={!newPatternName || selectedCells.length === 0} style={{ ...styles.addBtn, ...(!newPatternName || selectedCells.length === 0 ? styles.addBtnDisabled : {}) }}>
            + Add Pattern
          </button>
        </div>
      </div>
    )}

    {/* Existing patterns summary */}
    {patterns.length > 0 && (
      <div style={{ marginBottom: 12, fontSize: 11, color: '#6b7280' }}>
        📋 Available patterns: <b>{patterns.map(p => p.name).join(', ')}</b>
      </div>
    )}

    {/* Mixed sub-rules */}
    {(mixedRules || []).map((mr, i) => (
      <div key={i} style={styles.mixedRuleCard}>
        <div style={styles.mixedRuleHeader}><span style={styles.mixedRuleTitle}>Sub-Rule #{i + 1}</span><button onClick={() => removeMixedRule(i)} style={styles.deleteBtn}>✕ Remove</button></div>
        <div style={styles.grid2}>
          <div style={styles.fieldWrapper}><label style={styles.label}>Type</label><select value={mr.type} onChange={e => updateMixedRule(i, 'type', e.target.value)} style={styles.select}><option value="count">Count</option><option value="pattern">Pattern</option></select></div>
          <div style={styles.fieldWrapper}><label style={styles.label}>Interception</label><select value={mr.interception} onChange={e => updateMixedRule(i, 'interception', e.target.value)} style={styles.select}><option value="canIntercept">Can Intercept</option><option value="mustIntercept">Must Intercept</option><option value="noInterception">No Interception</option></select></div>
        </div>
        {mr.type === 'count' && <div style={{ marginTop: 10, padding: 10, background: '#f9fafb', borderRadius: 8 }}>{renderCountConfig(mr.countConfig || defaultCountConfig, (f, v) => updateMixedCount(i, f, v))}</div>}
        {mr.type === 'pattern' && patterns.length > 0 && <div style={{ marginTop: 10 }}><label style={styles.label}>Pattern</label><select value={mr.patternIndex || 0} onChange={e => updateMixedRule(i, 'patternIndex', parseInt(e.target.value))} style={styles.select}>{patterns.map((p, j) => <option key={j} value={j}>{p.name}</option>)}</select></div>}
        {mr.type === 'pattern' && patterns.length === 0 && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 8 }}>⚠️ Create a pattern first</p>}
      </div>
    ))}

    <button onClick={addMixedRule} style={styles.addMixedBtn}>+ Add Sub-Rule</button>

    {(mixedRules || []).length === 0 && patterns.length > 0 && (
      <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 8, textAlign: 'center' }}>Click "+ Add Sub-Rule" to start building your mixed rule.</p>
    )}
  </div>
)}

      {/* Summary */}
      <div style={{ ...styles.section, background: '#f9fafb' }}>
        <h4 style={{ ...styles.sectionTitle, color: '#6d28d9' }}>📋 Summary</h4>
        <div style={{ fontSize: 11 }}>
          {method === 'rule' && <span>🎯 Count-Based: Lines={cfg.linesToWin} | Dirs: {(cfg.lineDirections || []).join(', ')}</span>}
          {method === 'pattern' && <span>🎨 Patterns: <b>{patterns.length}</b></span>}
          {method === 'mixed' && <span>🔀 Mixed: <b>{(mixedRules || []).length} sub-rules</b></span>}
        </div>
      </div>
    </div>
  );
}