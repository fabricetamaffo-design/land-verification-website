import type { LandStatus, LandUseType, OwnershipType } from './types';

export const LAND_USE_TYPES: LandUseType[] = [
  'RESIDENTIAL',
  'COMMERCIAL',
  'AGRICULTURAL',
  'MIXED',
  'INDUSTRIAL',
];

export const OWNERSHIP_TYPES: OwnershipType[] = [
  'ORIGINAL',
  'PURCHASE',
  'INHERITANCE',
  'DONATION',
  'COURT_ORDER',
];

export const landUseLabels: Record<LandUseType, string> = {
  RESIDENTIAL: 'Residential',
  COMMERCIAL: 'Commercial',
  AGRICULTURAL: 'Agricultural',
  MIXED: 'Mixed use',
  INDUSTRIAL: 'Industrial',
};

export const ownershipLabels: Record<OwnershipType, string> = {
  ORIGINAL: 'Original title',
  PURCHASE: 'Purchase',
  INHERITANCE: 'Inheritance',
  DONATION: 'Donation',
  COURT_ORDER: 'Court order',
};

export const statusLabels: Record<LandStatus, string> = {
  VALID: 'Valid',
  SUSPICIOUS: 'Suspicious',
  DUPLICATE: 'Duplicate',
};

export function isValidStatus(status: LandStatus) {
  return status === 'VALID';
}

export function publicStatusLabel(status: LandStatus) {
  return isValidStatus(status) ? 'Valid' : 'Not valid';
}

export function notValidReason(status: LandStatus, notes?: string | null) {
  if (status === 'DUPLICATE') return notes || 'Duplicate title or GPS coordinates detected.';
  if (status === 'SUSPICIOUS') return notes || 'Nearby parcel overlap detected. Manual review is recommended.';
  return notes || 'This parcel did not pass verification checks.';
}

export function landUseLabel(value?: string | null) {
  if (!value) return 'Not specified';
  return landUseLabels[value as LandUseType] || value;
}

export function ownershipLabel(value?: string | null) {
  if (!value) return 'Ownership record';
  return ownershipLabels[value as OwnershipType] || value;
}

export function formatArea(areaSqm?: number | null) {
  if (typeof areaSqm !== 'number') return 'Not specified';
  return `${Math.round(areaSqm).toLocaleString()} sqm`;
}

export function formatDate(date?: string | null) {
  if (!date) return 'Not specified';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return 'Not specified';
  return parsed.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function currentYear() {
  return new Date().getFullYear();
}

export function normalizeDocumentName(filePath: string) {
  return filePath.replace(/\\/g, '/').split('/').pop() || filePath;
}
