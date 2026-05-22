import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
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

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
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

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
