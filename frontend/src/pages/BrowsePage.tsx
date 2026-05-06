import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchLands, getQuarters } from '../services/land.service';
import { SearchResult } from '../types';
import LandCard from '../components/LandCard';
import { useLang } from '../context/LanguageContext';

export default function BrowsePage() {
  const [quarters, setQuarters] = useState<string[]>([]);
  const [selectedQuarter, setSelectedQuarter] = useState('');
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const { t } = useLang();

  useEffect(() => {
    getQuarters().then((data) => setQuarters(data.quarters));
    searchLands().then((data) => { setResults(data.results); setInitialLoad(false); });
  }, []);

  const handleFilter = async () => {
    setLoading(true);
    try {
      const data = await searchLands(keyword || undefined, selectedQuarter || undefined);
      setResults(data.results);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setSelectedQuarter(''); setKeyword(''); setLoading(true);
    const data = await searchLands();
    setResults(data.results); setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-black text-gray-900 mb-1">{t.browse.title}</h1>
            <p className="text-gray-400 text-sm mb-6">{t.browse.subtitle}</p>

            {/* Filter bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{t.browse.quarter}</label>
                <div className="relative">
                  <select
                    value={selectedQuarter}
                    onChange={(e) => setSelectedQuarter(e.target.value)}
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all appearance-none pr-10"
                  >
                    <option value="">{t.browse.allQuarters}</option>
                    {quarters.map((q) => <option key={q} value={q}>{q}</option>)}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{t.browse.keyword}</label>
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                    placeholder={t.browse.keywordPlaceholder}
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <motion.button
                  onClick={handleFilter}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary px-7 py-3 rounded-xl text-sm"
                >
                  {t.browse.apply}
                </motion.button>
                <motion.button
                  onClick={handleReset}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="border-2 border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-100 font-medium px-5 py-3 rounded-xl text-sm transition-all"
                >
                  {t.browse.reset}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {(loading || initialLoad) ? (
            <motion.div key="loading" className="flex flex-col items-center justify-center py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="relative w-14 h-14 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-green-100" />
                <div className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
              </div>
              <p className="text-gray-400 text-sm">Loading parcels…</p>
            </motion.div>
          ) : results.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm"
            >
              <div className="text-6xl mb-5 float-anim inline-block">🏘️</div>
              <h3 className="text-gray-600 font-semibold">{t.browse.noResults}</h3>
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="text-sm text-gray-400 mb-5 font-medium">
                <span className="text-green-600 font-bold">{results.length}</span> {t.browse.parcelsFound}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {results.map((land, i) => <LandCard key={land.id} land={land} index={i} />)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
