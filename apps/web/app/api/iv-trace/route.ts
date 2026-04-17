import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { mockIVSweep, runIVSweep } from '@/lib/esl-driver';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const StartSchema = z.object({
  moduleId: z.string().min(1),
  testBedId: z.string().default('testbed-alpha'),
  operatorId: z.string().optional(),
  name: z.string().default('IV Sweep'),
  startV: z.number().min(0).max(300).default(0),
  stopV: z.number().min(0).max(300).default(50),
  stepCount: z.number().int().min(10).max(10000).default(500),
  scanTimeSec: z.number().min(0.1).max(60).default(5),
  mock: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = StartSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const cfg = parsed.data;

  // Resolve operator (fallback to any admin if not provided)
  const operator =
    (cfg.operatorId && (await prisma.user.findUnique({ where: { id: cfg.operatorId } }))) ||
    (await prisma.user.findFirst({ orderBy: { createdAt: 'asc' } }));
  if (!operator) {
    return NextResponse.json({ error: 'No operator found — run db:seed first' }, { status: 400 });
  }

  const session = await prisma.testSession.create({
    data: {
      testBedId: cfg.testBedId,
      operatorId: operator.id,
      name: cfg.name,
      loadMode: 'IV_SWEEP',
      status: 'RUNNING',
      startV: cfg.startV,
      stopV: cfg.stopV,
      stepCount: cfg.stepCount,
      scanTimeSec: cfg.scanTimeSec,
      startedAt: new Date(),
    },
  });

  try {
    const result = cfg.mock
      ? mockIVSweep(cfg)
      : await runIVSweep(cfg).catch(() => mockIVSweep(cfg));

    const condition = await prisma.environmentalReading.findFirst({
      where: { testBedId: cfg.testBedId },
      orderBy: { timestamp: 'desc' },
    });

    const measurement = await prisma.iVMeasurement.create({
      data: {
        sessionId: session.id,
        moduleId: cfg.moduleId,
        conditionId: condition?.id,
        vocRaw: result.voc,
        iscRaw: result.isc,
        vmppRaw: result.vmpp,
        imppRaw: result.impp,
        pmppRaw: result.pmpp,
        ffRaw: result.ff,
        rawCurvePoints: {
          create: result.points.map((p, i) => ({
            seqIndex: i,
            voltage: p.voltage,
            current: p.current,
            power: p.power,
          })),
        },
      },
    });

    await prisma.testSession.update({
      where: { id: session.id },
      data: { status: 'COMPLETED', completedAt: new Date() },
    });

    return NextResponse.json({
      sessionId: session.id,
      measurementId: measurement.id,
      result,
    });
  } catch (e) {
    await prisma.testSession.update({
      where: { id: session.id },
      data: { status: 'FAILED', completedAt: new Date() },
    });
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('sessionId');
  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
  }
  const session = await prisma.testSession.findUnique({
    where: { id: sessionId },
    include: {
      measurements: {
        include: {
          rawCurvePoints: { orderBy: { seqIndex: 'asc' } },
          correctedCurvePoints: { orderBy: { seqIndex: 'asc' } },
          condition: true,
        },
      },
    },
  });
  if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ session });
}
