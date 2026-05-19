export type Role = 'USER' | 'ADMIN';
export type LandStatus = 'VALID' | 'SUSPICIOUS' | 'DUPLICATE';
export type LandUseType = 'RESIDENTIAL' | 'COMMERCIAL' | 'AGRICULTURAL' | 'MIXED' | 'INDUSTRIAL';
export type OwnershipType = 'ORIGINAL' | 'PURCHASE' | 'INHERITANCE' | 'DONATION' | 'COURT_ORDER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface LandDocument {
  id: string;
  fileName: string;
  filePath: string;
  uploadedAt: string;
}

export interface OwnershipRecord {
  id: string;
  ownerName: string;
  ownershipType: OwnershipType;
  fromYear: number;
  toYear: number | null;
  notes: string | null;
}

export interface LandParcel {
  id: string;
  titleNumber: string;
  ownerName: string;
  quarter: string;
  areaSqm: number;
  gpsLat: number;
  gpsLng: number;
  status: LandStatus;
  notes: string | null;
  isActive: boolean;
  titleApprovedYear: number | null;
  landUseType: string;
  createdAt: string;
  updatedAt: string;
  documents?: LandDocument[];
  uploadedBy?: { id: string; name: string };
  ownershipHistory?: OwnershipRecord[];
}

export interface SearchResult {
  id: string;
  titleNumber: string;
  ownerName: string;
  quarter: string;
  areaSqm: number;
  status: LandStatus;
  notes: string | null;
  gpsLat: number;
  gpsLng: number;
  titleApprovedYear: number | null;
  landUseType: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
