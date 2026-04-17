import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { assignSlot } from '@/lib/mux-controller';

const Schema = z.object({
  testBedId: z.string().default('testbed-alpha'),
  slotNumber: z.number().int().min(1).max(75),
  destination: z.enum(['ELOAD', 'INVERTER', 'CONVERTER', 'IDLE']),
  forceOn: z.boolean().optional(),
  senseOn: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const state = await assignSlot(parsed.data);
  return NextResponse.json({ state });
}
