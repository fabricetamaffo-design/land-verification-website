import type { DocumentPickerAsset } from 'expo-document-picker';
import type { LandParcel, OwnershipDraft } from '../../shared';
import { currentYear } from '../../shared';
import type { Translations } from '../../translations/en';
import { template } from '../../utils/localized';

type AdminTranslations = Translations['admin'];

const fallbackValidation: AdminTranslations['validation'] = {
  titleNumberRequired: 'Title number is required.',
  ownerNameRequired: 'Owner name is required.',
  quarterRequired: 'Quarter is required.',
  areaPositive: 'Area must be positive.',
  latitudeRange: 'Latitude must be between -90 and 90.',
  longitudeRange: 'Longitude must be between -180 and 180.',
  approvedYearRange: 'Approved year must be between 1900 and {year}.',
  ownerNameIndexed: 'Owner {number}: name is required.',
  ownerFromYearIndexed: 'Owner {number}: from year is invalid.',
  ownerToYearIndexed: 'Owner {number}: to year is invalid.',
};

export interface LandFormState {
  titleNumber: string;
  ownerName: string;
  quarter: string;
  areaSqm: string;
  gpsLat: string;
  gpsLng: string;
  notes: string;
  titleApprovedYear: string;
  landUseType: string;
}

export function emptyLandForm(): LandFormState {
  return {
    titleNumber: '',
    ownerName: '',
    quarter: '',
    areaSqm: '',
    gpsLat: '',
    gpsLng: '',
    notes: '',
    titleApprovedYear: '',
    landUseType: 'RESIDENTIAL',
  };
}

export function formFromLand(land: LandParcel): LandFormState {
  return {
    titleNumber: land.titleNumber,
    ownerName: land.ownerName,
    quarter: land.quarter,
    areaSqm: String(land.areaSqm),
    gpsLat: String(land.gpsLat),
    gpsLng: String(land.gpsLng),
    notes: land.notes || '',
    titleApprovedYear: land.titleApprovedYear ? String(land.titleApprovedYear) : '',
    landUseType: land.landUseType || 'RESIDENTIAL',
  };
}

export function emptyOwnershipDraft(type = 'ORIGINAL'): OwnershipDraft {
  return {
    ownerName: '',
    ownershipType: type as OwnershipDraft['ownershipType'],
    fromYear: '',
    toYear: '',
    notes: '',
  };
}

export function validateLandForm(form: LandFormState, adminText?: AdminTranslations) {
  const validation = adminText?.validation || fallbackValidation;
  if (!form.titleNumber.trim()) return validation.titleNumberRequired;
  if (!form.ownerName.trim()) return validation.ownerNameRequired;
  if (!form.quarter.trim()) return validation.quarterRequired;
  if (!Number(form.areaSqm) || Number(form.areaSqm) <= 0) return validation.areaPositive;
  const lat = Number(form.gpsLat);
  const lng = Number(form.gpsLng);
  if (Number.isNaN(lat) || lat < -90 || lat > 90) return validation.latitudeRange;
  if (Number.isNaN(lng) || lng < -180 || lng > 180) return validation.longitudeRange;
  if (form.titleApprovedYear) {
    const year = Number(form.titleApprovedYear);
    if (!Number.isInteger(year) || year < 1900 || year > currentYear()) {
      return template(validation.approvedYearRange, { year: currentYear() });
    }
  }
  return '';
}

export function validateOwnershipDrafts(owners: OwnershipDraft[], adminText?: AdminTranslations) {
  const validation = adminText?.validation || fallbackValidation;
  for (const [index, owner] of owners.entries()) {
    const number = index + 1;
    if (!owner.ownerName.trim()) return template(validation.ownerNameIndexed, { number });
    const from = Number(owner.fromYear);
    if (!Number.isInteger(from) || from < 1900 || from > currentYear()) return template(validation.ownerFromYearIndexed, { number });
    if (owner.toYear) {
      const to = Number(owner.toYear);
      if (!Number.isInteger(to) || to < from || to > currentYear()) return template(validation.ownerToYearIndexed, { number });
    }
  }
  return '';
}

export function landFormData(form: LandFormState, owners?: OwnershipDraft[], documents?: DocumentPickerAsset[]) {
  const formData = new FormData();
  formData.append('titleNumber', form.titleNumber.trim());
  formData.append('ownerName', form.ownerName.trim());
  formData.append('quarter', form.quarter.trim());
  formData.append('areaSqm', form.areaSqm.trim());
  formData.append('gpsLat', form.gpsLat.trim());
  formData.append('gpsLng', form.gpsLng.trim());
  if (form.notes.trim()) formData.append('notes', form.notes.trim());
  if (form.titleApprovedYear.trim()) formData.append('titleApprovedYear', form.titleApprovedYear.trim());
  if (form.landUseType) formData.append('landUseType', form.landUseType);

  if (owners?.length) {
    formData.append('ownershipRecords', JSON.stringify(owners.map((owner) => ({
      ownerName: owner.ownerName.trim(),
      ownershipType: owner.ownershipType,
      fromYear: Number(owner.fromYear),
      toYear: owner.toYear ? Number(owner.toYear) : null,
      notes: owner.notes.trim() || undefined,
    }))));
  }

  documents?.slice(0, 5).forEach((asset) => {
    formData.append('documents', {
      uri: asset.uri,
      name: asset.name,
      type: asset.mimeType || 'application/octet-stream',
    } as unknown as Blob);
  });

  return formData;
}
