import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { performFullCorrection } from '@/lib/iv-corrections';

export const dynamic = 'force-dynamic';

const Schema = z.object({
  measurementId: z.string().min(1),
  procedure: z.enum(['P1', 'P2', 'P3', 'P4']),
  aoiDeg: z.number().optional(),
  beamFraction: z.number().optional(),
  applySmmf: z.boolean().optional(),
  rsOverride: z.number().optional(),
  kappaOverride: z.number().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const measurement = await prisma.iVMeasurement.findUnique({
    where: { id: parsed.data.measurementId },
    include: {
      rawCurvePoints: { orderBy: { seqIndex: 'asc' } },
      condition: true,
      module: { include: { moduleType: true } },
    },
  });
  if (!measurement || !measurement.condition) {
    return NextResponse.json(
      { error: 'Measurement or environmental reading not found' },
      { status: 404 },
    );
  }

  const mt = measurement.module.moduleType;
  const result = performFullCorrection({
    procedure: parsed.data.procedure,
    curve: measurement.rawCurvePoints.map((p) => ({ voltage: p.voltage, current: p.current })),
    module: {
      alphaPct: mt.alphaPct,
      betaPct: mt.betaPct,
      gammaPct: mt.gammaPct,
      rs: parsed.data.rsOverride ?? mt.rs ?? undefined,
      kappa: parsed.data.kappaOverride ?? mt.kappa ?? undefined,
      iscSTC: mt.iscSTC,
      vocSTC: mt.vocSTC,
      arCoeff: mt.arCoeff ?? 0.17,
    },
    gMeas: measurement.condition.gPoa,
    tMeas: measurement.condition.tCell,
    aoiDeg: parsed.data.aoiDeg ?? measurement.condition.aoi ?? undefined,
    beamFraction: parsed.data.beamFraction,
    applySmmf: parsed.data.applySmmf,
  });

  // Persist corrected curve + metadata
  await prisma.$transaction([
    prisma.iVCurvePointSTC.deleteMany({ where: { measurementId: measurement.id } }),
    prisma.iVCurvePointSTC.createMany({
      data: result.corrected.map((p, i) => ({
        measurementId: measurement.id,
        seqIndex: i,
        voltage: p.voltage,
        current: p.current,
        power: p.voltage * p.current,
      })),
    }),
    prisma.iVMeasurement.update({
      where: { id: measurement.id },
      data: {
        vocSTC: result.metrics.voc,
        iscSTC: result.metrics.isc,
        vmppSTC: result.metrics.vmpp,
        imppSTC: result.metrics.impp,
        pmppSTC: result.metrics.pmpp,
        ffSTC: result.metrics.ff,
        etaSTC: (result.metrics.pmpp / mt.areaMm2) * 1e6 / 10, // %
        correctionProc: ('IEC60891_' + parsed.data.procedure) as
          | 'IEC60891_P1'
          | 'IEC60891_P2'
          | 'IEC60891_P3'
          | 'IEC60891_P4',
        smmmfApplied: parsed.data.applySmmf ?? false,
        iamApplied: parsed.data.aoiDeg !== undefined,
        smmmfValue: result.smmfUsed,
        iamValue: result.iamUsed,
      },
    }),
    prisma.correctionResult.upsert({
      where: { measurementId: measurement.id },
      update: {
        procedure: ('IEC60891_' + parsed.data.procedure) as
          | 'IEC60891_P1'
          | 'IEC60891_P2'
          | 'IEC60891_P3'
          | 'IEC60891_P4',
        gMeas: measurement.condition.gPoa,
        tMeas: measurement.condition.tCell,
        alphaUsed: mt.alphaPct,
        betaUsed: mt.betaPct,
        gammaUsed: mt.gammaPct,
        rsUsed: parsed.data.rsOverride ?? mt.rs ?? null,
        kappaUsed: parsed.data.kappaOverride ?? mt.kappa ?? null,
        smmmfUsed: result.smmfUsed,
        iamUsed: result.iamUsed,
        deltaI: result.deltaI,
        deltaV: result.deltaV,
      },
      create: {
        measurementId: measurement.id,
        procedure: ('IEC60891_' + parsed.data.procedure) as
          | 'IEC60891_P1'
          | 'IEC60891_P2'
          | 'IEC60891_P3'
          | 'IEC60891_P4',
        gMeas: measurement.condition.gPoa,
        tMeas: measurement.condition.tCell,
        alphaUsed: mt.alphaPct,
        betaUsed: mt.betaPct,
        gammaUsed: mt.gammaPct,
        rsUsed: parsed.data.rsOverride ?? mt.rs ?? null,
        kappaUsed: parsed.data.kappaOverride ?? mt.kappa ?? null,
        smmmfUsed: result.smmfUsed,
        iamUsed: result.iamUsed,
        deltaI: result.deltaI,
        deltaV: result.deltaV,
      },
    }),
  ]);

  return NextResponse.json({ result });
}
