import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SearchResult } from '../types';
import StatusBadge from './StatusBadge';
import { useLang } from '../context/LanguageContext';

export default function LandCard({ land, index = 0 }: { land: SearchResult; index?: number }) {
  const { t } = useLang();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: 'easeOut' }}
    >
      <Link
        to={`/lands/${land.id}`}
        className="block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-green-200 hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
      >
        {/* Top accent bar */}
        <div
          className={`h-1.5 w-full ${
            land.status === 'VALID'
              ? 'bg-gradient-to-r from-emerald-400 to-green-500'
              : land.status === 'SUSPICIOUS'
              ? 'bg-gradient-to-r from-amber-400 to-orange-500'
              : 'bg-gradient-to-r from-red-400 to-rose-500'
          }`}
        />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">{t.landCard.titleNumber}</p>
              <p className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                {land.titleNumber}
              </p>
            </div>
            <StatusBadge status={land.status} />
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            {[
              { label: t.landCard.owner, value: land.ownerName },
              { label: t.landCard.quarter, value: land.quarter },
              { label: t.landCard.area, value: `${land.areaSqm.toLocaleString()} m²` },
              { label: t.landCard.registered, value: new Date(land.createdAt).toLocaleDateString('en-GB') },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-lg p-2.5">
                <p className="text-gray-400 text-[10px] uppercase tracking-wide font-medium mb-0.5">{label}</p>
                <p className="text-gray-800 font-semibold truncate">{value}</p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-1 text-gray-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-[10px] font-medium">{land.gpsLat.toFixed(4)}, {land.gpsLng.toFixed(4)}</span>
            </div>
            <span className="text-xs text-green-600 font-semibold group-hover:text-green-500 transition-colors">
              {t.landCard.viewDetails}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
