import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.routes';
import landRoutes from './routes/land.routes';
import adminRoutes from './routes/admin.routes';
import supportRoutes from './routes/support.routes';
import adminSupportRoutes from './routes/admin.support.routes';
import { setSocketServer } from './utils/socket';
import { verifyToken } from './utils/jwt';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/lands', landRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/admin/support', adminSupportRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
});

io.use((socket, next) => {
  try {
    const token =
      (socket.handshake.auth?.token as string | undefined) ||
      (socket.handshake.headers.authorization?.toString().startsWith('Bearer ')
        ? socket.handshake.headers.authorization!.toString().split(' ')[1]
        : undefined);

    if (!token) return next(new Error('Unauthorized'));

    const payload = verifyToken(token);
    (socket.data as any).user = payload;
    return next();
  } catch {
    return next(new Error('Unauthorized'));
  }
});

io.on('connection', (socket) => {
  const user = (socket.data as any).user as { userId: string; role: string } | undefined;
  if (!user) return;

  socket.join(`support_user:${user.userId}`);
  if (user.role === 'ADMIN') socket.join('support_admins');
});

setSocketServer(io);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
