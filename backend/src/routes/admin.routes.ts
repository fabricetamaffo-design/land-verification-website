import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';
import {
  uploadLand,
  updateLand,
  deactivateLand,
  getAllLands,
  getAllUsers,
  getAuditLogs,
} from '../controllers/admin.controller';

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', '..', 'uploads'),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['.pdf', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  },
});

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/lands', getAllLands);
router.post('/lands', upload.array('documents', 5), uploadLand);
router.put('/lands/:id', upload.array('documents', 5), updateLand);
router.patch('/lands/:id/deactivate', deactivateLand);
router.get('/users', getAllUsers);
router.get('/lands/:landId/audit', getAuditLogs);

export default router;
