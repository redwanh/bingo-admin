import React from 'react';

export default function GameCards({ cardsPerPage }) {
  return (
    <div style={S.cardsArea}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cardsPerPage}, 1fr)`,
        gap: 10,
      }}>
        {Array.from({ length: cardsPerPage * 2 }, (_, i) => (
          <div key={i} style={S.card}>
            <div style={S.cardLabel}>Card {i + 1}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const S = {
  cardsArea: {
    flex: 1, overflowY: 'auto', padding: 12,
  },
  card: {
    background: '#FFFFFF', borderRadius: 14,
    padding: 20, border: '2px dashed #e0e0e0',
    minHeight: 160, display: 'flex',
    alignItems: 'center', justifyContent: 'center',
  },
  cardLabel: {
    textAlign: 'center', color: '#ccc', fontSize: 12
  }
};
