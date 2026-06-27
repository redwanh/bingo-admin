import React from 'react';
import './Pagination.css';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      let start = Math.max(2, page - 1);
      let end = Math.min(totalPages - 1, page + 1);
      
      if (page <= 2) end = maxVisible - 1;
      if (page >= totalPages - 1) start = totalPages - (maxVisible - 2);
      
      if (start > 2) pages.push('...');
      
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }
      
      if (end < totalPages - 1) pages.push('...');
      if (totalPages > 1) pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="pagination-container">
      <button
        className="pagination-btn"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        ← Previous
      </button>

      <div className="pagination-pages">
        {getPageNumbers().map((p, index) => (
          <button
            key={index}
            className={`page-btn ${p === page ? 'active' : ''} ${p === '...' ? 'dots' : ''}`}
            onClick={() => p !== '...' && onPageChange(p)}
            disabled={p === '...'}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        className="pagination-btn"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next →
      </button>
    </div>
  );
}