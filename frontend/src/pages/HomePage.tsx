import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    else navigate('/search');
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-800 via-green-700 to-green-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Verify Land Ownership in Cameroon
          </h1>
          <p className="text-green-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Search the national land registry to confirm title legitimacy, detect duplicates, and protect yourself from land fraud before any transaction.
          </p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter title number, owner name, or parcel ID…"
              className="flex-1 px-5 py-3.5 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 shadow-lg"
            />
            <button type="submit" className="bg-white text-green-800 font-bold px-7 py-3.5 rounded-xl hover:bg-green-50 transition shadow-lg text-sm">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-10 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { value: '500+', label: 'Land Parcels Registered' },
            { value: '3', label: 'Verification Statuses' },
            { value: '99%', label: 'Platform Uptime' },
          ].map((s) => (
            <div key={s.label} className="p-6 rounded-xl bg-green-50 border border-green-100">
              <p className="text-4xl font-extrabold text-green-700">{s.value}</p>
              <p className="text-gray-600 mt-1 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '1', icon: '🔍', title: 'Search a Parcel', desc: 'Enter the title number, parcel ID, or owner name in the search bar.' },
              { step: '2', icon: '📋', title: 'View Details', desc: 'See ownership info, GPS location on the map, and the verification status.' },
              { step: '3', icon: '✅', title: 'Make a Decision', desc: 'Use the Valid / Suspicious / Duplicate badge to decide with confidence.' },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">{item.icon}</div>
                <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-2">Step {item.step}</p>
                <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Status guide */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">Understanding Verification Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { status: 'Valid', color: 'green', desc: 'Title is unique, GPS is clear. No conflicts detected. Safe to proceed.' },
              { status: 'Suspicious', color: 'orange', desc: 'Proximity or data overlap detected. Manual verification recommended before proceeding.' },
              { status: 'Duplicate', color: 'red', desc: 'Title number or GPS coordinates already registered under another record. High fraud risk.' },
            ].map((item) => (
              <div key={item.status} className={`rounded-xl p-6 border-2 ${item.color === 'green' ? 'border-green-300 bg-green-50' : item.color === 'orange' ? 'border-orange-300 bg-orange-50' : 'border-red-300 bg-red-50'}`}>
                <p className={`font-bold text-lg mb-2 ${item.color === 'green' ? 'text-green-700' : item.color === 'orange' ? 'text-orange-700' : 'text-red-700'}`}>
                  {item.status}
                </p>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
