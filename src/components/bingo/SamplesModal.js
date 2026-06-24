import React from 'react';
import BingoCard from './BingoCard';

export default function SamplesModal({ rule, samples, onClose, onDeleteSample }) {
  if (!rule) return null;
  
  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      background: 'rgba(0,0,0,0.9)', zIndex: 200, 
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 
    }} onClick={onClose}>
      <div style={{ 
        background: '#16213e', borderRadius: 20, padding: 30, 
        maxWidth: 900, width: '100%', maxHeight: '90vh', overflowY: 'auto', 
        border: '1px solid #1a1a3e'
      }} onClick={e => e.stopPropagation()}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 22 }}>📊 Sample Cards</h2>
            <p style={{ color: '#FFA502', margin: '4px 0 0 0', fontSize: 14, fontWeight: 600 }}>
              {rule.name}
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#888', fontSize: 24, cursor: 'pointer', padding: '0 8px'
          }}>✕</button>
        </div>
        
        {samples.wins.length > 0 && (
          <div style={{ marginBottom: 30 }}>
            <h3 style={{ color: '#2ED573', marginBottom: 16, fontSize: 18 }}>
              🏆 Win Examples ({samples.wins.length})
            </h3>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
              {samples.wins.map((sample, idx) => (
                <div key={idx} style={{ 
                  background: '#1a3a2a', padding: 15, borderRadius: 12, 
                  border: '2px solid #2ED573', position: 'relative'
                }}>
                  {/* DELETE BUTTON */}
                  <button 
                    onClick={() => onDeleteSample && onDeleteSample('wins', idx)}
                    style={{
                      position: 'absolute', top: -8, right: -8,
                      background: '#FF4757', color: '#fff', border: 'none',
                      width: 24, height: 24, borderRadius: '50%',
                      cursor: 'pointer', fontSize: 12, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      zIndex: 10
                    }}
                    title="Delete sample"
                  >
                    ✕
                  </button>
                  <BingoCard 
                    markedCells={sample.markedCells} 
                    isFreeSpace={rule.ruleConfig?.freeSpaceCounts !== false}
                    size="small"
                  />
                  {sample.details && (
                    <div style={{ fontSize: 10, color: '#888', marginTop: 8, textAlign: 'center' }}>
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
          <div>
            <h3 style={{ color: '#FF4757', marginBottom: 16, fontSize: 18 }}>
              ❌ Loss Examples ({samples.losses.length})
            </h3>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
              {samples.losses.map((sample, idx) => (
                <div key={idx} style={{ 
                  background: '#3a1a1a', padding: 15, borderRadius: 12, 
                  border: '2px solid #FF4757', position: 'relative'
                }}>
                  {/* DELETE BUTTON */}
                  <button 
                    onClick={() => onDeleteSample && onDeleteSample('losses', idx)}
                    style={{
                      position: 'absolute', top: -8, right: -8,
                      background: '#FF4757', color: '#fff', border: 'none',
                      width: 24, height: 24, borderRadius: '50%',
                      cursor: 'pointer', fontSize: 12, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      zIndex: 10
                    }}
                    title="Delete sample"
                  >
                    ✕
                  </button>
                  <BingoCard 
                    markedCells={sample.markedCells} 
                    isFreeSpace={rule.ruleConfig?.freeSpaceCounts !== false}
                    size="small"
                  />
                  {sample.details && (
                    <div style={{ fontSize: 10, color: '#888', marginTop: 8, textAlign: 'center' }}>
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
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎱</div>
            <p style={{ color: '#888', fontSize: 15, marginBottom: 8 }}>No samples saved yet</p>
            <p style={{ color: '#666', fontSize: 13 }}>
              Use the <span style={{ color: '#FFA502', fontWeight: 600 }}>Test</span> feature to create samples
            </p>
          </div>
        )}
      </div>
    </div>
  );
}