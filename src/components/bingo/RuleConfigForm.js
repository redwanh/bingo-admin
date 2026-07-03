import React, { useState } from 'react';

const styles = {
  section: { background: '#f9fafb', padding: '15px', borderRadius: '10px', marginTop: '15px', border: '1px solid #e5e7eb' },
  sectionTitle: { fontSize: '13px', color: '#b8962f', fontWeight: 700, marginBottom: '12px' },
  label: { fontSize: '11px', color: '#6b7280', display: 'block', marginBottom: '4px', marginTop: '10px' },
  hint: { fontSize: '10px', color: '#9ca3af', marginTop: '2px' },
  input: { width: '100%', padding: '10px', background: '#ffffff', color: '#1a1a2e', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' },
  select: { width: '100%', padding: '10px', background: '#ffffff', color: '#1a1a2e', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' },
  flex: { display: 'flex', gap: '15px', flexWrap: 'wrap' },
  checkboxLabel: { display: 'flex', alignItems: 'center', gap: '6px', color: '#1a1a2e', fontSize: '13px', cursor: 'pointer' },
  checkboxChip: (active) => ({ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '12px', background: active ? '#d4af37' : '#fff', color: active ? '#fff' : '#1a1a2e', border: active ? '2px solid #000' : '1px solid #e5e7eb', userSelect: 'none' }),
  fieldWrapper: { display: 'flex', flexDirection: 'column' },
  langCard: { marginBottom: 12, padding: 12, background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb' },
  patternItem: { background: '#f9fafb', padding: '10px', borderRadius: '8px', marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e5e7eb' },
  patternName: { color: '#b8962f', fontWeight: 600, fontSize: '13px' },
  patternCount: { color: '#6b7280', fontSize: '11px', marginLeft: '8px' },
  deleteBtn: { background: '#fee2e2', color: '#991b1b', border: '1px solid #ef4444', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' },
  miniGrid: { display: 'inline-block', background: '#ffffff', padding: '8px', borderRadius: '8px', border: '1px solid #e5e7eb' },
  gridCell: { width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', borderRadius: '4px', cursor: 'pointer', background: '#f9fafb', color: '#6b7280', border: '1px solid #e5e7eb', fontWeight: 400 },
  gridCellSelected: { background: '#d4af37', color: '#ffffff', border: '2px solid #000000', fontWeight: 700 },
  headerCell: { textAlign: 'center', fontWeight: 700, fontSize: '10px', padding: '3px' },
  addPatternBtn: { width: '100%', padding: '10px', marginTop: '10px', background: 'linear-gradient(135deg, #d4af37, #b8962f)', color: '#fff', border: '2px solid #000000', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '13px', transition: 'all 0.2s ease' },
  addPatternBtnDisabled: { opacity: 0.5, cursor: 'not-allowed' },
  helpLink: { fontSize: 12, color: '#d4af37', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline', background: 'none', border: 'none', padding: 0 },
  helpOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  helpModal: { background: '#fff', borderRadius: '16px', padding: '24px', maxWidth: '650px', width: '100%', maxHeight: '85vh', overflowY: 'auto', border: '2px solid #000' },
  helpSection: { marginBottom: 16, padding: 12, background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' },
  helpTitle: { fontSize: 14, fontWeight: 700, color: '#b8962f', marginBottom: 6 },
  helpText: { fontSize: 11, color: '#4b5563', lineHeight: 1.6, margin: 0 },
  helpCode: { background: '#1a1a2e', color: '#d4af37', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontFamily: 'monospace' },
};

const langNames = [
  { key: 'nameAmharic', descKey: 'descriptionAmharic', label: 'አማርኛ (Amharic)', flag: '🇪🇹', ph: 'የህግ ስም', dph: 'መግለጫ' },
  { key: 'nameTigrinya', descKey: 'descriptionTigrinya', label: 'ትግርኛ (Tigrinya)', flag: '🇪🇷', ph: 'ስም ሕጊ', dph: 'መግለጺ' },
  { key: 'nameOromo', descKey: 'descriptionOromo', label: 'Afaan Oromo', flag: '🇪🇹', ph: 'Maqaa seeraa', dph: 'Ibsa' },
  { key: 'nameChinese', descKey: 'descriptionChinese', label: '中文 (Chinese)', flag: '🇨🇳', ph: '规则名称', dph: '规则描述' },
  { key: 'nameEnglish', descKey: 'descriptionEnglish', label: 'English', flag: '🇬🇧', ph: 'Rule name', dph: 'Description' },
];

export default function RuleConfigForm({ config, onChange, patterns = [], method = 'rule' }) {
  const [newPatternName, setNewPatternName] = useState('');
  const [selectedCells, setSelectedCells] = useState([]);
  const [showHelp, setShowHelp] = useState(false);

  const cfg = {
    linesToWin: 1, minRows: 0, minColumns: 0, minDiagonals: 0,
    exactRows: null, exactColumns: null, exactDiagonals: null,
    maxRows: null, maxColumns: null, maxDiagonals: null,
    minSquares: 0, exactSquares: null, maxSquares: null, squareSize: 2,
    minRectangles: 0, exactRectangles: null, maxRectangles: null, rectWidth: 3, rectHeight: 2,
    requiredCombination: { rows: null, columns: null, diagonals: null },
    mustHaveAllTypes: false, exclusiveLines: null,
    linesMustIntersect: false, linesMustNotIntersect: false,
    intersectionPoint: { row: 2, col: 2 },
    freeSpaceCounts: true, freeSpaceRequiredForWin: false, freeSpaceBlocked: false,
    allowOverlapping: true, sharedCellsLimit: null,
    lineDirections: ['horizontal', 'vertical', 'diagonal'],
    requiredDirections: [], prohibitedDirections: [],
    cornersRequired: false, minCellsMarked: null,
    specificLines: { topRow: false, bottomRow: false, leftColumn: false, rightColumn: false, centerRow: false, centerColumn: false, mainDiagonal: false, antiDiagonal: false },
    nameAmharic: '', nameTigrinya: '', nameOromo: '', nameChinese: '', nameEnglish: '',
    descriptionAmharic: '', descriptionTigrinya: '', descriptionOromo: '', descriptionChinese: '', descriptionEnglish: '',
    ...config
  };

  const updateConfig = (key, value) => onChange({ ...cfg, [key]: value });
  const togglePatternCell = (row, col) => {
    setSelectedCells(prev => { const exists = prev.find(c => c[0] === row && c[1] === col); return exists ? prev.filter(c => !(c[0] === row && c[1] === col)) : [...prev, [row, col]]; });
  };
  const addPattern = () => { if (!newPatternName || selectedCells.length === 0) return; onChange({ ...cfg, patterns: [...patterns, { name: newPatternName, cells: [...selectedCells] }] }); setNewPatternName(''); setSelectedCells([]); };
  const removePattern = (i) => onChange({ ...cfg, patterns: patterns.filter((_, idx) => idx !== i) });
  const letterColors = ['#FF4757', '#FFA502', '#2ED573', '#FF6348', '#7C5CFC'];
  const letters = ['B', 'I', 'N', 'G', 'O'];

  return (
    <div>
      {/* 📖 Help Link */}
      <div style={{ textAlign: 'right', marginBottom: 8 }}>
        <button onClick={() => setShowHelp(true)} style={styles.helpLink}>📖 How to Configure Rules</button>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div style={styles.helpOverlay} onClick={() => setShowHelp(false)}>
          <div style={styles.helpModal} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>📖 How to Configure Rules</h3>
              <button onClick={() => setShowHelp(false)} style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: 14 }}>✕</button>
            </div>
            <div style={styles.helpSection}><p style={styles.helpTitle}>🎯 Lines to Win</p><p style={styles.helpText}>Total lines needed. <b>Example:</b> <span style={styles.helpCode}>3</span> = need 3 lines of any type.</p></div>
            <div style={styles.helpSection}><p style={styles.helpTitle}>📏 Min / Exact / Max</p><p style={styles.helpText}><b>Min=0, Exact=empty, Max=empty</b> = any number allowed.<br/><b>Exact=2</b> = exactly 2 required. <b>Exact=0</b> = forbidden.<br/><b>Example:</b> Exact Rows=1, Exact Cols=2 = 1 row + 2 columns.</p></div>
            <div style={styles.helpSection}><p style={styles.helpTitle}>🟦 Square Blocks</p><p style={styles.helpText}>N×N filled block counts as 1 line. Size <span style={styles.helpCode}>2</span> = 2×2.<br/><b>Example:</b> Min Squares=3, Size=2, Overlap=No = 3 separate 2×2 blocks.</p></div>
            <div style={styles.helpSection}><p style={styles.helpTitle}>🟩 Rectangle Blocks</p><p style={styles.helpText}>W×H filled block counts as 1 line. Default 3×2.<br/><b>Example:</b> Exact Rectangles=1 = need one 3×2 block.</p></div>
            <div style={styles.helpSection}><p style={styles.helpTitle}>🧭 Line Directions</p><p style={styles.helpText}>Click to toggle which types count. Only checked types are counted.</p></div>
            <div style={styles.helpSection}><p style={styles.helpTitle}>🔗 Overlap</p><p style={styles.helpText}><b>Yes</b> = lines can share cells. <b>No</b> = each line must be separate.</p></div>
            <div style={styles.helpSection}><p style={styles.helpTitle}>💡 Quick Examples</p><p style={styles.helpText}>
              <b>Classic:</b> Lines=1, all dirs ON<br/>
              <b>3 Squares:</b> Lines=3, only Square ON, Min=3, Size=2, Overlap=No<br/>
              <b>2 Squares+1 Row:</b> Lines=3, Square+Row ON, Exact Squares=2, Exact Rows=1, Overlap=No
            </p></div>
          </div>
        </div>
      )}

      {/* 🌐 Multi-Language (ADDED) */}
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

      {/* Rule-Based Configuration */}
      {method === 'rule' && (
        <>
          {/* Core Settings */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>🎯 Core Settings</h4>
            <div style={styles.grid2}>
              {[
                { key: 'linesToWin', label: 'Lines to Win' },
                { key: 'minRows', label: 'Min Rows' }, { key: 'minColumns', label: 'Min Columns' }, { key: 'minDiagonals', label: 'Min Diagonals' },
                { key: 'exactRows', label: 'Exact Rows' }, { key: 'exactColumns', label: 'Exact Columns' }, { key: 'exactDiagonals', label: 'Exact Diagonals' },
                { key: 'maxRows', label: 'Max Rows' }, { key: 'maxColumns', label: 'Max Columns' }, { key: 'maxDiagonals', label: 'Max Diagonals' }
              ].map(f => (
                <div key={f.key}>
                  <label style={styles.label}>{f.label}</label>
                  <input type="number" value={cfg[f.key] !== null && cfg[f.key] !== undefined ? cfg[f.key] : ''} onChange={e => updateConfig(f.key, e.target.value === '' ? null : parseInt(e.target.value))} placeholder="Optional" style={styles.input} />
                </div>
              ))}
            </div>
          </div>

          {/* 🟦 Square Blocks (ADDED) */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>🟦 Square Blocks (N×N)</h4>
            <p style={{ fontSize: 11, color: '#6b7280', margin: '0 0 8px' }}>Completely filled N×N block. Each counts as 1 line.</p>
            <div style={styles.grid2}>
              <div style={styles.fieldWrapper}><label style={styles.label}>Min Squares</label><input type="number" min={0} value={cfg.minSquares ?? ''} onChange={e => updateConfig('minSquares', e.target.value === '' ? 0 : parseInt(e.target.value))} placeholder="0" style={styles.input} /></div>
              <div style={styles.fieldWrapper}><label style={styles.label}>Exact Squares</label><input type="number" min={0} value={cfg.exactSquares ?? ''} onChange={e => updateConfig('exactSquares', e.target.value === '' ? null : parseInt(e.target.value))} placeholder="Any" style={styles.input} /></div>
              <div style={styles.fieldWrapper}><label style={styles.label}>Max Squares</label><input type="number" min={0} value={cfg.maxSquares ?? ''} onChange={e => updateConfig('maxSquares', e.target.value === '' ? null : parseInt(e.target.value))} placeholder="∞" style={styles.input} /></div>
              <div style={styles.fieldWrapper}><label style={styles.label}>Square Size (2=2×2)</label><input type="number" min={2} max={5} value={cfg.squareSize || 2} onChange={e => updateConfig('squareSize', parseInt(e.target.value) || 2)} style={styles.input} /></div>
            </div>
          </div>

          {/* 🟩 Rectangle Blocks (ADDED) */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>🟩 Rectangle Blocks (W×H)</h4>
            <p style={{ fontSize: 11, color: '#6b7280', margin: '0 0 8px' }}>Completely filled W×H block. Each counts as 1 line.</p>
            <div style={styles.grid2}>
              <div style={styles.fieldWrapper}><label style={styles.label}>Min Rectangles</label><input type="number" min={0} value={cfg.minRectangles ?? ''} onChange={e => updateConfig('minRectangles', e.target.value === '' ? 0 : parseInt(e.target.value))} placeholder="0" style={styles.input} /></div>
              <div style={styles.fieldWrapper}><label style={styles.label}>Exact Rectangles</label><input type="number" min={0} value={cfg.exactRectangles ?? ''} onChange={e => updateConfig('exactRectangles', e.target.value === '' ? null : parseInt(e.target.value))} placeholder="Any" style={styles.input} /></div>
              <div style={styles.fieldWrapper}><label style={styles.label}>Max Rectangles</label><input type="number" min={0} value={cfg.maxRectangles ?? ''} onChange={e => updateConfig('maxRectangles', e.target.value === '' ? null : parseInt(e.target.value))} placeholder="∞" style={styles.input} /></div>
              <div style={styles.fieldWrapper}><label style={styles.label}>Width (default 3)</label><input type="number" min={2} max={5} value={cfg.rectWidth || 3} onChange={e => updateConfig('rectWidth', parseInt(e.target.value) || 3)} style={styles.input} /></div>
              <div style={styles.fieldWrapper}><label style={styles.label}>Height (default 2)</label><input type="number" min={2} max={5} value={cfg.rectHeight || 2} onChange={e => updateConfig('rectHeight', parseInt(e.target.value) || 2)} style={styles.input} /></div>
            </div>
          </div>

          {/* Free Space Settings */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>⭐ Free Space</h4>
            <div style={styles.grid2}>
              <div><label style={styles.label}>Free Space Counts</label><select value={cfg.freeSpaceCounts !== false ? 'true' : 'false'} onChange={e => updateConfig('freeSpaceCounts', e.target.value === 'true')} style={styles.select}><option value="true">Yes</option><option value="false">No</option></select></div>
              <div><label style={styles.label}>Free Space Required</label><select value={cfg.freeSpaceRequiredForWin ? 'true' : 'false'} onChange={e => updateConfig('freeSpaceRequiredForWin', e.target.value === 'true')} style={styles.select}><option value="false">No</option><option value="true">Yes</option></select></div>
              <div><label style={styles.label}>Free Space Blocked</label><select value={cfg.freeSpaceBlocked ? 'true' : 'false'} onChange={e => updateConfig('freeSpaceBlocked', e.target.value === 'true')} style={styles.select}><option value="false">No</option><option value="true">Yes</option></select></div>
            </div>
          </div>

          {/* Line Interaction */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>🔗 Line Interaction</h4>
            <div style={styles.grid2}>
              <div><label style={styles.label}>Allow Overlapping</label><select value={cfg.allowOverlapping !== false ? 'true' : 'false'} onChange={e => updateConfig('allowOverlapping', e.target.value === 'true')} style={styles.select}><option value="true">Yes</option><option value="false">No</option></select></div>
              <div><label style={styles.label}>Shared Cells Limit</label><input type="number" value={cfg.sharedCellsLimit ?? ''} onChange={e => updateConfig('sharedCellsLimit', e.target.value === '' ? null : parseInt(e.target.value))} placeholder="Unlimited" style={styles.input} /></div>
              <div><label style={styles.label}>Lines Must Intersect</label><select value={cfg.linesMustIntersect ? 'true' : 'false'} onChange={e => updateConfig('linesMustIntersect', e.target.value === 'true')} style={styles.select}><option value="false">No</option><option value="true">Yes</option></select></div>
              <div><label style={styles.label}>Lines Must NOT Touch</label><select value={cfg.linesMustNotIntersect ? 'true' : 'false'} onChange={e => updateConfig('linesMustNotIntersect', e.target.value === 'true')} style={styles.select}><option value="false">No</option><option value="true">Yes</option></select></div>
            </div>
            {cfg.linesMustIntersect && (
              <div style={styles.grid2}>
                <div><label style={styles.label}>Intersection Row (0-4)</label><input type="number" min={0} max={4} value={cfg.intersectionPoint?.row ?? ''} onChange={e => updateConfig('intersectionPoint', { ...cfg.intersectionPoint, row: parseInt(e.target.value) || 0 })} style={styles.input} /></div>
                <div><label style={styles.label}>Intersection Column (0-4)</label><input type="number" min={0} max={4} value={cfg.intersectionPoint?.col ?? ''} onChange={e => updateConfig('intersectionPoint', { ...cfg.intersectionPoint, col: parseInt(e.target.value) || 0 })} style={styles.input} /></div>
              </div>
            )}
          </div>

          {/* Direction Settings - UPDATED with Square/Rectangle */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>🧭 Line Directions</h4>
            <div style={styles.flex}>
              {['horizontal', 'vertical', 'diagonal', 'square', 'rectangle'].map(dir => {
                const active = (cfg.lineDirections || []).includes(dir);
                return (
                  <div key={dir} onClick={() => { const cur = [...(cfg.lineDirections || ['horizontal','vertical','diagonal'])]; const upd = active ? cur.filter(d => d !== dir) : [...cur, dir]; onChange({ ...cfg, lineDirections: upd.length === 0 ? ['horizontal'] : upd }); }} style={styles.checkboxChip(active)}>
                    {active ? '✓ ' : ''}{dir.charAt(0).toUpperCase() + dir.slice(1)}
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 12 }}>
              <label style={styles.label}>Exclusive Lines Type</label>
              <select value={cfg.exclusiveLines || ''} onChange={e => updateConfig('exclusiveLines', e.target.value || null)} style={styles.select}>
                <option value="">None</option><option value="rows">Rows Only</option><option value="columns">Columns Only</option><option value="diagonals">Diagonals Only</option><option value="squares">Squares Only</option><option value="rectangles">Rectangles Only</option>
              </select>
            </div>
          </div>

          {/* Combination Settings */}
          <div style={styles.section}><h4 style={styles.sectionTitle}>🔢 Required Combination</h4><div style={styles.grid3}>{['rows','columns','diagonals'].map(type=>(<div key={type}><label style={styles.label}>Required {type.charAt(0).toUpperCase()+type.slice(1)}</label><input type="number" value={cfg.requiredCombination?.[type]??''} onChange={e=>{const val=e.target.value===''?null:parseInt(e.target.value);updateConfig('requiredCombination',{...cfg.requiredCombination,[type]:val});}} placeholder="Any" style={styles.input}/></div>))}</div></div>

          {/* Specific Lines */}
          <div style={styles.section}><h4 style={styles.sectionTitle}>📍 Specific Lines Required</h4><div style={styles.grid2}>{[{key:'topRow',label:'Top Row'},{key:'bottomRow',label:'Bottom Row'},{key:'leftColumn',label:'Left Column'},{key:'rightColumn',label:'Right Column'},{key:'centerRow',label:'Center Row'},{key:'centerColumn',label:'Center Column'},{key:'mainDiagonal',label:'Main Diagonal (\\\\)'},{key:'antiDiagonal',label:'Anti-Diagonal (/)'}].map(item=>(<label key={item.key} style={styles.checkboxLabel}><input type="checkbox" checked={cfg.specificLines?.[item.key]||false} onChange={e=>updateConfig('specificLines',{...cfg.specificLines,[item.key]:e.target.checked})}/>{item.label}</label>))}</div></div>

          {/* Special Settings */}
          <div style={styles.section}><h4 style={styles.sectionTitle}>⚡ Special Settings</h4><div style={styles.grid2}><div><label style={styles.label}>Corners Required</label><select value={cfg.cornersRequired?'true':'false'} onChange={e=>updateConfig('cornersRequired',e.target.value==='true')} style={styles.select}><option value="false">No</option><option value="true">Yes</option></select></div><div><label style={styles.label}>Min Cells Marked</label><input type="number" value={cfg.minCellsMarked??''} onChange={e=>updateConfig('minCellsMarked',e.target.value===''?null:parseInt(e.target.value))} placeholder="No minimum" style={styles.input}/></div></div></div>
        </>
      )}

      {/* Pattern-Based */}
      {method === 'pattern' && (
        <div style={styles.section}><h4 style={styles.sectionTitle}>🎯 Pattern Configuration</h4><p style={{fontSize:11,color:'#6b7280',marginBottom:12}}>Define specific cell patterns that must be matched to win</p>
          {patterns.length>0&&(<div style={{marginBottom:15}}><label style={styles.label}>Saved Patterns ({patterns.length})</label>{patterns.map((p,i)=>(<div key={i} style={styles.patternItem}><span style={styles.patternName}>{p.name}<span style={styles.patternCount}>({p.cells.length}cells)</span></span><button onClick={()=>removePattern(i)} style={styles.deleteBtn}>✕</button></div>))}</div>)}
          <div style={{background:'#f9fafb',padding:15,borderRadius:10,border:'1px solid #e5e7eb'}}><label style={styles.label}>Pattern Name</label><input value={newPatternName} onChange={e=>setNewPatternName(e.target.value)} placeholder="e.g., X Pattern, Cross" style={styles.input}/>
            <label style={{...styles.label,marginTop:10}}>Click cells to select pattern ({selectedCells.length} selected)</label>
            <div style={{display:'flex',justifyContent:'center',margin:'10px 0'}}><div style={styles.miniGrid}><div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:2}}>{letters.map((c,i)=><div key={c} style={{...styles.headerCell,color:letterColors[i]}}>{c}</div>)}</div><div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:2,marginTop:2}}>{[0,1,2,3,4].map(row=>[0,1,2,3,4].map(col=>{const sel=selectedCells.some(c=>c[0]===row&&c[1]===col);return<div key={`${row}-${col}`} onClick={()=>togglePatternCell(row,col)} style={{...styles.gridCell,...(sel?styles.gridCellSelected:{})}}>{row*5+col+1}</div>;}))}</div></div></div>
            <button onClick={addPattern} disabled={!newPatternName||selectedCells.length===0} style={{...styles.addPatternBtn,...(!newPatternName||selectedCells.length===0?styles.addPatternBtnDisabled:{})}}>+ Add Pattern</button></div></div>
      )}

      {/* Config Summary */}
      <div style={{...styles.section,background:'#f9fafb'}}><h4 style={{...styles.sectionTitle,color:'#6d28d9'}}>📋 Configuration Summary</h4><div style={{fontSize:11,color:'#1a1a2e',lineHeight:1.6}}>
        {(cfg.nameAmharic||cfg.nameEnglish)&&(<div style={{marginBottom:8,padding:'6px 10px',background:'#fff',borderRadius:6,border:'1px solid #e5e7eb'}}><b>🌐:</b>{cfg.nameAmharic&&` 🇪🇹${cfg.nameAmharic}`}{cfg.nameEnglish&&` | 🇬🇧${cfg.nameEnglish}`}</div>)}
        {method==='rule'?(<><div>🎯Lines:<b>{cfg.linesToWin}</b></div><div>📏Rows:min={cfg.minRows}exact={cfg.exactRows??'any'}max={cfg.maxRows??'∞'}</div><div>📏Cols:min={cfg.minColumns}exact={cfg.exactColumns??'any'}max={cfg.maxColumns??'∞'}</div><div>📏Diags:min={cfg.minDiagonals}exact={cfg.exactDiagonals??'any'}max={cfg.maxDiagonals??'∞'}</div><div>🟦Squares({cfg.squareSize||2}×{cfg.squareSize||2}):min={cfg.minSquares||0}exact={cfg.exactSquares??'any'}max={cfg.maxSquares??'∞'}</div><div>🟩Rect({cfg.rectWidth||3}×{cfg.rectHeight||2}):min={cfg.minRectangles||0}exact={cfg.exactRectangles??'any'}max={cfg.maxRectangles??'∞'}</div><div>⭐Free:{cfg.freeSpaceCounts!==false?'Counts':'Blocked'}{cfg.freeSpaceRequiredForWin?'|Required':''}</div><div>🔗Overlap:{cfg.allowOverlapping!==false?'Yes':'No'}{cfg.sharedCellsLimit?`(max ${cfg.sharedCellsLimit})`:''}</div><div>📍Intersect:{cfg.linesMustIntersect?`Yes[${cfg.intersectionPoint?.row},${cfg.intersectionPoint?.col}]`:'No'}</div><div>🧭Directions:{(cfg.lineDirections||[]).join(',')}{cfg.exclusiveLines?`(only ${cfg.exclusiveLines})`:''}</div></>):(<div>🎯Patterns:<b>{patterns.length}</b></div>)}</div></div>
    </div>
  );
}