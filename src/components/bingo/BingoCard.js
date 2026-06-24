import React from 'react';

const COLS = ['B', 'I', 'N', 'G', 'O'];

export default function BingoCard({ 
  markedCells = [], 
  isInteractive = false, 
  isFreeSpace = true, 
  onCellClick = null,
  size = 'normal' // 'small' | 'normal'
}) {
  const cellSize = size === 'small' ? 35 : 50;
  const fontSize = size === 'small' ? 11 : 14;
  
  const isCellMarked = (row, col) => {
    if (isFreeSpace && col === 2 && row === 2) return true;
    return markedCells.some(c => c[0] === row && c[1] === col);
  };
  
  const handleCellClick = (row, col) => {
    if (isInteractive && onCellClick) {
      // Don't allow clicking free space
      if (isFreeSpace && col === 2 && row === 2) return;
      onCellClick(row, col);
    }
  };
  
  return (
    <div style={{ display: 'inline-block', background: '#1a1a2e', padding: size === 'small' ? 6 : 10, borderRadius: 10 }}>
      {/* Column Headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2, marginBottom: 4 }}>
        {COLS.map((c, idx) => (
          <div key={c} style={{ 
            textAlign: 'center', fontWeight: 800, fontSize: fontSize - 2, padding: '4px', 
            color: '#fff', 
            background: ['#FF4757', '#FFA502', '#2ED573', '#FF6348', '#7C5CFC'][idx],
            borderRadius: '4px 4px 0 0'
          }}>
            {c}
          </div>
        ))}
      </div>
      
      {/* Grid Cells */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: size === 'small' ? 2 : 3 }}>
        {[0, 1, 2, 3, 4].map(row => 
          COLS.map((col, colIdx) => {
            const isFree = isFreeSpace && colIdx === 2 && row === 2;
            const isMarked = isCellMarked(row, colIdx);
            const num = isFree ? '★' : (row * 5 + colIdx + 1);
            
            return (
              <div 
                key={`${row}-${colIdx}`} 
                onClick={() => handleCellClick(row, colIdx)}
                style={{
                  width: cellSize, height: cellSize, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize, borderRadius: 6, fontWeight: isMarked ? 700 : 400,
                  background: isFree ? '#2a4a3a' : 
                             isMarked ? ['#FF4757', '#FFA502', '#2ED573', '#FF6348', '#7C5CFC'][colIdx] : 
                             '#222',
                  color: isMarked ? '#fff' : '#555',
                  cursor: isInteractive && !isFree ? 'pointer' : 'default',
                  transition: 'all 0.2s ease',
                  border: isInteractive && !isFree ? '2px solid #333' : '2px solid transparent',
                  userSelect: 'none'
                }}
              >
                {num}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}