import React from 'react';
import { LandStatus } from '../types';
import { useLang } from '../context/LanguageContext';

const config: Record<LandStatus, { classes: string; dot: string; icon: string }> = {
  VALID: {
    classes: 'bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-300/50',
    dot: 'bg-emerald-500',
    icon: '✓',
  },
  SUSPICIOUS: {
    classes: 'bg-amber-50 text-amber-700 border border-amber-200 ring-1 ring-amber-300/50',
    dot: 'bg-amber-500',
    icon: '!',
  },
  DUPLICATE: {
    classes: 'bg-red-50 text-red-700 border border-red-200 ring-1 ring-red-300/50',
    dot: 'bg-red-500',
    icon: '✕',
  },
};

export default function StatusBadge({ status }: { status: LandStatus }) {
  const { t } = useLang();
  const { classes, dot, icon } = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide ${classes}`}>
      <span className={`h-1.5 w-1.5 rounded-full pulse-dot ${dot}`} />
      <span>{icon}</span>
      {t.status[status]}
    </span>
  );
}
