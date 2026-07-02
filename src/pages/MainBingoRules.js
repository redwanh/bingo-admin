import React, { useState } from 'react';

const styles = {
  section: {
    background: '#f9fafb',
    padding: '15px',
    borderRadius: '10px',
    marginTop: '15px',
    border: '1px solid #e5e7eb',
  },
  sectionTitle: {
    fontSize: '13px',
    color: '#b8962f',
    fontWeight: 700,
    marginBottom: '12px',
  },
  label: {
    fontSize: '11px',
    color: '#6b7280',
    display: 'block',
    marginBottom: '4px',
    marginTop: '10px',
  },
  input: {
    width: '100%',
    padding: '10px',
    background: '#ffffff',
    color: '#1a1a2e',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '13px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  select: {
    width: '100%',
    padding: '10px',
    background: '#ffffff',
    color: '#1a1a2e',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '13px',
    outline: 'none',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },
  grid3: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '10px',
  },
  flex: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#1a1a2e',
    fontSize: '13px',
    cursor: 'pointer',
  },
  patternItem: {
    background: '#f9fafb',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '6px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #e5e7eb',
  },
  patternName: {
    color: '#b8962f',
    fontWeight: 600,
    fontSize: '13px',
  },
  patternCount: {
    color: '#6b7280',
    fontSize: '11px',
    marginLeft: '8px',
  },
  deleteBtn: {
    background: '#fee2e2',
    color: '#991b1b',
    border: '1px solid #ef4444',
    padding: '4px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '11px',
  },
  miniGrid: {
    display: 'inline-block',
    background: '#ffffff',
    padding: '8px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  },
  gridCell: {
    width: '35px',
    height: '35px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    borderRadius: '4px',
    cursor: 'pointer',
    background: '#f9fafb',
    color: '#6b7280',
    border: '1px solid #e5e7eb',
    fontWeight: 400,
  },
  gridCellSelected: {
    background: '#d4af37',
    color: '#ffffff',
    border: '2px solid #000000',
    fontWeight: 700,
  },
  headerCell: {
    textAlign: 'center',
    fontWeight: 700,
    fontSize: '10px',
    padding: '3px',
  },
  addPatternBtn: {
    width: '100%',
    padding: '10px',
    marginTop: '10px',
    background: 'linear-gradient(135deg, #d4af37, #b8962f)',
    color: '#fff',
    border: '2px solid #000000',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '13px',
    transition: 'all 0.2s ease',
  },
  addPatternBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  langCard: {
    marginBottom: 12,
    padding: 12,
    background: '#fff',
    borderRadius: 8,
    border: '1px solid #e5e7eb',
  },
  hint: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 2,
  },
};

const langNames = [
  { key: 'nameAmharic', descKey: 'descriptionAmharic', label: 'አማርኛ (Amharic)', flag: '🇪🇹', placeholder: 'በአማርኛ የህግ ስም', descPlaceholder: 'በአማርኛ መግለጫ' },
  { key: 'nameTigrinya', descKey: 'descriptionTigrinya', label: 'ትግርኛ (Tigrinya)', flag: '🇪🇷', placeholder: 'ብትግርኛ ስም ሕጊ', descPlaceholder: 'ብትግርኛ መግለጺ' },
  { key: 'nameOromo', descKey: 'descriptionOromo', label: 'Afaan Oromo (Oromo)', flag: '🇪🇹', placeholder: 'Maqaa seeraa Afaan Oromoon', descPlaceholder: 'Ibsa Afaan Oromoon' },
  { key: 'nameChinese', descKey: 'descriptionChinese', label: '中文 (Chinese)', flag: '🇨🇳', placeholder: '规则名称（中文）', descPlaceholder: '规则描述（中文）' },
  { key: 'nameEnglish', descKey: 'descriptionEnglish', label: 'English', flag: '🇬🇧', placeholder: 'Rule name in English', descPlaceholder: 'Rule description in English' },
];

export default function RuleConfigForm({ config, onChange, patterns = [], method = 'rule' }) {
  const [newPatternName, setNewPatternName] = useState('');
  const [selectedCells, setSelectedCells] = useState([]);
  
  const cfg = {
    linesToWin: 1, minRows: 0, minColumns: 0, minDiagonals: 0,
    exactRows: null, exactColumns: null, exactDiagonals: null,
    maxRows: null, maxColumns: null, maxDiagonals: null,
    requiredCombination: { rows: null, columns: null, diagonals: null },
    mustHaveAllTypes: false, exclusiveLines: null,
    linesMustIntersect: false, linesMustNotIntersect: false,
    intersectionPoint: { row: 2, col: 2 },
    freeSpaceCounts: true, freeSpaceRequiredForWin: false, freeSpaceBlocked: false,
    allowOverlapping: true, sharedCellsLimit: null,
    lineDirections: ['horizontal', 'vertical', 'diagonal'],
    requiredDirections: [], prohibitedDirections: [],
    cornersRequired: false, minCellsMarked: null,
    specificLines: {
      topRow: false, bottomRow: false, leftColumn: false, rightColumn: false,
      centerRow: false, centerColumn: false, mainDiagonal: false, antiDiagonal: false
    },
    nameAmharic: '', nameTigrinya: '', nameOromo: '', nameChinese: '', nameEnglish: '',
    descriptionAmharic: '', descriptionTigrinya: '', descriptionOromo: '', descriptionChinese: '', descriptionEnglish: '',
    ...config
  };
  
  // 🔧 Helper: null means "any", 0 means "none required", >0 means "exact count"
  const updateConfig = (key, value) => {
    onChange({ ...cfg, [key]: value });
  };
  
  const togglePatternCell = (row, col) => {
    setSelectedCells(prev => {
      const exists = prev.find(c => c[0] === row && c[1] === col);
      if (exists) return prev.filter(c => !(c[0] === row && c[1] === col));
      return [...prev, [row, col]];
    });
  };
  
  const addPattern = () => {
    if (!newPatternName || selectedCells.length === 0) return;
    const updatedPatterns = [...patterns, { name: newPatternName, cells: [...selectedCells] }];
    onChange({ ...cfg, patterns: updatedPatterns });
    setNewPatternName('');
    setSelectedCells([]);
  };
  
  const removePattern = (index) => {
    const updatedPatterns = patterns.filter((_, i) => i !== index);
    onChange({ ...cfg, patterns: updatedPatterns });
  };
  
  const letterColors = ['#FF4757', '#FFA502', '#2ED573', '#FF6348', '#7C5CFC'];
  const letters = ['B', 'I', 'N', 'G', 'O'];
  
  return (
    <div>
      {/* 🌐 Multi-Language Names & Descriptions */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>🌐 Multi-Language Names & Descriptions</h4>
        <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 12 }}>
          Add rule name and description in different languages for players
        </p>
        {langNames.map(lang => (
          <div key={lang.key} style={styles.langCard}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#1a1a2e', display: 'block', marginBottom: 8 }}>
              {lang.flag} {lang.label}
            </label>
            <div style={styles.grid2}>
              <div>
                <label style={{ fontSize: 10, color: '#6b7280', display: 'block', marginBottom: 4 }}>Name</label>
                <input value={cfg[lang.key] || ''} onChange={e => updateConfig(lang.key, e.target.value)}
                  placeholder={lang.placeholder} style={styles.input} />
              </div>
              <div>
                <label style={{ fontSize: 10, color: '#6b7280', display: 'block', marginBottom: 4 }}>Description</label>
                <input value={cfg[lang.descKey] || ''} onChange={e => updateConfig(lang.descKey, e.target.value)}
                  placeholder={lang.descPlaceholder} style={styles.input} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Rule-Based Configuration */}
      {method === 'rule' && (
        <>
          {/* Core Settings */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>🎯 Core Settings</h4>
            <div style={styles.grid2}>
              <div>
                <label style={styles.label}>Lines to Win *</label>
                <input type="number" min={1}
                  value={cfg.linesToWin || 1} 
                  onChange={e => updateConfig('linesToWin', parseInt(e.target.value) || 1)}
                  style={styles.input} />
              </div>
              {[
                { key: 'minRows', label: 'Min Rows', hint: 'Leave empty for any' },
                { key: 'minColumns', label: 'Min Columns', hint: 'Leave empty for any' },
                { key: 'minDiagonals', label: 'Min Diagonals', hint: 'Leave empty for any' },
                { key: 'exactRows', label: 'Exact Rows', hint: 'Empty = any, 0 = none allowed' },
                { key: 'exactColumns', label: 'Exact Columns', hint: 'Empty = any, 0 = none allowed' },
                { key: 'exactDiagonals', label: 'Exact Diagonals', hint: 'Empty = any, 0 = none allowed' },
                { key: 'maxRows', label: 'Max Rows', hint: 'Leave empty for unlimited' },
                { key: 'maxColumns', label: 'Max Columns', hint: 'Leave empty for unlimited' },
                { key: 'maxDiagonals', label: 'Max Diagonals', hint: 'Leave empty for unlimited' }
              ].map(f => (
                <div key={f.key}>
                  <label style={styles.label}>{f.label}</label>
                  <input type="number" min={0}
                    value={cfg[f.key] !== null && cfg[f.key] !== undefined ? cfg[f.key] : ''} 
                    onChange={e => updateConfig(f.key, e.target.value === '' ? null : parseInt(e.target.value))}
                    placeholder="Any" style={styles.input} />
                  <span style={styles.hint}>{f.hint}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Free Space Settings */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>⭐ Free Space</h4>
            <div style={styles.grid2}>
              <div>
                <label style={styles.label}>Free Space Counts</label>
                <select value={cfg.freeSpaceCounts !== false ? 'true' : 'false'}
                  onChange={e => updateConfig('freeSpaceCounts', e.target.value === 'true')} style={styles.select}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Free Space Required</label>
                <select value={cfg.freeSpaceRequiredForWin ? 'true' : 'false'}
                  onChange={e => updateConfig('freeSpaceRequiredForWin', e.target.value === 'true')} style={styles.select}>
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Free Space Blocked</label>
                <select value={cfg.freeSpaceBlocked ? 'true' : 'false'}
                  onChange={e => updateConfig('freeSpaceBlocked', e.target.value === 'true')} style={styles.select}>
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Line Interaction */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>🔗 Line Interaction</h4>
            <div style={styles.grid2}>
              <div>
                <label style={styles.label}>Allow Overlapping</label>
                <select value={cfg.allowOverlapping !== false ? 'true' : 'false'}
                  onChange={e => updateConfig('allowOverlapping', e.target.value === 'true')} style={styles.select}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Shared Cells Limit</label>
                <input type="number" value={cfg.sharedCellsLimit ?? ''} 
                  onChange={e => updateConfig('sharedCellsLimit', e.target.value === '' ? null : parseInt(e.target.value))}
                  placeholder="Unlimited" style={styles.input} />
              </div>
              <div>
                <label style={styles.label}>Lines Must Intersect</label>
                <select value={cfg.linesMustIntersect ? 'true' : 'false'}
                  onChange={e => updateConfig('linesMustIntersect', e.target.value === 'true')} style={styles.select}>
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Direction Settings */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>🧭 Line Directions</h4>
            <div style={styles.flex}>
              {['horizontal', 'vertical', 'diagonal'].map(dir => (
                <label key={dir} style={styles.checkboxLabel}>
                  <input type="checkbox" checked={(cfg.lineDirections || []).includes(dir)}
                    onChange={e => {
                      const current = cfg.lineDirections || ['horizontal','vertical','diagonal'];
                      const updated = e.target.checked ? [...current, dir] : current.filter(d => d !== dir);
                      updateConfig('lineDirections', updated.length === 0 ? ['horizontal'] : updated);
                    }} />
                  {dir.charAt(0).toUpperCase() + dir.slice(1)}
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Pattern-Based Configuration */}
      {method === 'pattern' && (
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>🎯 Pattern Configuration</h4>
          <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 12 }}>
            Define specific cell patterns that must be matched to win
          </p>
          
          {patterns.length > 0 && (
            <div style={{ marginBottom: 15 }}>
              <label style={styles.label}>Saved Patterns ({patterns.length})</label>
              {patterns.map((pattern, idx) => (
                <div key={idx} style={styles.patternItem}>
                  <span style={styles.patternName}>
                    {pattern.name} <span style={styles.patternCount}>({pattern.cells.length} cells)</span>
                  </span>
                  <button onClick={() => removePattern(idx)} style={styles.deleteBtn}>✕</button>
                </div>
              ))}
            </div>
          )}
          
          <div style={{ background: '#f9fafb', padding: 15, borderRadius: 10, border: '1px solid #e5e7eb' }}>
            <label style={styles.label}>Pattern Name</label>
            <input value={newPatternName} onChange={e => setNewPatternName(e.target.value)}
              placeholder="e.g., X Pattern, Cross" style={styles.input} />
            
            <label style={{ ...styles.label, marginTop: 10 }}>Click cells to select pattern ({selectedCells.length} selected)</label>
            
            <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
              <div style={styles.miniGrid}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2 }}>
                  {letters.map((c, idx) => (
                    <div key={c} style={{ ...styles.headerCell, color: letterColors[idx] }}>{c}</div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2, marginTop: 2 }}>
                  {[0,1,2,3,4].map(row => 
                    [0,1,2,3,4].map(col => {
                      const isSelected = selectedCells.some(c => c[0] === row && c[1] === col);
                      return (
                        <div key={`${row}-${col}`} onClick={() => togglePatternCell(row, col)}
                          style={{ ...styles.gridCell, ...(isSelected ? styles.gridCellSelected : {}) }}>
                          {row * 5 + col + 1}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
            
            <button onClick={addPattern} disabled={!newPatternName || selectedCells.length === 0}
              style={{ ...styles.addPatternBtn, ...(!newPatternName || selectedCells.length === 0 ? styles.addPatternBtnDisabled : {}) }}>
              + Add Pattern
            </button>
          </div>
        </div>
      )}

      {/* Config Summary */}
      <div style={{ ...styles.section, background: '#f9fafb' }}>
        <h4 style={{ ...styles.sectionTitle, color: '#6d28d9' }}>📋 Configuration Summary</h4>
        <div style={{ fontSize: 11, color: '#1a1a2e', lineHeight: 1.6 }}>
          {(cfg.nameAmharic || cfg.nameEnglish) && (
            <div style={{ marginBottom: 8, padding: '8px 10px', background: '#fff', borderRadius: 6, border: '1px solid #e5e7eb' }}>
              <b>🌐 Names:</b>{' '}
              {cfg.nameAmharic && `🇪🇹 ${cfg.nameAmharic}`}
              {cfg.nameTigrinya && ` | 🇪🇷 ${cfg.nameTigrinya}`}
              {cfg.nameOromo && ` | ${cfg.nameOromo}`}
              {cfg.nameChinese && ` | 🇨🇳 ${cfg.nameChinese}`}
              {cfg.nameEnglish && ` | 🇬🇧 ${cfg.nameEnglish}`}
            </div>
          )}
          {method === 'rule' ? (
            <>
              <div>🎯 Lines to win: <b>{cfg.linesToWin}</b></div>
              <div>📏 Rows: min={cfg.minRows ?? 'any'} exact={cfg.exactRows ?? 'any'} max={cfg.maxRows ?? '∞'}</div>
              <div>📏 Cols: min={cfg.minColumns ?? 'any'} exact={cfg.exactColumns ?? 'any'} max={cfg.maxColumns ?? '∞'}</div>
              <div>📏 Diags: min={cfg.minDiagonals ?? 'any'} exact={cfg.exactDiagonals ?? 'any'} max={cfg.maxDiagonals ?? '∞'}</div>
              <div>⭐ Free: {cfg.freeSpaceCounts !== false ? 'Counts' : 'Blocked'}{cfg.freeSpaceRequiredForWin ? ' | Required' : ''}</div>
              <div>🔗 Overlap: {cfg.allowOverlapping !== false ? 'Yes' : 'No'}</div>
              <div>🧭 Directions: {(cfg.lineDirections || []).join(', ')}</div>
            </>
          ) : (
            <div>🎯 Patterns defined: <b>{patterns.length}</b></div>
          )}
        </div>
      </div>
    </div>
  );
}