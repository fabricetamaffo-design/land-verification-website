import { io, Socket } from 'socket.io-client';

function getBackendUrl() {
  const envUrl = import.meta.env.VITE_BACKEND_URL;
  return envUrl || 'http://localhost:5000';
}

export function connectSupportSocket(token: string): Socket {
  return io(getBackendUrl(), {
    transports: ['websocket', 'polling'],
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });
}
