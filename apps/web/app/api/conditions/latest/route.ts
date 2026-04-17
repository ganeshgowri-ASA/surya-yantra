import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const testBedId = searchParams.get('testBedId') ?? 'testbed-alpha';
  const reading = await prisma.environmentalReading.findFirst({
    where: { testBedId },
    orderBy: { timestamp: 'desc' },
  });
  return NextResponse.json({ reading });
}
