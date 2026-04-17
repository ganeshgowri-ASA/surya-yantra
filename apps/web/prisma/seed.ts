import { PrismaClient, ModuleTechnology, MuxDestination } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌞 Seeding Surya Yantra database...');

  const org = await prisma.organization.upsert({
    where: { labCode: 'SPL-001' },
    update: {},
    create: {
      name: 'Srishti PV Lab',
      labCode: 'SPL-001',
      address: 'Jamnagar, Gujarat, India',
      accredBody: 'NABL (under application)',
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@srishti-pv.in' },
    update: {},
    create: {
      name: 'Lab Administrator',
      email: 'admin@srishti-pv.in',
      role: 'ADMIN',
      orgId: org.id,
    },
  });

  const testBed = await prisma.testBed.upsert({
    where: { id: 'testbed-alpha' },
    update: {},
    create: {
      id: 'testbed-alpha',
      name: 'TestBed-Alpha',
      orgId: org.id,
      totalSlots: 75,
      rows: 15,
      cols: 5,
      latitude: 22.47,
      longitude: 70.06,
      altitude: 20.0,
      tiltAngle: 20.0,
      azimuthDeg: 180.0,
      locationDesc: 'Srishti PV Lab rooftop — south-facing',
    },
  });

  // Initialize 75 MUX slots to IDLE
  await Promise.all(
    Array.from({ length: 75 }, (_, i) =>
      prisma.muxSlotState.upsert({
        where: { testBedId_slotNumber: { testBedId: testBed.id, slotNumber: i + 1 } },
        update: {},
        create: {
          testBedId: testBed.id,
          slotNumber: i + 1,
          destination: MuxDestination.IDLE,
        },
      }),
    ),
  );

  // Manufacturers
  const firstSolar = await prisma.manufacturer.upsert({
    where: { name: 'First Solar' },
    update: {},
    create: { name: 'First Solar', country: 'USA', website: 'https://firstsolar.com' },
  });
  const longi = await prisma.manufacturer.upsert({
    where: { name: 'LONGi Solar' },
    update: {},
    create: { name: 'LONGi Solar', country: 'China', website: 'https://longi.com' },
  });
  const rec = await prisma.manufacturer.upsert({
    where: { name: 'REC Group' },
    update: {},
    create: { name: 'REC Group', country: 'Norway', website: 'https://recgroup.com' },
  });
  const jinko = await prisma.manufacturer.upsert({
    where: { name: 'JinkoSolar' },
    update: {},
    create: { name: 'JinkoSolar', country: 'China', website: 'https://jinkosolar.com' },
  });
  const trina = await prisma.manufacturer.upsert({
    where: { name: 'Trina Solar' },
    update: {},
    create: { name: 'Trina Solar', country: 'China', website: 'https://trinasolar.com' },
  });

  // Module types — nameplate per IEC 61215
  const moduleTypes = [
    {
      manufacturerId: firstSolar.id,
      modelName: 'Series 7 CdTe 550',
      technology: ModuleTechnology.THIN_FILM_CDTE,
      pmpSTC: 550,
      vocSTC: 218.0,
      iscSTC: 3.28,
      vmppSTC: 180.0,
      imppSTC: 3.06,
      ffSTC: 0.77,
      etaSTC: 19.4,
      areaMm2: 2.84e6,
      alphaPct: 0.04,
      betaPct: -0.28,
      gammaPct: -0.32,
      rs: 1.9,
      kappa: 0.00112,
      arCoeff: 0.17,
      lengthMm: 2384,
      widthMm: 1192,
      thicknessMm: 6.5,
      weightKg: 38.0,
      cellsSeries: 264,
      cellsParallel: 1,
      maxSystemVoltage: 1500,
      maxCurrent: 5.1,
    },
    {
      manufacturerId: longi.id,
      modelName: 'Hi-MO X6 HPBC 620W',
      technology: ModuleTechnology.HPBC,
      pmpSTC: 620,
      vocSTC: 41.8,
      iscSTC: 18.9,
      vmppSTC: 34.9,
      imppSTC: 17.77,
      ffSTC: 0.785,
      etaSTC: 22.8,
      areaMm2: 2.72e6,
      alphaPct: 0.045,
      betaPct: -0.25,
      gammaPct: -0.29,
      rs: 0.32,
      kappa: 0.00098,
      arCoeff: 0.16,
      lengthMm: 2278,
      widthMm: 1134,
      thicknessMm: 35,
      weightKg: 27.5,
      cellsSeries: 60,
      cellsParallel: 1,
      maxSystemVoltage: 1500,
      maxCurrent: 30,
    },
    {
      manufacturerId: rec.id,
      modelName: 'Alpha Pure-R HJT 430W',
      technology: ModuleTechnology.HJT,
      pmpSTC: 430,
      vocSTC: 45.7,
      iscSTC: 11.75,
      vmppSTC: 38.4,
      imppSTC: 11.2,
      ffSTC: 0.80,
      etaSTC: 22.3,
      areaMm2: 1.93e6,
      alphaPct: 0.04,
      betaPct: -0.24,
      gammaPct: -0.26,
      rs: 0.28,
      kappa: 0.00092,
      arCoeff: 0.16,
      lengthMm: 1730,
      widthMm: 1118,
      thicknessMm: 30,
      weightKg: 19.5,
      cellsSeries: 108,
      cellsParallel: 1,
      maxSystemVoltage: 1000,
      maxCurrent: 20,
    },
    {
      manufacturerId: jinko.id,
      modelName: 'Tiger Neo TOPCon 610W',
      technology: ModuleTechnology.TOPCon,
      pmpSTC: 610,
      vocSTC: 41.2,
      iscSTC: 18.6,
      vmppSTC: 34.3,
      imppSTC: 17.79,
      ffSTC: 0.796,
      etaSTC: 22.5,
      areaMm2: 2.71e6,
      alphaPct: 0.046,
      betaPct: -0.25,
      gammaPct: -0.30,
      rs: 0.31,
      kappa: 0.00100,
      arCoeff: 0.16,
      bifaciality: 0.80,
      lengthMm: 2278,
      widthMm: 1134,
      thicknessMm: 30,
      weightKg: 32.0,
      cellsSeries: 66,
      cellsParallel: 1,
      maxSystemVoltage: 1500,
      maxCurrent: 30,
    },
    {
      manufacturerId: trina.id,
      modelName: 'Vertex N IBC 695W',
      technology: ModuleTechnology.IBC,
      pmpSTC: 695,
      vocSTC: 46.2,
      iscSTC: 18.9,
      vmppSTC: 38.7,
      imppSTC: 17.96,
      ffSTC: 0.796,
      etaSTC: 22.8,
      areaMm2: 3.05e6,
      alphaPct: 0.04,
      betaPct: -0.24,
      gammaPct: -0.26,
      rs: 0.27,
      kappa: 0.00094,
      arCoeff: 0.16,
      lengthMm: 2384,
      widthMm: 1303,
      thicknessMm: 33,
      weightKg: 34.0,
      cellsSeries: 66,
      cellsParallel: 1,
      maxSystemVoltage: 1500,
      maxCurrent: 30,
    },
  ];

  for (const mt of moduleTypes) {
    await prisma.moduleType.upsert({
      where: { manufacturerId_modelName: { manufacturerId: mt.manufacturerId, modelName: mt.modelName } },
      update: {},
      create: mt,
    });
  }

  // Seed one environmental reading so dashboard has numbers
  await prisma.environmentalReading.create({
    data: {
      testBedId: testBed.id,
      gPoa: 980.0,
      gPoaBeam: 820.0,
      gPoaDiffuse: 160.0,
      tCell: 48.5,
      tAmbient: 32.1,
      tModule: 47.0,
      windSpeed: 2.3,
      airmass: 1.5,
      aoi: 15.0,
    },
  });

  console.log('✅ Seed complete.');
  console.log(`   Organization: ${org.name} (${org.labCode})`);
  console.log(`   TestBed: ${testBed.name}`);
  console.log(`   Module types: ${moduleTypes.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
