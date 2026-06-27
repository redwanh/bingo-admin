import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import Login from './pages/Login';

// Import all pages
import Dashboard from './pages/Dashboard';
import Users from './pages/Users/index';
import GameConfig from './pages/GameConfig';
import VoiceManager from './pages/VoiceManager';
import GameMonitor from './pages/MainBingoMonitor';
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
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes - Now wrapped with ProtectedRoute */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AdminLayout><Dashboard /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute>
              <AdminLayout><Users /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/game-config" element={
            <ProtectedRoute>
              <AdminLayout><GameConfig /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/main-bingo-rules" element={
            <ProtectedRoute>
              <AdminLayout><MainBingoRules /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/main-bingo-monitor" element={
            <ProtectedRoute>
              <AdminLayout><MainBingoMonitor /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/voice-manager" element={
            <ProtectedRoute>
              <AdminLayout><VoiceManager /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/game-monitor" element={
            <ProtectedRoute>
              <AdminLayout><GameMonitor /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/transactions" element={
            <ProtectedRoute>
              <AdminLayout><Transactions /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/deposits" element={
            <ProtectedRoute>
              <AdminLayout><Deposits /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/cms" element={
            <ProtectedRoute>
              <AdminLayout><CMS /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/app-settings" element={
            <ProtectedRoute>
              <AdminLayout><AppSettings /></AdminLayout>
            </ProtectedRoute>
          } />

          {/* Default */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;