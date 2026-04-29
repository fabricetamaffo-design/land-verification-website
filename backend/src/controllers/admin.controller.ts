import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth.middleware';
import { computeVerificationStatus } from '../utils/verification';

const prisma = new PrismaClient();

const landSchema = z.object({
  titleNumber: z.string().min(1, 'Title number is required'),
  ownerName: z.string().min(2, 'Owner name is required'),
  quarter: z.string().min(1, 'Quarter is required'),
  areaSqm: z.coerce.number().positive('Area must be positive'),
  gpsLat: z.coerce.number().min(-90).max(90),
  gpsLng: z.coerce.number().min(-180).max(180),
  notes: z.string().optional(),
});

export async function uploadLand(req: AuthRequest, res: Response): Promise<void> {
  const parsed = landSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.errors[0].message });
    return;
  }

  const { titleNumber, ownerName, quarter, areaSqm, gpsLat, gpsLng, notes } = parsed.data;
  const adminId = req.user!.userId;

  const { status, notes: verificationNotes } = await computeVerificationStatus(
    titleNumber,
    gpsLat,
    gpsLng
  );

  if (status === 'DUPLICATE') {
    res.status(409).json({
      message: 'Duplicate detected. This title or location already exists.',
      details: verificationNotes,
    });
    return;
  }

  const files = (req.files as Express.Multer.File[]) || [];

  const land = await prisma.landParcel.create({
    data: {
      titleNumber,
      ownerName,
      quarter,
      areaSqm,
      gpsLat,
      gpsLng,
      status,
      notes: verificationNotes || notes || null,
      uploadedById: adminId,
      documents: {
        create: files.map((f) => ({ fileName: f.originalname, filePath: f.path })),
      },
    },
    include: { documents: true },
  });

  await prisma.auditLog.create({
    data: { landId: land.id, userId: adminId, action: 'CREATE', changes: { titleNumber, ownerName } },
  });

  res.status(201).json({ message: 'Land record uploaded successfully.', land });
}

export async function updateLand(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const adminId = req.user!.userId;

  const existing = await prisma.landParcel.findFirst({ where: { id, isActive: true } });
  if (!existing) {
    res.status(404).json({ message: 'Land parcel not found.' });
    return;
  }

  const parsed = landSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.errors[0].message });
    return;
  }

  const { titleNumber, ownerName, quarter, areaSqm, gpsLat, gpsLng, notes } = parsed.data;

  const { status, notes: verificationNotes } = await computeVerificationStatus(
    titleNumber,
    gpsLat,
    gpsLng,
    id
  );

  const updated = await prisma.landParcel.update({
    where: { id },
    data: {
      titleNumber,
      ownerName,
      quarter,
      areaSqm,
      gpsLat,
      gpsLng,
      status,
      notes: verificationNotes || notes || null,
    },
  });

  await prisma.auditLog.create({
    data: {
      landId: id,
      userId: adminId,
      action: 'UPDATE',
      changes: { before: { titleNumber: existing.titleNumber }, after: { titleNumber } },
    },
  });

  res.json({ message: 'Land record updated successfully.', land: updated });
}

export async function deactivateLand(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const adminId = req.user!.userId;

  const existing = await prisma.landParcel.findFirst({ where: { id, isActive: true } });
  if (!existing) {
    res.status(404).json({ message: 'Land parcel not found or already deactivated.' });
    return;
  }

  await prisma.landParcel.update({ where: { id }, data: { isActive: false } });

  await prisma.auditLog.create({
    data: { landId: id, userId: adminId, action: 'DEACTIVATE', changes: null },
  });

  res.json({ message: 'Land record deactivated successfully.' });
}

export async function getAllLands(req: AuthRequest, res: Response): Promise<void> {
  const lands = await prisma.landParcel.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      uploadedBy: { select: { name: true } },
      _count: { select: { documents: true } },
    },
  });

  res.json({ lands });
}

export async function getAllUsers(req: AuthRequest, res: Response): Promise<void> {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ users });
}

export async function getAuditLogs(req: AuthRequest, res: Response): Promise<void> {
  const { landId } = req.params;
  const logs = await prisma.auditLog.findMany({
    where: { landId },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { timestamp: 'desc' },
  });

  res.json({ logs });
}
