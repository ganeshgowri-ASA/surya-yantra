import { NextRequest, NextResponse } from 'next/server';
import { getAllMuxStates } from '@/lib/mux-controller';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const testBedId = searchParams.get('testBedId') ?? 'testbed-alpha';
  const states = await getAllMuxStates(testBedId);
  return NextResponse.json({ testBedId, states });
}
