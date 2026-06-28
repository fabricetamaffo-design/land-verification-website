import type { AdminUser, AuditLog, LandParcel, PaginatedResponse, SearchResult, User } from '../shared';
import { Platform } from 'react-native';

const DEFAULT_BACKEND_URL = 'https://land-verification-website-production.up.railway.app';

let authToken: string | null = null;

type ApiErrorCode =
  | 'AUTH_INVALID_CREDENTIALS'
  | 'AUTH_USER_NOT_FOUND'
  | 'AUTH_SESSION_EXPIRED'
  | 'FORBIDDEN'
  | 'INVALID_RESPONSE'
  | 'NETWORK_ERROR'
  | 'NOT_FOUND'
  | 'RATE_LIMITED'
  | 'REQUEST_FAILED'
  | 'SERVER_ERROR';

export class ApiError extends Error {
  status: number;
  details?: string;
  code: ApiErrorCode;

  constructor(message: string, status: number, details?: string, code: ApiErrorCode = 'REQUEST_FAILED') {
    super(message);
    this.status = status;
    this.details = details;
    this.code = code;
  }
}

function normalizeBackendUrl(raw?: string) {
  let url = (raw || DEFAULT_BACKEND_URL).trim().replace(/\/$/, '');
  if (url && !url.startsWith('http')) url = `https://${url}`;
  return url;
}

export const backendUrl = Platform.OS === 'web'
  ? normalizeBackendUrl(process.env.EXPO_PUBLIC_API_URL || '')
  : normalizeBackendUrl(process.env.EXPO_PUBLIC_API_URL);
export const apiBaseUrl = Platform.OS === 'web' && !process.env.EXPO_PUBLIC_API_URL
  ? '/api'
  : `${backendUrl}/api`;

export function setApiToken(token: string | null) {
  authToken = token;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function looksLikeJson(text: string) {
  const trimmed = text.trim();
  return trimmed.startsWith('{') || trimmed.startsWith('[');
}

function looksLikeHtml(text: string) {
  return /<!doctype html|<html[\s>]/i.test(text);
}

function extractBackendMessage(data: unknown) {
  if (!isRecord(data)) return undefined;
  const message = data.message || data.error;
  return typeof message === 'string' ? message : undefined;
}

function extractBackendDetails(data: unknown) {
  if (!isRecord(data)) return undefined;
  const details = data.details;
  return typeof details === 'string' ? details : undefined;
}

function loginPath(path: string) {
  return path === '/auth/login' || path.endsWith('/auth/login');
}

function friendlyStatusMessage(status: number, path: string, backendMessage?: string): { message: string; code: ApiErrorCode } {
  const normalized = (backendMessage || '').toLowerCase();

  if (normalized.includes('user not found')) {
    return { message: 'User not found', code: 'AUTH_USER_NOT_FOUND' };
  }

  if (loginPath(path) && (status === 400 || status === 401 || normalized.includes('invalid credentials'))) {
    return { message: 'Wrong credentials', code: 'AUTH_INVALID_CREDENTIALS' };
  }

  if (status === 401) {
    return { message: 'Your session has expired. Please log in again.', code: 'AUTH_SESSION_EXPIRED' };
  }

  if (status === 403) {
    return { message: 'You do not have permission to do this.', code: 'FORBIDDEN' };
  }

  if (status === 404) {
    return { message: backendMessage || 'This record could not be found.', code: 'NOT_FOUND' };
  }

  if (status === 429) {
    return { message: 'Too many attempts. Please wait and try again.', code: 'RATE_LIMITED' };
  }

  if (status >= 500) {
    return { message: 'The server is having trouble. Please try again shortly.', code: 'SERVER_ERROR' };
  }

  return { message: backendMessage || 'We could not complete that request. Please try again.', code: 'REQUEST_FAILED' };
}

function invalidResponseError(status: number) {
  return new ApiError(
    'We could not load this information. Please try again.',
    status,
    undefined,
    'INVALID_RESPONSE',
  );
}

async function parseResponse<T>(response: Response, path: string): Promise<T> {
  const text = await response.text();
  const contentType = response.headers.get('content-type') || '';
  const shouldParseJson = !text || contentType.includes('application/json') || looksLikeJson(text);
  let data: unknown = {};

  if (!shouldParseJson || looksLikeHtml(text)) {
    throw invalidResponseError(response.status);
  }

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw invalidResponseError(response.status);
    }
  }

  if (!response.ok) {
    const backendMessage = extractBackendMessage(data);
    const friendly = friendlyStatusMessage(response.status, path, backendMessage);
    throw new ApiError(friendly.message, response.status, extractBackendDetails(data), friendly.code);
  }

  return data as T;
}

async function request<T>(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  if (authToken) headers.set('Authorization', `Bearer ${authToken}`);
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    const response = await fetch(`${apiBaseUrl}${path}`, { ...init, headers });
    return await parseResponse<T>(response, path);
  } catch (error) {
    if (error instanceof ApiError) throw error;

    throw new ApiError(
      'Could not connect to the server. Check your connection and try again.',
      0,
      undefined,
      'NETWORK_ERROR',
    );
  }
}

export function getFriendlyErrorMessage(error: unknown, fallback = 'Please try again.') {
  if (error instanceof ApiError) return error.message;
  if (!(error instanceof Error)) return fallback;

  const message = error.message.trim();
  const technical =
    !message ||
    /unexpected token|json parse|syntaxerror|doctype|<html|network request failed|failed to fetch/i.test(message);

  return technical ? fallback : message;
}

export function uploadPathToUrl(filePath: string) {
  const fileName = filePath.replace(/\\/g, '/').split('/').pop();
  if (Platform.OS === 'web' && !process.env.EXPO_PUBLIC_API_URL) {
    return `/uploads/${encodeURIComponent(fileName || filePath)}`;
  }
  return `${backendUrl}/uploads/${encodeURIComponent(fileName || filePath)}`;
}

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    request<{ message: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  login: (data: { email: string; password: string }) =>
    request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  forgotPassword: (email: string) =>
    request<{ message: string; resetUrl?: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  resetPassword: (token: string, password: string) =>
    request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),
  changePassword: (currentPassword: string, newPassword: string) =>
    request<{ message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
};

export const landApi = {
  search: (q: string, page = 1, limit = 20) =>
    request<{ results: SearchResult[] } & PaginatedResponse>(
      `/lands/search?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`,
    ),
  browse: (quarter?: string, page = 1, limit = 20) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (quarter) params.set('quarter', quarter);
    return request<{ results: SearchResult[] } & PaginatedResponse>(`/lands/browse?${params.toString()}`);
  },
  quarters: () => request<{ quarters: string[] }>('/lands/quarters'),
  detail: (id: string) => request<{ land: LandParcel }>(`/lands/${id}`),
};

export const adminApi = {
  lands: (page = 1, limit = 100) =>
    request<{ lands: LandParcel[] } & PaginatedResponse>(`/admin/lands?page=${page}&limit=${limit}`),
  users: (page = 1, limit = 100) =>
    request<{ users: AdminUser[] } & PaginatedResponse>(`/admin/users?page=${page}&limit=${limit}`),
  uploadLand: (formData: FormData) =>
    request<{ message: string; land: LandParcel }>('/admin/lands', {
      method: 'POST',
      body: formData,
    }),
  updateLand: (id: string, formData: FormData) =>
    request<{ message: string; land: LandParcel }>(`/admin/lands/${id}`, {
      method: 'PUT',
      body: formData,
    }),
  deactivateLand: (id: string) =>
    request<{ message: string }>(`/admin/lands/${id}/deactivate`, {
      method: 'PATCH',
    }),
  auditLogs: (landId: string) => request<{ logs: AuditLog[] }>(`/admin/lands/${landId}/audit`),
  addOwnership: (
    landId: string,
    data: { ownerName: string; ownershipType: string; fromYear: number; toYear: number | null; notes?: string },
  ) =>
    request<{ message: string }>(`/admin/lands/${landId}/ownership`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteOwnership: (recordId: string) =>
    request<{ message: string }>(`/admin/ownership/${recordId}`, {
      method: 'DELETE',
    }),
};

export function getAuthHeaders(): Record<string, string> {
  return authToken ? { Authorization: `Bearer ${authToken}` } : {};
}
