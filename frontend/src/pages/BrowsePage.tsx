import React, { useState, useEffect } from 'react';
import { searchLands, getQuarters } from '../services/land.service';
import { SearchResult } from '../types';
import LandCard from '../components/LandCard';

export default function BrowsePage() {
  const [quarters, setQuarters] = useState<string[]>([]);
  const [selectedQuarter, setSelectedQuarter] = useState('');
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    getQuarters().then((data) => setQuarters(data.quarters));
    searchLands().then((data) => { setResults(data.results); setInitialLoad(false); });
  }, []);

  const handleFilter = async () => {
    setLoading(true);
    try {
      const data = await searchLands(keyword || undefined, selectedQuarter || undefined);
      setResults(data.results);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setSelectedQuarter('');
    setKeyword('');
    setLoading(true);
    const data = await searchLands();
    setResults(data.results);
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Land Parcels</h1>
        <p className="text-gray-500 text-sm">Filter by quarter or keyword to find available land in your area</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">Quarter / Neighborhood</label>
            <select
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Quarters</option>
              {quarters.map((q) => <option key={q} value={q}>{q}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">Keyword</label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Owner name or title number…"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex items-end gap-2">
            <button onClick={handleFilter} className="bg-green-700 hover:bg-green-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition">
              Apply
            </button>
            <button onClick={handleReset} className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm transition">
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {(loading || initialLoad) ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-700 border-t-transparent" />
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-4xl mb-3">🏘️</p>
          <p className="text-gray-500">No land parcels found for the selected filters.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{results.length} parcel(s) found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((land) => <LandCard key={land.id} land={land} />)}
          </div>
        </>
      )}
    </div>
  );
}
