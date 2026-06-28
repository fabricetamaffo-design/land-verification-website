import type { Translations } from '../translations/en';
import type { LandStatus, LandUseType, OwnershipType } from '../shared';

export type AppLanguage = 'en' | 'fr';

export function formatAreaLabel(t: Translations, areaSqm?: number | null) {
  if (typeof areaSqm !== 'number') return t.common.notSpecified;
  return `${Math.round(areaSqm).toLocaleString()} ${t.common.areaUnit}`;
}

export function formatDateLabel(t: Translations, lang: AppLanguage, date?: string | null) {
  if (!date) return t.common.notSpecified;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return t.common.notSpecified;
  return parsed.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function landUseName(t: Translations, value?: string | null) {
  if (!value) return t.common.notSpecified;
  return t.landUse[value as LandUseType] || value;
}

export function ownershipName(t: Translations, value?: string | null) {
  if (!value) return t.common.notSpecified;
  return t.ownership[value as OwnershipType] || value;
}

export function statusName(t: Translations, status: LandStatus, admin = false) {
  if (!admin && status !== 'VALID') return t.status.NOT_VALID;
  return t.status[status];
}

export function notValidReasonLabel(t: Translations, status: LandStatus, notes?: string | null) {
  if (notes) return notes;
  if (status === 'DUPLICATE') return t.land.duplicateReason;
  if (status === 'SUSPICIOUS') return t.land.suspiciousReason;
  return t.land.notValidReason;
}

export function template(text: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (current, [key, value]) => current.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value)),
    text,
  );
}
