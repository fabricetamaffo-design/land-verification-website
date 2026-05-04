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
            <div className="mt-5 flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
              <span className="text-xs text-green-400 font-medium">System Online — 99% Uptime</span>
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

          {/* Project Info */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">{t.footer.project}</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="text-gray-400">{t.footer.institute}</li>
              <li className="text-gray-400">{t.footer.dept}</li>
              <li className="text-gray-400">Spring 2026 — Team LandVerify</li>
              <li className="mt-3">
                <a
                  href="https://github.com/fabricetamaffo-design/land-verification-website"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>GitHub</span>
                </a>
              </li>
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
