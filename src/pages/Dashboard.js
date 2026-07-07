import React from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="admin-dashboard">
      <div className="dashboard-welcome">
        <h1>Welcome, {user?.fullName || user?.phoneNumber || 'Admin'} 👋</h1>
        <p>This is your admin dashboard. More features coming soon.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;