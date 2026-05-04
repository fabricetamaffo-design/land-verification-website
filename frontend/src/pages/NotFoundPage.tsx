import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLang } from '../context/LanguageContext';

export default function NotFoundPage() {
  const { t } = useLang();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
          className="mb-8"
        >
          <div className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-green-500 to-emerald-300 leading-none">
            404
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="text-6xl mb-5 float-anim inline-block">🗺️</div>
          <h1 className="text-2xl font-black text-gray-900 mb-3">{t.notFound.title}</h1>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">{t.notFound.subtitle}</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="btn-primary px-7 py-3 rounded-xl text-sm inline-flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {t.notFound.goHome}
            </Link>
            <button
              onClick={() => navigate(-1)}
              className="btn-secondary px-7 py-3 rounded-xl text-sm inline-flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t.notFound.goBack}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
