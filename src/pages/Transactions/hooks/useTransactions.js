// pages/Transactions/hooks/useTransactions.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export function useTransactions() {
  const [tab, setTab] = useState('withdrawals');
  const [withdrawals, setWithdrawals] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [journal, setJournal] = useState([]);
  const [cardPurchases, setCardPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pendingCount, setPendingCount] = useState(0);
  const [typeFilter, setTypeFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('');
  const [accountFilter, setAccountFilter] = useState('all');

  const headers = () => ({ Authorization: 'Bearer ' + localStorage.getItem('token') });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (tab === 'withdrawals') {
        const res = await axios.get(API + '/finance/withdrawals', { headers: headers() });
        const wList = res.data?.data?.withdrawals || [];
        setWithdrawals(wList);
        setPendingCount(wList.filter(w => w.status === 'pending').length);
      } else if (tab === 'deposits') {
        const res = await axios.get(API + '/payments/deposits?limit=50', { headers: headers() });
        setDeposits(res.data?.data?.deposits || []);
      } else if (tab === 'journal') {
        const params = { page, limit: 30 };
        if (typeFilter !== 'all') params.type = typeFilter;
        if (userFilter) params.userId = userFilter;
        const res = await axios.get(API + '/finance/transactions', { headers: headers(), params });
        setJournal(res.data?.data?.transactions || []);
        setTotalPages(res.data?.data?.pagination?.pages || 1);
      } else if (tab === 'card_purchases') {
        const res = await axios.get(API + '/finance/reconciliation', { headers: headers(), params: { type: 'card_purchase' } });
        setCardPurchases(res.data?.data?.summary || []);
      }
    } catch (e) {
      console.log('Fetch error:', tab, e.response?.status);
    }
    setLoading(false);
  }, [tab, page, typeFilter, userFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const approveWithdrawal = async (id, txId) => {
    try {
      await axios.put(API + '/payments/withdrawals/' + id + '/approve', { transactionId: txId || 'N/A' }, { headers: headers() });
      toast.success('Withdrawal approved');
      fetchData();
    } catch (e) { toast.error('Failed'); }
  };

  const rejectWithdrawal = async (id, reason) => {
    try {
      await axios.put(API + '/payments/withdrawals/' + id + '/reject', { note: reason || 'Rejected' }, { headers: headers() });
      toast.success('Withdrawal rejected - balance restored');
      fetchData();
    } catch (e) { toast.error('Failed'); }
  };

  const approveDeposit = async (id) => {
    try {
      await axios.put(API + '/payments/deposits/' + id + '/approve', {}, { headers: headers() });
      toast.success('Deposit approved');
      fetchData();
    } catch (e) { toast.error('Failed'); }
  };

  return {
    tab, setTab,
    withdrawals, deposits, journal, cardPurchases,
    loading, page, totalPages, pendingCount,
    typeFilter, setTypeFilter,
    userFilter, setUserFilter,
    accountFilter, setAccountFilter,
    setPage,
    approveWithdrawal, rejectWithdrawal, approveDeposit,
    fetchData,
  };
}
