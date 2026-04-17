import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const UpdateSchema = z.object({
  serialNumber: z.string().min(1).optional(),
  slotPosition: z.number().int().min(1).max(75).nullable().optional(),
  testBedId: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  notes: z.string().nullable().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const module = await prisma.module.update({
    where: { id: params.id },
    data: parsed.data,
  });
  return NextResponse.json({ module });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.module.update({ where: { id: params.id }, data: { isActive: false } });
  return NextResponse.json({ ok: true });
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const module = await prisma.module.findUnique({
    where: { id: params.id },
    include: {
      moduleType: { include: { manufacturer: true } },
      measurements: {
        orderBy: { measuredAt: 'desc' },
        take: 20,
        include: { condition: true },
      },
    },
  });
  if (!module) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ module });
}
