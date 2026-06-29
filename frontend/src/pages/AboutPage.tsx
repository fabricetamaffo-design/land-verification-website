import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useLang } from '../context/LanguageContext';

const features = [
  { icon: '🔍', title: 'Record Search', titleFr: 'Recherche de Dossiers', desc: 'Search saved records by land title number.', descFr: 'Recherchez les dossiers enregistrés par numéro de titre foncier.', gradient: 'from-blue-500 to-indigo-500', bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700' },
  { icon: '🗺️', title: 'GPS Map View', titleFr: 'Carte GPS', desc: 'View a parcel on a map when GPS coordinates are recorded.', descFr: 'Affichez une parcelle sur la carte lorsque ses coordonnées GPS sont enregistrées.', gradient: 'from-green-500 to-emerald-500', bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-700' },
  { icon: '🛡️', title: 'Conflict Checks', titleFr: 'Contrôle des Conflits', desc: 'Flag duplicate title numbers, GPS overlaps, and suspicious record data.', descFr: 'Signalez les titres en double, les chevauchements GPS et les données suspectes.', gradient: 'from-red-500 to-rose-500', bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-700' },
  { icon: '🔐', title: 'Controlled Access', titleFr: 'Accès Contrôlé', desc: 'Use account roles to limit access to private ownership and document details.', descFr: "Utilisez les rôles pour limiter l'accès aux propriétaires et aux documents privés.", gradient: 'from-purple-500 to-violet-500', bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-700' },
  { icon: '📋', title: 'Document Records', titleFr: 'Documents Associés', desc: 'Associate PDF and image documents with a record for administrator review.', descFr: "Associez des documents PDF et images à un dossier pour l'examen administratif.", gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700' },
  { icon: '🌍', title: 'Two Languages', titleFr: 'Deux Langues', desc: 'Use the web interface in English or French.', descFr: "Utilisez l'interface web en anglais ou en français.", gradient: 'from-teal-500 to-cyan-500', bg: 'bg-teal-50', border: 'border-teal-100', text: 'text-teal-700' },
];

const values = [
  { icon: '🔍', label: 'Clarity', labelFr: 'Clarté', gradient: 'from-blue-500 to-indigo-600', desc: 'Present recorded parcel information in a clear format.', descFr: 'Présenter clairement les informations enregistrées sur les parcelles.' },
  { icon: '🛡️', label: 'Privacy', labelFr: 'Confidentialité', gradient: 'from-red-500 to-rose-600', desc: 'Keep sensitive ownership details behind administrator access.', descFr: "Réserver les données sensibles sur les propriétaires à l'accès administrateur." },
  { icon: '⚙️', label: 'Practicality', labelFr: 'Utilité', gradient: 'from-amber-500 to-orange-600', desc: 'Support common checks with search, status, and map tools.', descFr: 'Faciliter les contrôles avec la recherche, le statut et la carte.' },
  { icon: '🤝', label: 'Accessibility', labelFr: 'Accessibilité', gradient: 'from-green-500 to-emerald-600', desc: 'Provide English, French, web, and mobile interfaces.', descFr: 'Proposer des interfaces web et mobile en anglais et en français.' },
];

const stats = [
  { value: '2', label: 'Supported Languages',  labelFr: 'Langues Disponibles' },
  { value: '3', label: 'Team Members',          labelFr: "Membres de l'Équipe" },
  { value: '3', label: 'Verification Statuses', labelFr: 'Statuts de Vérification' },
  { value: '2', label: 'User Interfaces',       labelFr: 'Interfaces Utilisateur' },
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
  const { t, lang } = useLang();

  return (
    <div className="min-h-screen bg-gray-50 pt-16">

      {/* ── HERO ── */}
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
              {t.about.authorityLabel}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-5 leading-tight">
              {t.about.title}
            </h1>
            <p className="text-green-100/80 text-lg max-w-2xl mx-auto leading-relaxed">
              {t.about.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.value}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="text-center p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-green-200 hover:bg-green-50/40 transition-all"
              >
                <p className="text-4xl font-black text-green-700 mb-1">{s.value}</p>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {lang === 'fr' ? s.labelFr : s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <Section>
            <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
              <motion.div variants={fadeUp}>
                <p className="text-green-600 text-xs font-bold uppercase tracking-widest mb-2">{t.about.mission}</p>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-5 leading-tight">
                  {lang === 'fr' ? 'Pourquoi LandVerifyCM ?' : 'Why LandVerifyCM?'}
                </h2>
                <p className="text-gray-500 leading-relaxed text-base mb-6">{t.about.missionText}</p>
                <div className="flex items-start gap-3 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-2xl px-5 py-4">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>{t.about.authorityText}</span>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {values.map((v, i) => (
                  <motion.div
                    key={v.label}
                    variants={fadeUp}
                    custom={i + 1}
                    className="rounded-2xl p-5 text-white overflow-hidden relative"
                  >
                    <div className={`bg-gradient-to-br ${v.gradient} absolute inset-0 rounded-2xl`} />
                    <div className="relative z-10">
                      <div className="text-3xl mb-3">{v.icon}</div>
                      <p className="font-black text-sm mb-1">{lang === 'fr' ? v.labelFr : v.label}</p>
                      <p className="text-white/75 text-xs leading-relaxed">{lang === 'fr' ? v.descFr : v.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Section>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <Section>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <p className="text-green-600 text-xs font-bold uppercase tracking-widest mb-2">
                {lang === 'fr' ? 'Fonctionnalités' : 'Platform Features'}
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
                {lang === 'fr' ? 'Ce que la plateforme offre' : 'What the Platform Offers'}
              </h2>
              <p className="text-gray-500 text-base max-w-lg mx-auto">
                {lang === 'fr'
                  ? 'Ces fonctions aident à consulter les données enregistrées et à repérer les dossiers qui nécessitent une vérification supplémentaire.'
                  : 'These features help users review saved data and identify records that need further checking.'}
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
                  <div className={`w-12 h-12 bg-gradient-to-br ${f.gradient} rounded-xl flex items-center justify-center text-2xl mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    {f.icon}
                  </div>
                  <h3 className={`font-black text-base mb-2 ${f.text}`}>{lang === 'fr' ? f.titleFr : f.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{lang === 'fr' ? f.descFr : f.desc}</p>
                </motion.div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <Section>
            <motion.div variants={fadeUp}>
              <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-2">
                {lang === 'fr' ? 'Construit avec' : 'Built With'}
              </p>
              <h3 className="text-white font-black text-3xl mb-3">
                {lang === 'fr' ? 'Notre Technologie' : 'Our Technology'}
              </h3>
              <p className="text-gray-400 text-sm mb-10 max-w-md mx-auto">
                {lang === 'fr'
                  ? 'Les principales technologies utilisées pour construire le site, l’API et la base de données.'
                  : 'The main technologies used to build the website, API, and database.'}
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

      {/* ── CONTACT & LEGAL ── */}
      <section className="py-16 px-4 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <Section>
            <motion.div variants={fadeUp} className="text-center mb-12">
              <p className="text-green-600 text-xs font-bold uppercase tracking-widest mb-2">{t.about.contactTitle}</p>
              <h2 className="text-3xl font-black text-gray-900">
                {lang === 'fr' ? 'Nous Contacter' : 'Get in Touch'}
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
              <motion.div variants={fadeUp} custom={0} className="rounded-2xl p-6 border-2 border-green-200 bg-green-50">
                <div className="w-11 h-11 bg-green-500 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-1">Email</p>
                <p className="font-bold text-gray-900 text-sm mb-1">{t.about.contactEmail}</p>
                <p className="text-xs text-gray-500">{t.about.contactHours}</p>
              </motion.div>

              <motion.div variants={fadeUp} custom={1} className="rounded-2xl p-6 border-2 border-blue-200 bg-blue-50">
                <div className="w-11 h-11 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">
                  {lang === 'fr' ? 'Téléphone' : 'Phone'}
                </p>
                <p className="font-bold text-gray-900 text-sm mb-1">{t.about.contactPhone}</p>
                <p className="text-xs text-gray-500">{t.about.contactAddress}</p>
              </motion.div>

              <motion.div variants={fadeUp} custom={2} className="rounded-2xl p-6 border-2 border-purple-200 bg-purple-50">
                <div className="w-11 h-11 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-purple-600 mb-1">{t.about.legalTitle}</p>
                <p className="text-xs text-gray-700 leading-relaxed mb-2">{t.about.licensedBy}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{t.about.dataProtection}</p>
              </motion.div>
            </div>
          </Section>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '28px 28px' }}
        />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <Section>
            <motion.p variants={fadeUp} className="text-green-300 text-xs font-bold uppercase tracking-widest mb-3">
              {t.cta.getStarted}
            </motion.p>
            <motion.h3 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-black text-white mb-4">
              {t.about.ctaTitle}
            </motion.h3>
            <motion.p variants={fadeUp} custom={2} className="text-green-100/70 text-base mb-8 max-w-md mx-auto">
              {t.about.ctaSubtitle}
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/search"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-green-800 font-bold rounded-2xl hover:bg-green-50 active:scale-95 transition-all duration-200 shadow-xl text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {t.about.ctaSearch}
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/30 text-white font-bold rounded-2xl hover:bg-white/20 active:scale-95 transition-all duration-200 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                {t.about.ctaRegister}
              </Link>
            </motion.div>
          </Section>
        </div>
      </section>
    </div>
  );
}
