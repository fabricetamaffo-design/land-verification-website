import 'express-async-errors';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { Role, LandStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import authRoutes from './routes/auth.routes';
import landRoutes from './routes/land.routes';
import adminRoutes from './routes/admin.routes';
import { prisma } from './lib/prisma';
import { authenticate } from './middleware/auth.middleware';

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

// ── Security headers ──────────────────────────────────────────────────────
app.use(helmet({
  // API-only backend — no need to serve HTML, so keep CSP simple
  contentSecurityPolicy: false,
  // Allow Railway/Vercel cross-origin requests
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// ── Compression ───────────────────────────────────────────────────────────
app.use(compression());

// ── CORS ──────────────────────────────────────────────────────────────────
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

// ── Body parsing with size limits (prevent DoS) ───────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use('/uploads', authenticate as express.RequestHandler, express.static(uploadsDir));

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
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@landverify.cm';
    let admin = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!admin) {
      const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@1234';
      const passwordHash = await bcrypt.hash(adminPassword, 12);
      admin = await prisma.user.create({
        data: { name: 'System Administrator', email: adminEmail, passwordHash, role: Role.ADMIN },
      });
      console.log(`[SEED] Admin user created: ${adminEmail}`);
    }

    const landCount = await prisma.landParcel.count();
    if (landCount === 0) {
      const demoLands = [
        {
          titleNumber: 'TF-001-YAOUNDE', ownerName: 'Jean-Pierre Mbarga', quarter: 'Bastos',
          areaSqm: 500, gpsLat: 3.8697, gpsLng: 11.5212, status: LandStatus.VALID,
          titleApprovedYear: 2018, landUseType: 'RESIDENTIAL', uploadedById: admin.id,
          ownership: [
            { ownerName: 'Famille Mbarga', ownershipType: 'ORIGINAL', fromYear: 1995, toYear: 2010 },
            { ownerName: 'Mbarga Pierre', ownershipType: 'INHERITANCE', fromYear: 2010, toYear: 2018 },
            { ownerName: 'Jean-Pierre Mbarga', ownershipType: 'PURCHASE', fromYear: 2018, toYear: null },
          ],
        },
        {
          titleNumber: 'TF-002-YAOUNDE', ownerName: 'Marie-Claire Ngo Biyik', quarter: 'Nlongkak',
          areaSqm: 300, gpsLat: 3.8741, gpsLng: 11.5176, status: LandStatus.VALID,
          titleApprovedYear: 2021, landUseType: 'COMMERCIAL', uploadedById: admin.id,
          ownership: [
            { ownerName: 'État du Cameroun', ownershipType: 'ORIGINAL', fromYear: 1980, toYear: 2015 },
            { ownerName: 'Ngo Biyik Emile', ownershipType: 'PURCHASE', fromYear: 2015, toYear: 2021 },
            { ownerName: 'Marie-Claire Ngo Biyik', ownershipType: 'INHERITANCE', fromYear: 2021, toYear: null },
          ],
        },
        {
          titleNumber: 'TF-003-YAOUNDE', ownerName: 'Emmanuel Tchio', quarter: 'Melen',
          areaSqm: 750, gpsLat: 3.8612, gpsLng: 11.5098, status: LandStatus.SUSPICIOUS,
          notes: 'Proximity overlap detected with parcel TF-004.',
          titleApprovedYear: 2019, landUseType: 'AGRICULTURAL', uploadedById: admin.id,
          ownership: [
            { ownerName: 'Tchio Mathieu', ownershipType: 'ORIGINAL', fromYear: 2000, toYear: 2019 },
            { ownerName: 'Emmanuel Tchio', ownershipType: 'INHERITANCE', fromYear: 2019, toYear: null },
          ],
        },
        {
          titleNumber: 'TF-004-YAOUNDE', ownerName: 'Paul Ekotto', quarter: 'Melen',
          areaSqm: 400, gpsLat: 3.8618, gpsLng: 11.5102, status: LandStatus.DUPLICATE,
          notes: 'GPS coordinates overlap with TF-003-YAOUNDE.',
          titleApprovedYear: 2020, landUseType: 'RESIDENTIAL', uploadedById: admin.id,
          ownership: [
            { ownerName: 'Paul Ekotto', ownershipType: 'PURCHASE', fromYear: 2020, toYear: null },
          ],
        },
        {
          titleNumber: 'TF-005-DOUALA', ownerName: 'Christelle Fosso', quarter: 'Bonanjo',
          areaSqm: 620, gpsLat: 4.0465, gpsLng: 9.7016, status: LandStatus.VALID,
          titleApprovedYear: 2016, landUseType: 'COMMERCIAL', uploadedById: admin.id,
          ownership: [
            { ownerName: 'Fosso Enterprises SARL', ownershipType: 'ORIGINAL', fromYear: 2005, toYear: 2016 },
            { ownerName: 'Christelle Fosso', ownershipType: 'PURCHASE', fromYear: 2016, toYear: null },
          ],
        },
      ];

      for (const { ownership, ...land } of demoLands) {
        const created = await prisma.landParcel.create({ data: land });
        await prisma.ownershipRecord.createMany({
          data: ownership.map((o) => ({ ...o, landId: created.id })),
        });
      }
      console.log(`[SEED] ${demoLands.length} demo land parcels created`);
    }
  } catch (e) {
    console.error('[SEED] Failed:', e);
  }
}

export default app;
