// pages/Transactions/index.js
import React from 'react';
import { useTransactions } from './hooks/useTransactions';
import WithdrawalTable from './components/WithdrawalTable';
import DepositTable from './components/DepositTable';
import JournalTable from './components/JournalTable';
import CardPurchaseTable from './components/CardPurchaseTable';
import './Transactions.css';

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

  return (
    <div className="transactions-page">
      <div className="transactions-header">
        <div>
          <h1 className="page-title">💰 Transaction Management</h1>
          <p className="page-subtitle">Manage withdrawals, deposits, and view transaction reports</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-bar">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`tab-btn ${tab === t.key ? 'active' : ''}`}
          >
            {t.label}
            {t.count > 0 && (
              <span className="tab-badge">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="tab-content">
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
      </div>
    </div>
  );
}