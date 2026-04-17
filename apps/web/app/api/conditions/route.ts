import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const CreateSchema = z.object({
  testBedId: z.string().default('testbed-alpha'),
  gPoa: z.number(),
  gPoaBeam: z.number().optional(),
  gPoaDiffuse: z.number().optional(),
  gPoaAlbedo: z.number().optional(),
  gRef: z.number().optional(),
  refCellTemp: z.number().optional(),
  ghi: z.number().optional(),
  dhi: z.number().optional(),
  dni: z.number().optional(),
  tCell: z.number(),
  tAmbient: z.number(),
  tModule: z.number().optional(),
  windSpeed: z.number().optional(),
  airmass: z.number().optional(),
  aod: z.number().optional(),
  precipWater: z.number().optional(),
  aoi: z.number().optional(),
  solarZenith: z.number().optional(),
  solarAzimuth: z.number().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const reading = await prisma.environmentalReading.create({ data: parsed.data });
  return NextResponse.json({ reading }, { status: 201 });
}
