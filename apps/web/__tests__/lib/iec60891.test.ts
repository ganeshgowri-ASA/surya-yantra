import { describe, expect, it } from 'vitest';
import {
  correctProcedure1,
  correctProcedure2,
  correctProcedure3,
  correctProcedure4,
  findMPP,
  fillFactor,
  STC,
  type IVCurve,
  type ModuleParams,
} from '../../lib/iec60891';

/**
 * Example module parameters — loosely based on IEC 61853-1 Annex B Table B.1
 * (450 Wp bifacial monocrystalline class).
 */
const MODULE: ModuleParams = {
  alpha: 0.0055, // A/°C
  beta: -0.1337, // V/°C
  rs: 0.35, // Ω
  kappa: 0.0012, // Ω/°C
  rsh: 450, // Ω
};

/** Coarse synthetic I-V curve anchored on Isc / MPP / Voc. */
function syntheticCurve(opts: {
  isc: number;
  voc: number;
  vmpp: number;
  impp: number;
  g: number;
  t: number;
}): IVCurve {
  const { isc, voc, vmpp, impp, g, t } = opts;
  const points = [
    { voltage: 0, current: isc },
    { voltage: vmpp * 0.5, current: isc * 0.998 },
    { voltage: vmpp, current: impp },
    { voltage: (vmpp + voc) / 2, current: impp * 0.55 },
    { voltage: voc * 0.98, current: isc * 0.1 },
    { voltage: voc, current: 0 },
  ];
  return { points, isc, voc, irradiance: g, temperature: t };
}

const STC_CURVE: IVCurve = syntheticCurve({
  isc: 11.5, voc: 49.5, vmpp: 41.2, impp: 10.93, g: 1000, t: 25,
});

describe('IEC 60891:2021 Procedure 1', () => {
  it('is an identity when measured at STC', () => {
    const corrected = correctProcedure1(STC_CURVE, MODULE, STC);
    expect(corrected.irradiance).toBe(1000);
    expect(corrected.temperature).toBe(25);
    corrected.points.forEach((p, i) => {
      expect(p.voltage).toBeCloseTo(STC_CURVE.points[i].voltage, 9);
      expect(p.current).toBeCloseTo(STC_CURVE.points[i].current, 9);
    });
  });

  it('applies the classical linear translation exactly', () => {
    // G1=800, T1=45 → STC (1000, 25)
    const g1 = 800, t1 = 45;
    const isc = 9.3;
    const curve = syntheticCurve({ isc, voc: 47.8, vmpp: 39.6, impp: 8.75, g: g1, t: t1 });
    const corrected = correctProcedure1(curve, MODULE, STC);

    const dT = 25 - 45;
    const expectedIsc = isc + isc * (1000 / g1 - 1) + MODULE.alpha * dT;
    expect(corrected.isc).toBeCloseTo(expectedIsc, 6);

    // First point (V=0) — verify voltage shift follows the stated formula
    const v0 = 0;
    const i1_0 = isc;
    const i2_0 = i1_0 + isc * (1000 / g1 - 1) + MODULE.alpha * dT;
    const v2_0 =
      v0 - MODULE.rs * (i2_0 - i1_0) - MODULE.kappa * i2_0 * dT + MODULE.beta * dT;
    expect(corrected.points[0].voltage).toBeCloseTo(v2_0, 6);
    expect(corrected.points[0].current).toBeCloseTo(i2_0, 6);
  });

  it('raises current when translating from low to high irradiance', () => {
    const curve = syntheticCurve({
      isc: 5.7, voc: 48.2, vmpp: 40.1, impp: 5.30, g: 500, t: 25,
    });
    const corrected = correctProcedure1(curve, MODULE, STC);
    expect(corrected.isc).toBeGreaterThan(curve.isc);
  });

  it('rejects non-positive irradiance', () => {
    const bad: IVCurve = { ...STC_CURVE, irradiance: 0 };
    expect(() => correctProcedure1(bad, MODULE, STC)).toThrow();
  });
});

describe('IEC 60891:2021 Procedure 2', () => {
  it('is an identity when measured at STC', () => {
    const corrected = correctProcedure2(STC_CURVE, MODULE, STC);
    corrected.points.forEach((p, i) => {
      expect(p.voltage).toBeCloseTo(STC_CURVE.points[i].voltage, 9);
      expect(p.current).toBeCloseTo(STC_CURVE.points[i].current, 9);
    });
  });

  it('scales current multiplicatively with irradiance', () => {
    const curve = syntheticCurve({
      isc: 5.75, voc: 49.5, vmpp: 41.2, impp: 5.47, g: 500, t: 25,
    });
    const corrected = correctProcedure2(curve, MODULE, STC);
    // ΔT = 0 → Isc_corrected = Isc_measured * (1000/500) = 2 * Isc
    expect(corrected.isc).toBeCloseTo(curve.isc * 2, 6);
  });

  it('corrects Voc with the β·ΔT term', () => {
    const curve = syntheticCurve({
      isc: 11.5, voc: 46.8, vmpp: 38.7, impp: 10.93, g: 1000, t: 45,
    });
    const corrected = correctProcedure2(curve, MODULE, STC);
    expect(corrected.voc).toBeCloseTo(curve.voc + MODULE.beta * (25 - 45), 6);
  });
});

describe('IEC 60891:2021 Procedure 3 (bilinear interpolation)', () => {
  const curveA = syntheticCurve({
    isc: 5.75, voc: 49.5, vmpp: 41.2, impp: 5.47, g: 500, t: 25,
  });
  const curveB = syntheticCurve({
    isc: 11.5, voc: 49.5, vmpp: 41.2, impp: 10.93, g: 1000, t: 25,
  });

  it('returns curve A when target matches curve A', () => {
    const result = correctProcedure3(curveA, curveB, { irradiance: 500, temperature: 25 });
    result.points.forEach((p, i) => {
      expect(p.current).toBeCloseTo(curveA.points[i].current, 9);
      expect(p.voltage).toBeCloseTo(curveA.points[i].voltage, 9);
    });
  });

  it('returns curve B when target matches curve B', () => {
    const result = correctProcedure3(curveA, curveB, { irradiance: 1000, temperature: 25 });
    result.points.forEach((p, i) => {
      expect(p.current).toBeCloseTo(curveB.points[i].current, 9);
    });
  });

  it('interpolates linearly at the midpoint', () => {
    const result = correctProcedure3(curveA, curveB, { irradiance: 750, temperature: 25 });
    expect(result.isc).toBeCloseTo((curveA.isc + curveB.isc) / 2, 6);
  });

  it('requires differing reference conditions', () => {
    expect(() => correctProcedure3(curveA, curveA, STC)).toThrow();
  });

  it('requires equal-length reference curves', () => {
    const short: IVCurve = { ...curveB, points: curveB.points.slice(0, 3) };
    expect(() => correctProcedure3(curveA, short, STC)).toThrow();
  });
});

describe('IEC 60891:2021 Procedure 4', () => {
  it('is an identity at STC when Rsh is given', () => {
    const corrected = correctProcedure4(STC_CURVE, MODULE, STC);
    corrected.points.forEach((p, i) => {
      expect(p.voltage).toBeCloseTo(STC_CURVE.points[i].voltage, 9);
      expect(p.current).toBeCloseTo(STC_CURVE.points[i].current, 9);
    });
  });

  it('falls back to Procedure 2 when Rsh is absent', () => {
    const params: ModuleParams = { ...MODULE, rsh: undefined };
    const curve = syntheticCurve({
      isc: 5.75, voc: 49.5, vmpp: 41.2, impp: 5.47, g: 500, t: 25,
    });
    const p2 = correctProcedure2(curve, params, STC);
    const p4 = correctProcedure4(curve, params, STC);
    expect(p4.isc).toBeCloseTo(p2.isc, 9);
    expect(p4.voc).toBeCloseTo(p2.voc, 9);
  });

  it('accounts for shunt conduction when translating irradiance', () => {
    const curve = syntheticCurve({
      isc: 5.75, voc: 49.5, vmpp: 41.2, impp: 5.47, g: 500, t: 25,
    });
    const p4 = correctProcedure4(curve, MODULE, STC);
    // With Rsh contribution, the near-Voc currents should differ from P2.
    const p2 = correctProcedure2(curve, MODULE, STC);
    const deltas = p4.points.map((p, i) => Math.abs(p.current - p2.points[i].current));
    const maxDelta = Math.max(...deltas);
    expect(maxDelta).toBeGreaterThan(0);
  });
});

describe('MPP and fill factor helpers', () => {
  it('finds the maximum-power point', () => {
    const mpp = findMPP(STC_CURVE);
    expect(mpp.vmpp).toBeCloseTo(41.2, 3);
    expect(mpp.impp).toBeCloseTo(10.93, 3);
    expect(mpp.pmpp).toBeCloseTo(41.2 * 10.93, 3);
  });

  it('computes fill factor in the expected range', () => {
    const ff = fillFactor(STC_CURVE);
    expect(ff).toBeGreaterThan(0.7);
    expect(ff).toBeLessThan(0.9);
  });
});
