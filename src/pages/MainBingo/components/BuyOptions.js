import React from 'react';

export default function BuyOptions({ cardPrice, onBuy, onToggle, showOptions }) {
  const quantities = [1, 2, 3, 5, 10];

  return (
    <>
      {showOptions && (
        <div style={S.options}>
          {quantities.map(qty => (
            <button key={qty} onClick={() => onBuy(qty)} style={S.option}>
              <span style={S.qty}>{qty}</span>
              <span style={S.label}>card{qty > 1 ? 's' : ''}</span>
              <span style={S.price}>{(cardPrice || 0) * qty} ETB</span>
            </button>
          ))}
        </div>
      )}
      <button onClick={onToggle} style={S.fab}>
        <span style={S.fabIcon}>{showOptions ? '✕' : '+'}</span>
      </button>
    </>
  );
}

const S = {
  options: {
    position: 'fixed', bottom: 90, right: 24,
    display: 'flex', flexDirection: 'column', gap: 8, zIndex: 79,
  },
  option: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '14px 20px', background: '#FFFFFF',
    border: '1px solid #eee', borderRadius: 12, cursor: 'pointer',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    minWidth: 180,
  },
  qty: { fontSize: 22, fontWeight: 800, color: '#FF4757', minWidth: 30, textAlign: 'center' },
  label: { fontSize: 13, color: '#333', fontWeight: 500, flex: 1 },
  price: { fontSize: 12, color: '#999', fontWeight: 600 },
  fab: {
    position: 'fixed', bottom: 24, right: 24,
    width: 56, height: 56, borderRadius: '50%',
    background: 'linear-gradient(135deg, #FF4757, #FF6B81)',
    border: 'none', boxShadow: '0 4px 15px rgba(255,71,87,0.4)',
    cursor: 'pointer', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 80,
  },
  fabIcon: { color: '#FFFFFF', fontSize: 28, fontWeight: 300, lineHeight: 1 }
};
