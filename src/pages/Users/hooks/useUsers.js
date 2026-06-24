// pages/Users/hooks/useUsers.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [roleFilter, setRoleFilter] = useState('all'); // all | user | admin | superadmin
  const [statusFilter, setStatusFilter] = useState('all'); // all | active | blocked
  const [sortBy, setSortBy] = useState('newest'); // newest | oldest | name | balance

  const getHeaders = () => ({
    Authorization: 'Bearer ' + localStorage.getItem('token')
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10, search };
      if (roleFilter !== 'all') {
    params.role = roleFilter;
    // Map UI names to actual roles
    if (roleFilter === 'finance') params.role = 'finance';
    if (roleFilter === 'game') params.role = 'game';
  }
      if (statusFilter !== 'all') params.isActive = statusFilter === 'active';
      if (sortBy) params.sort = sortBy;

      const res = await axios.get(API + '/admin/users', { headers: getHeaders(), params });
      setUsers(res.data.users || []);
      setTotalPages(res.data.pagination?.pages || 1);
      setTotalUsers(res.data.pagination?.total || 0);
    } catch { toast.error('Failed to load users'); }
    setLoading(false);
  }, [page, search, roleFilter, statusFilter, sortBy]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const toggleStatus = async (userId, isActive, userName) => {
    try {
      await axios.put(API + '/admin/users/' + userId, { isActive: !isActive }, { headers: getHeaders() });
      toast.success(
        isActive 
          ? '?? ' + userName + ' has been blocked' 
          : '?? ' + userName + ' has been activated'
      );
      fetchUsers();
    } catch { toast.error('Failed to update user'); }
  };

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  return {
    users, search, page, totalPages, totalUsers, loading,
    roleFilter, statusFilter, sortBy,
    setPage, handleSearch, setRoleFilter, setStatusFilter, setSortBy,
    toggleStatus, fetchUsers,
  };
}

