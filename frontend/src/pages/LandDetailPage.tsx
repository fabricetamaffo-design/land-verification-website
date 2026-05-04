import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getLandById } from '../services/land.service';
import { LandParcel } from '../types';
import StatusBadge from '../components/StatusBadge';
import MapView from '../components/MapView';
import { useLang } from '../context/LanguageContext';

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">{label}</p>
      <p className="text-gray-900 font-bold">{value}</p>
    </div>
  );
}

export default function LandDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [land, setLand] = useState<LandParcel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useLang();

  useEffect(() => {
    if (!id) return;
    getLandById(id)
      .then((data) => setLand(data.land))
      .catch(() => setError(t.landDetail.notFound))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-green-100" />
            <div className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
          </div>
          <p className="text-gray-400 text-sm">{t.landDetail.loading}</p>
        </div>
      </div>
    );
  }

  if (error || !land) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-7xl mb-5 float-anim inline-block">⚠️</div>
          <h2 className="text-xl font-black text-gray-800 mb-2">{error || t.landDetail.notFound}</h2>
          <Link to="/search" className="mt-4 inline-flex items-center gap-2 text-green-600 hover:text-green-500 font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            {t.landDetail.back}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-500 text-sm font-medium mb-6 group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t.landDetail.back}
          </Link>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Status accent */}
            <div className={`h-2 ${land.status === 'VALID' ? 'bg-gradient-to-r from-emerald-400 to-green-500' : land.status === 'SUSPICIOUS' ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gradient-to-r from-red-400 to-rose-500'}`} />

            {/* Header */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white px-8 py-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-2">{t.landDetail.landParcel}</p>
                  <h1 className="text-3xl font-black tracking-tight">{land.titleNumber}</h1>
                  <p className="text-gray-300 mt-1 text-sm">{land.ownerName}</p>
                </div>
                <div className="flex-shrink-0">
                  <StatusBadge status={land.status} />
                </div>
              </div>
            </div>

            {/* Warning / Note */}
            {land.notes && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={`px-8 py-4 border-b text-sm flex items-start gap-3 ${
                  land.status === 'DUPLICATE'
                    ? 'bg-red-50 border-red-100 text-red-700'
                    : 'bg-amber-50 border-amber-100 text-amber-700'
                }`}
              >
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p><strong>{t.common.note}:</strong> {land.notes}</p>
              </motion.div>
            )}

            {/* Details Grid */}
            <div className="px-8 py-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <DetailRow label={t.landDetail.titleNumber} value={land.titleNumber} />
                <DetailRow label={t.landDetail.ownerName} value={land.ownerName} />
                <DetailRow label={t.landDetail.quarter} value={land.quarter} />
                <DetailRow label={t.landDetail.area} value={`${land.areaSqm.toLocaleString()} m²`} />
                <DetailRow label={t.landDetail.registeredBy} value={land.uploadedBy?.name || '—'} />
                <DetailRow label={t.landDetail.dateRegistered} value={new Date(land.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} />
                <DetailRow label={t.landDetail.gpsLat} value={land.gpsLat.toFixed(6)} />
                <DetailRow label={t.landDetail.gpsLng} value={land.gpsLng.toFixed(6)} />
              </div>

              {/* Status tag */}
              <div className="flex items-center gap-2 mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Status:</span>
                <StatusBadge status={land.status} />
                <span className={`text-xs ml-2 ${land.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                  {land.isActive ? `· ${t.common.active}` : `· ${t.common.inactive}`}
                </span>
              </div>
            </div>

            {/* Map */}
            <div className="px-8 pb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t.landDetail.gpsLocation}
              </h2>
              {land.gpsLat && land.gpsLng ? (
                <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                  <MapView lat={land.gpsLat} lng={land.gpsLng} title={`${land.titleNumber} — ${land.ownerName}`} />
                </div>
              ) : (
                <div className="bg-gray-50 rounded-2xl p-10 text-center text-gray-400 border border-dashed border-gray-200">
                  {t.landDetail.noGps}
                </div>
              )}
            </div>

            {/* Documents */}
            {land.documents && land.documents.length > 0 && (
              <div className="px-8 pb-8 border-t border-gray-100 pt-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {t.landDetail.documents}
                </h2>
                <ul className="space-y-2">
                  {land.documents.map((doc) => (
                    <li key={doc.id}>
                      <a
                        href={`/uploads/${doc.filePath.split('/').pop()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-green-50 hover:border-green-200 transition-all group"
                      >
                        <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-700 font-medium group-hover:text-green-700 truncate">{doc.fileName}</span>
                        <svg className="w-4 h-4 text-gray-300 ml-auto flex-shrink-0 group-hover:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
