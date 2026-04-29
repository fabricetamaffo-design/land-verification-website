import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getLandById, adminUpdateLand } from '../../services/land.service';
import { LandParcel } from '../../types';

interface FormData {
  titleNumber: string;
  ownerName: string;
  quarter: string;
  areaSqm: number;
  gpsLat: number;
  gpsLng: number;
  notes: string;
}

export default function EditLandPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const [land, setLand] = useState<LandParcel | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!id) return;
    getLandById(id).then((data) => {
      setLand(data.land);
      reset({
        titleNumber: data.land.titleNumber,
        ownerName: data.land.ownerName,
        quarter: data.land.quarter,
        areaSqm: data.land.areaSqm,
        gpsLat: data.land.gpsLat,
        gpsLng: data.land.gpsLng,
        notes: data.land.notes || '',
      });
    }).catch(() => setError('Failed to load land record.')).finally(() => setLoading(false));
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    if (!id) return;
    setError('');
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => { if (v !== '') formData.append(k, String(v)); });
      await adminUpdateLand(id, formData);
      setSuccess('Land record updated successfully!');
      setTimeout(() => navigate('/admin/manage'), 2000);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-4 border-green-700 border-t-transparent" /></div>;
  }

  if (!land) {
    return <div className="text-center py-20 text-gray-500">Land record not found. <Link to="/admin" className="text-green-700 hover:underline">Back to admin</Link></div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link to="/admin/manage" className="text-green-700 hover:underline text-sm mb-6 inline-block">← Back to Manage Records</Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-800 to-green-600 px-8 py-6 text-white">
          <h1 className="text-2xl font-bold">Edit Land Record</h1>
          <p className="text-green-100 text-sm mt-1">Changes are logged in the audit trail.</p>
        </div>

        <div className="px-8 py-8">
          {success && <div className="mb-5 bg-green-50 border border-green-300 text-green-700 rounded-lg px-4 py-3 text-sm">{success}</div>}
          {error && <div className="mb-5 bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title Number *</label>
                <input {...register('titleNumber', { required: 'Required' })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                {errors.titleNumber && <p className="text-red-500 text-xs mt-1">{errors.titleNumber.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name *</label>
                <input {...register('ownerName', { required: 'Required' })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                {errors.ownerName && <p className="text-red-500 text-xs mt-1">{errors.ownerName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quarter *</label>
                <input {...register('quarter', { required: 'Required' })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                {errors.quarter && <p className="text-red-500 text-xs mt-1">{errors.quarter.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area (m²) *</label>
                <input {...register('areaSqm', { required: 'Required', min: 1 })} type="number" step="0.01"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                {errors.areaSqm && <p className="text-red-500 text-xs mt-1">{errors.areaSqm.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GPS Latitude *</label>
                <input {...register('gpsLat', { required: 'Required' })} type="number" step="any"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GPS Longitude *</label>
                <input {...register('gpsLng', { required: 'Required' })} type="number" step="any"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea {...register('notes')} rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving}
                className="bg-green-700 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold px-8 py-3 rounded-xl transition text-sm">
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              <Link to="/admin/manage" className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl text-sm transition">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
