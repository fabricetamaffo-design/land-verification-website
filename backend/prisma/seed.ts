import { PrismaClient, Role, LandStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('Admin@1234', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@landverify.cm' },
    update: {},
    create: {
      name: 'System Administrator',
      email: 'admin@landverify.cm',
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  });

  const demoLands = [
    {
      titleNumber: 'TF-001-YAOUNDE',
      ownerName: 'Jean-Pierre Mbarga',
      quarter: 'Bastos',
      areaSqm: 500,
      gpsLat: 3.8697,
      gpsLng: 11.5212,
      status: LandStatus.VALID,
      uploadedById: admin.id,
    },
    {
      titleNumber: 'TF-002-YAOUNDE',
      ownerName: 'Marie-Claire Ngo Biyik',
      quarter: 'Nlongkak',
      areaSqm: 300,
      gpsLat: 3.8741,
      gpsLng: 11.5176,
      status: LandStatus.VALID,
      uploadedById: admin.id,
    },
    {
      titleNumber: 'TF-003-YAOUNDE',
      ownerName: 'Emmanuel Tchio',
      quarter: 'Melen',
      areaSqm: 750,
      gpsLat: 3.8612,
      gpsLng: 11.5098,
      status: LandStatus.SUSPICIOUS,
      notes: 'Proximity overlap detected with parcel TF-004.',
      uploadedById: admin.id,
    },
    {
      titleNumber: 'TF-004-YAOUNDE',
      ownerName: 'Paul Ekotto',
      quarter: 'Melen',
      areaSqm: 400,
      gpsLat: 3.8618,
      gpsLng: 11.5102,
      status: LandStatus.DUPLICATE,
      notes: 'GPS coordinates overlap with TF-003-YAOUNDE.',
      uploadedById: admin.id,
    },
    {
      titleNumber: 'TF-005-DOUALA',
      ownerName: 'Christelle Fosso',
      quarter: 'Bonanjo',
      areaSqm: 620,
      gpsLat: 4.0465,
      gpsLng: 9.7016,
      status: LandStatus.VALID,
      uploadedById: admin.id,
    },
  ];

  for (const land of demoLands) {
    await prisma.landParcel.upsert({
      where: { titleNumber: land.titleNumber },
      update: {},
      create: land,
    });
  }

  console.log('Seed complete. Admin: admin@landverify.cm / Admin@1234');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
