import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useInView, Variants } from 'framer-motion';
import { useLang } from '../context/LanguageContext';

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.12, type: 'tween' },
  }),
};

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
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
      {/* ─── HERO ─── */}
      <section className="hero-gradient dot-pattern min-h-screen flex items-center relative overflow-hidden pt-16">
        {/* Glow blobs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-green-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10 py-24">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-green-200 text-sm font-medium mb-8"
          >
            <div className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
            <span>{t.hero.badge}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white leading-tight mb-2 drop-shadow-lg"
          >
            {t.hero.title}
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl md:text-7xl font-black leading-tight mb-8"
            style={{ color: '#fbbf24', textShadow: '0 2px 20px rgba(251,191,36,0.4)' }}
          >
            {t.hero.titleHighlight}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="text-green-100/80 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            {t.hero.subtitle}
          </motion.p>

          {/* Search bar */}
          <motion.form
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-8"
          >
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.hero.searchPlaceholder}
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 text-sm focus:outline-none focus:ring-4 focus:ring-green-400/30 shadow-xl bg-white/95 backdrop-blur placeholder:text-gray-400"
              />
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary px-8 py-4 rounded-2xl text-sm whitespace-nowrap"
            >
              {t.hero.searchBtn}
            </motion.button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-3"
          >
            <Link
              to="/browse"
              className="text-green-200 hover:text-white text-sm font-medium underline underline-offset-4 transition-colors"
            >
              {t.hero.browseBtn}
            </Link>
            <span className="text-green-600 text-xs">·</span>
            <Link
              to="/register"
              className="text-green-200 hover:text-white text-sm font-medium underline underline-offset-4 transition-colors"
            >
              {t.nav.register}
            </Link>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/40 text-xs gap-2"
        >
          <span>{t.hero.scrollHint}</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── STATS ─── */}
      <section className="bg-white border-b border-gray-100 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <Section className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { target: 500, suffix: '+', label: t.stats.parcels, icon: '🏘️' },
              { target: 2, suffix: '', label: t.stats.statuses, icon: '✅' },
              { target: 99, suffix: '%', label: t.stats.uptime, icon: '⚡' },
              { target: 120, suffix: '+', label: t.stats.users, icon: '👥' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                variants={fadeUp}
                custom={i}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100/60"
              >
                <div className="text-3xl mb-2">{s.icon}</div>
                <p className="text-4xl font-black text-green-700 mb-1">
                  <AnimatedCounter target={s.target} suffix={s.suffix} />
                </p>
                <p className="text-gray-500 text-sm font-medium">{s.label}</p>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <Section>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <span className="text-green-600 text-sm font-semibold uppercase tracking-widest">Process</span>
              <h2 className="text-4xl font-black text-gray-900 mt-2 mb-4">{t.howItWorks.title}</h2>
              <p className="text-gray-500 max-w-xl mx-auto">{t.howItWorks.subtitle}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connector line */}
              <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-transparent via-green-300 to-transparent" />

              {t.howItWorks.steps.map((item, i) => (
                <motion.div
                  key={item.step}
                  variants={fadeUp}
                  custom={i}
                  className="relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-green-200 transition-all duration-300 group"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-400 rounded-2xl flex items-center justify-center text-white font-black text-xl mb-6 shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform duration-300">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-3">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ─── STATUS GUIDE ─── */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <Section>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <span className="text-green-600 text-sm font-semibold uppercase tracking-widest">Verification</span>
              <h2 className="text-4xl font-black text-gray-900 mt-2 mb-4">{t.statusGuide.title}</h2>
              <p className="text-gray-500 max-w-xl mx-auto">{t.statusGuide.subtitle}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {[
                { status: t.statusGuide.statuses[0], icon: '✓', from: 'from-emerald-500', to: 'to-green-600', bg: 'from-emerald-50 to-green-50', border: 'border-emerald-200', text: 'text-emerald-700' },
                { status: t.statusGuide.statuses[1], icon: '✕', from: 'from-red-500', to: 'to-rose-600', bg: 'from-red-50 to-rose-50', border: 'border-red-200', text: 'text-red-700' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  custom={i}
                  className={`rounded-2xl p-8 border ${item.border} bg-gradient-to-br ${item.bg} hover:shadow-lg transition-all duration-300 group`}
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${item.from} ${item.to} rounded-2xl flex items-center justify-center text-white font-black text-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  <p className={`font-black text-2xl mb-3 ${item.text}`}>{item.status.status}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.status.desc}</p>
                </motion.div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 px-4 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <Section>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black text-white mb-5">
              {t.cta.title}
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-green-100/80 text-lg mb-10 max-w-xl mx-auto">
              {t.cta.subtitle}
            </motion.p>
            <motion.div variants={fadeUp} custom={2} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-800 font-bold rounded-2xl hover:bg-green-50 transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
              >
                {t.cta.register}
              </Link>
              <Link
                to="/search"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/40 text-white font-bold rounded-2xl hover:bg-white/10 transition-all duration-200"
              >
                {t.cta.search}
              </Link>
            </motion.div>
          </Section>
        </div>
      </section>
    </div>
  );
}
