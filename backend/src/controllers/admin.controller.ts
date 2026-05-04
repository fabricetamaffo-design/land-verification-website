import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth.middleware';
import { computeVerificationStatus } from '../utils/verification';

const prisma = new PrismaClient();

const LAND_USE_TYPES = ['RESIDENTIAL', 'COMMERCIAL', 'AGRICULTURAL', 'MIXED', 'INDUSTRIAL'] as const;

const landSchema = z.object({
  titleNumber: z.string().min(1, 'Title number is required'),
  ownerName: z.string().min(2, 'Owner name is required'),
  quarter: z.string().min(1, 'Quarter is required'),
  areaSqm: z.coerce.number().positive('Area must be positive'),
  gpsLat: z.coerce.number().min(-90).max(90),
  gpsLng: z.coerce.number().min(-180).max(180),
  notes: z.string().optional(),
  titleApprovedYear: z.coerce.number().int().min(1900).max(new Date().getFullYear()).optional(),
  landUseType: z.enum(LAND_USE_TYPES).optional(),
});

const ownershipSchema = z.object({
  ownerName: z.string().min(2, 'Owner name is required'),
  ownershipType: z.enum(['ORIGINAL', 'PURCHASE', 'INHERITANCE', 'DONATION', 'COURT_ORDER']),
  fromYear: z.coerce.number().int().min(1900).max(new Date().getFullYear()),
  toYear: z.coerce.number().int().min(1900).max(new Date().getFullYear()).optional().nullable(),
  notes: z.string().optional(),
});

export async function uploadLand(req: AuthRequest, res: Response): Promise<void> {
  const parsed = landSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.errors[0].message });
    return;
  }

  const { titleNumber, ownerName, quarter, areaSqm, gpsLat, gpsLng, notes, titleApprovedYear, landUseType } = parsed.data;
  const adminId = req.user!.userId;

  const { status, notes: verificationNotes } = await computeVerificationStatus(titleNumber, gpsLat, gpsLng);

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
      titleApprovedYear: titleApprovedYear || null,
      landUseType: landUseType || 'RESIDENTIAL',
      uploadedById: adminId,
      documents: {
        create: files.map((f) => ({ fileName: f.originalname, filePath: f.path })),
      },
      ownershipHistory: {
        create: [{
          ownerName,
          ownershipType: 'ORIGINAL',
          fromYear: titleApprovedYear || new Date().getFullYear(),
          toYear: null,
        }],
      },
    },
    include: { documents: true, ownershipHistory: true },
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

  const { titleNumber, ownerName, quarter, areaSqm, gpsLat, gpsLng, notes, titleApprovedYear, landUseType } = parsed.data;
  const { status, notes: verificationNotes } = await computeVerificationStatus(titleNumber, gpsLat, gpsLng, id);

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
      titleApprovedYear: titleApprovedYear || null,
      landUseType: landUseType || existing.landUseType,
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
    data: { landId: id, userId: adminId, action: 'DEACTIVATE', changes: {} },
  });

  res.json({ message: 'Land record deactivated successfully.' });
}

export async function getAllLands(req: AuthRequest, res: Response): Promise<void> {
  const lands = await prisma.landParcel.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      uploadedBy: { select: { name: true } },
      _count: { select: { documents: true, ownershipHistory: true } },
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

export async function addOwnershipRecord(req: AuthRequest, res: Response): Promise<void> {
  const { landId } = req.params;

  const land = await prisma.landParcel.findFirst({ where: { id: landId, isActive: true } });
  if (!land) {
    res.status(404).json({ message: 'Land parcel not found.' });
    return;
  }

  const parsed = ownershipSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.errors[0].message });
    return;
  }

  // Close out the previous current owner if they have no toYear
  const currentOwner = await prisma.ownershipRecord.findFirst({
    where: { landId, toYear: null },
    orderBy: { fromYear: 'desc' },
  });

  if (currentOwner && parsed.data.ownershipType !== 'ORIGINAL') {
    await prisma.ownershipRecord.update({
      where: { id: currentOwner.id },
      data: { toYear: parsed.data.fromYear - 1 },
    });

    await prisma.landParcel.update({
      where: { id: landId },
      data: { ownerName: parsed.data.ownerName },
    });
  }

  const record = await prisma.ownershipRecord.create({
    data: { ...parsed.data, landId },
  });

  await prisma.auditLog.create({
    data: {
      landId,
      userId: req.user!.userId,
      action: 'OWNERSHIP_TRANSFER',
      changes: { newOwner: parsed.data.ownerName, type: parsed.data.ownershipType },
    },
  });

  res.status(201).json({ message: 'Ownership record added.', record });
}

export async function deleteOwnershipRecord(req: AuthRequest, res: Response): Promise<void> {
  const { recordId } = req.params;
  await prisma.ownershipRecord.delete({ where: { id: recordId } });
  res.json({ message: 'Ownership record deleted.' });
}
