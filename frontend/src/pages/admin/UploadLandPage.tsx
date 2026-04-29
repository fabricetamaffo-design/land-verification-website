import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { adminUploadLand } from '../../services/land.service';

interface FormData {
  titleNumber: string;
  ownerName: string;
  quarter: string;
  areaSqm: number;
  gpsLat: number;
  gpsLng: number;
  notes: string;
}

export default function UploadLandPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [files, setFiles] = useState<FileList | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => { if (v !== '') formData.append(k, String(v)); });
      if (files) Array.from(files).forEach((f) => formData.append('documents', f));

      await adminUploadLand(formData);
      setSuccess('Land record uploaded and verified successfully!');
      setTimeout(() => navigate('/admin'), 2000);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string; details?: string } } };
      const msg = e.response?.data?.details || e.response?.data?.message || 'Upload failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link to="/admin" className="text-green-700 hover:underline text-sm mb-6 inline-block">← Back to Admin Panel</Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-800 to-green-600 px-8 py-6 text-white">
          <h1 className="text-2xl font-bold">Upload Land Record</h1>
          <p className="text-green-100 text-sm mt-1">The system will automatically verify the title for duplicates and GPS conflicts.</p>
        </div>

        <div className="px-8 py-8">
          {success && <div className="mb-5 bg-green-50 border border-green-300 text-green-700 rounded-lg px-4 py-3 text-sm">{success}</div>}
          {error && <div className="mb-5 bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title Number *</label>
                <input {...register('titleNumber', { required: 'Title number is required' })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g. TF-006-YAOUNDE" />
                {errors.titleNumber && <p className="text-red-500 text-xs mt-1">{errors.titleNumber.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name *</label>
                <input {...register('ownerName', { required: 'Owner name is required', minLength: { value: 2, message: 'At least 2 characters' } })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Full legal name" />
                {errors.ownerName && <p className="text-red-500 text-xs mt-1">{errors.ownerName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quarter / Neighborhood *</label>
                <input {...register('quarter', { required: 'Quarter is required' })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g. Bastos, Melen, Bonanjo" />
                {errors.quarter && <p className="text-red-500 text-xs mt-1">{errors.quarter.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area (m²) *</label>
                <input {...register('areaSqm', { required: 'Area is required', min: { value: 1, message: 'Must be positive' } })}
                  type="number" step="0.01"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g. 500" />
                {errors.areaSqm && <p className="text-red-500 text-xs mt-1">{errors.areaSqm.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GPS Latitude *</label>
                <input {...register('gpsLat', { required: 'Latitude is required', min: { value: -90, message: '-90 to 90' }, max: { value: 90, message: '-90 to 90' } })}
                  type="number" step="any"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g. 3.8697" />
                {errors.gpsLat && <p className="text-red-500 text-xs mt-1">{errors.gpsLat.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GPS Longitude *</label>
                <input {...register('gpsLng', { required: 'Longitude is required', min: { value: -180, message: '-180 to 180' }, max: { value: 180, message: '-180 to 180' } })}
                  type="number" step="any"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g. 11.5212" />
                {errors.gpsLng && <p className="text-red-500 text-xs mt-1">{errors.gpsLng.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
              <textarea {...register('notes')}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Any additional remarks about this parcel…" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supporting Documents (PDF, JPG, PNG — max 10MB each)</label>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setFiles(e.target.files)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-gray-50 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-green-100 file:text-green-700"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading}
                className="bg-green-700 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold px-8 py-3 rounded-xl transition text-sm">
                {loading ? 'Uploading & Verifying…' : 'Upload Land Record'}
              </button>
              <Link to="/admin" className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl text-sm transition">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
