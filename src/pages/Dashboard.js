import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };
      const res = await axios.get(API + '/admin/stats', { headers });
      setStats(res.data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading dashboard...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={styles.errorContainer}>
        <p style={styles.errorText}>No data available</p>
      </div>
    );
  }

  const chartData = stats.byRole?.map(r => ({ 
    name: r._id?.charAt(0).toUpperCase() + r._id?.slice(1) || 'Unknown', 
    count: r.count 
  })) || [];

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, color: '#d4af37' },
    { label: 'Active Users', value: stats.activeUsers, color: '#2ED573' },
    { label: 'New Today', value: stats.newToday, color: '#FF6B6B' },
  ];

  return (
    <div style={styles.container}>
      {/* Welcome Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>👋 Welcome, {user?.fullName || 'Admin'}!</h1>
          <p style={styles.subtitle}>Here's what's happening with your platform today</p>
        </div>
        <div style={styles.dateBadge}>
          <span>📅</span>
          <span>{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        {statCards.map((stat, index) => (
          <div key={index} style={styles.statCard}>
            <p style={styles.statLabel}>{stat.label}</p>
            <p style={{ ...styles.statValue, color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>📊 Users by Role</h3>
            <span style={styles.chartBadge}>Total: {stats.totalUsers}</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280" 
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={12}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ 
                  background: '#ffffff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }} 
                cursor={{ fill: 'rgba(212, 175, 55, 0.05)' }}
              />
              <Bar 
                dataKey="count" 
                fill="#d4af37" 
                radius={[6, 6, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

// ============================================
// Styles
// ============================================
const styles = {
  container: {
    padding: '4px 0',
  },
  
  // ===== Header =====
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '28px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: '0 0 4px 0',
  },
  subtitle: {
    fontSize: '15px',
    color: '#6b7280',
    margin: 0,
  },
  dateBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#374151',
    whiteSpace: 'nowrap',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },

  // ===== Stats Grid =====
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  statCard: {
    background: '#ffffff',
    padding: '20px 24px',
    borderRadius: '14px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    transition: 'box-shadow 0.2s ease',
  },
  statLabel: {
    color: '#6b7280',
    fontSize: '13px',
    fontWeight: '500',
    margin: '0 0 4px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  statValue: {
    fontSize: '36px',
    fontWeight: '800',
    margin: 0,
    lineHeight: '1.2',
  },

  // ===== Chart =====
  chartCard: {
    background: '#ffffff',
    padding: '24px',
    borderRadius: '14px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  chartTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a2e',
    margin: 0,
  },
  chartBadge: {
    fontSize: '13px',
    color: '#6b7280',
    background: '#f3f4f6',
    padding: '4px 12px',
    borderRadius: '20px',
  },

  // ===== Loading =====
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',
    gap: '16px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f4f6',
    borderTop: '4px solid #d4af37',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: '#6b7280',
    fontSize: '14px',
  },

  // ===== Error =====
  errorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '40vh',
  },
  errorText: {
    color: '#6b7280',
    fontSize: '16px',
  },
};

// Add keyframe animation for spinner
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);