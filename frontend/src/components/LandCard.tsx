import React from 'react';
import { Link } from 'react-router-dom';
import { SearchResult } from '../types';
import StatusBadge from './StatusBadge';

export default function LandCard({ land }: { land: SearchResult }) {
  return (
    <Link
      to={`/lands/${land.id}`}
      className="block bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-green-400 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Title Number</p>
          <p className="text-lg font-bold text-gray-900">{land.titleNumber}</p>
        </div>
        <StatusBadge status={land.status} />
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
        <div>
          <span className="font-medium text-gray-700">Owner:</span> {land.ownerName}
        </div>
        <div>
          <span className="font-medium text-gray-700">Quarter:</span> {land.quarter}
        </div>
        <div>
          <span className="font-medium text-gray-700">Area:</span> {land.areaSqm.toLocaleString()} m²
        </div>
        <div>
          <span className="font-medium text-gray-700">Registered:</span>{' '}
          {new Date(land.createdAt).toLocaleDateString('en-GB')}
        </div>
      </div>

      <p className="mt-3 text-xs text-green-600 font-medium">Click to view full details →</p>
    </Link>
  );
}
