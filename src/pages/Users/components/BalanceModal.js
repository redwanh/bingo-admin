import React, { useState } from "react";
import toast from "react-hot-toast";
import "../../Users/UsersNew.css";

export default function BalanceModal({ user, onClose, onSubmit, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const name = user?.fullName || "User";
  const balance = user?.walletBalance ?? user?.balance ?? 0;
  const newBalance = balance + parseFloat(amount || 0);

  const handleSubmit = async e => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return toast.error("Enter valid amount");
    if (amt > 100000) return toast.error("Max 100,000");
    setLoading(true);
    const ok = await onSubmit(user._id, amt, name);
    setLoading(false);
    if (ok) onSuccess();
  };

  return (
    <div className="um-modal-overlay" onClick={onClose}><div className="um-modal" onClick={e=>e.stopPropagation()}>
      <div className="um-modal-header"><h2 className="um-modal-title">💰 Add Balance</h2><button className="um-modal-close" onClick={onClose}>✕</button></div>
      <div className="um-modal-body">
        <div className="um-modal-user"><div className="um-modal-avatar">{name[0].toUpperCase()}</div><div><p className="um-modal-user-name">{name}</p><p className="um-modal-user-balance">Current: <strong>{balance.toLocaleString()}</strong></p></div></div>
        <form onSubmit={handleSubmit}>
          <label className="um-form-label">Amount</label>
          <input className="um-form-input" type="number" step="0.01" min="1" max="100000" placeholder="Enter amount..." value={amount} onChange={e=>setAmount(e.target.value)} disabled={loading} autoFocus />
          {amount>0 && <p className="um-balance-preview">New balance: <strong>{newBalance.toLocaleString()}</strong></p>}
          <div className="um-modal-actions">
            <button type="button" className="um-btn um-btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="um-btn um-btn-primary" disabled={loading||!amount}>{loading?"Processing...":"Confirm"}</button>
          </div>
        </form>
      </div>
    </div></div>
  );
}