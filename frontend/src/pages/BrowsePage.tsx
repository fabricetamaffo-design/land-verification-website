import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../context/LanguageContext';
import { browseLands, getQuarters } from '../services/land.service';
import { SearchResult } from '../types';
import LandCard from '../components/LandCard';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

export default function BrowsePage() {
  const [quarter, setQuarter] = useState('');
  const [quarters, setQuarters] = useState<string[]>([]);
  const [lands, setLands] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLang();

  useEffect(() => {
    getQuarters()
      .then((data) => setQuarters(data.quarters))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    browseLands(quarter || undefined)
      .then((data) => setLands(data.results))
      .catch(() => setLands([]))
      .finally(() => setLoading(false));
  }, [quarter]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <h1 className="text-3xl font-black text-gray-900 mb-1">{t.browse.title}</h1>
            <p className="text-gray-400 text-sm mb-6">{t.browse.subtitle}</p>

            {/* Quarter filter pills */}
            <div className="flex flex-wrap gap-2">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setQuarter('')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                  quarter === ''
                    ? 'bg-green-600 text-white border-green-600 shadow-md shadow-green-500/25'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:bg-green-50'
                }`}
              >
                All Quarters
              </motion.button>
              {quarters.map((q) => (
                <motion.button
                  key={q}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setQuarter(q)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                    quarter === q
                      ? 'bg-green-600 text-white border-green-600 shadow-md shadow-green-500/25'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:bg-green-50'
                  }`}
                >
                  {q}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-6">
        {/* Record count */}
        <AnimatePresence mode="wait">
          {!loading && (
            <motion.p
              key={lands.length}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm text-gray-400 mb-5 font-medium"
            >
              <span className="text-green-600 font-bold">{lands.length}</span>{' '}
              {lands.length === 1 ? 'record' : 'records'} found
              {quarter ? <span className="text-gray-300"> · {quarter}</span> : ''}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Loading spinner */}
        {loading && (
          <div className="flex justify-center py-24">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-4 border-green-100" />
              <div className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && lands.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm"
          >
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-gray-700 font-bold text-xl mb-2">No lands found</h3>
            <p className="text-gray-400 text-sm">{t.browse.noResults}</p>
            {quarter && (
              <button
                onClick={() => setQuarter('')}
                className="mt-5 bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all duration-200"
              >
                Clear filter
              </button>
            )}
          </motion.div>
        )}

        {/* Land cards — real clickable data */}
        {!loading && lands.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {lands.map((land, i) => (
              <LandCard key={land.id} land={land} index={i} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
