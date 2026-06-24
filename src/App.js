import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AdminLayout from './components/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users/index';
import GameConfig from './pages/GameConfig';

import VoiceManager from './pages/VoiceManager';
import GameMonitor from './pages/GameMonitor';
import MainBingoRules from './pages/MainBingoRules';
import MainBingoMonitor from './pages/MainBingoMonitor';
import Transactions from './pages/Transactions/index';
import Deposits from './pages/Deposits/index';
import CMS from './pages/CMS';
import AppSettings from './pages/AppSettings/index';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ style: { background: '#1a1a2e', color: '#fff' } }} />
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protected � All wrapped in AdminLayout */}
          <Route path="/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
          <Route path="/users" element={<AdminLayout><Users /></AdminLayout>} />
          <Route path="/game-config" element={<AdminLayout><GameConfig /></AdminLayout>} />
          <Route path="/main-bingo-rules" element={<AdminLayout><MainBingoRules /></AdminLayout>} />
        
          <Route path="/main-bingo-monitor" element={<AdminLayout><MainBingoMonitor /></AdminLayout>} />
          <Route path="/voice-manager" element={<AdminLayout><VoiceManager /></AdminLayout>} />
          <Route path="/game-monitor" element={<AdminLayout><GameMonitor /></AdminLayout>} />
          
          <Route path="/transactions" element={<AdminLayout><Transactions /></AdminLayout>} />
          <Route path="/deposits" element={<AdminLayout><Deposits /></AdminLayout>} />
          <Route path="/cms" element={<AdminLayout><CMS /></AdminLayout>} />          <Route path="/app-settings" element={<AdminLayout><AppSettings /></AdminLayout>} />

          {/* Default */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;









