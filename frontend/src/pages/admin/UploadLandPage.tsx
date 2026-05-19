import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { adminUploadLand } from '../../services/land.service';

interface LandFormData {
  titleNumber: string;
  quarter: string;
  areaSqm: number;
  gpsLat: number;
  gpsLng: number;
  notes: string;
  titleApprovedYear: number;
  landUseType: string;
}

type OwnershipType = 'ORIGINAL' | 'PURCHASE' | 'INHERITANCE' | 'DONATION' | 'COURT_ORDER';

interface OwnershipEntry {
  ownerName: string;
  ownershipType: OwnershipType;
  fromYear: string;
  toYear: string;   // empty = current (no end date)
  notes: string;
}

const OWNERSHIP_TYPES: { value: OwnershipType; label: string; icon: string }[] = [
  { value: 'ORIGINAL',    label: 'Original Title',  icon: '📜' },
  { value: 'PURCHASE',    label: 'Purchase',         icon: '🤝' },
  { value: 'INHERITANCE', label: 'Inheritance',      icon: '👨‍👩‍👧' },
  { value: 'DONATION',    label: 'Donation',         icon: '🎁' },
  { value: 'COURT_ORDER', label: 'Court Order',      icon: '⚖️' },
];

const LAND_USE_TYPES = [
  { value: 'RESIDENTIAL',  label: '🏠 Residential' },
  { value: 'COMMERCIAL',   label: '🏢 Commercial' },
  { value: 'AGRICULTURAL', label: '🌾 Agricultural' },
  { value: 'MIXED',        label: '🏙️ Mixed Use' },
  { value: 'INDUSTRIAL',   label: '🏭 Industrial' },
];

const OWNERSHIP_COLORS: Record<OwnershipType, string> = {
  ORIGINAL:    'border-amber-300 bg-amber-50',
  PURCHASE:    'border-blue-300 bg-blue-50',
  INHERITANCE: 'border-purple-300 bg-purple-50',
  DONATION:    'border-teal-300 bg-teal-50',
  COURT_ORDER: 'border-red-300 bg-red-50',
};

const CURRENT_YEAR = new Date().getFullYear();

const emptyEntry = (): OwnershipEntry => ({
  ownerName: '',
  ownershipType: 'ORIGINAL',
  fromYear: '',
  toYear: '',
  notes: '',
});

export default function UploadLandPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LandFormData>({
    defaultValues: { landUseType: 'RESIDENTIAL' },
  });

  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [owners, setOwners] = useState<OwnershipEntry[]>([emptyEntry()]);
  const [ownerErrors, setOwnerErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  /* ── Ownership list helpers ── */
  const updateOwner = (idx: number, field: keyof OwnershipEntry, value: string) => {
    setOwners((prev) => prev.map((o, i) => i === idx ? { ...o, [field]: value } : o));
  };

  const addOwner = () => {
    setOwners((prev) => [...prev, { ...emptyEntry(), ownershipType: 'PURCHASE' }]);
  };

  const removeOwner = (idx: number) => {
    setOwners((prev) => prev.filter((_, i) => i !== idx));
  };

  const validateOwners = (): boolean => {
    const errs = owners.map((o, i) => {
      if (!o.ownerName.trim()) return `Owner #${i + 1}: name is required`;
      if (!o.fromYear) return `Owner #${i + 1}: start year is required`;
      const from = parseInt(o.fromYear);
      if (isNaN(from) || from < 1900 || from > CURRENT_YEAR) return `Owner #${i + 1}: from year must be 1900–${CURRENT_YEAR}`;
      if (o.toYear) {
        const to = parseInt(o.toYear);
        if (isNaN(to) || to < from || to > CURRENT_YEAR) return `Owner #${i + 1}: to year must be ≥ from year`;
      }
      return '';
    });
    setOwnerErrors(errs);
    return errs.every((e) => e === '');
  };

  const onSubmit = async (data: LandFormData) => {
    if (!validateOwners()) return;
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (v !== '' && v !== undefined) formData.append(k, String(v));
      });

      const ownershipRecords = owners.map((o) => ({
        ownerName:     o.ownerName.trim(),
        ownershipType: o.ownershipType,
        fromYear:      parseInt(o.fromYear),
        toYear:        o.toYear ? parseInt(o.toYear) : null,
        notes:         o.notes.trim() || undefined,
      }));
      formData.append('ownershipRecords', JSON.stringify(ownershipRecords));

      if (files) Array.from(files).forEach((f) => formData.append('documents', f));

      await adminUploadLand(formData);
      toast.success('Land record uploaded and verified successfully!');
      setTimeout(() => navigate('/admin'), 1800);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string; details?: string } } };
      toast.error(e.response?.data?.details || e.response?.data?.message || 'Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all';
  const labelCls = 'block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5';

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <Link to="/admin" className="inline-flex items-center gap-2 text-green-600 hover:text-green-500 text-sm font-medium mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Admin Panel
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 px-8 py-7 text-white">
            <h1 className="text-2xl font-black">Upload Land Record</h1>
            <p className="text-gray-400 text-sm mt-1">
              Fill in all fields including the ownership chain. The system will verify for duplicates and GPS conflicts.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-8 space-y-8">

            {/* ── SECTION 1: Basic Info ── */}
            <section>
              <SectionHeader number="1" title="Basic Information" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Title Number *</label>
                  <input
                    {...register('titleNumber', { required: 'Title number is required' })}
                    className={inputCls}
                    placeholder="e.g. TF-006-YAOUNDE"
                  />
                  {errors.titleNumber && <Err msg={errors.titleNumber.message!} />}
                </div>
                <div>
                  <label className={labelCls}>Quarter / Neighborhood *</label>
                  <input
                    {...register('quarter', { required: 'Quarter is required' })}
                    className={inputCls}
                    placeholder="e.g. Bastos, Melen, Bonanjo"
                  />
                  {errors.quarter && <Err msg={errors.quarter.message!} />}
                </div>
                <div>
                  <label className={labelCls}>Area (m²) *</label>
                  <input
                    {...register('areaSqm', { required: 'Area is required', min: { value: 1, message: 'Must be positive' } })}
                    type="number" step="0.01"
                    className={inputCls}
                    placeholder="e.g. 500"
                  />
                  {errors.areaSqm && <Err msg={errors.areaSqm.message!} />}
                </div>
                <div>
                  <label className={labelCls}>Land Use Type</label>
                  <div className="relative">
                    <select {...register('landUseType')} className={inputCls + ' appearance-none pr-10'}>
                      {LAND_USE_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Title Approved Year</label>
                  <input
                    {...register('titleApprovedYear', {
                      min: { value: 1900, message: 'Year must be after 1900' },
                      max: { value: CURRENT_YEAR, message: 'Cannot be in the future' },
                    })}
                    type="number"
                    className={inputCls}
                    placeholder={`e.g. ${CURRENT_YEAR}`}
                  />
                  {errors.titleApprovedYear && <Err msg={errors.titleApprovedYear.message!} />}
                </div>
              </div>
            </section>

            {/* ── SECTION 2: Ownership History ── */}
            <section>
              <SectionHeader number="2" title="Ownership History" />
              <p className="text-xs text-gray-400 mb-4">
                Add one row per owner, in chronological order (oldest first). Leave <strong>To Year</strong> empty for the current owner.
              </p>

              <div className="space-y-3">
                <AnimatePresence initial={false}>
                  {owners.map((owner, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: -10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.15 } }}
                      className={`rounded-2xl border-2 p-5 ${OWNERSHIP_COLORS[owner.ownershipType]}`}
                    >
                      {/* Row header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 bg-white/80 rounded-full flex items-center justify-center text-xs font-black text-gray-700 shadow-sm">
                            {idx + 1}
                          </span>
                          <span className="text-sm font-bold text-gray-700">
                            {owner.ownerName || `Owner #${idx + 1}`}
                          </span>
                          {!owner.toYear && (
                            <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        {owners.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeOwner(idx)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-white/60"
                            title="Remove this owner"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* Fields grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Owner name */}
                        <div className="sm:col-span-2">
                          <label className={labelCls}>Owner Name *</label>
                          <input
                            value={owner.ownerName}
                            onChange={(e) => updateOwner(idx, 'ownerName', e.target.value)}
                            className={inputCls}
                            placeholder="Full legal name of owner"
                          />
                        </div>

                        {/* Ownership type */}
                        <div>
                          <label className={labelCls}>How They Acquired It *</label>
                          <div className="relative">
                            <select
                              value={owner.ownershipType}
                              onChange={(e) => updateOwner(idx, 'ownershipType', e.target.value)}
                              className={inputCls + ' appearance-none pr-10'}
                            >
                              {OWNERSHIP_TYPES.map((t) => (
                                <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
                              ))}
                            </select>
                            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>

                        {/* From year */}
                        <div>
                          <label className={labelCls}>From Year *</label>
                          <input
                            type="number"
                            value={owner.fromYear}
                            onChange={(e) => updateOwner(idx, 'fromYear', e.target.value)}
                            className={inputCls}
                            placeholder={`e.g. ${CURRENT_YEAR - 5}`}
                            min={1900}
                            max={CURRENT_YEAR}
                          />
                        </div>

                        {/* To year */}
                        <div>
                          <label className={labelCls}>
                            To Year
                            <span className="text-gray-400 font-normal normal-case ml-1">(leave empty = current owner)</span>
                          </label>
                          <input
                            type="number"
                            value={owner.toYear}
                            onChange={(e) => updateOwner(idx, 'toYear', e.target.value)}
                            className={inputCls}
                            placeholder="Leave empty if still owner"
                            min={1900}
                            max={CURRENT_YEAR}
                          />
                        </div>

                        {/* Notes */}
                        <div className="sm:col-span-2">
                          <label className={labelCls}>Notes <span className="text-gray-400 font-normal normal-case">(optional)</span></label>
                          <input
                            value={owner.notes}
                            onChange={(e) => updateOwner(idx, 'notes', e.target.value)}
                            className={inputCls}
                            placeholder="e.g. Purchased via notarial deed No. 45, Deed of sale, etc."
                          />
                        </div>
                      </div>

                      {/* Validation error for this row */}
                      {ownerErrors[idx] && <Err msg={ownerErrors[idx]} />}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Add owner button */}
              <button
                type="button"
                onClick={addOwner}
                className="mt-3 w-full flex items-center justify-center gap-2 border-2 border-dashed border-green-300 text-green-600 hover:border-green-500 hover:bg-green-50 rounded-2xl py-3 text-sm font-semibold transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Another Owner
              </button>
            </section>

            {/* ── SECTION 3: GPS Coordinates ── */}
            <section>
              <SectionHeader number="3" title="GPS Coordinates" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Latitude *</label>
                  <input
                    {...register('gpsLat', {
                      required: 'Latitude is required',
                      min: { value: -90, message: '-90 to 90' },
                      max: { value:  90, message: '-90 to 90' },
                    })}
                    type="number" step="any"
                    className={inputCls}
                    placeholder="e.g. 3.8697"
                  />
                  {errors.gpsLat && <Err msg={errors.gpsLat.message!} />}
                </div>
                <div>
                  <label className={labelCls}>Longitude *</label>
                  <input
                    {...register('gpsLng', {
                      required: 'Longitude is required',
                      min: { value: -180, message: '-180 to 180' },
                      max: { value:  180, message: '-180 to 180' },
                    })}
                    type="number" step="any"
                    className={inputCls}
                    placeholder="e.g. 11.5212"
                  />
                  {errors.gpsLng && <Err msg={errors.gpsLng.message!} />}
                </div>
              </div>
            </section>

            {/* ── SECTION 4: Notes & Documents ── */}
            <section>
              <SectionHeader number="4" title="Notes & Documents" />
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Parcel Notes <span className="text-gray-400 font-normal normal-case">(optional)</span></label>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    className={inputCls + ' resize-none'}
                    placeholder="Any additional remarks about this parcel…"
                  />
                </div>
                <div>
                  <label className={labelCls}>Supporting Documents <span className="text-gray-400 font-normal normal-case">(PDF, JPG, PNG — max 10 MB each)</span></label>
                  <input
                    type="file" multiple accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setFiles(e.target.files)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:bg-green-100 file:text-green-700 file:font-semibold cursor-pointer"
                  />
                </div>
              </div>
            </section>

            {/* ── Submit ── */}
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="btn-primary px-8 py-3 rounded-xl text-sm flex items-center gap-2 disabled:opacity-60"
              >
                {loading && (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {loading ? 'Uploading & Verifying…' : 'Upload Land Record'}
              </motion.button>
              <Link
                to="/admin"
                className="border-2 border-gray-200 text-gray-500 hover:bg-gray-50 font-medium px-6 py-3 rounded-xl text-sm transition-all"
              >
                Cancel
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

/* ── Small helpers ── */
function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-4 flex items-center gap-2">
      <span className="w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center font-black text-xs shadow-sm">
        {number}
      </span>
      {title}
    </h3>
  );
}

function Err({ msg }: { msg: string }) {
  return <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span>⚠</span>{msg}</p>;
}
