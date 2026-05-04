import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import { getQuarters } from '../services/land.service';

type SampleStatus = 'VALID' | 'NOT_VALID';

interface SampleLand {
  id: string;
  quarter: string;
  areaSqm: number;
  status: SampleStatus;
  landUseType: string;
}

const LAND_USE_LABELS: Record<string, string> = {
  RESIDENTIAL: 'Residential', COMMERCIAL: 'Commercial',
  AGRICULTURAL: 'Agricultural', MIXED: 'Mixed Use', INDUSTRIAL: 'Industrial',
};
const LAND_USE_COLORS: Record<string, string> = {
  RESIDENTIAL: 'bg-blue-50 text-blue-700 border-blue-200',
  COMMERCIAL: 'bg-purple-50 text-purple-700 border-purple-200',
  AGRICULTURAL: 'bg-green-50 text-green-700 border-green-200',
  MIXED: 'bg-amber-50 text-amber-700 border-amber-200',
  INDUSTRIAL: 'bg-gray-50 text-gray-700 border-gray-200',
};

const SAMPLE_LANDS: SampleLand[] = [
  { id: 's1',  quarter: 'Bastos',             areaSqm: 500,  status: 'VALID',     landUseType: 'RESIDENTIAL' },
  { id: 's2',  quarter: 'Nlongkak',           areaSqm: 300,  status: 'VALID',     landUseType: 'COMMERCIAL' },
  { id: 's3',  quarter: 'Melen',              areaSqm: 750,  status: 'NOT_VALID', landUseType: 'AGRICULTURAL' },
  { id: 's4',  quarter: 'Bonanjo',            areaSqm: 620,  status: 'VALID',     landUseType: 'COMMERCIAL' },
  { id: 's5',  quarter: 'Akwa',               areaSqm: 410,  status: 'VALID',     landUseType: 'RESIDENTIAL' },
  { id: 's6',  quarter: 'Bafoussam Centre',   areaSqm: 880,  status: 'VALID',     landUseType: 'MIXED' },
  { id: 's7',  quarter: 'Commercial Avenue',  areaSqm: 320,  status: 'NOT_VALID', landUseType: 'COMMERCIAL' },
  { id: 's8',  quarter: 'Centre Ville',       areaSqm: 1100, status: 'VALID',     landUseType: 'AGRICULTURAL' },
  { id: 's9',  quarter: 'Bastos',             areaSqm: 680,  status: 'VALID',     landUseType: 'RESIDENTIAL' },
  { id: 's10', quarter: 'Akwa',               areaSqm: 450,  status: 'VALID',     landUseType: 'MIXED' },
  { id: 's11', quarter: 'Melen',              areaSqm: 920,  status: 'VALID',     landUseType: 'RESIDENTIAL' },
  { id: 's12', quarter: 'Nlongkak',           areaSqm: 280,  status: 'NOT_VALID', landUseType: 'COMMERCIAL' },
];

const SAMPLE_QUARTERS = ['All', ...Array.from(new Set(SAMPLE_LANDS.map((l) => l.quarter)))];

const cardVariants: import('framer-motion').Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.055, type: 'tween', ease: 'easeOut' } }),
};

export default function BrowsePage() {
  const [quarter, setQuarter] = useState('All');
  const { t } = useLang();

  const filtered = quarter === 'All'
    ? SAMPLE_LANDS
    : SAMPLE_LANDS.filter((l) => l.quarter === quarter);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">

      {/* ─── Page header ─── */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="text-3xl font-black text-gray-900 mb-1">{t.browse.title}</h1>
            <p className="text-gray-400 text-sm mb-6">Browse sample previews — enter a land title ID to see real details.</p>

            {/* Quarter filter pills */}
            <div className="flex flex-wrap gap-2">
              {SAMPLE_QUARTERS.map((q) => (
                <motion.button
                  key={q}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setQuarter(q)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${
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

        {/* ─── Privacy notice banner ─── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4 mb-6"
        >
          <div className="flex items-start gap-3 flex-1">
            <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <p className="text-amber-800 font-bold text-sm">Sample Preview — Owner Data Protected</p>
              <p className="text-amber-700 text-xs mt-0.5 leading-relaxed">
                This page shows anonymized sample records only. Real ownership details, title numbers, and GPS data are protected.
                Enter the exact <strong>Land Title ID</strong> in Search to verify a specific parcel.
              </p>
            </div>
          </div>
          <Link
            to="/search"
            className="flex-shrink-0 bg-amber-600 hover:bg-amber-500 active:scale-95 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search by Title ID
          </Link>
        </motion.div>

        {/* Count line */}
        <AnimatePresence mode="wait">
          <motion.p
            key={quarter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-gray-400 mb-4 font-medium"
          >
            <span className="text-green-600 font-bold">{filtered.length}</span> sample{' '}
            {filtered.length === 1 ? 'preview' : 'previews'} shown
            {quarter !== 'All' && <span className="text-gray-300"> · {quarter}</span>}
          </motion.p>
        </AnimatePresence>

        {/* ─── Sample cards — NOT clickable, data anonymised ─── */}
        <motion.div
          key={quarter}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filtered.map((land, i) => (
            <motion.div
              key={land.id}
              custom={i}
              variants={cardVariants}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 select-none"
            >
              {/* Status colour bar */}
              <div className={`h-1.5 w-full ${land.status === 'VALID' ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-gradient-to-r from-red-400 to-rose-500'}`} />

              <div className="p-5">
                {/* Header row */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">Title Number</p>
                    <p className="text-lg font-black text-gray-300 tracking-widest select-none">● ● ● ● ● ●</p>
                    <p className="text-xs text-gray-300 mt-0.5 italic">Confidential</p>
                  </div>

                  {/* Status badge */}
                  <div className="flex flex-col items-end gap-1">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                      land.status === 'VALID'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${land.status === 'VALID' ? 'bg-emerald-500 pulse-dot' : 'bg-red-500'}`} />
                      {land.status === 'VALID' ? t.status.VALID : t.status.NOT_VALID}
                    </span>
                  </div>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-2.5 text-xs mb-4">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-gray-400 text-[10px] uppercase tracking-wide font-semibold mb-0.5">Quarter</p>
                    <p className="text-gray-800 font-bold">{land.quarter}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-gray-400 text-[10px] uppercase tracking-wide font-semibold mb-0.5">Area</p>
                    <p className="text-gray-800 font-bold">{land.areaSqm.toLocaleString()} m²</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 col-span-2">
                    <p className="text-gray-400 text-[10px] uppercase tracking-wide font-semibold mb-0.5">Owner</p>
                    <p className="text-gray-300 font-semibold italic">— Protected —</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${LAND_USE_COLORS[land.landUseType] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                    {LAND_USE_LABELS[land.landUseType] || land.landUseType}
                  </span>
                  <Link
                    to="/search"
                    className="text-xs text-green-600 hover:text-green-500 font-semibold transition-colors flex items-center gap-1"
                  >
                    Verify →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ─── Bottom CTA ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 bg-gradient-to-br from-green-900 to-green-700 rounded-2xl p-8 text-center text-white overflow-hidden relative"
        >
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}
          />
          <div className="relative z-10">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-xl font-black mb-2">Want to verify a real parcel?</h3>
            <p className="text-green-100/80 text-sm mb-6 max-w-sm mx-auto">
              Real land data is protected. Enter the exact land title number to see full ownership details, GPS location, and verification status.
            </p>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 bg-white text-green-800 font-bold px-8 py-3 rounded-xl text-sm hover:bg-green-50 active:scale-95 transition-all duration-200 shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search by Land Title Number
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
