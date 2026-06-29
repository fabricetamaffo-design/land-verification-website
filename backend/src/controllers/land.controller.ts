import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

const PROTECTED_VALUE = 'Protected';

function isAdmin(req: AuthRequest): boolean {
  return req.user?.role === 'ADMIN';
}

function publicStatus<T extends string>(status: T): T {
  // Public clients only need a valid/not-valid result. Normalizing every
  // non-valid state prevents duplicate/suspicious internals from leaking.
  return (status === 'VALID' ? 'VALID' : 'SUSPICIOUS') as T;
}

function redactSearchResult<T extends {
  titleNumber: string;
  ownerName: string;
  status: string;
  notes: string | null;
  gpsLat: number;
  gpsLng: number;
}>(land: T): T {
  return {
    ...land,
    ownerName: PROTECTED_VALUE,
    status: publicStatus(land.status),
    notes: null,
  };
}

function redactLandDetail<T extends {
  titleNumber: string;
  ownerName: string;
  status: string;
  notes: string | null;
  gpsLat: number;
  gpsLng: number;
  documents: unknown[];
  uploadedBy: unknown;
  ownershipHistory: Array<{
    ownerName: string;
    notes: string | null;
  }>;
}>(land: T) {
  const { uploadedBy: _uploadedBy, ...publicLand } = land;
  return {
    ...publicLand,
    ownerName: PROTECTED_VALUE,
    status: publicStatus(land.status),
    notes: null,
    documents: [],
    ownershipHistory: land.ownershipHistory,
  };
}

export async function searchLands(req: AuthRequest, res: Response): Promise<void> {
  const { q } = req.query as { q?: string };

  if (!q || q.trim().length < 2) {
    res.json({ results: [], count: 0, page: 1, limit: 20, totalPages: 0 });
    return;
  }

  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const skip = (page - 1) * limit;

  const where = {
    isActive: true,
    titleNumber: { contains: q.trim(), mode: 'insensitive' as const },
  };

  const [lands, total] = await Promise.all([
    prisma.landParcel.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        titleNumber: true,
        ownerName: true,
        quarter: true,
        areaSqm: true,
        status: true,
        notes: true,
        gpsLat: true,
        gpsLng: true,
        titleApprovedYear: true,
        landUseType: true,
        createdAt: true,
      },
    }),
    prisma.landParcel.count({ where }),
  ]);

  const results = isAdmin(req) ? lands : lands.map(redactSearchResult);
  res.json({ results, count: total, page, limit, totalPages: Math.ceil(total / limit) });
}

export async function getLandById(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;

  const land = await prisma.landParcel.findFirst({
    where: { id, isActive: true },
    include: {
      documents: { select: { id: true, fileName: true, filePath: true, uploadedAt: true } },
      uploadedBy: { select: { id: true, name: true } },
      ownershipHistory: {
        orderBy: { fromYear: 'asc' },
        select: { id: true, ownerName: true, ownershipType: true, fromYear: true, toYear: true, notes: true },
      },
    },
  });

  if (!land) {
    res.status(404).json({ message: 'Land parcel not found.' });
    return;
  }

  res.json({ land: isAdmin(req) ? land : redactLandDetail(land) });
}

export async function browseLands(req: AuthRequest, res: Response): Promise<void> {
  const { quarter } = req.query as { quarter?: string };

  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const skip = (page - 1) * limit;

  const where = {
    isActive: true,
    ...(quarter ? { quarter: { equals: quarter, mode: 'insensitive' as const } } : {}),
  };

  const [lands, total] = await Promise.all([
    prisma.landParcel.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        titleNumber: true,
        ownerName: true,
        quarter: true,
        areaSqm: true,
        status: true,
        notes: true,
        gpsLat: true,
        gpsLng: true,
        titleApprovedYear: true,
        landUseType: true,
        createdAt: true,
      },
    }),
    prisma.landParcel.count({ where }),
  ]);

  const results = isAdmin(req) ? lands : lands.map(redactSearchResult);
  res.json({ results, count: total, page, limit, totalPages: Math.ceil(total / limit) });
}

export async function getQuarters(req: Request, res: Response): Promise<void> {
  const quarters = await prisma.landParcel.findMany({
    where: { isActive: true },
    select: { quarter: true },
    distinct: ['quarter'],
    orderBy: { quarter: 'asc' },
  });

  res.json({ quarters: quarters.map((q) => q.quarter) });
}
