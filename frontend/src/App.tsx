import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';
import LandDetailPage from './pages/LandDetailPage';
import BrowsePage from './pages/BrowsePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UploadLandPage from './pages/admin/UploadLandPage';
import ManageLandsPage from './pages/admin/ManageLandsPage';
import EditLandPage from './pages/admin/EditLandPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/lands/:id" element={<LandDetailPage />} />
              <Route path="/browse" element={<BrowsePage />} />

              {/* Protected: logged-in users */}
              <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />

              {/* Protected: admins only */}
              <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/upload" element={<ProtectedRoute adminOnly><UploadLandPage /></ProtectedRoute>} />
              <Route path="/admin/manage" element={<ProtectedRoute adminOnly><ManageLandsPage /></ProtectedRoute>} />
              <Route path="/admin/edit/:id" element={<ProtectedRoute adminOnly><EditLandPage /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
