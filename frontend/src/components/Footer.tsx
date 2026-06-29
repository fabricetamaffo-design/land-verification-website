import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLang } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center space-x-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-green-900 text-sm font-black">LV</span>
              </div>
              <span className="text-white font-bold text-xl">
                LandVerify<span className="text-green-400">CM</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              {t.footer.tagline}
            </p>
            <div className="mt-5 text-xs text-gray-500">
              Web and mobile capstone project
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">{t.footer.quickLinks}</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/search', label: t.footer.searchLand },
                { to: '/browse', label: t.footer.browseLand },
                { to: '/register', label: t.footer.registerAccount },
                { to: '/about', label: t.footer.about },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-gray-400 hover:text-green-400 transition-colors duration-200 flex items-center space-x-1.5"
                  >
                    <span className="text-green-600 text-xs">→</span>
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">{t.footer.contactTitle}</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href={`mailto:${t.footer.contactEmail}`} className="text-gray-400 hover:text-green-400 transition-colors flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {t.footer.contactEmail}
                </a>
              </li>
              <li className="text-gray-400 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {t.footer.contactPhone}
              </li>
              <li className="text-gray-400 text-xs leading-relaxed">{t.footer.ministry}</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">{t.footer.copyright}</p>
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <Link to="/about" className="hover:text-gray-300 transition-colors">{t.footer.privacyPolicy}</Link>
            <span>·</span>
            <Link to="/about" className="hover:text-gray-300 transition-colors">{t.footer.terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
