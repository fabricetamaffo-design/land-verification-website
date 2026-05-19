import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getLandById } from '../services/land.service';
import { LandParcel, OwnershipRecord, OwnershipType } from '../types';
import StatusBadge, { isValid, getNotValidReason } from '../components/StatusBadge';
import MapView from '../components/MapView';
import { useLang } from '../context/LanguageContext';

function DetailRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">{label}</p>
      <p className={`font-bold ${highlight ? 'text-green-700' : 'text-gray-900'}`}>{value}</p>
    </div>
  );
}

const OWNERSHIP_COLORS: Record<OwnershipType, { bg: string; text: string; border: string; dot: string }> = {
  ORIGINAL:    { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  dot: 'bg-amber-500' },
  PURCHASE:    { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   dot: 'bg-blue-500' },
  INHERITANCE: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
  DONATION:    { bg: 'bg-teal-50',   text: 'text-teal-700',   border: 'border-teal-200',   dot: 'bg-teal-500' },
  COURT_ORDER: { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200',    dot: 'bg-red-500' },
};

const LAND_USE_LABELS: Record<string, string> = {
  RESIDENTIAL: 'Residential', COMMERCIAL: 'Commercial',
  AGRICULTURAL: 'Agricultural', MIXED: 'Mixed Use', INDUSTRIAL: 'Industrial',
};

const LAND_USE_ICONS: Record<string, string> = {
  RESIDENTIAL: '🏠', COMMERCIAL: '🏢', AGRICULTURAL: '🌾', MIXED: '🏙️', INDUSTRIAL: '🏭',
};

function OwnershipTimeline({ history, t }: { history: OwnershipRecord[]; t: any }) {
  if (!history || history.length === 0) {
    return <p className="text-gray-400 text-sm italic">{t.ownership.noHistory}</p>;
  }

  const sorted = [...history].sort((a, b) => a.fromYear - b.fromYear);

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-gray-200" />

      <div className="space-y-4">
        {sorted.map((record, i) => {
          const isCurrent = record.toYear === null;
          const colors = OWNERSHIP_COLORS[record.ownershipType] || OWNERSHIP_COLORS.PURCHASE;
          const duration = isCurrent
            ? new Date().getFullYear() - record.fromYear
            : (record.toYear ?? record.fromYear) - record.fromYear;

          return (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4"
            >
              {/* Dot */}
              <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${isCurrent ? 'border-green-400 bg-green-50' : `border-gray-200 bg-white`}`}>
                {isCurrent ? (
                  <div className="w-3 h-3 rounded-full bg-green-500 pulse-dot" />
                ) : (
                  <div className={`w-3 h-3 rounded-full ${colors.dot}`} />
                )}
              </div>

              {/* Content */}
              <div className={`flex-1 rounded-xl border p-4 ${isCurrent ? 'bg-green-50 border-green-200 shadow-sm' : `${colors.bg} ${colors.border}`}`}>
                <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                  <div>
                    <p className={`font-bold ${isCurrent ? 'text-green-800' : colors.text}`}>
                      {record.ownerName}
                      {isCurrent && <span className="ml-2 text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full font-semibold">Current Owner</span>}
                    </p>
                    <p className={`text-xs mt-0.5 ${isCurrent ? 'text-green-600' : colors.text} opacity-70`}>
                      {t.ownership[record.ownershipType]}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-semibold ${isCurrent ? 'text-green-700' : colors.text}`}>
                      {record.fromYear} — {isCurrent ? t.ownership.present : record.toYear}
                    </p>
                    <p className={`text-[10px] ${isCurrent ? 'text-green-600' : colors.text} opacity-60`}>
                      {duration} {t.ownership.years}
                    </p>
                  </div>
                </div>
                {record.notes && (
                  <p className={`text-xs mt-1 ${isCurrent ? 'text-green-700' : colors.text} opacity-70`}>{record.notes}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
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

  const valid = isValid(land.status);
  const notValidReason = !valid ? getNotValidReason(land.status, land.notes) : '';
  const currentOwner = land.ownershipHistory?.find((r) => r.toYear === null);
  const ownershipCount = land.ownershipHistory?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link to="/search" className="inline-flex items-center gap-2 text-green-600 hover:text-green-500 text-sm font-medium mb-6 group">
            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t.landDetail.back}
          </Link>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Status accent bar */}
            <div className={`h-2 ${valid ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-gradient-to-r from-red-400 to-rose-500'}`} />

            {/* Header */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white px-8 py-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-2">{t.landDetail.landParcel}</p>
                  <h1 className="text-3xl font-black tracking-tight">{land.titleNumber}</h1>
                  {land.titleApprovedYear && (
                    <p className="text-gray-400 mt-1 text-sm flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Title approved: <span className="text-green-400 font-bold">{land.titleApprovedYear}</span>
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={land.status} notes={land.notes} />
                  {land.landUseType && (
                    <span className="text-xs text-gray-400 bg-white/10 px-3 py-1 rounded-full">
                      {LAND_USE_ICONS[land.landUseType]} {LAND_USE_LABELS[land.landUseType] || land.landUseType}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Not Valid warning */}
            {!valid && notValidReason && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="px-8 py-4 border-b bg-red-50 border-red-100 text-red-700 flex items-start gap-3"
              >
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="font-bold text-sm">Why is this land Not Valid?</p>
                  <p className="text-sm mt-0.5">{notValidReason}</p>
                  <p className="text-xs mt-1 text-red-600 font-medium">We strongly advise against proceeding with a transaction on this parcel.</p>
                </div>
              </motion.div>
            )}

            {/* Buyer summary bar */}
            <div className="px-8 py-4 bg-gray-50 border-b border-gray-100 flex flex-wrap gap-4 text-xs">
              {[
                { icon: '🏘️', label: 'Quarter', value: land.quarter },
                { icon: '📐', label: 'Area', value: `${land.areaSqm.toLocaleString()} m²` },
                { icon: '👤', label: 'Owners', value: `${ownershipCount} recorded` },
                { icon: '📅', label: 'Registered', value: new Date(land.createdAt).getFullYear().toString() },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                  <span>{icon}</span>
                  <span className="text-gray-400">{label}:</span>
                  <span className="font-semibold text-gray-700">{value}</span>
                </div>
              ))}
            </div>

            {/* Details Grid */}
            <div className="px-8 py-8">
              <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                Land Record Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <DetailRow label={t.landDetail.titleNumber} value={land.titleNumber} highlight />
                <DetailRow label="Current Owner" value={currentOwner?.ownerName || land.ownerName} highlight />
                <DetailRow label={t.landDetail.quarter} value={land.quarter} />
                <DetailRow label={t.landDetail.area} value={`${land.areaSqm.toLocaleString()} m²`} />
                <DetailRow label="Land Use Type" value={`${LAND_USE_ICONS[land.landUseType] || ''} ${LAND_USE_LABELS[land.landUseType] || land.landUseType}`} />
                <DetailRow label="Title Approved Year" value={land.titleApprovedYear ? land.titleApprovedYear.toString() : 'Not specified'} />
                <DetailRow label={t.landDetail.registeredBy} value={land.uploadedBy?.name || '—'} />
                <DetailRow label={t.landDetail.dateRegistered} value={new Date(land.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} />
                <DetailRow label={t.landDetail.gpsLat} value={land.gpsLat.toFixed(6)} />
                <DetailRow label={t.landDetail.gpsLng} value={land.gpsLng.toFixed(6)} />
              </div>

              {/* Verification status summary */}
              <div className={`rounded-xl p-4 mb-8 border ${valid ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                <p className={`font-bold text-sm mb-1 ${valid ? 'text-emerald-800' : 'text-red-800'}`}>
                  {valid ? '✓ This land parcel is Verified Valid' : '✕ This land parcel is Not Valid'}
                </p>
                <p className={`text-xs ${valid ? 'text-emerald-700' : 'text-red-700'}`}>
                  {valid
                    ? 'No title conflicts or GPS overlaps detected. The title number is unique in the registry.'
                    : notValidReason}
                </p>
              </div>
            </div>

            {/* Ownership History */}
            <div className="px-8 pb-8 border-t border-gray-100 pt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    {t.ownership.title}
                  </h2>
                  <p className="text-gray-400 text-xs mt-1">{t.ownership.subtitle}</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-green-700">
                  {ownershipCount} owner{ownershipCount !== 1 ? 's' : ''} recorded
                </div>
              </div>

              <OwnershipTimeline history={land.ownershipHistory || []} t={t} />
            </div>

            {/* Map */}
            <div className="px-8 pb-8 border-t border-gray-100 pt-6">
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
                <div className="bg-gray-50 rounded-2xl p-10 text-center text-gray-400 border border-dashed border-gray-200">{t.landDetail.noGps}</div>
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
                        <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                        </div>
                        <span className="text-sm text-gray-700 font-medium group-hover:text-green-700 truncate">{doc.fileName}</span>
                        <svg className="w-4 h-4 text-gray-300 ml-auto flex-shrink-0 group-hover:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Buyer advice footer */}
            <div className="px-8 pb-8 border-t border-gray-100 pt-6">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                <h3 className="font-bold text-blue-900 text-sm mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Buyer Advice
                </h3>
                <ul className="text-xs text-blue-800 space-y-1.5">
                  <li className="flex items-start gap-1.5"><span className="text-blue-500 font-bold mt-0.5">→</span> Always verify the ownership history matches what the seller claims.</li>
                  <li className="flex items-start gap-1.5"><span className="text-blue-500 font-bold mt-0.5">→</span> Confirm the GPS location on-site before signing any document.</li>
                  <li className="flex items-start gap-1.5"><span className="text-blue-500 font-bold mt-0.5">→</span> Request original title documents and cross-check with this registry.</li>
                  {!valid && <li className="flex items-start gap-1.5 text-red-700 font-semibold"><span className="text-red-500 font-bold mt-0.5">⚠</span> This parcel has a Not Valid status — do NOT proceed without legal counsel.</li>}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
