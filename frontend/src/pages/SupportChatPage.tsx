import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import type { SupportMessage } from '../types';
import { getMySupportMessages, markMySupportRead, sendMySupportMessage } from '../services/support.service';
import { connectSupportSocket } from '../services/support.socket';

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

export default function SupportChatPage() {
  const { token, user } = useAuth();
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const socket = useMemo(() => {
    if (!token) return null;
    return connectSupportSocket(token);
  }, [token]);

  useEffect(() => {
    getMySupportMessages()
      .then((data) => {
        setThreadId(data.thread.id);
        setMessages(data.messages);
        notifyUnreadChanged();
      })
      .catch((err) => {
        const serverMessage = err?.response?.data?.message;
        toast.error(serverMessage || 'Unable to load support chat.');
      })
      .finally(() => setLoading(false));

    markMySupportRead().catch(() => {});
  }, []);

  useEffect(() => {
    if (!socket) return;
    const onMsg = (msg: SupportMessage) => {
      if (msg.thread?.id && threadId && msg.thread.id !== threadId) return;
      setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
      notifyUnreadChanged();
    };
    socket.on('support:message', onMsg);
    return () => {
      socket.off('support:message', onMsg);
      socket.disconnect();
    };
  }, [socket, threadId]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages.length, loading]);

  const submit = async () => {
    if (!text.trim() && !file) return;
    setSending(true);
    try {
      const created = await sendMySupportMessage({ body: text.trim() || undefined, attachment: file });
      setMessages((prev) => (prev.some((m) => m.id === created.id) ? prev : [...prev, created]));
      setText('');
      setFile(null);
      notifyUnreadChanged();
    } catch {
      toast.error('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white px-8 py-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-2">Customer Support</p>
                  <h1 className="text-2xl font-black tracking-tight">Chat with our admins</h1>
                  <p className="text-gray-300 text-sm mt-1">Share screenshots, documents, and questions. We reply here.</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Signed in as</p>
                  <p className="text-sm font-semibold text-white">{user?.name}</p>
                </div>
              </div>
            </div>

            <div className="px-6 sm:px-8 py-5 border-b border-gray-100 bg-gray-50/60">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-100">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Live updates
                  </span>
                  {threadId && <span className="hidden sm:inline text-gray-400">Thread: {threadId.slice(0, 8)}…</span>}
                </div>
                <div className="text-xs text-gray-400">Max 7MB per attachment</div>
              </div>
            </div>

            <div ref={listRef} className="h-[56vh] overflow-y-auto px-4 sm:px-8 py-6 bg-white">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="relative w-10 h-10">
                    <div className="absolute inset-0 rounded-full border-4 border-green-100" />
                    <div className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
                  </div>
                  <p className="text-gray-400 text-sm">Loading chat…</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8L3 20l1.4-3.5A7.77 7.77 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-gray-900 font-bold">Start a conversation</h3>
                  <p className="text-gray-400 text-sm mt-1">Send your first message and an admin will respond.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((m) => {
                    const mine = m.senderId === user?.id;
                    const url = attachmentUrl(m.attachmentPath);
                    return (
                      <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 border shadow-sm ${mine ? 'bg-green-600 text-white border-green-600' : 'bg-gray-50 text-gray-900 border-gray-100'}`}>
                          <div className="flex items-center justify-between gap-3 mb-1">
                            <p className={`text-xs font-semibold ${mine ? 'text-white/90' : 'text-gray-500'}`}>
                              {mine ? 'You' : (m.sender?.role === 'ADMIN' ? 'Admin' : (m.sender?.name || 'User'))}
                            </p>
                            <p className={`text-[10px] ${mine ? 'text-white/80' : 'text-gray-400'}`}>
                              {new Date(m.createdAt).toLocaleString()}
                            </p>
                          </div>
                          {m.body && <p className={`text-sm leading-relaxed ${mine ? 'text-white' : 'text-gray-800'}`}>{m.body}</p>}
                          {url && (
                            <div className="mt-3">
                              {isImage(m.attachmentMime) ? (
                                <a href={url} target="_blank" rel="noreferrer" className="block">
                                  <img src={url} alt={m.attachmentName || 'attachment'} className={`max-h-64 w-auto rounded-xl border ${mine ? 'border-white/20' : 'border-gray-200'}`} />
                                </a>
                              ) : (
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border transition-colors ${mine ? 'bg-white/10 border-white/20 hover:bg-white/15' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                                >
                                  <svg className={`w-4 h-4 ${mine ? 'text-white/90' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      placeholder="Type your message…"
                      rows={2}
                      className="w-full resize-none outline-none text-sm text-gray-800 placeholder:text-gray-400"
                      disabled={sending}
                    />
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <label className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 cursor-pointer hover:text-gray-800">
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => setFile(e.target.files?.[0] || null)}
                          disabled={sending}
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
                    onClick={submit}
                    disabled={sending || (!text.trim() && !file)}
                    className="btn-primary px-5 py-3 rounded-2xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? 'Sending…' : 'Send'}
                  </button>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-gray-400">
                Never share passwords or sensitive data in chat. For file issues, attach screenshots.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
