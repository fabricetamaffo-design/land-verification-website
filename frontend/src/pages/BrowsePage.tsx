import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import StatusBadge, { isValid } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { adminGetAllLands } from '../services/land.service';
import { LandParcel } from '../types';

type SampleStatus = 'VALID' | 'NOT_VALID';

interface SampleLand {
  id: string;
  quarter: string;
  areaSqm: number;
  status: SampleStatus;
  landUseType: string;
}

const LAND_USE_LABELS: Record<string, string> = {
  RESIDENTIAL: 'Residential',
  COMMERCIAL: 'Commercial',
  AGRICULTURAL: 'Agricultural',
  MIXED: 'Mixed Use',
  INDUSTRIAL: 'Industrial',
};

const LAND_USE_COLORS: Record<string, string> = {
  RESIDENTIAL: 'bg-blue-50 text-blue-700 border-blue-200',
  COMMERCIAL: 'bg-purple-50 text-purple-700 border-purple-200',
  AGRICULTURAL: 'bg-green-50 text-green-700 border-green-200',
  MIXED: 'bg-amber-50 text-amber-700 border-amber-200',
  INDUSTRIAL: 'bg-gray-50 text-gray-700 border-gray-200',
};

const SAMPLE_LANDS: SampleLand[] = [
  { id: 's1', quarter: 'Bastos', areaSqm: 500, status: 'VALID', landUseType: 'RESIDENTIAL' },
  { id: 's2', quarter: 'Nlongkak', areaSqm: 300, status: 'VALID', landUseType: 'COMMERCIAL' },
  { id: 's3', quarter: 'Melen', areaSqm: 750, status: 'NOT_VALID', landUseType: 'AGRICULTURAL' },
  { id: 's4', quarter: 'Bonanjo', areaSqm: 620, status: 'VALID', landUseType: 'COMMERCIAL' },
  { id: 's5', quarter: 'Akwa', areaSqm: 410, status: 'VALID', landUseType: 'RESIDENTIAL' },
  { id: 's6', quarter: 'Bafoussam Centre', areaSqm: 880, status: 'VALID', landUseType: 'MIXED' },
  { id: 's7', quarter: 'Commercial Avenue', areaSqm: 320, status: 'NOT_VALID', landUseType: 'COMMERCIAL' },
  { id: 's8', quarter: 'Centre Ville', areaSqm: 1100, status: 'VALID', landUseType: 'AGRICULTURAL' },
  { id: 's9', quarter: 'Bastos', areaSqm: 680, status: 'VALID', landUseType: 'RESIDENTIAL' },
  { id: 's10', quarter: 'Akwa', areaSqm: 450, status: 'VALID', landUseType: 'MIXED' },
  { id: 's11', quarter: 'Melen', areaSqm: 920, status: 'VALID', landUseType: 'RESIDENTIAL' },
  { id: 's12', quarter: 'Nlongkak', areaSqm: 280, status: 'NOT_VALID', landUseType: 'COMMERCIAL' },
];

const SAMPLE_QUARTERS = Array.from(new Set(SAMPLE_LANDS.map((land) => land.quarter)));

const cardVariants: import('framer-motion').Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: index * 0.055, type: 'tween', ease: 'easeOut' },
  }),
};

function AdminLandCard({ land, index }: { land: LandParcel; index: number }) {
  const { t } = useLang();
  const valid = isValid(land.status);
  const ownershipCount = land._count?.ownershipHistory ?? land.ownershipHistory?.length ?? 0;
  const documentCount = land._count?.documents ?? land.documents?.length ?? 0;

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      className={`bg-white border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 ${
        land.isActive ? 'border-gray-200' : 'border-gray-300 opacity-75'
      }`}
    >
      <div className={`h-1.5 ${valid ? 'bg-emerald-500' : 'bg-red-500'}`} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <p className="text-[10px] text-gray-400 uppercase font-semibold">{t.landCard.titleNumber}</p>
            <Link
              to={`/lands/${land.id}`}
              className="block text-lg font-black text-gray-900 hover:text-green-700 truncate"
            >
              {land.titleNumber}
            </Link>
            <p className="text-sm font-semibold text-gray-600 truncate">{land.ownerName}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <StatusBadge status={land.status} notes={land.notes} compact />
            <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${
              land.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
            }`}>
              {land.isActive ? t.browse.active : t.browse.inactive}
            </span>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-2 text-xs">
          <AdminMetric label={t.landCard.quarter} value={land.quarter} />
          <AdminMetric label={t.landCard.area} value={`${land.areaSqm.toLocaleString()} m2`} />
          <AdminMetric label={t.landDetail.landUseType} value={LAND_USE_LABELS[land.landUseType] || land.landUseType} />
          <AdminMetric
            label={t.landDetail.titleApprovedYear}
            value={land.titleApprovedYear?.toString() || t.landDetail.notSpecified}
          />
          <AdminMetric label={t.landDetail.gpsLat} value={land.gpsLat.toFixed(6)} />
          <AdminMetric label={t.landDetail.gpsLng} value={land.gpsLng.toFixed(6)} />
          <AdminMetric label={t.landDetail.registeredBy} value={land.uploadedBy?.name || t.landDetail.notSpecified} />
          <AdminMetric label={t.browse.relatedRecords} value={`${ownershipCount} / ${documentCount}`} />
        </dl>

        {land.notes && (
          <div className="mt-3 bg-gray-50 border border-gray-100 p-3">
            <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">{t.browse.notes}</p>
            <p className="text-xs text-gray-700 leading-relaxed break-words">{land.notes}</p>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-[10px] text-gray-400">
            {ownershipCount} {t.browse.ownersShort} / {documentCount} {t.browse.documentsShort}
          </span>
          <Link to={`/lands/${land.id}`} className="text-xs text-green-700 hover:text-green-600 font-bold">
            {t.landCard.viewDetails}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function AdminMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 border border-gray-100 p-2.5 min-w-0">
      <dt className="text-[9px] text-gray-400 uppercase font-semibold mb-0.5 truncate">{label}</dt>
      <dd className="text-gray-800 font-bold truncate" title={value}>{value}</dd>
    </div>
  );
}

export default function BrowsePage() {
  const [quarter, setQuarter] = useState('__all__');
  const [adminLands, setAdminLands] = useState<LandParcel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useLang();
  const { isAdmin } = useAuth();

  useEffect(() => {
    setQuarter('__all__');
    if (!isAdmin) {
      setAdminLands([]);
      setError('');
      return;
    }

    setLoading(true);
    setError('');
    adminGetAllLands()
      .then(({ lands }) => setAdminLands(lands))
      .catch(() => setError(t.browse.loadError))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  const quarterValues = isAdmin
    ? Array.from(new Set(adminLands.map((land) => land.quarter))).sort()
    : SAMPLE_QUARTERS;
  const quarterOptions = [
    { value: '__all__', label: t.browse.allFilter },
    ...quarterValues.map((value) => ({ value, label: value })),
  ];
  const adminFiltered = quarter === '__all__'
    ? adminLands
    : adminLands.filter((land) => land.quarter === quarter);
  const sampleFiltered = quarter === '__all__'
    ? SAMPLE_LANDS
    : SAMPLE_LANDS.filter((land) => land.quarter === quarter);
  const shownCount = isAdmin ? adminFiltered.length : sampleFiltered.length;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-black text-gray-900 mb-1">{t.browse.title}</h1>
            <p className="text-gray-400 text-sm mb-6">
              {isAdmin ? t.browse.adminSubtitle : t.browse.sampleSubtitle}
            </p>
            <div className="flex flex-wrap gap-2">
              {quarterOptions.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setQuarter(value)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                    quarter === value
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:bg-green-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className={`border px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4 mb-6 ${
          isAdmin ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'
        }`}>
          <div className="flex-1">
            <p className={`font-bold text-sm ${isAdmin ? 'text-emerald-800' : 'text-amber-800'}`}>
              {isAdmin ? t.browse.adminPrivacyTitle : t.browse.privacyTitle}
            </p>
            <p className={`text-xs mt-1 leading-relaxed ${isAdmin ? 'text-emerald-700' : 'text-amber-700'}`}>
              {isAdmin ? t.browse.adminPrivacyDesc : t.browse.privacyDesc}
            </p>
          </div>
          <Link
            to={isAdmin ? '/admin/manage' : '/search'}
            className={`flex-shrink-0 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors ${
              isAdmin ? 'bg-emerald-700 hover:bg-emerald-600' : 'bg-amber-600 hover:bg-amber-500'
            }`}
          >
            {isAdmin ? t.browse.manageRecordsBtn : t.browse.searchByTitleBtn}
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm mb-6">{error}</div>
        )}

        <AnimatePresence mode="wait">
          <motion.p
            key={`${isAdmin}-${quarter}-${shownCount}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-gray-400 mb-4 font-medium"
          >
            <span className="text-green-600 font-bold">{shownCount}</span>{' '}
            {isAdmin
              ? (shownCount === 1 ? t.browse.recordShown : t.browse.recordsShown)
              : (shownCount === 1 ? t.browse.sampleShown : t.browse.samplesShown)}
          </motion.p>
        </AnimatePresence>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-9 w-9 border-4 border-green-600 border-t-transparent" />
          </div>
        ) : isAdmin ? (
          <motion.div
            key={quarter}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
          >
            {adminFiltered.map((land, index) => (
              <AdminLandCard key={land.id} land={land} index={index} />
            ))}
            {adminFiltered.length === 0 && (
              <div className="md:col-span-2 xl:col-span-3 bg-white border border-gray-200 py-14 text-center text-gray-500">
                {t.browse.emptyAdmin}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key={quarter}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {sampleFiltered.map((land, index) => (
              <motion.div
                key={land.id}
                custom={index}
                variants={cardVariants}
                className="bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow select-none"
              >
                <div className={`h-1.5 ${land.status === 'VALID' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">{t.landCard.titleNumber}</p>
                      <p className="text-lg font-black text-gray-300 tracking-widest">* * * * * *</p>
                      <p className="text-xs text-gray-300 mt-0.5 italic">{t.browse.confidential}</p>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                      land.status === 'VALID'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {land.status === 'VALID' ? t.status.VALID : t.status.NOT_VALID}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 text-xs mb-4">
                    <AdminMetric label={t.landCard.quarter} value={land.quarter} />
                    <AdminMetric label={t.landCard.area} value={`${land.areaSqm.toLocaleString()} m2`} />
                    <div className="bg-gray-50 border border-gray-100 p-3 col-span-2">
                      <p className="text-gray-400 text-[10px] uppercase font-semibold">{t.landCard.owner}</p>
                      <p className="text-gray-300 font-semibold italic">{t.browse.ownerProtected}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                      LAND_USE_COLORS[land.landUseType] || LAND_USE_COLORS.INDUSTRIAL
                    }`}>
                      {LAND_USE_LABELS[land.landUseType] || land.landUseType}
                    </span>
                    <Link to="/search" className="text-xs text-green-600 hover:text-green-500 font-semibold">
                      {t.browse.verifyLink}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!isAdmin && (
          <div className="mt-10 bg-green-900 p-8 text-center text-white">
            <h3 className="text-xl font-black mb-2">{t.browse.wantVerify}</h3>
            <p className="text-green-100 text-sm mb-6 max-w-sm mx-auto">{t.browse.realDataProtected}</p>
            <Link
              to="/search"
              className="inline-flex bg-white text-green-800 font-bold px-8 py-3 rounded-lg text-sm hover:bg-green-50"
            >
              {t.browse.searchByTitleFull}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
