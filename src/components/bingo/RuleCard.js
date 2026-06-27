import React from 'react';

export default function RuleCard({ rule, onEdit, onTest, onSamples, onDelete }) {
  const cfg = rule.ruleConfig || {};
  
  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.name}>{rule.name}</h3>
        <span style={{
          ...styles.methodBadge,
          background: rule.method === 'rule' ? '#d1fae5' : '#fef3c7',
          color: rule.method === 'rule' ? '#065f46' : '#b8962f'
        }}>
          {rule.method}
        </span>
      </div>
      
      {rule.description && (
        <p style={styles.description}>{rule.description}</p>
      )}
      
      {/* Config Summary */}
      <div style={styles.tagsContainer}>
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
        <div style={styles.sampleContainer}>
          {rule.samples?.wins?.length > 0 && (
            <span style={styles.winBadge}>🏆 {rule.samples.wins.length}</span>
          )}
          {rule.samples?.losses?.length > 0 && (
            <span style={styles.lossBadge}>❌ {rule.samples.losses.length}</span>
          )}
        </div>
      )}

      {/* Actions */}
      <div style={styles.actions}>
        <button style={{ ...styles.actionBtn, background: '#f3f4f6', color: '#1a1a2e', border: '1px solid #e5e7eb' }} onClick={onEdit}>✎ Edit</button>
        <button style={{ ...styles.actionBtn, background: '#fef3c7', color: '#b8962f', border: '1px solid #d4af37' }} onClick={onTest}>🧪 Test</button>
        <button style={{ ...styles.actionBtn, background: '#ede9fe', color: '#6d28d9', border: '1px solid #7c5cfc' }} onClick={onSamples}>📊 Samples</button>
        <button style={{ ...styles.actionBtn, background: '#fee2e2', color: '#991b1b', border: '1px solid #ef4444' }} onClick={onDelete}>🗑</button>
      </div>
    </div>
  );
}

function Tag({ label, value }) {
  return (
    <span style={styles.tag}>
      {label}: {value}
    </span>
  );
}

const styles = {
  card: {
    background: '#ffffff',
    padding: '24px',
    borderRadius: '14px',
    border: '2px solid #000000',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '12px',
  },
  name: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 700,
    color: '#1a1a2e',
  },
  methodBadge: {
    fontSize: '10px',
    padding: '4px 10px',
    borderRadius: '20px',
    fontWeight: 700,
    textTransform: 'uppercase',
    border: '1px solid #000000',
  },
  description: {
    color: '#6b7280',
    fontSize: '13px',
    marginBottom: '12px',
  },
  tagsContainer: {
    fontSize: '11px',
    color: '#1a1a2e',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '12px',
    background: '#f9fafb',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  },
  tag: {
    background: '#ffffff',
    padding: '3px 8px',
    borderRadius: '4px',
    border: '1px solid #e5e7eb',
  },
  sampleContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px',
  },
  winBadge: {
    fontSize: '11px',
    color: '#065f46',
    background: '#d1fae5',
    padding: '4px 10px',
    borderRadius: '12px',
    border: '1px solid #065f46',
  },
  lossBadge: {
    fontSize: '11px',
    color: '#991b1b',
    background: '#fee2e2',
    padding: '4px 10px',
    borderRadius: '12px',
    border: '1px solid #991b1b',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  actionBtn: {
    flex: 1,
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 600,
    background: '#f9fafb',
    color: '#1a1a2e',
    border: '1px solid #e5e7eb',
    transition: 'all 0.2s ease',
  },
};