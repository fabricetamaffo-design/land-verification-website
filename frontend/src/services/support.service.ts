import api from './api';
import type {
  AdminSupportThreadDetail,
  AdminSupportThreadListItem,
  SupportMessage,
  SupportThread,
  SupportThreadStatus,
} from '../types';

export async function getMySupportMessages(): Promise<{ thread: SupportThread; messages: SupportMessage[] }> {
  const res = await api.get('/support/messages');
  return res.data;
}

export async function getMySupportUnreadCount(): Promise<number> {
  const res = await api.get('/support/unread-count');
  return res.data.unread as number;
}

export async function markMySupportRead(): Promise<void> {
  await api.post('/support/read');
}

export async function sendMySupportMessage(input: { body?: string; attachment?: File | null }): Promise<SupportMessage> {
  const fd = new FormData();
  if (input.body) fd.append('body', input.body);
  if (input.attachment) fd.append('attachment', input.attachment);
  const res = await api.post('/support/messages', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data.supportMessage;
}

export async function adminListSupportThreads(): Promise<AdminSupportThreadListItem[]> {
  const res = await api.get('/admin/support/threads');
  return res.data.threads;
}

export async function adminGetSupportThreadMessages(
  threadId: string
): Promise<{ thread: AdminSupportThreadDetail; messages: SupportMessage[] }> {
  const res = await api.get(`/admin/support/threads/${threadId}/messages`);
  return res.data;
}

export async function adminGetSupportUnreadCount(): Promise<number> {
  const res = await api.get('/admin/support/unread-count');
  return res.data.unread as number;
}

export async function adminMarkThreadRead(threadId: string): Promise<void> {
  await api.post(`/admin/support/threads/${threadId}/read`);
}

export async function adminSendSupportMessage(threadId: string, input: { body?: string; attachment?: File | null; status?: SupportThreadStatus }): Promise<SupportMessage> {
  const fd = new FormData();
  if (input.body) fd.append('body', input.body);
  if (input.status) fd.append('status', input.status);
  if (input.attachment) fd.append('attachment', input.attachment);
  const res = await api.post(`/admin/support/threads/${threadId}/messages`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data.supportMessage;
}
