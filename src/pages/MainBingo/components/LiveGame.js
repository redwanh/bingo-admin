import React from 'react';

export default function LiveGame({ gameState }) {
  return (
    <div style={S.numberArea}>
      <div style={S.placeholder}>
        <span style={S.icon}>🎯</span>
        <span style={S.text}>Ball Tube / Board View</span>
      </div>
    </div>
  );
}

const S = {
  numberArea: {
    flexShrink: 0, background: '#FFFFFF',
    borderBottom: '1px solid #eee',
    padding: 12, minHeight: 80,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  placeholder: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: 10, background: '#F9F9F9',
    borderRadius: 12, border: '2px dashed #e0e0e0',
  },
  icon: { fontSize: 28 },
  text: { color: '#999', fontSize: 14, fontWeight: 500 }
};
