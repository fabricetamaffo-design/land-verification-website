import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useInView, Variants } from 'framer-motion';
import { useLang } from '../context/LanguageContext';

/* ── Animated number counter ── */
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(current);
    }, 20);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ── Scroll-triggered section wrapper ── */
const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: 'easeOut' },
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

/* ── Small feature pill ── */
function TrustBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2 text-green-100 text-sm backdrop-blur-sm">
      <span className="text-green-300">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

export default function HomePage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { t } = useLang();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : '/search');
  };

  return (
    <div className="flex flex-col">

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="hero-gradient min-h-screen flex flex-col items-center justify-center relative overflow-hidden pt-16">

        {/* Background texture */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)', backgroundSize: '32px 32px' }}
        />
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-green-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 py-20">

          {/* Trust badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 text-green-200 text-sm font-medium mb-10"
          >
            <div className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
            {t.hero.badge}
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.08] mb-4 drop-shadow-lg"
          >
            {t.hero.title}{' '}
            <span style={{ color: '#fbbf24', textShadow: '0 2px 24px rgba(251,191,36,0.5)' }}>
              {t.hero.titleHighlight}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-green-100/75 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {t.hero.subtitle}
          </motion.p>

          {/* Search bar */}
          <motion.form
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.4 }}
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-6"
          >
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Land Title ID — e.g. TF-001-YAOUNDE"
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-green-400/30 shadow-2xl bg-white/97 placeholder:text-gray-400"
              />
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(16,185,129,0.4)' }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary px-7 py-4 rounded-2xl text-sm font-bold whitespace-nowrap shadow-xl"
            >
              {t.hero.searchBtn}
            </motion.button>
          </motion.form>

          {/* Browse link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-green-200/60 text-sm mb-12"
          >
            Not sure of the ID?{' '}
            <Link to="/browse" className="text-green-300 hover:text-white font-semibold underline underline-offset-4 transition-colors">
              Browse sample previews
            </Link>
            {' '}or{' '}
            <Link to="/register" className="text-green-300 hover:text-white font-semibold underline underline-offset-4 transition-colors">
              create a free account
            </Link>
          </motion.p>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <TrustBadge icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>} label="Fraud Prevention" />
            <TrustBadge icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} label="Instant Verification" />
            <TrustBadge icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>} label="Data Protected" />
            <TrustBadge icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>} label="Free to Use" />
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/30 text-xs gap-2"
        >
          <span>{t.hero.scrollHint}</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════
          STATS
      ══════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <Section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { target: 500, suffix: '+', label: t.stats.parcels,  icon: '🏘️', color: 'text-green-700' },
              { target: 2,   suffix: '',  label: t.stats.statuses, icon: '✅', color: 'text-blue-700' },
              { target: 99,  suffix: '%', label: t.stats.uptime,   icon: '⚡', color: 'text-amber-600' },
              { target: 120, suffix: '+', label: t.stats.users,    icon: '👥', color: 'text-purple-700' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                variants={fadeUp}
                custom={i}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-green-200 hover:bg-green-50/50 transition-all duration-300"
              >
                <span className="text-3xl mb-3">{s.icon}</span>
                <p className={`text-4xl font-black mb-1 ${s.color}`}>
                  <AnimatedCounter target={s.target} suffix={s.suffix} />
                </p>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">{s.label}</p>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════ */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <Section>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <p className="text-green-600 text-xs font-bold uppercase tracking-widest mb-2">Simple Process</p>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">{t.howItWorks.title}</h2>
              <p className="text-gray-500 text-base max-w-lg mx-auto">{t.howItWorks.subtitle}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {t.howItWorks.steps.map((item, i) => (
                <motion.div
                  key={item.step}
                  variants={fadeUp}
                  custom={i + 1}
                  className="relative bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all duration-300 group"
                >
                  {/* Step number */}
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-lg mb-5 shadow-md shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
                    {item.step}
                  </div>
                  {/* Connector arrow (desktop) */}
                  {i < 2 && (
                    <div className="hidden md:block absolute -right-3 top-9 z-10">
                      <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                  <h3 className="font-bold text-gray-900 text-base mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATUS GUIDE
      ══════════════════════════════════════ */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <Section>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <p className="text-green-600 text-xs font-bold uppercase tracking-widest mb-2">Verification</p>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">{t.statusGuide.title}</h2>
              <p className="text-gray-500 text-base max-w-lg mx-auto">{t.statusGuide.subtitle}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  status: t.statusGuide.statuses[0],
                  icon: (
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ),
                  gradient: 'from-emerald-500 to-green-600',
                  bg: 'bg-emerald-50',
                  border: 'border-emerald-200',
                  title: 'text-emerald-800',
                  desc: 'text-emerald-700',
                  badge: 'bg-emerald-100 text-emerald-700',
                  badgeLabel: 'Safe to proceed',
                },
                {
                  status: t.statusGuide.statuses[1],
                  icon: (
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ),
                  gradient: 'from-red-500 to-rose-600',
                  bg: 'bg-red-50',
                  border: 'border-red-200',
                  title: 'text-red-800',
                  desc: 'text-red-700',
                  badge: 'bg-red-100 text-red-700',
                  badgeLabel: 'Do not proceed',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  custom={i + 1}
                  className={`rounded-2xl p-8 border ${item.border} ${item.bg} hover:shadow-md transition-all duration-300 group`}
                >
                  <div className="flex items-center gap-4 mb-5">
                    <div className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className={`font-black text-xl ${item.title}`}>{item.status.status}</p>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${item.badge}`}>{item.badgeLabel}</span>
                    </div>
                  </div>
                  <p className={`text-sm leading-relaxed ${item.desc}`}>{item.status.desc}</p>
                </motion.div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ══════════════════════════════════════
          KEY FEATURES
      ══════════════════════════════════════ */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <Section>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <p className="text-green-600 text-xs font-bold uppercase tracking-widest mb-2">Why LandVerifyCM</p>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">Built to Protect Your Investment</h2>
              <p className="text-gray-500 text-base max-w-lg mx-auto">
                Every feature is designed to give you confidence before making any land transaction.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: '🛡️', title: 'Fraud Detection', desc: 'Automatic duplicate title and GPS overlap detection across the entire registry.' },
                { icon: '📍', title: 'GPS Mapping', desc: 'Interactive map showing the exact location of every registered parcel.' },
                { icon: '📜', title: 'Ownership History', desc: 'Full chain of title from original owner to the current holder, with transfer dates.' },
                { icon: '⚡', title: 'Instant Results', desc: 'Enter a title number and get the verification result in under a second.' },
              ].map((f, i) => (
                <motion.div
                  key={f.title}
                  variants={fadeUp}
                  custom={i}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-green-200 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">{f.icon}</div>
                  <h3 className="font-bold text-gray-900 text-sm mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
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
            <motion.p variants={fadeUp} className="text-green-300 text-xs font-bold uppercase tracking-widest mb-3">
              Get Started
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-black text-white mb-4">
              {t.cta.title}
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-green-100/70 text-base mb-8 max-w-md mx-auto leading-relaxed">
              {t.cta.subtitle}
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-green-800 font-bold rounded-2xl hover:bg-green-50 active:scale-95 transition-all duration-200 shadow-xl text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                {t.cta.register}
              </Link>
              <Link
                to="/search"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/30 text-white font-bold rounded-2xl hover:bg-white/20 active:scale-95 transition-all duration-200 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {t.cta.search}
              </Link>
            </motion.div>
          </Section>
        </div>
      </section>
    </div>
  );
}
