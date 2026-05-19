import React from 'react';
import { LandStatus } from '../types';
import { useLang } from '../context/LanguageContext';

export function isValid(status: LandStatus) {
  return status === 'VALID';
}

export function getNotValidReason(status: LandStatus, notes?: string | null): string {
  if (status === 'DUPLICATE') return notes || 'Duplicate title or GPS coordinates detected.';
  if (status === 'SUSPICIOUS') return notes || 'Proximity or data overlap detected with another parcel.';
  return notes || 'This parcel did not pass verification checks.';
}

export default function StatusBadge({
  status,
  notes,
  compact = false,
}: {
  status: LandStatus;
  notes?: string | null;
  compact?: boolean;
}) {
  const { t } = useLang();
  const valid = isValid(status);

  if (valid) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-300/50">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 pulse-dot" />
        <span>✓</span>
        {t.status.VALID}
      </span>
    );
  }

  const reason = getNotValidReason(status, notes);

  return (
    <div className="inline-flex flex-col gap-1">
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-red-50 text-red-700 border border-red-200 ring-1 ring-red-300/50">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        <span>✕</span>
        {t.status.NOT_VALID}
      </span>
      {!compact && reason && (
        <p className="text-[10px] text-red-500 font-medium leading-tight max-w-[200px]">{reason}</p>
      )}
    </div>
  );
}
