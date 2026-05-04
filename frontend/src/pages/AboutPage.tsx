import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLang } from '../context/LanguageContext';

const team = [
  { name: 'Tamaffo Fabrice', role: 'Project Manager · Backend · Database', initials: 'TF', color: 'from-green-500 to-emerald-400' },
  { name: 'Kuate Messado', role: 'Backend Developer', initials: 'KM', color: 'from-blue-500 to-indigo-400' },
  { name: 'Nkam Titcha', role: 'Frontend Developer · Database', initials: 'NT', color: 'from-purple-500 to-violet-400' },
  { name: 'Kemgang Leprince', role: 'Frontend Developer · Backend', initials: 'KL', color: 'from-amber-500 to-orange-400' },
];

const features = [
  { icon: '🔍', title: 'Smart Search', desc: 'Search by title number, parcel ID, or owner name across the entire registry.' },
  { icon: '🗺️', title: 'GPS Map View', desc: 'Every land parcel is pinpointed on an interactive Leaflet map.' },
  { icon: '🛡️', title: 'Fraud Detection', desc: 'Automated detection of duplicates and suspicious overlapping titles.' },
  { icon: '👤', title: 'Role-Based Access', desc: 'Separate admin and user roles with protected routes.' },
  { icon: '📋', title: 'Document Upload', desc: 'Admins can attach supporting documents to each land record.' },
  { icon: '🌍', title: 'Bilingual', desc: 'Full English and French language support for Cameroon users.' },
];

export default function AboutPage() {
  const { t } = useLang();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero */}
      <section className="hero-gradient dot-pattern py-24 relative overflow-hidden">
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-green-200 text-sm font-medium mb-6">
              PKFokam Institute of Excellence — Spring 2026
            </span>
            <h1 className="text-5xl font-black text-white mb-4">{t.about.title}</h1>
            <p className="text-green-100/80 text-lg max-w-xl mx-auto">{t.about.subtitle}</p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <span className="text-green-600 text-sm font-semibold uppercase tracking-widest">{t.about.mission}</span>
              <h2 className="text-3xl font-black text-gray-900 mt-2 mb-5">Why LandVerifyCM?</h2>
              <p className="text-gray-500 leading-relaxed">{t.about.missionText}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Eliminate Fraud', icon: '🚫', color: 'bg-red-50 border-red-100' },
                { label: 'Protect Rights', icon: '⚖️', color: 'bg-blue-50 border-blue-100' },
                { label: 'Build Trust', icon: '🤝', color: 'bg-green-50 border-green-100' },
                { label: 'Digital Access', icon: '💻', color: 'bg-purple-50 border-purple-100' },
              ].map((item) => (
                <div key={item.label} className={`rounded-2xl p-5 border ${item.color} text-center`}>
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <p className="text-sm font-semibold text-gray-700">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-green-600 text-sm font-semibold uppercase tracking-widest">Features</span>
            <h2 className="text-3xl font-black text-gray-900 mt-2">What the Platform Offers</h2>
          </motion.div>
          <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all duration-300"
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-green-600 text-sm font-semibold uppercase tracking-widest">{t.about.team}</span>
            <h2 className="text-3xl font-black text-gray-900 mt-2">Meet the Team</h2>
            <p className="text-gray-400 mt-2">Supervised by <strong className="text-gray-600">Mr. Joel Teto Kamdem</strong></p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100 hover:shadow-md transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${member.color} rounded-2xl flex items-center justify-center text-white font-black text-xl mx-auto mb-4 shadow-lg`}>
                  {member.initials}
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">{member.name}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h3 className="text-white font-black text-2xl mb-8">Tech Stack</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Node.js', 'Express.js', 'PostgreSQL', 'Prisma ORM', 'JWT', 'Leaflet.js'].map((tech) => (
                <span key={tech} className="px-4 py-2 bg-white/10 border border-white/10 rounded-full text-white/80 text-sm font-medium hover:bg-white/15 transition-colors">
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-white text-center border-t border-gray-100">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h3 className="text-2xl font-black text-gray-900 mb-3">Ready to get started?</h3>
          <p className="text-gray-400 text-sm mb-6">Search land parcels or create a free account to get full access.</p>
          <div className="flex gap-3 justify-center">
            <Link to="/search" className="btn-primary px-6 py-3 rounded-xl text-sm inline-flex items-center">Search Lands</Link>
            <Link to="/register" className="btn-secondary px-6 py-3 rounded-xl text-sm inline-flex items-center">Create Account</Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
