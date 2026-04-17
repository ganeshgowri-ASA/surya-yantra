import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const CreateModuleSchema = z.object({
  serialNumber: z.string().min(1),
  moduleTypeId: z.string().min(1),
  testBedId: z.string().optional(),
  slotPosition: z.number().int().min(1).max(75).optional(),
  installDate: z.string().datetime().optional(),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const testBedId = searchParams.get('testBedId');
  const activeOnly = searchParams.get('activeOnly') === 'true';

  const modules = await prisma.module.findMany({
    where: {
      ...(testBedId ? { testBedId } : {}),
      ...(activeOnly ? { isActive: true } : {}),
    },
    include: {
      moduleType: { include: { manufacturer: true } },
      testBed: { select: { id: true, name: true } },
    },
    orderBy: [{ slotPosition: 'asc' }, { createdAt: 'desc' }],
  });
  return NextResponse.json({ modules });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = CreateModuleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const module = await prisma.module.create({
    data: {
      ...parsed.data,
      installDate: parsed.data.installDate ? new Date(parsed.data.installDate) : undefined,
    },
    include: { moduleType: { include: { manufacturer: true } } },
  });
  return NextResponse.json({ module }, { status: 201 });
}
