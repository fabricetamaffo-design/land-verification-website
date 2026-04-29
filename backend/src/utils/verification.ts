import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Haversine formula — returns distance in kilometers between two GPS points
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export type VerificationResult = {
  status: 'VALID' | 'SUSPICIOUS' | 'DUPLICATE';
  notes: string | null;
};

export async function computeVerificationStatus(
  titleNumber: string,
  gpsLat: number,
  gpsLng: number,
  excludeId?: string
): Promise<VerificationResult> {
  const activeParcels = await prisma.landParcel.findMany({
    where: { isActive: true, ...(excludeId ? { id: { not: excludeId } } : {}) },
  });

  // DUPLICATE: identical title number already exists
  const titleConflict = activeParcels.find(
    (p) => p.titleNumber.toLowerCase() === titleNumber.toLowerCase()
  );
  if (titleConflict) {
    return {
      status: 'DUPLICATE',
      notes: `Title number already registered under parcel ${titleConflict.titleNumber}.`,
    };
  }

  // DUPLICATE: GPS coordinates within 10 meters of another parcel
  const gpsExact = activeParcels.find((p) => haversineKm(gpsLat, gpsLng, p.gpsLat, p.gpsLng) < 0.01);
  if (gpsExact) {
    return {
      status: 'DUPLICATE',
      notes: `GPS coordinates overlap with existing parcel ${gpsExact.titleNumber}.`,
    };
  }

  // SUSPICIOUS: GPS coordinates within 50 meters of another parcel
  const gpsNear = activeParcels.find((p) => haversineKm(gpsLat, gpsLng, p.gpsLat, p.gpsLng) < 0.05);
  if (gpsNear) {
    return {
      status: 'SUSPICIOUS',
      notes: `Proximity overlap detected with parcel ${gpsNear.titleNumber}. Manual review recommended.`,
    };
  }

  return { status: 'VALID', notes: null };
}
