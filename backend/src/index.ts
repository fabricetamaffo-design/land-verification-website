import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import authRoutes from './routes/auth.routes';
import landRoutes from './routes/land.routes';
import adminRoutes from './routes/admin.routes';

dotenv.config();

// ── Startup validation ────────────────────────────────────────────────────
const REQUIRED_ENV = ['DATABASE_URL', 'JWT_SECRET'];
const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missing.length > 0) {
  console.error(`[STARTUP ERROR] Missing required environment variables: ${missing.join(', ')}`);
  console.error('Set them in Railway → Variables tab, then redeploy.');
  process.exit(1);
}

// ── Ensure uploads directory exists (Railway ephemeral filesystem) ────────
const uploadsDir = path.join(__dirname, '..', 'uploads');
const uploadsSupportDir = path.join(uploadsDir, 'support');
const uploadsLandsDir = path.join(uploadsDir, 'lands');
[uploadsDir, uploadsSupportDir, uploadsLandsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ── App setup ─────────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

// Support comma-separated FRONTEND_URL for multiple allowed origins
const rawOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const allowedOrigins = Array.from(new Set([
  ...rawOrigins,
  'https://land-verification-website.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
]));

console.log('[CORS] Allowed origins:', allowedOrigins);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    console.warn(`[CORS] Blocked origin: ${origin}`);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(uploadsDir));

app.use('/api/auth', authRoutes);
app.use('/api/lands', landRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Global error handler ──────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[UNHANDLED ERROR]', err.message);
  res.status(500).json({ message: 'Internal server error.' });
});

// Catch unhandled promise rejections so the process doesn't crash
process.on('unhandledRejection', (reason) => {
  console.error('[UNHANDLED REJECTION]', reason);
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  seedAdminIfNeeded();
});

async function seedAdminIfNeeded() {
  const prisma = new PrismaClient();
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@landverify.cm';
    const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!existing) {
      const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@1234';
      const passwordHash = await bcrypt.hash(adminPassword, 12);
      await prisma.user.create({
        data: { name: 'System Administrator', email: adminEmail, passwordHash, role: Role.ADMIN },
      });
      console.log(`[SEED] Admin user created: ${adminEmail}`);
    }
  } catch (e) {
    console.error('[SEED] Failed to seed admin:', e);
  } finally {
    await prisma.$disconnect();
  }
}

export default app;
