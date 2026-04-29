import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchLands } from '../services/land.service';
import { SearchResult } from '../types';
import LandCard from '../components/LandCard';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (q: string) => {
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const data = await searchLands(q || undefined);
      setResults(data.results);
      setSearchParams(q ? { q } : {});
    } catch {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initial = searchParams.get('q');
    if (initial) handleSearch(initial);
    else { setSearched(false); setResults([]); }
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Land Parcels</h1>
        <p className="text-gray-500 text-sm">Search by title number, parcel ID, or owner name</p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. TF-001-YAOUNDE or Jean-Pierre Mbarga…"
          className="flex-1 border border-gray-300 rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button type="submit" className="bg-green-700 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-xl text-sm transition">
          Search
        </button>
      </form>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {loading && (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-green-700 border-t-transparent" />
          <p className="mt-3 text-gray-500 text-sm">Searching registry…</p>
        </div>
      )}

      {!loading && searched && (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            {results.length > 0 ? `${results.length} result(s) found` : 'No results found'}
          </p>
          {results.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-gray-600 font-medium">No land parcels match your search.</p>
              <p className="text-gray-400 text-sm mt-1">Try a different title number or owner name.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {results.map((land) => <LandCard key={land.id} land={land} />)}
            </div>
          )}
        </div>
      )}

      {!loading && !searched && (
        <div className="text-center py-16 bg-green-50 rounded-2xl border border-green-100">
          <p className="text-5xl mb-4">🏡</p>
          <p className="text-gray-600 font-medium">Enter a search query above to find land parcels.</p>
        </div>
      )}
    </div>
  );
}
