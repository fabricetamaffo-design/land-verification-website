import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLandById } from '../services/land.service';
import { LandParcel } from '../types';
import StatusBadge from '../components/StatusBadge';
import MapView from '../components/MapView';

export default function LandDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [land, setLand] = useState<LandParcel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    getLandById(id)
      .then((data) => setLand(data.land))
      .catch(() => setError('Land parcel not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-700 border-t-transparent" />
      </div>
    );
  }

  if (error || !land) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4">⚠️</p>
        <p className="text-gray-700 font-semibold text-lg">{error || 'Land parcel not found.'}</p>
        <Link to="/search" className="mt-6 inline-block text-green-700 hover:underline text-sm">← Back to Search</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link to="/search" className="text-green-700 hover:underline text-sm mb-6 inline-block">← Back to Search</Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-800 to-green-600 text-white px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-green-200 text-xs uppercase tracking-wider mb-1">Land Parcel</p>
              <h1 className="text-2xl font-bold">{land.titleNumber}</h1>
            </div>
            <StatusBadge status={land.status} />
          </div>
        </div>

        {/* Notes / Warning */}
        {land.notes && (
          <div className={`px-8 py-4 border-b text-sm ${land.status === 'DUPLICATE' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-orange-50 border-orange-200 text-orange-700'}`}>
            <strong>Note:</strong> {land.notes}
          </div>
        )}

        {/* Details */}
        <div className="px-8 py-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { label: 'Title Number', value: land.titleNumber },
            { label: 'Owner Name', value: land.ownerName },
            { label: 'Quarter', value: land.quarter },
            { label: 'Area', value: `${land.areaSqm.toLocaleString()} m²` },
            { label: 'Registered By', value: land.uploadedBy?.name || '—' },
            { label: 'Date Registered', value: new Date(land.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) },
            { label: 'GPS Latitude', value: land.gpsLat.toFixed(6) },
            { label: 'GPS Longitude', value: land.gpsLng.toFixed(6) },
          ].map((row) => (
            <div key={row.label} className="border-b border-gray-100 pb-3">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">{row.label}</p>
              <p className="text-gray-800 font-semibold mt-0.5">{row.value}</p>
            </div>
          ))}
        </div>

        {/* Map */}
        <div className="px-8 pb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">GPS Location</h2>
          {land.gpsLat && land.gpsLng ? (
            <MapView lat={land.gpsLat} lng={land.gpsLng} title={`${land.titleNumber} — ${land.ownerName}`} />
          ) : (
            <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-400 border border-gray-200">
              GPS coordinates not available for this parcel.
            </div>
          )}
        </div>

        {/* Documents */}
        {land.documents && land.documents.length > 0 && (
          <div className="px-8 pb-8 border-t border-gray-100 pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Supporting Documents</h2>
            <ul className="space-y-2">
              {land.documents.map((doc) => (
                <li key={doc.id} className="flex items-center gap-3 text-sm text-green-700 hover:underline">
                  <span>📄</span>
                  <a href={`/uploads/${doc.filePath.split('/').pop()}`} target="_blank" rel="noopener noreferrer">
                    {doc.fileName}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
