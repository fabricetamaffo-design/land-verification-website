import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function searchLands(req: Request, res: Response): Promise<void> {
  const { q } = req.query as { q?: string };

  if (!q || q.trim().length < 2) {
    res.json({ results: [], count: 0 });
    return;
  }

  const lands = await prisma.landParcel.findMany({
    where: {
      isActive: true,
      titleNumber: { contains: q.trim(), mode: 'insensitive' },
    },
    orderBy: { createdAt: 'desc' },
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

  const lands = await prisma.landParcel.findMany({
    where: {
      isActive: true,
      ...(quarter ? { quarter: { equals: quarter, mode: 'insensitive' } } : {}),
    },
    orderBy: { createdAt: 'desc' },
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
  });

  res.json({ results: lands, count: lands.length });
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
