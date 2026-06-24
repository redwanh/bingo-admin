// pages/Users/components/Pagination.jsx
import React from 'react';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 24 }}>
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1}
        style={navBtnStyle(page === 1)}>
        ← Prev
      </button>

      {start > 1 && (
        <>
          <button onClick={() => onPageChange(1)} style={pageBtnStyle(1 === page)}>1</button>
          {start > 2 && <span style={{ color: '#666' }}>...</span>}
        </>
      )}

      {pages.map(p => (
        <button key={p} onClick={() => onPageChange(p)} style={pageBtnStyle(p === page)}>
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span style={{ color: '#666' }}>...</span>}
          <button onClick={() => onPageChange(totalPages)} style={pageBtnStyle(totalPages === page)}>
            {totalPages}
          </button>
        </>
      )}

      <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}
        style={navBtnStyle(page === totalPages)}>
        Next →
      </button>
    </div>
  );
}

const navBtnStyle = (disabled) => ({
  padding: '10px 20px', borderRadius: 10, border: 'none',
  background: disabled ? '#1a1a2e' : '#FF4757',
  color: disabled ? '#555' : '#fff',
  cursor: disabled ? 'default' : 'pointer',
  fontSize: 13, fontWeight: 600, transition: 'all 0.15s',
});

const pageBtnStyle = (active) => ({
  width: 40, height: 40, borderRadius: 10, border: 'none',
  background: active ? '#FF4757' : '#16213e',
  color: active ? '#fff' : '#A0A0B8',
  cursor: 'pointer', fontSize: 14, fontWeight: active ? 700 : 500,
  transition: 'all 0.15s',
});
