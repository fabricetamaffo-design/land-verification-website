import { io, Socket } from 'socket.io-client';

function getBackendUrl() {
  const envUrl = import.meta.env.VITE_BACKEND_URL;
  return envUrl || 'http://localhost:5000';
}

export function connectSupportSocket(token: string): Socket {
  return io(getBackendUrl(), {
    transports: ['websocket'],
    auth: { token },
  });
}
