import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const USERS_PER_PAGE = 15;

const getToken = () => localStorage.getItem('token');

const api = axios.create({ baseURL: API });
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function useUsers() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);

  const abortRef = useRef(null);

  const fetchAllUsers = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setLoading(true);

    try {
      const { data } = await api.get('/admin/users', {
        params: { limit: 1000, page: 1, _t: Date.now() },
        signal: abortRef.current.signal,
      });

      const users = (data.users || []).map(u => ({
        ...u,
        balance: u.walletBalance ?? u.balance ?? 0,
      }));

      setAllUsers(users);
      setTotalUsers(data.pagination?.total || users.length);
    } catch (e) {
      if (e.name !== 'CanceledError') toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllUsers();
    return () => abortRef.current?.abort();
  }, [fetchAllUsers, refreshKey]);

  // Filter and sort (no useMemo — always fresh)
  let result = [...allUsers];

  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(u =>
      (u.fullName || '').toLowerCase().includes(q) ||
      (u.username || '').toLowerCase().includes(q) ||
      (u.phone || '').includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    );
  }

  if (roleFilter !== 'all') result = result.filter(u => u.role === roleFilter);
  if (statusFilter === 'active') result = result.filter(u => u.isActive !== false);
  else if (statusFilter === 'inactive') result = result.filter(u => u.isActive === false);

  switch (sortBy) {
    case 'oldest': result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); break;
    case 'name': result.sort((a, b) => (a.fullName || '').localeCompare(b.fullName || '')); break;
    case 'role': result.sort((a, b) => (a.role || '').localeCompare(b.role || '')); break;
    case 'balance_high': result.sort((a, b) => (b.walletBalance || 0) - (a.walletBalance || 0)); break;
    case 'balance_low': result.sort((a, b) => (a.walletBalance || 0) - (b.walletBalance || 0)); break;
    default: result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  const totalFiltered = result.length;
  const totalPages = Math.ceil(totalFiltered / USERS_PER_PAGE) || 1;
  const safePage = Math.min(page, totalPages);
  const users = result.slice((safePage - 1) * USERS_PER_PAGE, safePage * USERS_PER_PAGE);

  useEffect(() => { setPage(1); }, [search, roleFilter, statusFilter, sortBy]);

  const handleSearch = useCallback((value) => setSearch(value), []);

  const toggleStatus = useCallback(async (userId, isActive, userName) => {
    try {
      await api.put(`/admin/users/${userId}`, { isActive: !isActive });
      toast.success(isActive ? `🔒 ${userName} disabled` : `✅ ${userName} enabled`);
      setRefreshKey(k => k + 1);
    } catch {
      toast.error('Failed to update');
    }
  }, []);

  const addBalance = useCallback(async (userId, amount, userName) => {
    try {
      await api.post(`/admin/users/${userId}/balance`, {
        amount: parseFloat(amount),
        description: 'Admin deposit',
      });
      toast.success(`💰 Added ${amount.toLocaleString()} to ${userName}`);
      setRefreshKey(k => k + 1);
      return true;
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed');
      return false;
    }
  }, []);

  return {
    users, search, page: safePage, totalPages, totalUsers, loading,
    roleFilter, statusFilter, sortBy,
    setPage, handleSearch, setRoleFilter, setStatusFilter, setSortBy,
    toggleStatus, addBalance, fetchUsers: () => setRefreshKey(k => k + 1),
  };
}