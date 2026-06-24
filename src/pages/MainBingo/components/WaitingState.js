import React from 'react';

export default function WaitingState({ gameState }) {
  return (
    <div style={S.center}>
      <span style={S.emoji}>⏳</span>
      <p style={S.title}>Game Starting Soon!</p>
      <p style={S.subtitle}>
        Rule: {gameState?.config?.ruleName || 'BINGO'}
      </p>
      <p style={S.price}>
        Card Price: {gameState?.config?.cardPrice || 0} ETB
      </p>
    </div>
  );
}

const S = {
  center: {
    flex: 1, display: 'flex', justifyContent: 'center',
    alignItems: 'center', flexDirection: 'column', gap: 12
  },
  emoji: { fontSize: 48 },
  title: { fontSize: 20, fontWeight: 800, color: '#333', margin: 0 },
  subtitle: { fontSize: 14, color: '#666', margin: 0 },
  price: { fontSize: 16, fontWeight: 700, color: '#FF4757', margin: 0 }
};
