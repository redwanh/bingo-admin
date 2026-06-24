import React from 'react';

export default function RuleCard({ rule, onEdit, onTest, onSamples, onDelete }) {
  const cfg = rule.ruleConfig || {};
  
  return (
    <div style={{ background: '#16213e', padding: 24, borderRadius: 16, border: '1px solid #1a1a3e' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 18 }}>{rule.name}</h3>
        <span style={{ 
          fontSize: 10, padding: '4px 10px', borderRadius: 20, 
          background: rule.method === 'rule' ? '#2ED573' : '#FFA502', 
          color: '#000', fontWeight: 700, textTransform: 'uppercase'
        }}>
          {rule.method}
        </span>
      </div>
      
      {rule.description && (
        <p style={{ color: '#888', fontSize: 13, marginBottom: 12 }}>{rule.description}</p>
      )}
      
      {/* Config Summary */}
      <div style={{ 
        fontSize: 11, color: '#aaa', display: 'flex', flexWrap: 'wrap', gap: 6, 
        marginBottom: 12, background: '#0a0a1e', padding: 10, borderRadius: 8 
      }}>
        <Tag label="🎯 Lines" value={cfg.linesToWin || 1} />
        <Tag label="↔️ Rows" value={`${cfg.minRows || 0}${cfg.exactRows ? `(=${cfg.exactRows})` : ''}`} />
        <Tag label="↕️ Cols" value={`${cfg.minColumns || 0}${cfg.exactColumns ? `(=${cfg.exactColumns})` : ''}`} />
        <Tag label="✖️ Diags" value={`${cfg.minDiagonals || 0}${cfg.exactDiagonals ? `(=${cfg.exactDiagonals})` : ''}`} />
        <Tag label="⭐ Free" value={cfg.freeSpaceCounts !== false ? 'Yes' : 'No'} />
        <Tag label="🔗 Overlap" value={cfg.allowOverlapping !== false ? 'Yes' : 'No'} />
        {cfg.linesMustIntersect && <Tag label="📍 Intersect" value="Yes" />}
        {cfg.cornersRequired && <Tag label="📐 Corners" value="Yes" />}
        {cfg.exclusiveLines && <Tag label="🔒" value={cfg.exclusiveLines} />}
      </div>

      {/* Sample Count */}
      {(rule.samples?.wins?.length > 0 || rule.samples?.losses?.length > 0) && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {rule.samples?.wins?.length > 0 && (
            <span style={sampleBadge('#2ED573', '#1a3a2a')}>
              🏆 {rule.samples.wins.length}
            </span>
          )}
          {rule.samples?.losses?.length > 0 && (
            <span style={sampleBadge('#FF4757', '#3a1a1a')}>
              ❌ {rule.samples.losses.length}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <ActionButton label="✎ Edit" color="#0f3460" onClick={onEdit} />
        <ActionButton label="🧪 Test" color="#FFA502" textColor="#000" onClick={onTest} />
        <ActionButton label="📊 Samples" color="#7C5CFC" onClick={onSamples} />
        <ActionButton label="🗑" color="#3a0a0a" textColor="#FF4757" onClick={onDelete} narrow />
      </div>
    </div>
  );
}

function Tag({ label, value }) {
  return (
    <span style={{ background: '#1a1a3e', padding: '3px 8px', borderRadius: 4 }}>
      {label}: {value}
    </span>
  );
}

function ActionButton({ label, color, textColor = '#fff', onClick, narrow }) {
  return (
    <button onClick={onClick} style={{ 
      flex: narrow ? 'none' : 1, 
      padding: narrow ? '10px 12px' : 10, 
      borderRadius: 8, border: 'none', background: color, 
      color: textColor, cursor: 'pointer', fontSize: 13, fontWeight: 600,
      minWidth: narrow ? 44 : 'auto'
    }}>
      {label}
    </button>
  );
}

function sampleBadge(color, bg) {
  return { fontSize: 11, color, background: bg, padding: '4px 10px', borderRadius: 12 };
}