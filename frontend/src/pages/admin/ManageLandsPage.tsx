import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminGetAllLands, adminDeactivateLand } from '../../services/land.service';
import { LandParcel } from '../../types';
import StatusBadge from '../../components/StatusBadge';

export default function ManageLandsPage() {
  const [lands, setLands] = useState<LandParcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();

  const fetchLands = () => {
    adminGetAllLands().then((data) => setLands(data.lands)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchLands(); }, []);

  const handleDeactivate = async (id: string, title: string) => {
    if (!confirm(`Deactivate parcel "${title}"? This will hide it from public search.`)) return;
    try {
      await adminDeactivateLand(id);
      fetchLands();
    } catch {
      alert('Failed to deactivate parcel.');
    }
  };

  const filtered = filter
    ? lands.filter(
        (l) =>
          l.titleNumber.toLowerCase().includes(filter.toLowerCase()) ||
          l.ownerName.toLowerCase().includes(filter.toLowerCase()) ||
          l.quarter.toLowerCase().includes(filter.toLowerCase())
      )
    : lands;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <Link to="/admin" className="text-green-700 hover:underline text-sm">← Back to Dashboard</Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Manage Land Records</h1>
        </div>
        <Link to="/admin/upload" className="bg-green-700 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition">
          + Upload New
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by title, owner, or quarter…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full sm:max-w-sm border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-green-700 border-t-transparent" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-5 py-3 text-left">Title / Owner</th>
                  <th className="px-5 py-3 text-left">Quarter</th>
                  <th className="px-5 py-3 text-left">Area (m²)</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-left">State</th>
                  <th className="px-5 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((land) => (
                  <tr
                    key={land.id}
                    onClick={() => navigate(`/lands/${land.id}`)}
                    className={`cursor-pointer hover:bg-green-50 hover:shadow-sm transition-all duration-150 ${!land.isActive ? 'opacity-50' : ''}`}
                  >
                    <td className="px-5 py-4">
                      <p className="font-bold text-gray-900 hover:text-green-700 transition-colors">{land.titleNumber}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{land.ownerName}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{land.quarter}</td>
                    <td className="px-5 py-4 text-gray-600">{land.areaSqm.toLocaleString()}</td>
                    <td className="px-5 py-4"><StatusBadge status={land.status} compact /></td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${land.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                        {land.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-3">
                        <Link to={`/admin/edit/${land.id}`} className="text-green-700 hover:underline text-xs font-medium">Edit</Link>
                        {land.isActive && (
                          <button
                            onClick={() => handleDeactivate(land.id, land.titleNumber)}
                            className="text-red-500 hover:underline text-xs"
                          >
                            Deactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">No records match the filter.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
