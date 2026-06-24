// pages/Transactions/index.js
import React from 'react';
import { useTransactions } from './hooks/useTransactions';
import WithdrawalTable from './components/WithdrawalTable';
import DepositTable from './components/DepositTable';
import JournalTable from './components/JournalTable';
import CardPurchaseTable from './components/CardPurchaseTable';

export default function Transactions() {
  const {
    tab, setTab,
    withdrawals, deposits, journal, cardPurchases,
    loading, pendingCount,
    typeFilter, setTypeFilter,
    userFilter, setUserFilter, accountFilter, setAccountFilter,
    page, totalPages, setPage,
    approveWithdrawal, rejectWithdrawal, approveDeposit,
  } = useTransactions();

  const tabs = [
    { key: 'withdrawals', label: '💸 Withdrawals', count: pendingCount },
    { key: 'deposits', label: '💰 Deposits' },
    { key: 'journal', label: '📊 Journal' },
    { key: 'card_purchases', label: '🎴 Card Purchases' },
  ];

  const s = {
    tabBtn: (active) => ({
      padding: '12px 20px', borderRadius: 12, border: 'none',
      background: active ? 'rgba(255,215,0,0.12)' : '#16213e',
      color: active ? '#FFD700' : '#A0A0B8',
      fontWeight: active ? 700 : 500, fontSize: 13, cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 6,
    }),
  };

  return (
    <>
      <h1 style={{ marginBottom: 5, fontSize: 28 }}>💰 Transaction Management</h1>
      <p style={{ color: '#888', marginBottom: 20 }}>Manage withdrawals, deposits, and view transaction reports</p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={s.tabBtn(tab === t.key)}>
            {t.label}
            {t.count > 0 && (
              <span style={{ background: '#FF4757', color: '#fff', padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700 }}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'withdrawals' && (
        <WithdrawalTable data={withdrawals} loading={loading} onApprove={approveWithdrawal} onReject={rejectWithdrawal} />
      )}
      {tab === 'deposits' && (
        <DepositTable data={deposits} loading={loading} onApprove={approveDeposit} />
      )}
      {tab === 'journal' && (
        <JournalTable data={journal} loading={loading} typeFilter={typeFilter} onTypeFilter={setTypeFilter} userFilter={userFilter} onUserFilter={setUserFilter} page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
      {tab === 'card_purchases' && (
        <CardPurchaseTable data={cardPurchases} loading={loading} />
      )}
    </>
  );
}


