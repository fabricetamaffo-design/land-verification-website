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
      titleApprovedYear: 2018,
      landUseType: 'RESIDENTIAL',
      uploadedById: admin.id,
      ownership: [
        { ownerName: 'Famille Mbarga', ownershipType: 'ORIGINAL', fromYear: 1995, toYear: 2010 },
        { ownerName: 'Mbarga Pierre', ownershipType: 'INHERITANCE', fromYear: 2010, toYear: 2018 },
        { ownerName: 'Jean-Pierre Mbarga', ownershipType: 'PURCHASE', fromYear: 2018, toYear: null },
      ],
    },
    {
      titleNumber: 'TF-002-YAOUNDE',
      ownerName: 'Marie-Claire Ngo Biyik',
      quarter: 'Nlongkak',
      areaSqm: 300,
      gpsLat: 3.8741,
      gpsLng: 11.5176,
      status: LandStatus.VALID,
      titleApprovedYear: 2021,
      landUseType: 'COMMERCIAL',
      uploadedById: admin.id,
      ownership: [
        { ownerName: 'État du Cameroun', ownershipType: 'ORIGINAL', fromYear: 1980, toYear: 2015 },
        { ownerName: 'Ngo Biyik Emile', ownershipType: 'PURCHASE', fromYear: 2015, toYear: 2021 },
        { ownerName: 'Marie-Claire Ngo Biyik', ownershipType: 'INHERITANCE', fromYear: 2021, toYear: null },
      ],
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
      titleApprovedYear: 2019,
      landUseType: 'AGRICULTURAL',
      uploadedById: admin.id,
      ownership: [
        { ownerName: 'Tchio Mathieu', ownershipType: 'ORIGINAL', fromYear: 2000, toYear: 2019 },
        { ownerName: 'Emmanuel Tchio', ownershipType: 'INHERITANCE', fromYear: 2019, toYear: null },
      ],
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
      titleApprovedYear: 2020,
      landUseType: 'RESIDENTIAL',
      uploadedById: admin.id,
      ownership: [
        { ownerName: 'Paul Ekotto', ownershipType: 'PURCHASE', fromYear: 2020, toYear: null },
      ],
    },
    {
      titleNumber: 'TF-005-DOUALA',
      ownerName: 'Christelle Fosso',
      quarter: 'Bonanjo',
      areaSqm: 620,
      gpsLat: 4.0465,
      gpsLng: 9.7016,
      status: LandStatus.VALID,
      titleApprovedYear: 2016,
      landUseType: 'COMMERCIAL',
      uploadedById: admin.id,
      ownership: [
        { ownerName: 'Fosso Enterprises SARL', ownershipType: 'ORIGINAL', fromYear: 2005, toYear: 2016 },
        { ownerName: 'Christelle Fosso', ownershipType: 'PURCHASE', fromYear: 2016, toYear: null },
      ],
    },
  ];

  for (const { ownership, ...land } of demoLands) {
    const created = await prisma.landParcel.upsert({
      where: { titleNumber: land.titleNumber },
      update: {},
      create: land,
    });

    for (const record of ownership) {
      const existing = await prisma.ownershipRecord.findFirst({
        where: { landId: created.id, ownerName: record.ownerName, fromYear: record.fromYear },
      });
      if (!existing) {
        await prisma.ownershipRecord.create({ data: { ...record, landId: created.id } });
      }
    }
  }

  console.log('Seed complete. Admin: admin@landverify.cm / Admin@1234');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
