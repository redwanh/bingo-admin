import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [phone, setPhone] = useState('+251900000000');
  const [password, setPassword] = useState('Admin@1234');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(phone, password);
      if (user.role === 'admin' || user.role === 'superadmin') {
        toast.success('Welcome back!');
        navigate('/dashboard');
      } else {
        toast.error('Admin access only');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🎯 Bingo Admin</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="Phone (+251...)"
          />
          <input
            style={styles.input}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={styles.hint}>Admin: +251900000000 / Admin@1234</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    minHeight: '100vh', background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)'
  },
  card: {
    background: '#16213e', padding: 40, borderRadius: 16,
    width: 400, textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
  },
  title: { fontSize: 28, marginBottom: 30, color: '#e94560' },
  form: { display: 'flex', flexDirection: 'column', gap: 15 },
  input: {
    padding: 14, borderRadius: 8, border: '1px solid #333',
    background: '#0f3460', color: '#fff', fontSize: 16
  },
  button: {
    padding: 14, borderRadius: 8, border: 'none',
    background: '#e94560', color: '#fff', fontSize: 16,
    fontWeight: 'bold', cursor: 'pointer'
  },
  hint: { marginTop: 20, fontSize: 12, color: '#666' }
};
