import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { adminUploadLand } from '../../services/land.service';

interface FormData {
  titleNumber: string;
  ownerName: string;
  quarter: string;
  areaSqm: number;
  gpsLat: number;
  gpsLng: number;
  notes: string;
  titleApprovedYear: number;
  landUseType: string;
}

const LAND_USE_TYPES = [
  { value: 'RESIDENTIAL', label: '🏠 Residential' },
  { value: 'COMMERCIAL', label: '🏢 Commercial' },
  { value: 'AGRICULTURAL', label: '🌾 Agricultural' },
  { value: 'MIXED', label: '🏙️ Mixed Use' },
  { value: 'INDUSTRIAL', label: '🏭 Industrial' },
];

export default function UploadLandPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: { landUseType: 'RESIDENTIAL' },
  });
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => { if (v !== '' && v !== undefined) formData.append(k, String(v)); });
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

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <Link to="/admin" className="inline-flex items-center gap-2 text-green-600 hover:text-green-500 text-sm font-medium mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Admin Panel
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 px-8 py-7 text-white">
            <h1 className="text-2xl font-black">Upload Land Record</h1>
            <p className="text-gray-400 text-sm mt-1">The system will automatically verify the title for duplicates and GPS conflicts.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-8 space-y-6">
            {/* Basic info */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-black text-xs">1</span>
                Basic Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title Number *</label>
                  <input {...register('titleNumber', { required: 'Title number is required' })} className={inputCls} placeholder="e.g. TF-006-YAOUNDE" />
                  {errors.titleNumber && <p className="text-red-500 text-xs mt-1">{errors.titleNumber.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Current Owner Name *</label>
                  <input {...register('ownerName', { required: 'Owner name is required', minLength: { value: 2, message: 'At least 2 characters' } })} className={inputCls} placeholder="Full legal name" />
                  {errors.ownerName && <p className="text-red-500 text-xs mt-1">{errors.ownerName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Quarter / Neighborhood *</label>
                  <input {...register('quarter', { required: 'Quarter is required' })} className={inputCls} placeholder="e.g. Bastos, Melen, Bonanjo" />
                  {errors.quarter && <p className="text-red-500 text-xs mt-1">{errors.quarter.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Area (m²) *</label>
                  <input {...register('areaSqm', { required: 'Area is required', min: { value: 1, message: 'Must be positive' } })} type="number" step="0.01" className={inputCls} placeholder="e.g. 500" />
                  {errors.areaSqm && <p className="text-red-500 text-xs mt-1">{errors.areaSqm.message}</p>}
                </div>
              </div>
            </div>

            {/* Title metadata */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-black text-xs">2</span>
                Title Metadata
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title Approved Year</label>
                  <input
                    {...register('titleApprovedYear', {
                      min: { value: 1900, message: 'Year must be after 1900' },
                      max: { value: new Date().getFullYear(), message: 'Cannot be in the future' },
                    })}
                    type="number"
                    className={inputCls}
                    placeholder={`e.g. ${new Date().getFullYear()}`}
                  />
                  {errors.titleApprovedYear && <p className="text-red-500 text-xs mt-1">{errors.titleApprovedYear.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Land Use Type</label>
                  <div className="relative">
                    <select {...register('landUseType')} className={inputCls + ' appearance-none pr-10'}>
                      {LAND_USE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                The current owner will be automatically added as the initial ownership record with type "Original".
              </p>
            </div>

            {/* GPS */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-black text-xs">3</span>
                GPS Coordinates
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Latitude *</label>
                  <input {...register('gpsLat', { required: 'Latitude is required', min: { value: -90, message: '-90 to 90' }, max: { value: 90, message: '-90 to 90' } })} type="number" step="any" className={inputCls} placeholder="e.g. 3.8697" />
                  {errors.gpsLat && <p className="text-red-500 text-xs mt-1">{errors.gpsLat.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Longitude *</label>
                  <input {...register('gpsLng', { required: 'Longitude is required', min: { value: -180, message: '-180 to 180' }, max: { value: 180, message: '-180 to 180' } })} type="number" step="any" className={inputCls} placeholder="e.g. 11.5212" />
                  {errors.gpsLng && <p className="text-red-500 text-xs mt-1">{errors.gpsLng.message}</p>}
                </div>
              </div>
            </div>

            {/* Notes & Documents */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-black text-xs">4</span>
                Notes & Documents
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Notes (optional)</label>
                  <textarea {...register('notes')} rows={3} className={inputCls + ' resize-none'} placeholder="Any additional remarks about this parcel…" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Supporting Documents (PDF, JPG, PNG — max 10MB each)</label>
                  <input
                    type="file" multiple accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setFiles(e.target.files)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:bg-green-100 file:text-green-700 file:font-semibold cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="btn-primary px-8 py-3 rounded-xl text-sm flex items-center gap-2 disabled:opacity-60"
              >
                {loading && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                {loading ? 'Uploading & Verifying…' : 'Upload Land Record'}
              </motion.button>
              <Link to="/admin" className="border-2 border-gray-200 text-gray-500 hover:bg-gray-50 font-medium px-6 py-3 rounded-xl text-sm transition-all">
                Cancel
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
