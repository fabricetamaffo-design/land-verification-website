import api from './api';
import { LandParcel, SearchResult } from '../types';

export async function searchLands(q?: string, quarter?: string) {
  const params: Record<string, string> = {};
  if (q) params.q = q;
  if (quarter) params.quarter = quarter;
  const res = await api.get('/lands/search', { params });
  return res.data as { results: SearchResult[]; count: number };
}

export async function getLandById(id: string) {
  const res = await api.get(`/lands/${id}`);
  return res.data as { land: LandParcel };
}

export async function getQuarters() {
  const res = await api.get('/lands/quarters');
  return res.data as { quarters: string[] };
}

export async function adminGetAllLands() {
  const res = await api.get('/admin/lands');
  return res.data as { lands: LandParcel[] };
}

export async function adminUploadLand(formData: FormData) {
  const res = await api.post('/admin/lands', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function adminUpdateLand(id: string, formData: FormData) {
  const res = await api.put(`/admin/lands/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function adminDeactivateLand(id: string) {
  const res = await api.patch(`/admin/lands/${id}/deactivate`);
  return res.data;
}

export async function adminGetUsers() {
  const res = await api.get('/admin/users');
  return res.data;
}
