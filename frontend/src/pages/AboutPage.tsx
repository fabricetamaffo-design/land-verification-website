import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useLang } from '../context/LanguageContext';

const team = [
  { name: 'Tamaffo Fabrice',  role: 'Project Manager · Backend · Database', initials: 'TF', gradient: 'from-green-500 to-emerald-400',  ring: 'ring-green-400/40',  bg: 'bg-green-50',  border: 'border-green-200' },
  { name: 'Kuate Messado',    role: 'Backend Developer',                     initials: 'KM', gradient: 'from-blue-500 to-indigo-400',   ring: 'ring-blue-400/40',   bg: 'bg-blue-50',   border: 'border-blue-200' },
  { name: 'Nkam Titcha',      role: 'Frontend Developer · Database',         initials: 'NT', gradient: 'from-purple-500 to-violet-400', ring: 'ring-purple-400/40', bg: 'bg-purple-50', border: 'border-purple-200' },
  { name: 'Kemgang Leprince', role: 'Frontend Developer · Backend',          initials: 'KL', gradient: 'from-amber-500 to-orange-400',  ring: 'ring-amber-400/40',  bg: 'bg-amber-50',  border: 'border-amber-200' },
];

const features = [
  { icon: '🔍', title: 'Smart Search',        desc: 'Search by title number, parcel ID, or owner name across the full national registry.', gradient: 'from-blue-500 to-indigo-500',   bg: 'bg-blue-50',   border: 'border-blue-100',   text: 'text-blue-700' },
  { icon: '🗺️', title: 'GPS Map View',        desc: 'Every land parcel is pinpointed on an interactive Leaflet map with satellite overlay.', gradient: 'from-green-500 to-emerald-500', bg: 'bg-green-50',  border: 'border-green-100',  text: 'text-green-700' },
  { icon: '🛡️', title: 'Fraud Detection',     desc: 'Automated detection of duplicates and suspicious GPS overlaps before they cause harm.', gradient: 'from-red-500 to-rose-500',      bg: 'bg-red-50',    border: 'border-red-100',    text: 'text-red-700' },
  { icon: '👤', title: 'Role-Based Access',   desc: 'Separate admin and user roles with protected routes and JWT authentication.',           gradient: 'from-purple-500 to-violet-500', bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-700' },
  { icon: '📋', title: 'Document Upload',     desc: 'Admins can attach PDF or image documents to each land record as legal evidence.',       gradient: 'from-amber-500 to-orange-500',  bg: 'bg-amber-50',  border: 'border-amber-100',  text: 'text-amber-700' },
  { icon: '🌍', title: 'Bilingual Platform',  desc: 'Full English and French language support — toggled instantly for all Cameroon users.',  gradient: 'from-teal-500 to-cyan-500',     bg: 'bg-teal-50',   border: 'border-teal-100',   text: 'text-teal-700' },
];

const goals = [
  { label: 'Eliminate Fraud',  icon: '🚫', gradient: 'from-red-500 to-rose-600',     bg: 'bg-red-600',    desc: 'Stop fraudulent title transfers before they happen.' },
  { label: 'Protect Rights',   icon: '⚖️', gradient: 'from-blue-500 to-indigo-600',  bg: 'bg-blue-600',   desc: 'Ensure every citizen\'s land rights are on record.' },
  { label: 'Build Trust',      icon: '🤝', gradient: 'from-green-500 to-emerald-600',bg: 'bg-green-600',  desc: 'Create a transparent, verified public registry.' },
  { label: 'Digital Access',   icon: '💻', gradient: 'from-purple-500 to-violet-600',bg: 'bg-purple-600', desc: 'Make land information accessible to every Cameroonian.' },
];

const techStack = [
  { name: 'React 18',      color: 'bg-cyan-100 text-cyan-800 border-cyan-300' },
  { name: 'TypeScript',    color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { name: 'Vite',          color: 'bg-purple-100 text-purple-800 border-purple-300' },
  { name: 'Tailwind CSS',  color: 'bg-sky-100 text-sky-800 border-sky-300' },
  { name: 'Framer Motion', color: 'bg-pink-100 text-pink-800 border-pink-300' },
  { name: 'Node.js',       color: 'bg-green-100 text-green-800 border-green-300' },
  { name: 'Express.js',    color: 'bg-gray-100 text-gray-700 border-gray-300' },
  { name: 'PostgreSQL',    color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
  { name: 'Prisma ORM',    color: 'bg-teal-100 text-teal-800 border-teal-300' },
  { name: 'JWT Auth',      color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { name: 'Leaflet.js',    color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
];

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' as const },
  }),
};

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} className={className}>
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
  const { t } = useLang();

  return (
    <div className="min-h-screen bg-gray-50 pt-16">

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="hero-gradient py-28 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '28px 28px' }}
        />
        <div className="absolute top-12 left-1/3 w-72 h-72 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-12 right-1/4 w-56 h-56 bg-green-300/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 text-green-200 text-sm font-semibold mb-8">
              <div className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
              PKFokam Institute of Excellence — Spring 2026
            </span>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-5 leading-tight">
              {t.about.title}
            </h1>
            <p className="text-green-100/75 text-lg max-w-2xl mx-auto leading-relaxed">
              {t.about.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          MISSION
      ══════════════════════════════════════ */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <Section>
            <div className="grid md:grid-cols-2 gap-14 items-center">
              <motion.div variants={fadeUp}>
                <p className="text-green-600 text-xs font-bold uppercase tracking-widest mb-2">{t.about.mission}</p>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-5 leading-tight">Why LandVerifyCM?</h2>
                <p className="text-gray-500 leading-relaxed text-base mb-6">{t.about.missionText}</p>
                <div className="flex items-center gap-3 text-sm font-semibold text-green-700 bg-green-50 border border-green-200 rounded-2xl px-5 py-3.5">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Capstone Project — {t.about.dept}
                </div>
              </motion.div>

              <div className="grid grid-cols-2 gap-4">
                {goals.map((g, i) => (
                  <motion.div
                    key={g.label}
                    variants={fadeUp}
                    custom={i + 1}
                    className="rounded-2xl p-5 text-white overflow-hidden relative"
                    style={{ background: `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))` }}
                  >
                    <div className={`bg-gradient-to-br ${g.gradient} absolute inset-0`} />
                    <div className="relative z-10">
                      <div className="text-3xl mb-3">{g.icon}</div>
                      <p className="font-black text-sm mb-1">{g.label}</p>
                      <p className="text-white/75 text-xs leading-relaxed">{g.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Section>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURES
      ══════════════════════════════════════ */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <Section>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <p className="text-green-600 text-xs font-bold uppercase tracking-widest mb-2">Platform Features</p>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">What the Platform Offers</h2>
              <p className="text-gray-500 text-base max-w-lg mx-auto">
                Every feature was designed to combat land fraud and give citizens confidence in property transactions.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  variants={fadeUp}
                  custom={i}
                  className={`rounded-2xl p-6 border ${f.border} ${f.bg} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group`}
                >
                  {/* Coloured icon circle */}
                  <div className={`w-12 h-12 bg-gradient-to-br ${f.gradient} rounded-xl flex items-center justify-center text-2xl mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    {f.icon}
                  </div>
                  <h3 className={`font-black text-base mb-2 ${f.text}`}>{f.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TEAM
      ══════════════════════════════════════ */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <Section>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <p className="text-green-600 text-xs font-bold uppercase tracking-widest mb-2">{t.about.team}</p>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">Meet the Team</h2>
              <p className="text-gray-400 text-sm">
                {t.about.supervisor}:{' '}
                <strong className="text-gray-700 font-bold">Mr. Joel Teto Kamdem</strong>
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {team.map((member, i) => (
                <motion.div
                  key={member.name}
                  variants={fadeUp}
                  custom={i}
                  className={`${member.bg} rounded-2xl p-7 text-center border-2 ${member.border} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}
                >
                  <div className={`w-18 h-18 w-[72px] h-[72px] bg-gradient-to-br ${member.gradient} rounded-2xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-5 shadow-lg ring-4 ${member.ring} group-hover:scale-105 transition-transform duration-300`}>
                    {member.initials}
                  </div>
                  <h4 className="font-black text-gray-900 text-sm mb-1.5">{member.name}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TECH STACK
      ══════════════════════════════════════ */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <Section>
            <motion.div variants={fadeUp}>
              <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-2">Built With</p>
              <h3 className="text-white font-black text-3xl mb-3">Tech Stack</h3>
              <p className="text-gray-400 text-sm mb-10 max-w-md mx-auto">
                Modern, production-ready technologies selected for performance, type safety, and developer experience.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} custom={1} className="flex flex-wrap justify-center gap-3">
              {techStack.map((tech) => (
                <span
                  key={tech.name}
                  className={`px-4 py-2 border rounded-full text-sm font-semibold ${tech.color} hover:scale-105 transition-transform duration-200 cursor-default`}
                >
                  {tech.name}
                </span>
              ))}
            </motion.div>
          </Section>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PROJECT INFO BANNER
      ══════════════════════════════════════ */}
      <section className="py-16 px-4 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <Section>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { label: 'Project',     value: t.about.projectText,   icon: '🎓', color: 'bg-green-50 border-green-200 text-green-700' },
                { label: 'Supervisor',  value: 'Mr. Joel Teto Kamdem', icon: '👨‍🏫', color: 'bg-blue-50 border-blue-200 text-blue-700' },
                { label: 'Department',  value: t.about.dept,           icon: '🏛️', color: 'bg-purple-50 border-purple-200 text-purple-700' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  variants={fadeUp}
                  custom={i}
                  className={`rounded-2xl p-5 border-2 ${item.color}`}
                >
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">{item.label}</p>
                  <p className="font-bold text-sm leading-snug">{item.value}</p>
                </motion.div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA
      ══════════════════════════════════════ */}
      <section className="py-20 px-4 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '28px 28px' }}
        />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <Section>
            <motion.p variants={fadeUp} className="text-green-300 text-xs font-bold uppercase tracking-widest mb-3">Get Started</motion.p>
            <motion.h3 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-black text-white mb-4">
              Ready to verify a land parcel?
            </motion.h3>
            <motion.p variants={fadeUp} custom={2} className="text-green-100/70 text-base mb-8 max-w-md mx-auto">
              Search land parcels or create a free account to get full access to the registry.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/search"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-green-800 font-bold rounded-2xl hover:bg-green-50 active:scale-95 transition-all duration-200 shadow-xl text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search Lands
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/30 text-white font-bold rounded-2xl hover:bg-white/20 active:scale-95 transition-all duration-200 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Create Account
              </Link>
            </motion.div>
          </Section>
        </div>
      </section>
    </div>
  );
}
