import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function searchLands(req: Request, res: Response): Promise<void> {
  const { q, quarter } = req.query as { q?: string; quarter?: string };

  const where: Record<string, unknown> = { isActive: true };

  if (quarter) {
    where.quarter = { equals: quarter, mode: 'insensitive' };
  }

  if (q) {
    where.OR = [
      { titleNumber: { contains: q, mode: 'insensitive' } },
      { ownerName: { contains: q, mode: 'insensitive' } },
      { id: { contains: q, mode: 'insensitive' } },
    ];
  }

  const lands = await prisma.landParcel.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      titleNumber: true,
      ownerName: true,
      quarter: true,
      areaSqm: true,
      status: true,
      gpsLat: true,
      gpsLng: true,
      createdAt: true,
    },
  });

  res.json({ results: lands, count: lands.length });
}

export async function getLandById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const land = await prisma.landParcel.findFirst({
    where: { id, isActive: true },
    include: {
      documents: { select: { id: true, fileName: true, filePath: true, uploadedAt: true } },
      uploadedBy: { select: { id: true, name: true } },
    },
  });

  if (!land) {
    res.status(404).json({ message: 'Land parcel not found.' });
    return;
  }

  res.json({ land });
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
