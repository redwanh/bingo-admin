import React, { useEffect, useRef, useState } from "react";
import "../../Users/UsersNew.css";

export default function UserToolbar({ search, onSearch, roleFilter, onRoleFilter, statusFilter, onStatusFilter, sortBy, onSortBy }) {
  const toolbarRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => { if (toolbarRef.current) setIsSticky(toolbarRef.current.getBoundingClientRect().top <= 8); };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={toolbarRef} className={`um-toolbar ${isSticky ? "is-sticky" : ""}`}>
      <div className="um-search-wrap">
        <span className="um-search-icon">🔍</span>
        <input className="um-search-input" type="text" placeholder="Search..." value={search} onChange={e => onSearch(e.target.value)} />
        {search && <button className="um-search-clear" onClick={() => onSearch("")}>✕</button>}
      </div>
      <div className="um-filters">
        {[{ label: "Role", value: roleFilter, onChange: onRoleFilter, options: ["all","user","admin","superadmin"] },
          { label: "Status", value: statusFilter, onChange: onStatusFilter, options: ["all","active","inactive"] },
          { label: "Sort", value: sortBy, onChange: onSortBy, options: ["newest","oldest","name","role"] }].map(f => (
          <div className="um-filter-group" key={f.label}>
            <label className="um-filter-label">{f.label}</label>
            <select className="um-filter-select" value={f.value} onChange={e => f.onChange(e.target.value)}>
              {f.options.map(o => <option key={o} value={o}>{o[0].toUpperCase()+o.slice(1)}</option>)}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}