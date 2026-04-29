import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminGetAllLands, adminGetUsers } from '../../services/land.service';
import { LandParcel } from '../../types';
import StatusBadge from '../../components/StatusBadge';

export default function AdminDashboard() {
  const [lands, setLands] = useState<LandParcel[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminGetAllLands(), adminGetUsers()])
      .then(([landData, userData]) => {
        setLands(landData.lands);
        setUserCount(userData.users.length);
      })
      .finally(() => setLoading(false));
  }, []);

  const counts = {
    total: lands.length,
    valid: lands.filter((l) => l.status === 'VALID').length,
    suspicious: lands.filter((l) => l.status === 'SUSPICIOUS').length,
    duplicate: lands.filter((l) => l.status === 'DUPLICATE').length,
    active: lands.filter((l) => l.isActive).length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-1">Manage land records and users</p>
        </div>
        <Link to="/admin/upload" className="bg-green-700 hover:bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition">
          + Upload Land Record
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        {[
          { label: 'Total Parcels', value: counts.total, color: 'gray' },
          { label: 'Valid', value: counts.valid, color: 'green' },
          { label: 'Suspicious', value: counts.suspicious, color: 'orange' },
          { label: 'Duplicate', value: counts.duplicate, color: 'red' },
          { label: 'Registered Users', value: userCount, color: 'blue' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <p className="text-3xl font-bold text-gray-800">{loading ? '—' : s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Land records table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">All Land Records</h2>
          <Link to="/admin/manage" className="text-sm text-green-700 hover:underline">Manage all →</Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-green-700 border-t-transparent" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-6 py-3 text-left">Title Number</th>
                  <th className="px-6 py-3 text-left">Owner</th>
                  <th className="px-6 py-3 text-left">Quarter</th>
                  <th className="px-6 py-3 text-left">Area (m²)</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Active</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {lands.slice(0, 10).map((land) => (
                  <tr key={land.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{land.titleNumber}</td>
                    <td className="px-6 py-4 text-gray-600">{land.ownerName}</td>
                    <td className="px-6 py-4 text-gray-600">{land.quarter}</td>
                    <td className="px-6 py-4 text-gray-600">{land.areaSqm.toLocaleString()}</td>
                    <td className="px-6 py-4"><StatusBadge status={land.status} /></td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${land.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {land.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link to={`/admin/edit/${land.id}`} className="text-green-700 hover:underline mr-3 text-xs font-medium">Edit</Link>
                      <Link to={`/lands/${land.id}`} className="text-gray-500 hover:underline text-xs">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {lands.length > 10 && (
              <div className="px-6 py-3 border-t border-gray-100 text-sm text-gray-500">
                Showing 10 of {lands.length} records. <Link to="/admin/manage" className="text-green-700 hover:underline">View all</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
