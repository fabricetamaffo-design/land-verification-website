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
