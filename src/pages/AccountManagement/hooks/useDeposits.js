// pages/Deposits/hooks/useDeposits.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export function useDeposits() {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pendingCount, setPendingCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState('pending');

  const getHeaders = () => ({
    Authorization: 'Bearer ' + localStorage.getItem('token')
  });

  const fetchDeposits = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (statusFilter !== 'all') params.status = statusFilter;
      
      const res = await axios.get(API + '/payments/deposits', { headers: getHeaders(), params });
      setDeposits(res.data.data.deposits || []);
      setTotalPages(res.data.data.pagination?.pages || 1);
      setPendingCount(res.data.data.pendingCount || 0);
    } catch (e) {
      toast.error('Failed to load deposits');
    }
    setLoading(false);
  }, [page, statusFilter]);

  useEffect(() => { fetchDeposits(); }, [fetchDeposits]);

  const approveDeposit = async (id) => {
    try {
      await axios.put(API + '/payments/deposits/' + id + '/approve', {}, { headers: getHeaders() });
      toast.success('? Deposit approved! Balance updated.');
      fetchDeposits();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Approval failed');
    }
  };

  const rejectDeposit = async (id) => {
    const note = prompt('Reason for rejection (optional):');
    try {
      await axios.put(API + '/payments/deposits/' + id + '/reject', { note }, { headers: getHeaders() });
      toast.success('Deposit rejected');
      fetchDeposits();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Rejection failed');
    }
  };

  return {
    deposits, loading, page, totalPages, pendingCount,
    statusFilter, setStatusFilter, setPage,
    approveDeposit, rejectDeposit, fetchDeposits,
  };
}
