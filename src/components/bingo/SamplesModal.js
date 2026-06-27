import React from 'react';
import BingoCard from './BingoCard';

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
    maxWidth: '900px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    border: '2px solid #000000',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    margin: 0,
    fontSize: '22px',
    fontWeight: 700,
    color: '#1a1a2e',
  },
  ruleName: {
    color: '#b8962f',
    margin: '4px 0 0 0',
    fontSize: '14px',
    fontWeight: 600,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#6b7280',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '0 8px',
  },
  section: {
    marginBottom: '30px',
  },
  sectionTitle: {
    color: '#065f46',
    marginBottom: '16px',
    fontSize: '18px',
    fontWeight: 700,
  },
  sectionTitleLoss: {
    color: '#991b1b',
    marginBottom: '16px',
    fontSize: '18px',
    fontWeight: 700,
  },
  sampleContainer: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  sampleCard: {
    padding: '15px',
    borderRadius: '12px',
    position: 'relative',
    border: '2px solid',
  },
  sampleCardWin: {
    background: '#f0fdf4',
    borderColor: '#065f46',
  },
  sampleCardLoss: {
    background: '#fef2f2',
    borderColor: '#991b1b',
  },
  deleteBtn: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    background: '#ef4444',
    color: '#fff',
    border: 'none',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  sampleDetails: {
    fontSize: '10px',
    color: '#6b7280',
    marginTop: '8px',
    textAlign: 'center',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '12px',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: '15px',
    marginBottom: '8px',
  },
  emptySubtext: {
    color: '#9ca3af',
    fontSize: '13px',
  },
};

export default function SamplesModal({ rule, samples, onClose, onDeleteSample }) {
  if (!rule) return null;
  
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>📊 Sample Cards</h2>
            <p style={styles.ruleName}>{rule.name}</p>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>
        
        {samples.wins.length > 0 && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>🏆 Win Examples ({samples.wins.length})</h3>
            <div style={styles.sampleContainer}>
              {samples.wins.map((sample, idx) => (
                <div key={idx} style={{ ...styles.sampleCard, ...styles.sampleCardWin }}>
                  <button 
                    onClick={() => onDeleteSample && onDeleteSample('wins', idx)}
                    style={styles.deleteBtn}
                    title="Delete sample"
                  >✕</button>
                  <BingoCard 
                    markedCells={sample.markedCells} 
                    isFreeSpace={rule.ruleConfig?.freeSpaceCounts !== false}
                    size="small"
                  />
                  {sample.details && (
                    <div style={styles.sampleDetails}>
                      Lines: {sample.details.totalLines || 0} | 
                      R:{sample.details.rowsFound || 0} C:{sample.details.colsFound || 0} D:{sample.details.diagsFound || 0}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {samples.losses.length > 0 && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitleLoss}>❌ Loss Examples ({samples.losses.length})</h3>
            <div style={styles.sampleContainer}>
              {samples.losses.map((sample, idx) => (
                <div key={idx} style={{ ...styles.sampleCard, ...styles.sampleCardLoss }}>
                  <button 
                    onClick={() => onDeleteSample && onDeleteSample('losses', idx)}
                    style={styles.deleteBtn}
                    title="Delete sample"
                  >✕</button>
                  <BingoCard 
                    markedCells={sample.markedCells} 
                    isFreeSpace={rule.ruleConfig?.freeSpaceCounts !== false}
                    size="small"
                  />
                  {sample.details && (
                    <div style={styles.sampleDetails}>
                      Lines: {sample.details.totalLines || 0} | 
                      R:{sample.details.rowsFound || 0} C:{sample.details.colsFound || 0} D:{sample.details.diagsFound || 0}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {samples.wins.length === 0 && samples.losses.length === 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🎱</div>
            <p style={styles.emptyText}>No samples saved yet</p>
            <p style={styles.emptySubtext}>
              Use the <span style={{ color: '#b8962f', fontWeight: 600 }}>Test</span> feature to create samples
            </p>
          </div>
        )}
      </div>
    </div>
  );
}