import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { adminGetAllLands, adminGetUsers } from '../../services/land.service';
import { LandParcel } from '../../types';
import StatusBadge from '../../components/StatusBadge';
import { useLang } from '../../context/LanguageContext';

export default function AdminDashboard() {
  const [lands, setLands] = useState<LandParcel[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { t } = useLang();

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

  const statCards = [
    { label: t.admin.totalParcels, value: counts.total, color: 'bg-gray-50 border-gray-200 text-gray-700' },
    { label: t.admin.valid, value: counts.valid, color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
    { label: t.admin.suspicious, value: counts.suspicious, color: 'bg-amber-50 border-amber-200 text-amber-700' },
    { label: t.admin.duplicate, value: counts.duplicate, color: 'bg-red-50 border-red-200 text-red-700' },
    { label: t.admin.users, value: userCount, color: 'bg-blue-50 border-blue-200 text-blue-700' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900">{t.admin.title}</h1>
              <p className="text-gray-400 text-sm mt-1">{t.admin.subtitle}</p>
            </div>
            <Link
              to="/admin/upload"
              className="btn-primary px-6 py-3 rounded-xl text-sm inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t.admin.uploadBtn}
            </Link>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {statCards.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`rounded-2xl border p-5 text-center ${s.color}`}
              >
                <p className="text-3xl font-black mb-1">{loading ? '—' : s.value}</p>
                <p className="text-xs font-medium opacity-70">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { to: '/admin/upload', label: 'Upload Land Record', icon: '📤', color: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' },
              { to: '/admin/manage', label: 'Manage Lands', icon: '📋', color: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' },
              { to: '/search', label: 'Search Parcels', icon: '🔍', color: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100' },
              { to: '/browse', label: 'Browse All', icon: '🗺️', color: 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100' },
            ].map(({ to, label, icon, color }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 p-4 rounded-xl border font-medium text-sm transition-all duration-200 ${color}`}
              >
                <span className="text-xl">{icon}</span>
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">{t.admin.allRecords}</h2>
              <Link to="/admin/manage" className="text-sm text-green-600 hover:text-green-500 font-medium">{t.admin.manageAll}</Link>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-14 gap-3">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 rounded-full border-4 border-green-100" />
                  <div className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
                </div>
                <p className="text-gray-400 text-sm">Loading records…</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-3.5 text-left font-semibold">Title Number</th>
                      <th className="px-6 py-3.5 text-left font-semibold">Owner</th>
                      <th className="px-6 py-3.5 text-left font-semibold">Quarter</th>
                      <th className="px-6 py-3.5 text-left font-semibold">Area (m²)</th>
                      <th className="px-6 py-3.5 text-left font-semibold">Status</th>
                      <th className="px-6 py-3.5 text-left font-semibold">Active</th>
                      <th className="px-6 py-3.5 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {lands.slice(0, 10).map((land) => (
                      <tr key={land.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900">{land.titleNumber}</td>
                        <td className="px-6 py-4 text-gray-600">{land.ownerName}</td>
                        <td className="px-6 py-4 text-gray-600">{land.quarter}</td>
                        <td className="px-6 py-4 text-gray-600">{land.areaSqm.toLocaleString()}</td>
                        <td className="px-6 py-4"><StatusBadge status={land.status} /></td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${land.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {land.isActive ? t.common.active : t.common.inactive}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex items-center gap-3">
                          <Link to={`/admin/edit/${land.id}`} className="text-green-600 hover:text-green-500 text-xs font-semibold">{t.common.edit}</Link>
                          <Link to={`/lands/${land.id}`} className="text-gray-400 hover:text-gray-600 text-xs">{t.common.view}</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {lands.length > 10 && (
                  <div className="px-6 py-3 border-t border-gray-100 text-sm text-gray-400">
                    {t.admin.showing} 10 {t.admin.of} {lands.length} {t.common.records}.{' '}
                    <Link to="/admin/manage" className="text-green-600 hover:text-green-500 font-medium">{t.admin.viewAll}</Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
