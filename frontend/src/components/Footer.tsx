import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-green-900 text-green-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-white font-bold text-lg mb-2">🏡 LandVerifyCM</h3>
            <p className="text-sm text-green-300">
              Secure, centralized land verification platform for Cameroon. Eliminating fraud, one title at a time.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-1 text-sm">
              <li><a href="/search" className="hover:text-white transition">Search Land</a></li>
              <li><a href="/browse" className="hover:text-white transition">Browse by Quarter</a></li>
              <li><a href="/register" className="hover:text-white transition">Register Account</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Capstone Project</h4>
            <p className="text-sm">PKFokam Institute of Excellence</p>
            <p className="text-sm">Department of Computing & Software Engineering</p>
            <p className="text-sm">Spring 2026 — Team LandVerify</p>
          </div>
        </div>
        <div className="mt-6 border-t border-green-700 pt-4 text-center text-xs text-green-400">
          © 2026 LandVerifyCM. Built for educational purposes.
        </div>
      </div>
    </footer>
  );
}
