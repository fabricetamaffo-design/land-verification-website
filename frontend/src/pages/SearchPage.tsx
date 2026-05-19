import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { searchLands } from '../services/land.service';
import { SearchResult } from '../types';
import LandCard from '../components/LandCard';
import { useLang } from '../context/LanguageContext';

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="h-1.5 skeleton" />
      <div className="p-5 space-y-4">
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="skeleton h-3 w-20 rounded" />
            <div className="skeleton h-5 w-32 rounded" />
          </div>
          <div className="skeleton h-7 w-16 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-12 rounded-lg" />)}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');
  const { t } = useLang();

  const handleSearch = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true); setError(''); setSearched(true);
    try {
      const data = await searchLands(q.trim());
      setResults(data.results);
      setSearchParams({ q: q.trim() });
    } catch {
      setError(t.search.error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initial = searchParams.get('q');
    if (initial) handleSearch(initial);
    else { setSearched(false); setResults([]); }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      {/* Search header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-black text-gray-900 mb-1">{t.search.title}</h1>
            <p className="text-gray-400 text-sm mb-6">{t.search.subtitle}</p>

            <form
              onSubmit={(e) => { e.preventDefault(); handleSearch(query); }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="flex-1 relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.search.placeholder}
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all font-mono"
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary px-8 py-3.5 rounded-xl text-sm"
              >
                {t.search.btn}
              </motion.button>
            </form>

            {/* Hint */}
            <p className="text-xs text-gray-400 mt-3 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Land title numbers follow the format: <span className="font-mono text-gray-500">TF-XXX-CITYNAME</span>
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-6 flex items-center gap-2">
            <span>⚠</span>{error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="text-sm text-gray-400 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin text-green-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t.search.loading}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[1, 2].map((i) => <SkeletonCard key={i} />)}
              </div>
            </motion.div>
          )}

          {!loading && searched && (
            <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <p className="text-sm text-gray-400 mb-5 font-medium">
                {results.length > 0 ? (
                  <><span className="text-green-600 font-bold">{results.length}</span> {t.search.results}</>
                ) : (
                  <span className="text-gray-400">{t.search.noResults}</span>
                )}
              </p>
              {results.length === 0 ? (
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm"
                >
                  <div className="text-5xl mb-4 float-anim inline-block">🔍</div>
                  <h3 className="text-gray-700 font-bold text-base mb-2">{t.search.noResults}</h3>
                  <p className="text-gray-400 text-sm">{t.search.noResultsHint}</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {results.map((land, i) => <LandCard key={land.id} land={land} index={i} />)}
                </div>
              )}
            </motion.div>
          )}

          {!loading && !searched && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white rounded-2xl border border-dashed border-green-200"
            >
              <div className="text-6xl mb-5 float-anim inline-block">🔐</div>
              <h3 className="text-gray-700 font-semibold text-base mb-2">Enter a Land Title Number</h3>
              <p className="text-gray-400 text-sm max-w-xs mx-auto">
                Type the exact title number of the land parcel you want to verify (e.g. TF-001-YAOUNDE).
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
