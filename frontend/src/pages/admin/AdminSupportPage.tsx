import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import type { AdminSupportThreadDetail, AdminSupportThreadListItem, SupportMessage, SupportThreadStatus } from '../../types';
import { adminGetSupportThreadMessages, adminListSupportThreads, adminMarkThreadRead, adminSendSupportMessage } from '../../services/support.service';
import { connectSupportSocket } from '../../services/support.socket';

function isImage(mime: string | null | undefined) {
  return !!mime && mime.startsWith('image/');
}

function attachmentUrl(path: string | null | undefined) {
  if (!path) return null;
  const backendBase = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '') || '';
  return `${backendBase}/uploads/${path}`;
}

function notifyUnreadChanged() {
  window.dispatchEvent(new Event('support-unread-changed'));
}

export default function AdminSupportPage() {
  const { token } = useAuth();
  const [threads, setThreads] = useState<AdminSupportThreadListItem[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [activeThread, setActiveThread] = useState<AdminSupportThreadDetail | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<SupportThreadStatus>('OPEN');
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const socket = useMemo(() => {
    if (!token) return null;
    return connectSupportSocket(token);
  }, [token]);

  const refreshThreads = () =>
    adminListSupportThreads()
      .then((t) => {
        setThreads(t);
        notifyUnreadChanged();
      })
      .catch((err) => {
        const serverMessage = err?.response?.data?.message;
        toast.error(serverMessage || 'Unable to load support threads.');
      })
      .finally(() => setLoadingThreads(false));

  useEffect(() => {
    refreshThreads();
  }, []);

  useEffect(() => {
    if (!activeThreadId) return;
    setLoadingMessages(true);
    adminGetSupportThreadMessages(activeThreadId)
      .then((data) => {
        setActiveThread(data.thread);
        setMessages(data.messages);
        setStatus(data.thread.status);
        setThreads((prev) =>
          prev.map((thread) => (thread.id === activeThreadId ? { ...thread, unreadCount: 0 } : thread))
        );
        notifyUnreadChanged();
      })
      .catch((err) => {
        const serverMessage = err?.response?.data?.message;
        toast.error(serverMessage || 'Unable to load messages.');
      })
      .finally(() => setLoadingMessages(false));

    adminMarkThreadRead(activeThreadId).catch(() => {});
  }, [activeThreadId]);

  // Disconnect only when the component fully unmounts
  useEffect(() => {
    return () => { socket?.disconnect(); };
  }, [socket]);

  // Re-register message handler when activeThreadId changes — but never disconnect here
  useEffect(() => {
    if (!socket) return;
    const onMsg = (msg: SupportMessage) => {
      const msgThreadId = msg.thread?.id;
      if (!msgThreadId) return;
      setThreads((prev) => {
        const exists = prev.some((t) => t.id === msgThreadId);
        if (!exists) return prev;
        return prev
          .map((t) => {
            if (t.id !== msgThreadId) return t;
            const isUserMessage = msg.sender?.role === 'USER';
            const isActive = activeThreadId === msgThreadId;
            const unreadCount = isUserMessage && !isActive ? (t.unreadCount || 0) + 1 : 0;
            return { ...t, lastMessageAt: msg.createdAt, unreadCount };
          })
          .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
      });

      if (activeThreadId && msgThreadId === activeThreadId) {
        setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
      }
      notifyUnreadChanged();
    };
    socket.on('support:message', onMsg);
    return () => { socket.off('support:message', onMsg); };
  }, [socket, activeThreadId]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages.length, loadingMessages]);

  const send = async () => {
    if (!activeThreadId) return;
    if (!text.trim() && !file) return;
    setSending(true);
    try {
      const created = await adminSendSupportMessage(activeThreadId, { body: text.trim() || undefined, attachment: file, status });
      setMessages((prev) => (prev.some((m) => m.id === created.id) ? prev : [...prev, created]));
      setThreads((prev) =>
        prev
          .map((thread) =>
            thread.id === activeThreadId
              ? { ...thread, lastMessageAt: created.createdAt, unreadCount: 0 }
              : thread
          )
          .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
      );
      setText('');
      setFile(null);
      notifyUnreadChanged();
      refreshThreads();
    } catch {
      toast.error('Failed to send reply.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <div className="flex flex-col lg:flex-row gap-5">
            {/* Sidebar */}
            <div className="lg:w-[360px]">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                  <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-2">Admin Support</p>
                  <h1 className="text-xl font-black tracking-tight">Inbox</h1>
                  <p className="text-gray-300 text-sm mt-1">Open a thread to reply.</p>
                </div>

                <div className="px-4 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center justify-between">
                  <p className="text-xs text-gray-500">{loadingThreads ? 'Loading…' : `${threads.length} thread(s)`}</p>
                  <button onClick={refreshThreads} className="text-xs font-semibold text-green-600 hover:text-green-500">Refresh</button>
                </div>

                <div className="max-h-[65vh] overflow-y-auto p-2">
                  {loadingThreads ? (
                    <div className="flex items-center justify-center py-10">
                      <div className="relative w-8 h-8">
                        <div className="absolute inset-0 rounded-full border-4 border-green-100" />
                        <div className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
                      </div>
                    </div>
                  ) : threads.length === 0 ? (
                    <div className="p-6 text-center text-sm text-gray-400">No support threads yet.</div>
                  ) : (
                    <div className="space-y-1">
                      {threads.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setActiveThreadId(t.id)}
                          className={`w-full text-left p-4 rounded-2xl border transition-all ${
                            activeThreadId === t.id ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-gray-900 truncate">{t.user?.name || 'User'}</p>
                              <p className="text-xs text-gray-400 truncate">{t.user?.email}</p>
                            </div>
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                              t.status === 'OPEN' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-gray-50 border-gray-200 text-gray-600'
                            }`}>
                              {t.status}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400">
                            <span>{t._count?.messages || 0} msg(s)</span>
                            <div className="flex items-center gap-2">
                              {t.unreadCount > 0 && (
                                <span className="inline-flex min-w-5 h-5 px-1.5 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
                                  {t.unreadCount > 99 ? '99+' : t.unreadCount}
                                </span>
                              )}
                              <span>{new Date(t.lastMessageAt).toLocaleString()}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Chat */}
            <div className="flex-1">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Conversation</p>
                    <p className="text-sm font-bold text-gray-900">{activeThread?.user?.name ? `${activeThread.user.name} (${activeThread.user.email})` : 'Select a thread'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-500 font-semibold">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as SupportThreadStatus)}
                      disabled={!activeThreadId}
                      className="text-xs font-semibold bg-white border border-gray-200 rounded-xl px-3 py-2 outline-none disabled:opacity-60"
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </div>
                </div>

                <div ref={listRef} className="h-[56vh] overflow-y-auto px-4 sm:px-8 py-6 bg-white">
                  {!activeThreadId ? (
                    <div className="py-16 text-center">
                      <div className="mx-auto w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
                        <svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h6m-6 4h10M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-gray-900 font-bold">Choose a thread</h3>
                      <p className="text-gray-400 text-sm mt-1">Pick a user on the left to view messages.</p>
                    </div>
                  ) : loadingMessages ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                      <div className="relative w-10 h-10">
                        <div className="absolute inset-0 rounded-full border-4 border-green-100" />
                        <div className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
                      </div>
                      <p className="text-gray-400 text-sm">Loading messages…</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="py-12 text-center text-sm text-gray-400">No messages yet.</div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((m) => {
                        const mine = m.sender?.role === 'ADMIN';
                        const url = attachmentUrl(m.attachmentPath);
                        return (
                          <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 border shadow-sm ${
                              mine ? 'bg-gray-900 text-white border-gray-900' : 'bg-gray-50 text-gray-900 border-gray-100'
                            }`}>
                              <div className="flex items-center justify-between gap-3 mb-1">
                                <p className={`text-xs font-semibold ${mine ? 'text-white/90' : 'text-gray-500'}`}>
                                  {mine ? 'Admin' : (m.sender?.name || 'User')}
                                </p>
                                <p className={`text-[10px] ${mine ? 'text-white/70' : 'text-gray-400'}`}>
                                  {new Date(m.createdAt).toLocaleString()}
                                </p>
                              </div>
                              {m.body && <p className={`text-sm leading-relaxed ${mine ? 'text-white' : 'text-gray-800'}`}>{m.body}</p>}
                              {url && (
                                <div className="mt-3">
                                  {isImage(m.attachmentMime) ? (
                                    <a href={url} target="_blank" rel="noreferrer" className="block">
                                      <img src={url} alt={m.attachmentName || 'attachment'} className={`max-h-64 w-auto rounded-xl border ${mine ? 'border-white/15' : 'border-gray-200'}`} />
                                    </a>
                                  ) : (
                                    <a
                                      href={url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border transition-colors ${
                                        mine ? 'bg-white/10 border-white/15 hover:bg-white/15' : 'bg-white border-gray-200 hover:bg-gray-50'
                                      }`}
                                    >
                                      <svg className={`w-4 h-4 ${mine ? 'text-white/85' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l3-3m-3 3l-3-3M4 20h16" />
                                      </svg>
                                      <span className={`${mine ? 'text-white/90' : 'text-gray-700'}`}>{m.attachmentName || 'Download file'}</span>
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="px-4 sm:px-8 py-5 border-t border-gray-100 bg-gray-50">
                  <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm">
                    <div className="flex items-end gap-3">
                      <div className="flex-1">
                        <textarea
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          placeholder={activeThreadId ? 'Write a reply…' : 'Select a thread to reply'}
                          rows={2}
                          className="w-full resize-none outline-none text-sm text-gray-800 placeholder:text-gray-400"
                          disabled={sending || !activeThreadId}
                        />
                        <div className="mt-2 flex items-center justify-between gap-3">
                          <label className={`inline-flex items-center gap-2 text-xs font-semibold cursor-pointer ${activeThreadId ? 'text-gray-600 hover:text-gray-800' : 'text-gray-300 cursor-not-allowed'}`}>
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => setFile(e.target.files?.[0] || null)}
                              disabled={sending || !activeThreadId}
                            />
                            <span className="w-9 h-9 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center">
                              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 9.828a4 4 0 00-5.656-5.656L5.757 10.757a6 6 0 108.486 8.486L20.5 13" />
                              </svg>
                            </span>
                            <span className="hidden sm:inline">{file ? file.name : 'Attach file'}</span>
                          </label>
                          <p className="text-[11px] text-gray-400">{file ? 'Ready to upload' : 'Images & documents supported'}</p>
                        </div>
                      </div>

                      <button
                        onClick={send}
                        disabled={sending || !activeThreadId || (!text.trim() && !file)}
                        className="btn-primary px-5 py-3 rounded-2xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {sending ? 'Sending…' : 'Send'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
