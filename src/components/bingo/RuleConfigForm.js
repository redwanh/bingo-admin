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
  grid5: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '8px',
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
  presetBtn: {
    padding: '8px',
    background: '#ffffff',
    color: '#1a1a2e',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '11px',
    textAlign: 'center',
    transition: 'all 0.2s ease',
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
};

// Language names config with descriptions
const langNames = [
  { 
    key: 'nameAmharic', 
    descKey: 'descriptionAmharic',
    label: 'አማርኛ (Amharic)', 
    flag: '🇪🇹', 
    placeholder: 'በአማርኛ የህግ ስም',
    descPlaceholder: 'በአማርኛ መግለጫ'
  },
  { 
    key: 'nameTigrinya', 
    descKey: 'descriptionTigrinya',
    label: 'ትግርኛ (Tigrinya)', 
    flag: '🇪🇷', 
    placeholder: 'ብትግርኛ ስም ሕጊ',
    descPlaceholder: 'ብትግርኛ መግለጺ'
  },
  { 
    key: 'nameOromo', 
    descKey: 'descriptionOromo',
    label: 'Afaan Oromo (Oromo)', 
    flag: '🇪🇹', 
    placeholder: 'Maqaa seeraa Afaan Oromoon',
    descPlaceholder: 'Ibsa Afaan Oromoon'
  },
  { 
    key: 'nameChinese', 
    descKey: 'descriptionChinese',
    label: '中文 (Chinese)', 
    flag: '🇨🇳', 
    placeholder: '规则名称（中文）',
    descPlaceholder: '规则描述（中文）'
  },
  { 
    key: 'nameEnglish', 
    descKey: 'descriptionEnglish',
    label: 'English', 
    flag: '🇬🇧', 
    placeholder: 'Rule name in English',
    descPlaceholder: 'Rule description in English'
  },
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
        minSquares: 0,
    exactSquares: null,
    maxSquares: null,
    squareMinSize: 2,
    squareMaxSize: 5,
    
    // Rectangle
    minRectangles: 0,
    exactRectangles: null,
    maxRectangles: null,
    rectMinWidth: 2,
    rectMaxWidth: 5,
    rectMinHeight: 2,
    rectMaxHeight: 5,
    
    
    ...config
  };
  
  const updateConfig = (key, value) => {
    onChange({ ...cfg, [key]: value });
  };
  
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
  
  const togglePatternCell = (row, col) => {
    setSelectedCells(prev => {
      const exists = prev.find(c => c[0] === row && c[1] === col);
      if (exists) return prev.filter(c => !(c[0] === row && c[1] === col));
      return [...prev, [row, col]];
    });
  };
  
 const addPattern = () => {
    if (!newPatternName || selectedCells.length === 0) return;
    
    console.log('🔵 [ADD PATTERN] Adding:', {
      name: newPatternName,
      cells: selectedCells,
      currentPatterns: patterns.length
    });
    
    const updatedPatterns = [...patterns, { name: newPatternName, cells: [...selectedCells] }];
    
    console.log('🔵 [ADD PATTERN] Updated patterns:', updatedPatterns);
    console.log('🔵 [ADD PATTERN] Calling onChange with patterns:', updatedPatterns.length);
    
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
      {/* 🔧 Multi-Language Rule Names & Descriptions */}
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
                <input 
                  value={cfg[lang.key] || ''} 
                  onChange={e => updateConfig(lang.key, e.target.value)}
                  placeholder={lang.placeholder}
                  style={styles.input}
                />
              </div>
              <div>
                <label style={{ fontSize: 10, color: '#6b7280', display: 'block', marginBottom: 4 }}>Description</label>
                <input 
                  value={cfg[lang.descKey] || ''} 
                  onChange={e => updateConfig(lang.descKey, e.target.value)}
                  placeholder={lang.descPlaceholder}
                  style={styles.input}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Shape Presets */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>🎨 Shape Presets (Quick Setup)</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          {[
            { key: 'any_T', label: 'T Any', icon: '⊥' },
            { key: 'top_T', label: 'T Top', icon: '⊤' },
            { key: 'bottom_T', label: 'T Bottom', icon: '⊥' },
            { key: 'left_T', label: 'T Left', icon: '⊣' },
            { key: 'right_T', label: 'T Right', icon: '⊢' },
            { key: 'X_shape', label: 'X Shape', icon: '✕' },
            { key: 'plus_sign', label: '+ Plus', icon: '✚' }
          ].map(preset => (
            <button key={preset.key} onClick={() => applyShapePreset(preset.key)} style={styles.presetBtn}>
              <div style={{ fontSize: 18 }}>{preset.icon}</div>
              <div style={{ fontWeight: 600 }}>{preset.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Rule-Based Configuration */}
      {method === 'rule' && (
        <>
          {/* Core Settings */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>🎯 Core Settings</h4>
            <div style={styles.grid2}>
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
                  <label style={styles.label}>{f.label}</label>
                  <input type="number" 
                    value={cfg[f.key] !== null && cfg[f.key] !== undefined ? cfg[f.key] : ''} 
                    onChange={e => updateConfig(f.key, e.target.value === '' ? null : parseInt(e.target.value))}
                    placeholder="Optional" style={styles.input}
                  />
                </div>
              ))}
            </div>
          </div>
{/* Square Settings */}
<div style={styles.section}>
  <h4 style={styles.sectionTitle}>🟦 Square Blocks (NxN)</h4>
  <div style={styles.grid2}>
    <div style={styles.fieldWrapper}>
      <label style={styles.label}>Min Squares</label>
      <input type="number" min={0} value={cfg.minSquares ?? ''} 
        onChange={e => updateConfig('minSquares', e.target.value === '' ? null : parseInt(e.target.value))}
        placeholder="Any" style={styles.input} />
    </div>
    <div style={styles.fieldWrapper}>
      <label style={styles.label}>Exact Squares</label>
      <input type="number" min={0} value={cfg.exactSquares ?? ''} 
        onChange={e => updateConfig('exactSquares', e.target.value === '' ? null : parseInt(e.target.value))}
        placeholder="Any" style={styles.input} />
    </div>
    <div style={styles.fieldWrapper}>
      <label style={styles.label}>Max Squares</label>
      <input type="number" min={0} value={cfg.maxSquares ?? ''} 
        onChange={e => updateConfig('maxSquares', e.target.value === '' ? null : parseInt(e.target.value))}
        placeholder="Any" style={styles.input} />
    </div>
    <div style={styles.fieldWrapper}>
      <label style={styles.label}>Min Size (2=2x2)</label>
      <input type="number" min={2} max={5} value={cfg.squareMinSize ?? ''} 
        onChange={e => updateConfig('squareMinSize', e.target.value === '' ? 2 : parseInt(e.target.value))}
        style={styles.input} />
    </div>
    <div style={styles.fieldWrapper}>
      <label style={styles.label}>Max Size</label>
      <input type="number" min={2} max={5} value={cfg.squareMaxSize ?? ''} 
        onChange={e => updateConfig('squareMaxSize', e.target.value === '' ? 5 : parseInt(e.target.value))}
        style={styles.input} />
    </div>
  </div>
</div>

{/* Rectangle Settings */}
<div style={styles.section}>
  <h4 style={styles.sectionTitle}>🟩 Rectangle Blocks (NxM)</h4>
  <div style={styles.grid2}>
    <div style={styles.fieldWrapper}>
      <label style={styles.label}>Min Rectangles</label>
      <input type="number" min={0} value={cfg.minRectangles ?? ''} 
        onChange={e => updateConfig('minRectangles', e.target.value === '' ? null : parseInt(e.target.value))}
        placeholder="Any" style={styles.input} />
    </div>
    <div style={styles.fieldWrapper}>
      <label style={styles.label}>Exact Rectangles</label>
      <input type="number" min={0} value={cfg.exactRectangles ?? ''} 
        onChange={e => updateConfig('exactRectangles', e.target.value === '' ? null : parseInt(e.target.value))}
        placeholder="Any" style={styles.input} />
    </div>
    <div style={styles.fieldWrapper}>
      <label style={styles.label}>Max Rectangles</label>
      <input type="number" min={0} value={cfg.maxRectangles ?? ''} 
        onChange={e => updateConfig('maxRectangles', e.target.value === '' ? null : parseInt(e.target.value))}
        placeholder="Any" style={styles.input} />
    </div>
    <div style={styles.fieldWrapper}>
      <label style={styles.label}>Min Width</label>
      <input type="number" min={2} max={5} value={cfg.rectMinWidth ?? ''} 
        onChange={e => updateConfig('rectMinWidth', e.target.value === '' ? 2 : parseInt(e.target.value))}
        style={styles.input} />
    </div>
    <div style={styles.fieldWrapper}>
      <label style={styles.label}>Max Width</label>
      <input type="number" min={2} max={5} value={cfg.rectMaxWidth ?? ''} 
        onChange={e => updateConfig('rectMaxWidth', e.target.value === '' ? 5 : parseInt(e.target.value))}
        style={styles.input} />
    </div>
    <div style={styles.fieldWrapper}>
      <label style={styles.label}>Min Height</label>
      <input type="number" min={2} max={5} value={cfg.rectMinHeight ?? ''} 
        onChange={e => updateConfig('rectMinHeight', e.target.value === '' ? 2 : parseInt(e.target.value))}
        style={styles.input} />
    </div>
    <div style={styles.fieldWrapper}>
      <label style={styles.label}>Max Height</label>
      <input type="number" min={2} max={5} value={cfg.rectMaxHeight ?? ''} 
        onChange={e => updateConfig('rectMaxHeight', e.target.value === '' ? 5 : parseInt(e.target.value))}
        style={styles.input} />
    </div>
  </div>
</div>
          {/* Free Space Settings */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>⭐ Free Space</h4>
            <div style={styles.grid2}>
              <div>
                <label style={styles.label}>Free Space Counts</label>
                <select value={cfg.freeSpaceCounts !== false ? 'true' : 'false'}
                  onChange={e => updateConfig('freeSpaceCounts', e.target.value === 'true')}
                  style={styles.select}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Free Space Required</label>
                <select value={cfg.freeSpaceRequiredForWin ? 'true' : 'false'}
                  onChange={e => updateConfig('freeSpaceRequiredForWin', e.target.value === 'true')}
                  style={styles.select}>
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Free Space Blocked</label>
                <select value={cfg.freeSpaceBlocked ? 'true' : 'false'}
                  onChange={e => updateConfig('freeSpaceBlocked', e.target.value === 'true')}
                  style={styles.select}>
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
                  onChange={e => updateConfig('allowOverlapping', e.target.value === 'true')}
                  style={styles.select}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Shared Cells Limit</label>
                <input type="number" 
                  value={cfg.sharedCellsLimit ?? ''} 
                  onChange={e => updateConfig('sharedCellsLimit', e.target.value === '' ? null : parseInt(e.target.value))}
                  placeholder="Unlimited" style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Lines Must Intersect</label>
                <select value={cfg.linesMustIntersect ? 'true' : 'false'}
                  onChange={e => updateConfig('linesMustIntersect', e.target.value === 'true')}
                  style={styles.select}>
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Lines Must NOT Touch</label>
                <select value={cfg.linesMustNotIntersect ? 'true' : 'false'}
                  onChange={e => updateConfig('linesMustNotIntersect', e.target.value === 'true')}
                  style={styles.select}>
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
            </div>
            {cfg.linesMustIntersect && (
              <div style={styles.grid2}>
                <div>
                  <label style={styles.label}>Intersection Row (0-4)</label>
                  <input type="number" min={0} max={4}
                    value={cfg.intersectionPoint?.row ?? ''} 
                    onChange={e => updateConfig('intersectionPoint', { ...cfg.intersectionPoint, row: parseInt(e.target.value) || 0 })}
                    style={styles.input}
                  />
                </div>
                <div>
                  <label style={styles.label}>Intersection Column (0-4)</label>
                  <input type="number" min={0} max={4}
                    value={cfg.intersectionPoint?.col ?? ''} 
                    onChange={e => updateConfig('intersectionPoint', { ...cfg.intersectionPoint, col: parseInt(e.target.value) || 0 })}
                    style={styles.input}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Direction Settings */}
          {/* Direction Settings */}
<div style={styles.section}>
  <h4 style={styles.sectionTitle}>🧭 Line Directions</h4>
  <div style={styles.flex}>
  {['horizontal', 'vertical', 'diagonal', 'square', 'rectangle'].map(dir => {
    const isChecked = (cfg.lineDirections || []).includes(dir);
    return (
      <div key={dir} 
        onClick={() => {
          const current = [...(cfg.lineDirections || ['horizontal','vertical','diagonal'])];
          const updated = isChecked ? current.filter(d => d !== dir) : [...current, dir];
          onChange({ ...cfg, lineDirections: updated.length === 0 ? ['horizontal'] : updated });
        }}
        style={{
          ...styles.checkboxLabel,
          background: isChecked ? '#d4af37' : '#fff',
          color: isChecked ? '#fff' : '#1a1a2e',
          border: isChecked ? '2px solid #000' : '1px solid #e5e7eb',
        }}>
        <span style={{ fontSize: 14, fontWeight: 600 }}>
          {isChecked ? '✓ ' : ''}{dir.charAt(0).toUpperCase() + dir.slice(1)}
        </span>
      </div>
    );
  })}
</div>
</div>

          {/* Combination Settings */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>🔢 Required Combination</h4>
            <div style={styles.grid3}>
              {['rows', 'columns', 'diagonals'].map(type => (
                <div key={type}>
                  <label style={styles.label}>Required {type.charAt(0).toUpperCase() + type.slice(1)}</label>
                  <input type="number" 
                    value={cfg.requiredCombination?.[type] ?? ''} 
                    onChange={e => {
                      const val = e.target.value === '' ? null : parseInt(e.target.value);
                      updateConfig('requiredCombination', { ...cfg.requiredCombination, [type]: val });
                    }}
                    placeholder="Any" style={styles.input}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Specific Lines */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>📍 Specific Lines Required</h4>
            <div style={styles.grid2}>
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
                <label key={item.key} style={styles.checkboxLabel}>
                  <input type="checkbox" 
                    checked={cfg.specificLines?.[item.key] || false}
                    onChange={e => updateConfig('specificLines', { ...cfg.specificLines, [item.key]: e.target.checked })}
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </div>

          {/* Special Settings */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>⚡ Special Settings</h4>
            <div style={styles.grid2}>
              <div>
                <label style={styles.label}>Corners Required</label>
                <select value={cfg.cornersRequired ? 'true' : 'false'}
                  onChange={e => updateConfig('cornersRequired', e.target.value === 'true')}
                  style={styles.select}>
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Min Cells Marked</label>
                <input type="number" 
                  value={cfg.minCellsMarked ?? ''} 
                  onChange={e => updateConfig('minCellsMarked', e.target.value === '' ? null : parseInt(e.target.value))}
                  placeholder="No minimum" style={styles.input}
                />
              </div>
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
                    {pattern.name} 
                    <span style={styles.patternCount}>({pattern.cells.length} cells)</span>
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
                          style={{
                            ...styles.gridCell,
                            ...(isSelected ? styles.gridCellSelected : {})
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
                ...styles.addPatternBtn,
                ...(!newPatternName || selectedCells.length === 0 ? styles.addPatternBtnDisabled : {})
              }}>
              + Add Pattern
            </button>
          </div>
        </div>
      )}

      {/* Config Summary */}
      <div style={{ ...styles.section, background: '#f9fafb' }}>
        <h4 style={{ ...styles.sectionTitle, color: '#6d28d9' }}>📋 Configuration Summary</h4>
        <div style={{ fontSize: 11, color: '#1a1a2e', lineHeight: 1.6 }}>
          {/* Multi-language summary */}
          {(cfg.nameAmharic || cfg.nameEnglish || cfg.descriptionAmharic || cfg.descriptionEnglish) && (
            <div style={{ marginBottom: 8, padding: '8px 10px', background: '#fff', borderRadius: 6, border: '1px solid #e5e7eb' }}>
              <b>🌐 Names:</b>{' '}
              {cfg.nameAmharic && `🇪🇹 ${cfg.nameAmharic}`}
              {cfg.nameTigrinya && ` | 🇪🇷 ${cfg.nameTigrinya}`}
              {cfg.nameOromo && ` | ${cfg.nameOromo}`}
              {cfg.nameChinese && ` | 🇨🇳 ${cfg.nameChinese}`}
              {cfg.nameEnglish && ` | 🇬🇧 ${cfg.nameEnglish}`}
              {(cfg.descriptionAmharic || cfg.descriptionEnglish) && (
                <div style={{ marginTop: 4, fontSize: 10, color: '#6b7280' }}>
                  <b>📝 Descriptions:</b>{' '}
                  {cfg.descriptionAmharic && `🇪🇹 ${cfg.descriptionAmharic.substring(0, 30)}...`}
                  {cfg.descriptionEnglish && ` | 🇬🇧 ${cfg.descriptionEnglish.substring(0, 30)}...`}
                </div>
              )}
            </div>
          )}
          
          {method === 'rule' ? (
            <>
              <div>🎯 Lines to win: <b>{cfg.linesToWin}</b></div>
              <div>📏 Rows: min={cfg.minRows} exact={cfg.exactRows ?? 'any'} max={cfg.maxRows ?? '∞'}</div>
              <div>📏 Cols: min={cfg.minColumns} exact={cfg.exactColumns ?? 'any'} max={cfg.maxColumns ?? '∞'}</div>
              <div>📏 Diags: min={cfg.minDiagonals} exact={cfg.exactDiagonals ?? 'any'} max={cfg.maxDiagonals ?? '∞'}</div>
              <div>🟦 Squares: min={cfg.minSquares ?? 'any'} exact={cfg.exactSquares ?? 'any'} max={cfg.maxSquares ?? '∞'}</div>
<div>🟩 Rectangles: min={cfg.minRectangles ?? 'any'} exact={cfg.exactRectangles ?? 'any'} max={cfg.maxRectangles ?? '∞'}</div>
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