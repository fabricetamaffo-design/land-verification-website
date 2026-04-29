import React from 'react';
import { LandStatus } from '../types';

const config: Record<LandStatus, { label: string; classes: string }> = {
  VALID:      { label: 'Valid',      classes: 'bg-green-100 text-green-800 border border-green-300' },
  SUSPICIOUS: { label: 'Suspicious', classes: 'bg-orange-100 text-orange-800 border border-orange-300' },
  DUPLICATE:  { label: 'Duplicate',  classes: 'bg-red-100 text-red-800 border border-red-300' },
};

export default function StatusBadge({ status }: { status: LandStatus }) {
  const { label, classes } = config[status];
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${classes}`}>
      <span className="mr-1.5 h-2 w-2 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
}
