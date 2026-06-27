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
    maxWidth: '550px',
    width: '100%',
    border: '2px solid #000000',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 700,
    color: '#1a1a2e',
  },
  subtitle: {
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
  description: {
    color: '#6b7280',
    fontSize: '13px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  cardWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  testBtn: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #d4af37, #b8962f)',
    color: '#fff',
    border: '2px solid #000000',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '15px',
    marginBottom: '15px',
    transition: 'all 0.3s ease',
  },
  resultContainer: {
    padding: '16px',
    borderRadius: '10px',
    marginBottom: '15px',
    border: '2px solid',
  },
  resultValid: {
    background: '#d1fae5',
    borderColor: '#065f46',
  },
  resultInvalid: {
    background: '#fee2e2',
    borderColor: '#991b1b',
  },
  resultTitle: {
    fontWeight: 700,
    fontSize: '16px',
    margin: '0 0 6px 0',
  },
  resultTitleValid: {
    color: '#065f46',
  },
  resultTitleInvalid: {
    color: '#991b1b',
  },
  resultMessage: {
    color: '#1a1a2e',
    fontSize: '13px',
    margin: 0,
  },
  resultDetails: {
    fontSize: '11px',
    color: '#6b7280',
    marginTop: '8px',
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  saveContainer: {
    display: 'flex',
    gap: '12px',
  },
  saveWinBtn: {
    flex: 1,
    padding: '12px',
    background: '#d1fae5',
    color: '#065f46',
    border: '2px solid #065f46',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '14px',
    transition: 'all 0.2s ease',
  },
  saveLossBtn: {
    flex: 1,
    padding: '12px',
    background: '#fee2e2',
    color: '#991b1b',
    border: '2px solid #991b1b',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '14px',
    transition: 'all 0.2s ease',
  },
};

export default function TestModal({ 
  rule, 
  testCells, 
  testResult, 
  onCellClick, 
  onTest, 
  onSaveSample, 
  onClose 
}) {
  if (!rule) return null;
  
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>🧪 Test Rule</h2>
            <p style={styles.subtitle}>{rule.name}</p>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>
        
        <p style={styles.description}>
          Click cells to mark them. Center ★ is {rule.ruleConfig?.freeSpaceCounts !== false ? 'free space' : 'not free'}.
        </p>
        
        <div style={styles.cardWrapper}>
          <BingoCard 
            markedCells={testCells} 
            isInteractive={true} 
            isFreeSpace={rule.ruleConfig?.freeSpaceCounts !== false}
            onCellClick={onCellClick}
          />
        </div>
        
        <button onClick={onTest} style={styles.testBtn}>
          🔍 TEST RULE
        </button>
        
        {testResult && (
          <>
            <div style={{
              ...styles.resultContainer,
              ...(testResult.valid ? styles.resultValid : styles.resultInvalid)
            }}>
              <p style={{
                ...styles.resultTitle,
                ...(testResult.valid ? styles.resultTitleValid : styles.resultTitleInvalid)
              }}>
                {testResult.valid ? '✅ VALID BINGO!' : '❌ NOT A WIN'}
              </p>
              <p style={styles.resultMessage}>{testResult.message}</p>
              {testResult.details && (
                <div style={styles.resultDetails}>
                  <span>Rows: {testResult.details.rowsFound || 0}</span>
                  <span>Columns: {testResult.details.colsFound || 0}</span>
                  <span>Diagonals: {testResult.details.diagsFound || 0}</span>
                  <span>Total Lines: {testResult.details.totalLines || 0}</span>
                  {testResult.details.overlappingCells > 0 && (
                    <span>Shared Cells: {testResult.details.overlappingCells}</span>
                  )}
                </div>
              )}
            </div>

            <div style={styles.saveContainer}>
              <button onClick={() => onSaveSample('win')} style={styles.saveWinBtn}>
                🏆 Save as Win
              </button>
              <button onClick={() => onSaveSample('loss')} style={styles.saveLossBtn}>
                ❌ Save as Loss
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}