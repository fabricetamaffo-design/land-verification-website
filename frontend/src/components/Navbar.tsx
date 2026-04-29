import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) =>
    location.pathname === path ? 'text-green-300 font-semibold' : 'text-white hover:text-green-200';

  return (
    <nav className="bg-green-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🏡</span>
            <span className="text-white font-bold text-xl tracking-tight">LandVerify<span className="text-green-300">CM</span></span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-6 text-sm">
            <Link to="/" className={isActive('/')}>Home</Link>
            <Link to="/search" className={isActive('/search')}>Search</Link>
            <Link to="/browse" className={isActive('/browse')}>Browse</Link>
            {isAdmin && <Link to="/admin" className={isActive('/admin')}>Admin Panel</Link>}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-green-200 text-xs">Hi, {user?.name.split(' ')[0]}</span>
                <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link to="/login" className="text-white hover:text-green-200 border border-white/30 px-4 py-1.5 rounded-lg text-sm">Login</Link>
                <Link to="/register" className="bg-green-500 hover:bg-green-400 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2 text-sm">
            <Link to="/" className="block text-white hover:text-green-200 py-2" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/search" className="block text-white hover:text-green-200 py-2" onClick={() => setMenuOpen(false)}>Search</Link>
            <Link to="/browse" className="block text-white hover:text-green-200 py-2" onClick={() => setMenuOpen(false)}>Browse</Link>
            {isAdmin && <Link to="/admin" className="block text-white hover:text-green-200 py-2" onClick={() => setMenuOpen(false)}>Admin Panel</Link>}
            {isAuthenticated
              ? <button onClick={handleLogout} className="block text-red-300 py-2 w-full text-left">Logout</button>
              : <>
                  <Link to="/login" className="block text-white py-2" onClick={() => setMenuOpen(false)}>Login</Link>
                  <Link to="/register" className="block text-green-300 py-2" onClick={() => setMenuOpen(false)}>Register</Link>
                </>
            }
          </div>
        )}
      </div>
    </nav>
  );
}
