import React, { useState } from 'react';

const inputStyle = {
  width: '100%', padding: 10, background: '#0f3460', color: '#fff', 
  border: '1px solid #333', borderRadius: 8, fontSize: 13, outline: 'none'
};

const labelStyle = {
  fontSize: 11, color: '#888', display: 'block', marginBottom: 4, marginTop: 10
};

const sectionStyle = {
  background: '#0a0a1e', padding: 15, borderRadius: 10, marginTop: 15
};

const sectionTitle = {
  fontSize: 13, color: '#FFA502', fontWeight: 700, marginBottom: 12
};

export default function RuleConfigForm({ config, onChange, patterns = [], method = 'rule' }) {
  
  // Pattern state
  const [newPatternName, setNewPatternName] = useState('');
  const [selectedCells, setSelectedCells] = useState([]);
  
  // Safe config with defaults
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
    ...config
  };
  
  const updateConfig = (key, value) => {
    onChange({ ...cfg, [key]: value });
  };
  
  // Shape presets
  const applyShapePreset = (shape) => {
    const presets = {
      'any_T': {
        linesToWin: 2, minRows: 1, minColumns: 1, minDiagonals: 0,
        exactRows: 1, exactColumns: 1, exactDiagonals: 0,
        maxRows: 1, maxColumns: 1, maxDiagonals: 0,
        linesMustIntersect: true, intersectionPoint: null,
        allowOverlapping: true, lineDirections: ['horizontal', 'vertical'],
        requiredCombination: { rows: 1, columns: 1, diagonals: null },
        specificLines: { topRow: false, bottomRow: false, leftColumn: false, rightColumn: false, centerRow: false, centerColumn: false, mainDiagonal: false, antiDiagonal: false },
        freeSpaceCounts: true
      },
      'top_T': {
        linesToWin: 2, minRows: 1, minColumns: 1, exactRows: 1, exactColumns: 1,
        linesMustIntersect: true, intersectionPoint: { row: 0, col: 2 },
        allowOverlapping: true, lineDirections: ['horizontal', 'vertical'],
        specificLines: { topRow: true, centerColumn: true },
        freeSpaceCounts: true
      },
      'bottom_T': {
        linesToWin: 2, minRows: 1, minColumns: 1, exactRows: 1, exactColumns: 1,
        linesMustIntersect: true, intersectionPoint: { row: 4, col: 2 },
        allowOverlapping: true, lineDirections: ['horizontal', 'vertical'],
        specificLines: { bottomRow: true, centerColumn: true },
        freeSpaceCounts: true
      },
      'left_T': {
        linesToWin: 2, minRows: 1, minColumns: 1, exactRows: 1, exactColumns: 1,
        linesMustIntersect: true, intersectionPoint: { row: 2, col: 0 },
        allowOverlapping: true, lineDirections: ['horizontal', 'vertical'],
        specificLines: { leftColumn: true, centerRow: true },
        freeSpaceCounts: true
      },
      'right_T': {
        linesToWin: 2, minRows: 1, minColumns: 1, exactRows: 1, exactColumns: 1,
        linesMustIntersect: true, intersectionPoint: { row: 2, col: 4 },
        allowOverlapping: true, lineDirections: ['horizontal', 'vertical'],
        specificLines: { rightColumn: true, centerRow: true },
        freeSpaceCounts: true
      },
      'X_shape': {
        linesToWin: 2, exactDiagonals: 2, exactRows: 0, exactColumns: 0,
        maxRows: 0, maxColumns: 0,
        linesMustIntersect: true, intersectionPoint: { row: 2, col: 2 },
        allowOverlapping: true, lineDirections: ['diagonal'], exclusiveLines: 'diagonals',
        freeSpaceCounts: true
      },
      'plus_sign': {
        linesToWin: 2, minRows: 1, minColumns: 1, exactRows: 1, exactColumns: 1,
        linesMustIntersect: true, intersectionPoint: { row: 2, col: 2 },
        allowOverlapping: true, lineDirections: ['horizontal', 'vertical'],
        specificLines: { centerRow: true, centerColumn: true },
        freeSpaceCounts: true, freeSpaceRequiredForWin: true
      }
    };
    
    if (presets[shape]) {
      onChange({ ...cfg, ...presets[shape] });
    }
  };
  
  // Pattern functions
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
  
  return (
    <div>
      {/* ============================================ */}
      {/* SHAPE PRESETS */}
      {/* ============================================ */}
      <div style={sectionStyle}>
        <h4 style={sectionTitle}>🎨 Shape Presets (Quick Setup)</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {[
            { key: 'any_T', label: 'T Any', icon: '⊥' },
            { key: 'top_T', label: 'T Top', icon: '⊤' },
            { key: 'bottom_T', label: 'T Bottom', icon: '⊥' },
            { key: 'left_T', label: 'T Left', icon: '⊣' },
            { key: 'right_T', label: 'T Right', icon: '⊢' },
            { key: 'X_shape', label: 'X Shape', icon: '✕' },
            { key: 'plus_sign', label: '+ Plus', icon: '✚' }
          ].map(preset => (
            <button key={preset.key} onClick={() => applyShapePreset(preset.key)}
              style={{
                padding: '8px', background: '#0f3460', color: '#fff',
                border: '1px solid #333', borderRadius: 8, cursor: 'pointer',
                fontSize: 11, textAlign: 'center'
              }}>
              <div style={{ fontSize: 18 }}>{preset.icon}</div>
              <div style={{ fontWeight: 600 }}>{preset.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ============================================ */}
      {/* RULE-BASED CONFIGURATION */}
      {/* ============================================ */}
      {method === 'rule' && (
        <>
          {/* CORE SETTINGS */}
          <div style={sectionStyle}>
            <h4 style={sectionTitle}>🎯 Core Settings</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { key: 'linesToWin', label: 'Lines to Win' },
                { key: 'minRows', label: 'Min Rows' },
                { key: 'minColumns', label: 'Min Columns' },
                { key: 'minDiagonals', label: 'Min Diagonals' },
                { key: 'exactRows', label: 'Exact Rows' },
                { key: 'exactColumns', label: 'Exact Columns' },
                { key: 'exactDiagonals', label: 'Exact Diagonals' },
                { key: 'maxRows', label: 'Max Rows' },
                { key: 'maxColumns', label: 'Max Columns' },
                { key: 'maxDiagonals', label: 'Max Diagonals' }
              ].map(f => (
                <div key={f.key}>
                  <label style={labelStyle}>{f.label}</label>
                  <input type="number" 
                    value={cfg[f.key] !== null && cfg[f.key] !== undefined ? cfg[f.key] : ''} 
                    onChange={e => updateConfig(f.key, e.target.value === '' ? null : parseInt(e.target.value))}
                    placeholder="Optional" style={inputStyle}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* FREE SPACE SETTINGS */}
          <div style={sectionStyle}>
            <h4 style={sectionTitle}>⭐ Free Space</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={labelStyle}>Free Space Counts</label>
                <select value={cfg.freeSpaceCounts !== false ? 'true' : 'false'}
                  onChange={e => updateConfig('freeSpaceCounts', e.target.value === 'true')}
                  style={inputStyle}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Free Space Required</label>
                <select value={cfg.freeSpaceRequiredForWin ? 'true' : 'false'}
                  onChange={e => updateConfig('freeSpaceRequiredForWin', e.target.value === 'true')}
                  style={inputStyle}>
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Free Space Blocked</label>
                <select value={cfg.freeSpaceBlocked ? 'true' : 'false'}
                  onChange={e => updateConfig('freeSpaceBlocked', e.target.value === 'true')}
                  style={inputStyle}>
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
            </div>
          </div>

          {/* LINE INTERACTION */}
          <div style={sectionStyle}>
            <h4 style={sectionTitle}>🔗 Line Interaction</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={labelStyle}>Allow Overlapping</label>
                <select value={cfg.allowOverlapping !== false ? 'true' : 'false'}
                  onChange={e => updateConfig('allowOverlapping', e.target.value === 'true')}
                  style={inputStyle}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Shared Cells Limit</label>
                <input type="number" 
                  value={cfg.sharedCellsLimit ?? ''} 
                  onChange={e => updateConfig('sharedCellsLimit', e.target.value === '' ? null : parseInt(e.target.value))}
                  placeholder="Unlimited" style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Lines Must Intersect</label>
                <select value={cfg.linesMustIntersect ? 'true' : 'false'}
                  onChange={e => updateConfig('linesMustIntersect', e.target.value === 'true')}
                  style={inputStyle}>
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Lines Must NOT Touch</label>
                <select value={cfg.linesMustNotIntersect ? 'true' : 'false'}
                  onChange={e => updateConfig('linesMustNotIntersect', e.target.value === 'true')}
                  style={inputStyle}>
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
            </div>
            {cfg.linesMustIntersect && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
                <div>
                  <label style={labelStyle}>Intersection Row (0-4)</label>
                  <input type="number" min={0} max={4}
                    value={cfg.intersectionPoint?.row ?? ''} 
                    onChange={e => updateConfig('intersectionPoint', { ...cfg.intersectionPoint, row: parseInt(e.target.value) || 0 })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Intersection Column (0-4)</label>
                  <input type="number" min={0} max={4}
                    value={cfg.intersectionPoint?.col ?? ''} 
                    onChange={e => updateConfig('intersectionPoint', { ...cfg.intersectionPoint, col: parseInt(e.target.value) || 0 })}
                    style={inputStyle}
                  />
                </div>
              </div>
            )}
          </div>

          {/* DIRECTION SETTINGS */}
          <div style={sectionStyle}>
            <h4 style={sectionTitle}>🧭 Line Directions</h4>
            <div style={{ display: 'flex', gap: 15, flexWrap: 'wrap' }}>
              {['horizontal', 'vertical', 'diagonal'].map(dir => (
                <label key={dir} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ccc', fontSize: 13, cursor: 'pointer' }}>
                  <input type="checkbox" 
                    checked={(cfg.lineDirections || []).includes(dir)}
                    onChange={e => {
                      const current = cfg.lineDirections || ['horizontal','vertical','diagonal'];
                      const updated = e.target.checked ? [...current, dir] : current.filter(d => d !== dir);
                      updateConfig('lineDirections', updated.length === 0 ? ['horizontal'] : updated);
                    }}
                  />
                  {dir.charAt(0).toUpperCase() + dir.slice(1)}
                </label>
              ))}
            </div>
            <div style={{ marginTop: 12 }}>
              <label style={labelStyle}>Exclusive Lines Type</label>
              <select value={cfg.exclusiveLines || ''}
                onChange={e => updateConfig('exclusiveLines', e.target.value || null)}
                style={inputStyle}>
                <option value="">None</option>
                <option value="rows">Rows Only</option>
                <option value="columns">Columns Only</option>
                <option value="diagonals">Diagonals Only</option>
              </select>
            </div>
          </div>

          {/* COMBINATION SETTINGS */}
          <div style={sectionStyle}>
            <h4 style={sectionTitle}>🔢 Required Combination</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {['rows', 'columns', 'diagonals'].map(type => (
                <div key={type}>
                  <label style={labelStyle}>Required {type.charAt(0).toUpperCase() + type.slice(1)}</label>
                  <input type="number" 
                    value={cfg.requiredCombination?.[type] ?? ''} 
                    onChange={e => {
                      const val = e.target.value === '' ? null : parseInt(e.target.value);
                      updateConfig('requiredCombination', { ...cfg.requiredCombination, [type]: val });
                    }}
                    placeholder="Any" style={inputStyle}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SPECIFIC LINES */}
          <div style={sectionStyle}>
            <h4 style={sectionTitle}>📍 Specific Lines Required</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { key: 'topRow', label: 'Top Row' },
                { key: 'bottomRow', label: 'Bottom Row' },
                { key: 'leftColumn', label: 'Left Column' },
                { key: 'rightColumn', label: 'Right Column' },
                { key: 'centerRow', label: 'Center Row' },
                { key: 'centerColumn', label: 'Center Column' },
                { key: 'mainDiagonal', label: 'Main Diagonal (\\)' },
                { key: 'antiDiagonal', label: 'Anti-Diagonal (/)' }
              ].map(item => (
                <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ccc', fontSize: 12, cursor: 'pointer' }}>
                  <input type="checkbox" 
                    checked={cfg.specificLines?.[item.key] || false}
                    onChange={e => updateConfig('specificLines', { ...cfg.specificLines, [item.key]: e.target.checked })}
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </div>

          {/* SPECIAL SETTINGS */}
          <div style={sectionStyle}>
            <h4 style={sectionTitle}>⚡ Special Settings</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={labelStyle}>Corners Required</label>
                <select value={cfg.cornersRequired ? 'true' : 'false'}
                  onChange={e => updateConfig('cornersRequired', e.target.value === 'true')}
                  style={inputStyle}>
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Min Cells Marked</label>
                <input type="number" 
                  value={cfg.minCellsMarked ?? ''} 
                  onChange={e => updateConfig('minCellsMarked', e.target.value === '' ? null : parseInt(e.target.value))}
                  placeholder="No minimum" style={inputStyle}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* ============================================ */}
      {/* PATTERN-BASED CONFIGURATION */}
      {/* ============================================ */}
      {method === 'pattern' && (
        <div style={sectionStyle}>
          <h4 style={sectionTitle}>🎯 Pattern Configuration</h4>
          <p style={{ fontSize: 11, color: '#888', marginBottom: 12 }}>
            Define specific cell patterns that must be matched to win
          </p>
          
          {/* Existing Patterns */}
          {patterns.length > 0 && (
            <div style={{ marginBottom: 15 }}>
              <label style={labelStyle}>Saved Patterns ({patterns.length})</label>
              {patterns.map((pattern, idx) => (
                <div key={idx} style={{
                  background: '#0f3460', padding: 10, borderRadius: 8,
                  marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <span style={{ color: '#FFA502', fontWeight: 600, fontSize: 13 }}>
                    {pattern.name} 
                    <span style={{ color: '#888', fontSize: 11, marginLeft: 8 }}>
                      ({pattern.cells.length} cells)
                    </span>
                  </span>
                  <button onClick={() => removePattern(idx)} style={{
                    background: '#3a0a0a', color: '#FF4757', border: 'none',
                    padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 11
                  }}>✕</button>
                </div>
              ))}
            </div>
          )}
          
          {/* Add New Pattern */}
          <div style={{ background: '#1a1a3e', padding: 15, borderRadius: 10, border: '1px solid #333' }}>
            <label style={labelStyle}>Pattern Name</label>
            <input value={newPatternName} onChange={e => setNewPatternName(e.target.value)}
              placeholder="e.g., X Pattern, Cross" style={inputStyle} />
            
            <label style={labelStyle}>Click cells to select pattern ({selectedCells.length} selected)</label>
            
            {/* Mini Grid for Pattern Selection */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
              <div style={{ display: 'inline-block', background: '#0a0a1e', padding: 8, borderRadius: 8 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2 }}>
                  {['B','I','N','G','O'].map((c, idx) => (
                    <div key={c} style={{ 
                      textAlign: 'center', fontWeight: 700, fontSize: 10, padding: '3px',
                      color: '#fff', background: ['#FF4757','#FFA502','#2ED573','#FF6348','#7C5CFC'][idx]
                    }}>{c}</div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2, marginTop: 2 }}>
                  {[0,1,2,3,4].map(row => 
                    [0,1,2,3,4].map(col => {
                      const isSelected = selectedCells.some(c => c[0] === row && c[1] === col);
                      return (
                        <div key={`${row}-${col}`} onClick={() => togglePatternCell(row, col)}
                          style={{
                            width: 35, height: 35, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 10, borderRadius: 4, cursor: 'pointer',
                            background: isSelected ? '#FFA502' : '#1a1a3e',
                            color: isSelected ? '#000' : '#555',
                            border: isSelected ? '2px solid #FFA502' : '1px solid #333',
                            fontWeight: isSelected ? 700 : 400
                          }}>
                          {row * 5 + col + 1}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
            
            <button onClick={addPattern}
              disabled={!newPatternName || selectedCells.length === 0}
              style={{
                width: '100%', padding: 10, marginTop: 10,
                background: !newPatternName || selectedCells.length === 0 ? '#333' : '#FFA502',
                color: '#000', border: 'none', borderRadius: 8, cursor: 'pointer',
                fontWeight: 700, fontSize: 13,
                opacity: !newPatternName || selectedCells.length === 0 ? 0.5 : 1
              }}>
              + Add Pattern
            </button>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* CONFIG SUMMARY */}
      {/* ============================================ */}
      <div style={{ ...sectionStyle, background: '#1a1a3e' }}>
        <h4 style={{ ...sectionTitle, color: '#7C5CFC' }}>📋 Configuration Summary</h4>
        <div style={{ fontSize: 11, color: '#aaa', lineHeight: 1.6 }}>
          {method === 'rule' ? (
            <>
              <div>🎯 Lines to win: <b>{cfg.linesToWin}</b></div>
              <div>📏 Rows: min={cfg.minRows} exact={cfg.exactRows ?? 'any'} max={cfg.maxRows ?? '∞'}</div>
              <div>📏 Cols: min={cfg.minColumns} exact={cfg.exactColumns ?? 'any'} max={cfg.maxColumns ?? '∞'}</div>
              <div>📏 Diags: min={cfg.minDiagonals} exact={cfg.exactDiagonals ?? 'any'} max={cfg.maxDiagonals ?? '∞'}</div>
              <div>⭐ Free: {cfg.freeSpaceCounts !== false ? 'Counts' : 'Blocked'}{cfg.freeSpaceRequiredForWin ? ' | Required' : ''}</div>
              <div>🔗 Overlap: {cfg.allowOverlapping !== false ? 'Yes' : 'No'}{cfg.sharedCellsLimit ? ` (max ${cfg.sharedCellsLimit})` : ''}</div>
              <div>📍 Intersect: {cfg.linesMustIntersect ? `Yes [${cfg.intersectionPoint?.row},${cfg.intersectionPoint?.col}]` : 'No'}</div>
              <div>🧭 Directions: {(cfg.lineDirections || []).join(', ')}{cfg.exclusiveLines ? ` (only ${cfg.exclusiveLines})` : ''}</div>
            </>
          ) : (
            <div>🎯 Patterns defined: <b>{patterns.length}</b></div>
          )}
        </div>
      </div>
    </div>
  );
}