import React from "react";
import "../../Users/UsersNew.css";

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  const pages = [];
  if (totalPages <= 5) for (let i = 1; i <= totalPages; i++) pages.push(i);
  else {
    pages.push(1);
    let s = Math.max(2, page - 1), e = Math.min(totalPages - 1, page + 1);
    if (page <= 2) e = 4;
    if (page >= totalPages - 1) s = totalPages - 3;
    if (s > 2) pages.push("...");
    for (let i = s; i <= e; i++) pages.push(i);
    if (e < totalPages - 1) pages.push("...");
    pages.push(totalPages);
  }
  return (
    <div className="um-pagination">
      <button className="um-page-btn" disabled={page<=1} onClick={()=>onPageChange(page-1)}>← Prev</button>
      <div className="um-pagination-pages">{pages.map((p,i)=>p==="..."?<span key={i} className="um-page-num um-page-dots">...</span>:<button key={i} className={`um-page-num ${p===page?"um-page-active":""}`} onClick={()=>onPageChange(p)}>{p}</button>)}</div>
      <button className="um-page-btn" disabled={page>=totalPages} onClick={()=>onPageChange(page+1)}>Next →</button>
    </div>
  );
}