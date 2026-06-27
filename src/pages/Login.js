import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [phone, setPhone] = useState('+251900000000');
  const [password, setPassword] = useState('Admin@1234');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!phone || !password) {
      toast.error('Please enter phone and password');
      return;
    }
    
    setLoading(true);
    try {
      const user = await login(phone, password);
      
      if (user.role === 'admin' || user.role === 'superadmin') {
        toast.success('Welcome back, Admin!');
        navigate('/dashboard');
      } else {
        toast.error('Admin access only');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Invalid credentials');
      } else if (err.response?.status === 423) {
        toast.error(err.response?.data?.message || 'Account locked');
      } else if (err.code === 'ERR_NETWORK') {
        toast.error('Cannot connect to server');
      } else {
        toast.error(err.response?.data?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.icon}>🎯</span>
          <h1 style={styles.title}>Admin Login</h1>
        </div>
        <p style={styles.subtitle}>Sign in to your admin account</p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone Number</label>
            <input
              style={styles.input}
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+251900000000"
              disabled={loading}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>
          
          <button 
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }} 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
        
        <div style={styles.footer}>
          <p style={styles.hint}>
            Demo: +251900000000 / Admin@1234
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#ffffff',
    padding: '20px',
  },
  card: {
    background: '#ffffff',
    padding: '48px 40px',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '2px solid #d4af37',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '8px',
  },
  icon: {
    fontSize: '32px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: 0,
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    fontSize: '14px',
    marginBottom: '32px',
    marginTop: '4px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    color: '#333',
    fontSize: '14px',
    fontWeight: '500',
  },
  input: {
    padding: '14px 16px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    background: '#f9f9f9',
    color: '#333',
    fontSize: '15px',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  button: {
    padding: '14px',
    borderRadius: '8px',
    border: 'none',
    background: '#d4af37',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    marginTop: '8px',
    cursor: 'pointer',
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center',
  },
  hint: {
    fontSize: '13px',
    color: '#999',
    margin: 0,
  },
};