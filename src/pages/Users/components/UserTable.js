import React, { memo } from "react";
import "../../Users/UsersNew.css";

const UserRow = memo(({ user, onToggle, onAddBalance, canManage }) => {
  const isActive = user.isActive !== false;
  const name = user.fullName || user.username || "Unknown";
  const balance = user.walletBalance ?? user.balance ?? 0;
  

  return (
    <tr className={`um-table-row ${!isActive ? "um-table-row--inactive" : ""}`}>
      <td><div className="um-user-cell"><div className="um-avatar">{name[0].toUpperCase()}</div><div className="um-user-info"><span className="um-user-name">{name}</span>{user.email && <span className="um-user-email">{user.email}</span>}</div></div></td>
      <td>{user.phone || "—"}</td>
      <td><span className={`um-role-badge um-role-${user.role||"user"}`}>{user.role||"user"}</span></td>
      <td className="um-balance-cell">{Number(balance).toLocaleString(undefined,{minimumFractionDigits:2})}</td>
      <td><span className={`um-status-badge ${isActive?"um-status-active":"um-status-inactive"}`}><span className="um-status-dot"/>{isActive?"Active":"Inactive"}</span></td>
      {canManage && <td className="um-actions-col">
        <button className="um-action-btn um-action-toggle" onClick={()=>onToggle(user._id,isActive,name)}>{isActive?"🔒 Disable":"✅ Enable"}</button>
        <button className="um-action-btn um-action-balance" onClick={()=>onAddBalance(user)}>💰 Balance</button>
      </td>}
    </tr>
  );
});
UserRow.displayName="UserRow";

function UserTable({ users, loading, onToggle, onAddBalance, canManage }) {
  if (loading) return <div className="um-table-state"><div className="um-spinner"/><span>Loading...</span></div>;
  if (!users?.length) return <div className="um-table-state um-table-empty"><span className="um-empty-icon">📭</span><p>No users found</p><span>Try adjusting your filters</span></div>;
  return (
    <div className="um-table-wrap"><div className="um-table-scroll"><table className="um-table"><thead><tr><th>User</th><th>Phone</th><th>Role</th><th>Balance</th><th>Status</th>{canManage&&<th className="um-actions-col">Actions</th>}</tr></thead><tbody>{users.map(u=><UserRow key={u._id} user={u} onToggle={onToggle} onAddBalance={onAddBalance} canManage={canManage}/>)}</tbody></table></div></div>
  );
}
export default memo(UserTable);