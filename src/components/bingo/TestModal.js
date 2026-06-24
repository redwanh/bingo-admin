import React from 'react';
import BingoCard from './BingoCard';

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
    <div style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      background: 'rgba(0,0,0,0.9)', zIndex: 200, 
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 
    }} onClick={onClose}>
      <div style={{ 
        background: '#16213e', borderRadius: 20, padding: 30, 
        maxWidth: 550, width: '100%', border: '1px solid #1a1a3e'
      }} onClick={e => e.stopPropagation()}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20 }}>🧪 Test Rule</h2>
            <p style={{ color: '#FFA502', margin: '4px 0 0 0', fontSize: 14, fontWeight: 600 }}>
              {rule.name}
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#888', fontSize: 24, cursor: 'pointer', padding: '0 8px'
          }}>✕</button>
        </div>
        
        <p style={{ color: '#888', fontSize: 13, marginBottom: 20, textAlign: 'center' }}>
          Click cells to mark them. Center ★ is {rule.ruleConfig?.freeSpaceCounts !== false ? 'free space' : 'not free'}.
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <BingoCard 
            markedCells={testCells} 
            isInteractive={true} 
            isFreeSpace={rule.ruleConfig?.freeSpaceCounts !== false}
            onCellClick={onCellClick}
          />
        </div>
        
        <button onClick={onTest} style={{ 
          width: '100%', padding: 12, background: '#FFA502', color: '#000', 
          border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, 
          fontSize: 15, marginBottom: 15
        }}>
          🔍 TEST RULE
        </button>
        
        {testResult && (
          <>
            <div style={{ 
              padding: 16, borderRadius: 10, marginBottom: 15,
              background: testResult.valid ? '#1a3a2a' : '#3a1a1a', 
              border: '2px solid ' + (testResult.valid ? '#2ED573' : '#FF4757') 
            }}>
              <p style={{ 
                fontWeight: 700, fontSize: 16, margin: '0 0 6px 0',
                color: testResult.valid ? '#2ED573' : '#FF4757'
              }}>
                {testResult.valid ? '✅ VALID BINGO!' : '❌ NOT A WIN'}
              </p>
              <p style={{ color: '#aaa', fontSize: 13, margin: 0 }}>{testResult.message}</p>
              {testResult.details && (
                <div style={{ fontSize: 11, color: '#888', marginTop: 8, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
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

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => onSaveSample('win')} style={{ 
                flex: 1, padding: 12, background: '#2ED573', color: '#000', 
                border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 14 
              }}>
                🏆 Save as Win
              </button>
              <button onClick={() => onSaveSample('loss')} style={{ 
                flex: 1, padding: 12, background: '#FF4757', color: '#fff', 
                border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 14 
              }}>
                ❌ Save as Loss
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}