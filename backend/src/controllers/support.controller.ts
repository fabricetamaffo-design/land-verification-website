import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth.middleware';
import { getSocketServer } from '../utils/socket';

const prisma = new PrismaClient();

const sendMessageSchema = z.object({
  body: z.string().trim().min(1).max(5000).optional(),
});

async function getOrCreateThreadForUser(userId: string) {
  const existing = await prisma.supportThread.findUnique({ where: { userId } });
  if (existing) return existing;
  return prisma.supportThread.create({ data: { userId } });
}

export async function getMySupportThread(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const thread = await getOrCreateThreadForUser(userId);
    res.json({ thread });
  } catch {
    res.status(500).json({ message: 'Unable to load support thread.' });
  }
}

export async function getMySupportMessages(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const thread = await getOrCreateThreadForUser(userId);
    const now = new Date();

    await prisma.supportThread.update({
      where: { id: thread.id },
      data: { userLastReadAt: now },
    });

    const messages = await prisma.supportMessage.findMany({
      where: { threadId: thread.id },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        body: true,
        createdAt: true,
        senderId: true,
        attachmentName: true,
        attachmentPath: true,
        attachmentMime: true,
        sender: { select: { id: true, name: true, role: true } },
      },
    });

    res.json({ thread: { ...thread, userLastReadAt: now }, messages });
  } catch {
    res.status(500).json({ message: 'Unable to load support messages.' });
  }
}

export async function sendMySupportMessage(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const thread = await getOrCreateThreadForUser(userId);

    const parsed = sendMessageSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Invalid message.' });
      return;
    }

    const file = req.file as Express.Multer.File | undefined;
    const body = parsed.data.body;

    if (!body && !file) {
      res.status(400).json({ message: 'Message text or an attachment is required.' });
      return;
    }

    const message = await prisma.supportMessage.create({
      data: {
        threadId: thread.id,
        senderId: userId,
        body: body || null,
        attachmentName: file?.originalname || null,
        attachmentPath: file ? `support/${file.filename}` : null,
        attachmentMime: file?.mimetype || null,
      },
      select: {
        id: true,
        body: true,
        createdAt: true,
        senderId: true,
        attachmentName: true,
        attachmentPath: true,
        attachmentMime: true,
        sender: { select: { id: true, name: true, role: true } },
        thread: { select: { id: true, userId: true } },
      },
    });

    await prisma.supportThread.update({
      where: { id: thread.id },
      data: { lastMessageAt: new Date(), status: 'OPEN', userLastReadAt: new Date() },
    });

    const io = getSocketServer();
    io.to(`support_user:${thread.userId}`).emit('support:message', message);
    io.to('support_admins').emit('support:message', message);

    res.status(201).json({ message: 'Message sent.', supportMessage: message });
  } catch {
    res.status(500).json({ message: 'Unable to send support message.' });
  }
}

export async function getMySupportUnreadCount(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const thread = await getOrCreateThreadForUser(userId);

    const unread = await prisma.supportMessage.count({
      where: {
        threadId: thread.id,
        createdAt: { gt: thread.userLastReadAt },
        sender: { role: 'ADMIN' },
      },
    });

    res.json({ unread });
  } catch {
    res.status(500).json({ message: 'Unable to load unread support messages.' });
  }
}

export async function markMySupportRead(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const thread = await getOrCreateThreadForUser(userId);
    const now = new Date();

    await prisma.supportThread.update({
      where: { id: thread.id },
      data: { userLastReadAt: now },
    });

    res.json({ ok: true, readAt: now.toISOString() });
  } catch {
    res.status(500).json({ message: 'Unable to update read status.' });
  }
}
