import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
  // All users fetched from backend
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);

  // Client-side filters
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);

  const abortRef = useRef(null);

  // Fetch ALL users once
  const fetchAllUsers = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setLoading(true);

    try {
      const { data } = await api.get('/admin/users', {
        params: { limit: 1000, page: 1 }, // Fetch up to 1000 users
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
  }, [fetchAllUsers]);

  // Client-side filtering (instant)
  const filteredUsers = useMemo(() => {
    let result = [...allUsers];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(u =>
        (u.fullName || '').toLowerCase().includes(q) ||
        (u.username || '').toLowerCase().includes(q) ||
        (u.phone || '').includes(q) ||
        (u.email || '').toLowerCase().includes(q)
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      result = result.filter(u => u.role === roleFilter);
    }

    // Status filter
    if (statusFilter === 'active') {
      result = result.filter(u => u.isActive !== false);
    } else if (statusFilter === 'inactive') {
      result = result.filter(u => u.isActive === false);
    }

    // Sort
    switch (sortBy) {
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'name':
        result.sort((a, b) => (a.fullName || '').localeCompare(b.fullName || ''));
        break;
      case 'role':
        result.sort((a, b) => (a.role || '').localeCompare(b.role || ''));
        break;
      case 'balance_high':
        result.sort((a, b) => (b.walletBalance || 0) - (a.walletBalance || 0));
        break;
      case 'balance_low':
        result.sort((a, b) => (a.walletBalance || 0) - (b.walletBalance || 0));
        break;
      default: // newest
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [allUsers, search, roleFilter, statusFilter, sortBy]);

  // Paginate filtered results
  const totalFiltered = filteredUsers.length;
  const totalPages = Math.ceil(totalFiltered / USERS_PER_PAGE) || 1;
  const safePage = Math.min(page, totalPages);

  const users = useMemo(() => {
    const start = (safePage - 1) * USERS_PER_PAGE;
    return filteredUsers.slice(start, start + USERS_PER_PAGE);
  }, [filteredUsers, safePage]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, roleFilter, statusFilter, sortBy]);

  // Instant search (no debounce needed)
  const handleSearch = useCallback((value) => {
    setSearch(value);
  }, []);

  // Toggle user status
  const toggleStatus = useCallback(async (userId, isActive, userName) => {
    try {
      await api.put(`/admin/users/${userId}`, { isActive: !isActive });
      toast.success(isActive ? `🔒 ${userName} disabled` : `✅ ${userName} enabled`);
      setAllUsers(prev => prev.map(u => u._id === userId ? { ...u, isActive: !isActive } : u));
    } catch {
      toast.error('Failed to update');
    }
  }, []);

  // Add balance
  // Add balance
const addBalance = useCallback(async (userId, amount, userName) => {
  try {
    const { data } = await api.post(`/admin/users/${userId}/balance`, {
      amount: parseFloat(amount),
      description: 'Admin deposit',
    });

    toast.success(`💰 Added ${amount.toLocaleString()} to ${userName}`);

    // 🔥 Get the new balance from the response
    const newBalance = data?.data?.balanceAfter 
      ?? data?.balanceAfter 
      ?? data?.data?.walletBalance 
      ?? 0;

    console.log('💰 Balance update response:', data); // Debug — check what backend returns

    // 🔥 Update ALL user arrays immediately
    setAllUsers(prev => prev.map(u => {
      if (u._id === userId) {
        return {
          ...u,
          walletBalance: newBalance,
          balance: newBalance,
        };
      }
      return u;
    }));

    return true;
  } catch (e) {
    toast.error(e.response?.data?.message || 'Failed');
    return false;
  }
}, []);

  const fetchUsers = fetchAllUsers; // alias for refresh

  return {
    users,
    search,
    page: safePage,
    totalPages,
    totalUsers,
    loading,
    roleFilter,
    statusFilter,
    sortBy,
    setPage,
    handleSearch,
    setRoleFilter,
    setStatusFilter,
    setSortBy,
    toggleStatus,
    addBalance,
    fetchUsers,
  };
}