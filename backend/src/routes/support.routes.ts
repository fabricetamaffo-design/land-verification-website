import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate } from '../middleware/auth.middleware';
import {
  getMySupportThread,
  getMySupportMessages,
  sendMySupportMessage,
  getMySupportUnreadCount,
  markMySupportRead,
} from '../controllers/support.controller';

const router = Router();

router.use(authenticate);

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

router.get('/thread', getMySupportThread);
router.get('/messages', getMySupportMessages);
router.get('/unread-count', getMySupportUnreadCount);
router.post('/read', markMySupportRead);
router.post('/messages', upload.single('attachment'), sendMySupportMessage);

export default router;
