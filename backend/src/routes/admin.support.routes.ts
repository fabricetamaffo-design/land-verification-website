import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';
import {
  listSupportThreads,
  getSupportThreadMessages,
  adminSendSupportMessage,
  getAdminSupportUnreadCount,
  markAdminThreadRead,
} from '../controllers/admin.support.controller';

const router = Router();

router.use(authenticate, requireAdmin);

const supportUploadDir = path.join(__dirname, '..', '..', 'uploads', 'support');
fs.mkdirSync(supportUploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: supportUploadDir,
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 7 * 1024 * 1024 }, // 7MB
});

router.get('/threads', listSupportThreads);
router.get('/threads/:id/messages', getSupportThreadMessages);
router.get('/unread-count', getAdminSupportUnreadCount);
router.post('/threads/:id/read', markAdminThreadRead);
router.post('/threads/:id/messages', upload.single('attachment'), adminSendSupportMessage);

export default router;
