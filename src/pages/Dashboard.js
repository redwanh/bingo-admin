import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };
      const res = await axios.get(API + '/admin/stats', { headers });
      setStats(res.data.stats);
    } catch { toast.error('Failed'); }
  };

  if (!stats) return <div style={{ textAlign:'center',padding:50 }}>Loading...</div>;

  const chartData = stats.byRole?.map(r => ({ name: r._id, count: r.count })) || [];

  return (
    <>
      <h1>📊 Dashboard</h1>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:16,margin:'20px 0' }}>
        {[{ label:'Total Users', value:stats.totalUsers, color:'#FF4757' },{ label:'Active Users', value:stats.activeUsers, color:'#2ED573' },{ label:'New Today', value:stats.newToday, color:'#FFA502' }].map((s,i) => (
          <div key={i} style={{ background:'#16213e',padding:20,borderRadius:12 }}><p style={{ color:'#888',fontSize:12 }}>{s.label}</p><p style={{ fontSize:36,fontWeight:800,color:s.color }}>{s.value}</p></div>
        ))}
      </div>
      <div style={{ background:'#16213e',padding:20,borderRadius:12 }}>
        <h3>Users by Role</h3>
        <ResponsiveContainer width="100%" height={300}><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#333" /><XAxis dataKey="name" stroke="#888" /><YAxis stroke="#888" /><Tooltip contentStyle={{ background:'#1a1a2e',border:'none' }} /><Bar dataKey="count" fill="#FF4757" radius={[8,8,0,0]} /></BarChart></ResponsiveContainer>
      </div>
    </>
  );
}
