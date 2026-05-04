import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { lang, setLang, t } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  const navLink =
    'relative text-sm font-medium transition-colors duration-200 py-1';
  const activeClass = 'text-green-300';
  const inactiveClass = 'text-white/80 hover:text-white';

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-green-900/95 backdrop-blur-md shadow-2xl shadow-black/20'
          : 'bg-green-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-300 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
              <span className="text-green-900 text-sm font-black">LV</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              LandVerify<span className="text-green-300">CM</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {[
              { path: '/', label: t.nav.home },
              { path: '/search', label: t.nav.search },
              { path: '/browse', label: t.nav.browse },
              { path: '/about', label: 'About' },
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`${navLink} ${isActive(path) ? activeClass : inactiveClass} px-3 py-2 rounded-lg hover:bg-white/10`}
              >
                {label}
                {isActive(path) && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-green-300 rounded-full"
                  />
                )}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className={`${navLink} ${isActive('/admin') ? activeClass : inactiveClass} px-3 py-2 rounded-lg hover:bg-white/10`}
              >
                {t.nav.admin}
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-white/10 rounded-lg p-0.5">
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-200 ${
                  lang === 'en' ? 'bg-white text-green-900 shadow' : 'text-white/70 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('fr')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-200 ${
                  lang === 'fr' ? 'bg-white text-green-900 shadow' : 'text-white/70 hover:text-white'
                }`}
              >
                FR
              </button>
            </div>

            {isAuthenticated ? (
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 rounded-xl px-3 py-1.5 transition-all duration-200"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-green-400 to-emerald-300 rounded-full flex items-center justify-center text-green-900 font-bold text-xs">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-white text-sm font-medium">{user?.name?.split(' ')[0]}</span>
                  <svg
                    className={`w-3 h-3 text-white/60 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
                    >
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{t.nav.profile}</span>
                      </Link>
                      <div className="border-t border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>{t.nav.logout}</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-white/80 hover:text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-200"
                >
                  {t.nav.login}
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-300 hover:to-emerald-300 text-green-900 font-semibold text-sm px-5 py-2 rounded-xl transition-all duration-200 shadow-lg shadow-green-500/20 hover:shadow-green-400/30"
                >
                  {t.nav.register}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <motion.div
              animate={menuOpen ? 'open' : 'closed'}
              className="w-5 h-5 flex flex-col justify-center gap-1.5"
            >
              <motion.span
                variants={{ open: { rotate: 45, y: 6 }, closed: { rotate: 0, y: 0 } }}
                className="block h-0.5 w-5 bg-white origin-center transition-all"
              />
              <motion.span
                variants={{ open: { opacity: 0 }, closed: { opacity: 1 } }}
                className="block h-0.5 w-5 bg-white transition-all"
              />
              <motion.span
                variants={{ open: { rotate: -45, y: -6 }, closed: { rotate: 0, y: 0 } }}
                className="block h-0.5 w-5 bg-white origin-center transition-all"
              />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden bg-green-900/98 border-t border-white/10"
          >
            <div className="px-4 py-4 space-y-1">
              {[
                { path: '/', label: t.nav.home },
                { path: '/search', label: t.nav.search },
                { path: '/browse', label: t.nav.browse },
                { path: '/about', label: 'About' },
              ].map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(path) ? 'bg-white/15 text-green-300' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {label}
                </Link>
              ))}
              {isAdmin && (
                <Link to="/admin" className="block px-4 py-2.5 rounded-lg text-sm font-medium text-white/80 hover:bg-white/10">
                  {t.nav.admin}
                </Link>
              )}

              <div className="pt-3 border-t border-white/10 space-y-1">
                {/* Language */}
                <div className="flex items-center space-x-2 px-4 py-2">
                  <span className="text-white/50 text-xs">Language:</span>
                  <button
                    onClick={() => setLang('en')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold ${lang === 'en' ? 'bg-white text-green-900' : 'text-white/60 hover:text-white'}`}
                  >EN</button>
                  <button
                    onClick={() => setLang('fr')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold ${lang === 'fr' ? 'bg-white text-green-900' : 'text-white/60 hover:text-white'}`}
                  >FR</button>
                </div>

                {isAuthenticated ? (
                  <>
                    <Link to="/profile" className="block px-4 py-2.5 rounded-lg text-sm text-white/80 hover:bg-white/10">{t.nav.profile}</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 rounded-lg text-sm text-red-300 hover:bg-red-500/10">
                      {t.nav.logout}
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block px-4 py-2.5 rounded-lg text-sm text-white/80 hover:bg-white/10">{t.nav.login}</Link>
                    <Link to="/register" className="block px-4 py-2.5 rounded-lg text-sm font-semibold text-green-300 hover:bg-white/10">{t.nav.register}</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
