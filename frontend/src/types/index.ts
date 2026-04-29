export type Role = 'USER' | 'ADMIN';
export type LandStatus = 'VALID' | 'SUSPICIOUS' | 'DUPLICATE';

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
  createdAt: string;
  updatedAt: string;
  documents?: LandDocument[];
  uploadedBy?: { id: string; name: string };
}

export interface SearchResult {
  id: string;
  titleNumber: string;
  ownerName: string;
  quarter: string;
  areaSqm: number;
  status: LandStatus;
  gpsLat: number;
  gpsLng: number;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
