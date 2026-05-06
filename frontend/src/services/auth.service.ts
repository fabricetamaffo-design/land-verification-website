import api from './api';
import { User } from '../types';

export async function registerUser(data: { name: string; email: string; password: string }) {
  const res = await api.post('/auth/register', data);
  return res.data as { message: string; user: User };
}

export async function loginUser(data: { email: string; password: string }) {
  const res = await api.post('/auth/login', data);
  return res.data as { token: string; user: User };
}

export async function forgotPassword(email: string) {
  const res = await api.post('/auth/forgot-password', { email });
  return res.data as { message: string; resetUrl: string };
}

export async function resetPassword(token: string, password: string) {
  const res = await api.post('/auth/reset-password', { token, password });
  return res.data as { message: string };
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const res = await api.post('/auth/change-password', { currentPassword, newPassword });
  return res.data as { message: string };
}
