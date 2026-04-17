// IEC 60891:2021 — Procedures P1, P2, P3, P4
//
// P1 (classic): ΔI = I_SC·(G_STC/G_MEAS − 1) + α·(T_STC − T_MEAS)
//               ΔV = −β·(T_STC − T_MEAS) − Rs·ΔI − κ·I·(T_STC − T_MEAS)
//   V2 = V1 + ΔV ;  I2 = I1 + ΔI
//
// P2 (multiplicative / Blaesser):
//   I2 = I1·(1 + α'·ΔT)·(G_STC/G_MEAS)
//   V2 = V1·(1 + β'·ΔT)·(1 + δ·ln(G_STC/G_MEAS))
//     where δ is an internal parameter (default 0.085)
//
// P3 (matrix-less, Pmax-based): correct I_SC, V_OC, P_mp independently
//   then scale the curve to the corrected envelope.
//
// P4 (improved P1 with variable series resistance): identical to P1 but
//   Rs is determined from two curves at different irradiance; here we
//   accept Rs as a parameter and apply P1 identically (most practical for
//   field sites where only one curve is available).

import type { IVPoint, CorrectionInput, CorrectionResult, Procedure, ModuleParams } from './types';
import { STC } from './types';
import { computeMetrics } from './util';

const DEFAULT_DELTA = 0.085; // P2 irradiance-voltage coefficient

export function applyIEC60891(input: CorrectionInput): CorrectionResult {
  const target = input.target ?? STC;
  const raw = input.curve.map((p) => ({ ...p, power: p.voltage * p.current }));

  // Apply SMMF / IAM multiplicatively to measured irradiance before correction.
  const gEff =
    input.conditions.gMeas *
    (input.smmf ?? 1) *
    (input.iam ?? 1);

  const adjustedConditions = { ...input.conditions, gMeas: gEff };
  const adjustedInput: CorrectionInput = { ...input, conditions: adjustedConditions };

  let corrected: IVPoint[];
  switch (input.procedure) {
    case 'P1':
      corrected = p1Correct(raw, adjustedInput);
      break;
    case 'P2':
      corrected = p2Correct(raw, adjustedInput);
      break;
    case 'P3':
      corrected = p3Correct(raw, adjustedInput);
      break;
    case 'P4':
      corrected = p4Correct(raw, adjustedInput);
      break;
    default:
      corrected = raw;
  }

  corrected = corrected.map((p) => ({ ...p, power: p.voltage * p.current }));
  const metrics = computeMetrics(corrected);
  const rawMetrics = computeMetrics(raw);

  return {
    procedure: input.procedure,
    raw,
    corrected,
    metrics,
    rawMetrics,
    deltaI: metrics.isc - rawMetrics.isc,
    deltaV: metrics.voc - rawMetrics.voc,
    smmfUsed: input.smmf,
    iamUsed: input.iam,
  };
}

// ---------- P1 ----------

function p1Correct(curve: IVPoint[], input: CorrectionInput): IVPoint[] {
  const target = input.target ?? STC;
  const { module, conditions } = input;
  const gRatio = target.gSTC / conditions.gMeas;
  const dT = target.tSTC - conditions.tMeas;
  const alpha = fractionalCoeff(module.alphaPct) * module.iscSTC;
  const beta = fractionalCoeff(module.betaPct) * module.vocSTC;
  const rs = module.rs ?? 0;
  const kappa = module.kappa ?? 0;

  // Reference ISC (measured) — use first point near V=0
  const iscMeas = approxIsc(curve);
  const deltaI = iscMeas * (gRatio - 1) + alpha * dT;

  return curve.map((pt) => {
    const newI = pt.current + deltaI;
    const newV = pt.voltage - rs * deltaI - kappa * newI * dT + beta * dT;
    return { voltage: newV, current: newI };
  });
}

// ---------- P2 ----------

function p2Correct(curve: IVPoint[], input: CorrectionInput, delta = DEFAULT_DELTA): IVPoint[] {
  const target = input.target ?? STC;
  const { module, conditions } = input;
  const gRatio = target.gSTC / conditions.gMeas;
  const dT = target.tSTC - conditions.tMeas;
  const alphaRel = fractionalCoeff(module.alphaPct); // 1/°C
  const betaRel = fractionalCoeff(module.betaPct);

  const iScale = (1 + alphaRel * dT) * gRatio;
  const vScale = (1 + betaRel * dT) * (1 + delta * Math.log(gRatio));

  return curve.map((pt) => ({
    voltage: pt.voltage * vScale,
    current: pt.current * iScale,
  }));
}

// ---------- P3 ----------

function p3Correct(curve: IVPoint[], input: CorrectionInput): IVPoint[] {
  const target = input.target ?? STC;
  const { module, conditions } = input;
  const gRatio = target.gSTC / conditions.gMeas;
  const dT = target.tSTC - conditions.tMeas;

  // Correct envelope parameters individually
  const rawMetrics = computeMetrics(curve);
  const iscCorr = rawMetrics.isc * gRatio * (1 + fractionalCoeff(module.alphaPct) * dT);
  const vocCorr = rawMetrics.voc * (1 + fractionalCoeff(module.betaPct) * dT);
  const pmppCorr = rawMetrics.pmpp * gRatio * (1 + fractionalCoeff(module.gammaPct) * dT);

  // Scale curve: x-axis → VOC ratio, y-axis → ISC ratio, then renormalize Pmpp
  const xScale = vocCorr / Math.max(rawMetrics.voc, 1e-6);
  const yScale = iscCorr / Math.max(rawMetrics.isc, 1e-6);

  const scaled = curve.map((p) => ({ voltage: p.voltage * xScale, current: p.current * yScale }));

  // Adjust so that corrected Pmpp matches pmppCorr
  const scaledMetrics = computeMetrics(scaled);
  const pScale = pmppCorr / Math.max(scaledMetrics.pmpp, 1e-6);
  // Redistribute the Pmpp mismatch across the MPP knee — scale current only
  return scaled.map((p) => ({ voltage: p.voltage, current: p.current * pScale }));
}

// ---------- P4 ----------

function p4Correct(curve: IVPoint[], input: CorrectionInput): IVPoint[] {
  // P4 differs from P1 by using a variable Rs determined from two curves.
  // When only one curve is available, reduce to P1 with supplied Rs.
  return p1Correct(curve, input);
}

// ---------- Shared helpers ----------

function fractionalCoeff(percentPerC: number): number {
  // Convert "%/°C" to fractional (1/°C). Input 0.045 means 0.045 %/°C.
  return percentPerC / 100;
}

function approxIsc(curve: IVPoint[]): number {
  if (curve.length === 0) return 0;
  let best = curve[0]!;
  for (const p of curve) if (Math.abs(p.voltage) < Math.abs(best.voltage)) best = p;
  return best.current;
}

/**
 * Determine Rs from two IV curves at the same temperature but different
 * irradiance, per IEC 60891 §5.3. Returns Rs in Ω.
 */
export function determineRsFromTwoCurves(
  curveHigh: IVPoint[],
  curveLow: IVPoint[],
  _module: Pick<ModuleParams, 'alphaPct' | 'vocSTC' | 'iscSTC'>,
): number {
  const mHi = computeMetrics(curveHigh);
  const mLo = computeMetrics(curveLow);
  const di = mHi.isc - mLo.isc;
  const dv = mHi.voc - mLo.voc;
  if (Math.abs(di) < 1e-6) return 0;
  return -dv / di;
}
