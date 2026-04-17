import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const types = await prisma.moduleType.findMany({
    include: { manufacturer: true },
    orderBy: [{ manufacturer: { name: 'asc' } }, { modelName: 'asc' }],
  });
  return NextResponse.json({ moduleTypes: types });
}
