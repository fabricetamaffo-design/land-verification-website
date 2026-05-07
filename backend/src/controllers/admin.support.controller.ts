import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth.middleware';
import { getSocketServer } from '../utils/socket';

const prisma = new PrismaClient();

const adminSendSchema = z.object({
  body: z.string().trim().min(1).max(5000).optional(),
  status: z.enum(['OPEN', 'CLOSED']).optional(),
});

async function countUnreadForAdminThread(threadId: string, adminLastReadAt: Date) {
  return prisma.supportMessage.count({
    where: {
      threadId,
      createdAt: { gt: adminLastReadAt },
      sender: { role: 'USER' },
    },
  });
}

export async function listSupportThreads(req: AuthRequest, res: Response): Promise<void> {
  try {
    const threads = await prisma.supportThread.findMany({
      orderBy: [{ lastMessageAt: 'desc' }],
      select: {
        id: true,
        userId: true,
        status: true,
        lastMessageAt: true,
        createdAt: true,
        adminLastReadAt: true,
        user: { select: { id: true, name: true, email: true } },
        _count: { select: { messages: true } },
      },
    });

    const withUnread = await Promise.all(
      threads.map(async (thread) => ({
        ...thread,
        unreadCount: await countUnreadForAdminThread(thread.id, thread.adminLastReadAt),
      }))
    );

    res.json({ threads: withUnread });
  } catch {
    res.status(500).json({ message: 'Unable to load support threads.' });
  }
}

export async function getSupportThreadMessages(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const thread = await prisma.supportThread.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        status: true,
        lastMessageAt: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!thread) {
      res.status(404).json({ message: 'Support thread not found.' });
      return;
    }

    const now = new Date();
    await prisma.supportThread.update({
      where: { id },
      data: { adminLastReadAt: now },
    });

    const messages = await prisma.supportMessage.findMany({
      where: { threadId: id },
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

    res.json({ thread, messages });
  } catch {
    res.status(500).json({ message: 'Unable to load support messages.' });
  }
}

export async function adminSendSupportMessage(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const adminId = req.user!.userId;

    const thread = await prisma.supportThread.findUnique({ where: { id } });
    if (!thread) {
      res.status(404).json({ message: 'Support thread not found.' });
      return;
    }

    const parsed = adminSendSchema.safeParse(req.body);
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
        senderId: adminId,
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
      data: {
        lastMessageAt: new Date(),
        adminLastReadAt: new Date(),
        status: parsed.data.status || thread.status,
      },
    });

    const io = getSocketServer();
    io.to(`support_user:${thread.userId}`).emit('support:message', message);
    io.to('support_admins').emit('support:message', message);

    res.status(201).json({ message: 'Reply sent.', supportMessage: message });
  } catch {
    res.status(500).json({ message: 'Unable to send support reply.' });
  }
}

export async function getAdminSupportUnreadCount(req: AuthRequest, res: Response): Promise<void> {
  try {
    const threads = await prisma.supportThread.findMany({
      select: { id: true, adminLastReadAt: true },
    });

    const counts = await Promise.all(
      threads.map((thread) => countUnreadForAdminThread(thread.id, thread.adminLastReadAt))
    );
    const unread = counts.reduce((sum, count) => sum + count, 0);

    res.json({ unread });
  } catch {
    res.status(500).json({ message: 'Unable to load unread support count.' });
  }
}

export async function markAdminThreadRead(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const thread = await prisma.supportThread.findUnique({ where: { id }, select: { id: true } });
    if (!thread) {
      res.status(404).json({ message: 'Support thread not found.' });
      return;
    }

    const now = new Date();
    await prisma.supportThread.update({
      where: { id },
      data: { adminLastReadAt: now },
    });

    res.json({ ok: true, readAt: now.toISOString() });
  } catch {
    res.status(500).json({ message: 'Unable to update read status.' });
  }
}
