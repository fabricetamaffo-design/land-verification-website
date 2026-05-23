import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export async function searchLands(req: Request, res: Response): Promise<void> {
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

  res.json({ results: lands, count: total, page, limit, totalPages: Math.ceil(total / limit) });
}

export async function getLandById(req: Request, res: Response): Promise<void> {
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

  res.json({ land });
}

export async function browseLands(req: Request, res: Response): Promise<void> {
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

  res.json({ results: lands, count: total, page, limit, totalPages: Math.ceil(total / limit) });
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
