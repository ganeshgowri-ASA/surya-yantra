import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const moduleId = searchParams.get('moduleId') ?? undefined;
  const sessionId = searchParams.get('sessionId') ?? undefined;
  const limit = Math.min(200, Number.parseInt(searchParams.get('limit') ?? '50', 10));

  const measurements = await prisma.iVMeasurement.findMany({
    where: {
      ...(moduleId ? { moduleId } : {}),
      ...(sessionId ? { sessionId } : {}),
    },
    orderBy: { measuredAt: 'desc' },
    take: limit,
    include: {
      module: {
        select: {
          id: true,
          serialNumber: true,
          moduleType: { select: { modelName: true } },
        },
      },
      condition: { select: { gPoa: true, tCell: true, tAmbient: true } },
    },
  });

  return NextResponse.json({ measurements });
}
