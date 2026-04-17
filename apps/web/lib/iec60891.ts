/**
 * IEC 60891:2021 — Photovoltaic devices: Procedures for temperature and
 * irradiance corrections to measured I-V characteristics.
 *
 * Implements Procedures 1, 2, 3, and 4.
 *
 * Procedure 1 (classical linear): I2 = I1 + Isc·(G2/G1 - 1) + α·(T2 - T1)
 *                                 V2 = V1 - Rs·(I2 - I1) - κ·I2·(T2 - T1) + β·(T2 - T1)
 * Procedure 2 (multiplicative):   I2 = I1·(1 + α'·(T2 - T1))·(G2/G1)
 *                                 V2 = V1 + β'·(T2 - T1) - Rs'·(I2 - I1) - κ'·I2·(T2 - T1)
 * Procedure 3 (bilinear interpolation across two reference curves at different G, T).
 * Procedure 4 (combined parametric correction with Rs, Rsh, and voltage scaling).
 */

export interface IVPoint {
  voltage: number;
  current: number;
}

export interface IVCurve {
  points: IVPoint[];
  isc: number;
  voc: number;
  irradiance: number;
  temperature: number;
}

export interface ModuleParams {
  /** Absolute short-circuit current temperature coefficient [A/°C] */
  alpha: number;
  /** Absolute open-circuit voltage temperature coefficient [V/°C] */
  beta: number;
  /** Internal series resistance [Ω] */
  rs: number;
  /** Curve correction factor [Ω/°C] */
  kappa: number;
  /** Shunt resistance [Ω] (optional, for Procedure 4) */
  rsh?: number;
}

export interface CorrectionTarget {
  /** Target irradiance [W/m²]. STC = 1000. */
  irradiance: number;
  /** Target cell temperature [°C]. STC = 25. */
  temperature: number;
}

export const STC: CorrectionTarget = { irradiance: 1000, temperature: 25 };

function assertFinite(name: string, v: number) {
  if (!Number.isFinite(v)) throw new Error(`${name} must be a finite number, got ${v}`);
}

/**
 * IEC 60891:2021 Procedure 1 — classical linear translation.
 */
export function correctProcedure1(
  curve: IVCurve,
  params: ModuleParams,
  target: CorrectionTarget = STC,
): IVCurve {
  assertFinite('irradiance', curve.irradiance);
  assertFinite('temperature', curve.temperature);
  if (curve.irradiance <= 0) throw new Error('Measured irradiance must be > 0');

  const g1 = curve.irradiance;
  const g2 = target.irradiance;
  const dT = target.temperature - curve.temperature;
  const iscShift = curve.isc * (g2 / g1 - 1) + params.alpha * dT;

  const translated = curve.points.map(({ voltage, current }) => {
    const i2 = current + iscShift;
    const v2 = voltage - params.rs * (i2 - current) - params.kappa * i2 * dT + params.beta * dT;
    return { voltage: v2, current: i2 };
  });

  return {
    points: translated,
    isc: curve.isc + iscShift,
    voc: curve.voc + params.beta * dT,
    irradiance: target.irradiance,
    temperature: target.temperature,
  };
}

/**
 * IEC 60891:2021 Procedure 2 — uses relative temperature coefficients and
 * the corrected series resistance Rs'. More accurate at large ΔG than P1.
 */
export function correctProcedure2(
  curve: IVCurve,
  params: ModuleParams,
  target: CorrectionTarget = STC,
): IVCurve {
  assertFinite('irradiance', curve.irradiance);
  if (curve.irradiance <= 0) throw new Error('Measured irradiance must be > 0');

  const g1 = curve.irradiance;
  const g2 = target.irradiance;
  const dT = target.temperature - curve.temperature;
  const gFactor = g2 / g1;

  // Relative coefficients (IEC convention: alpha/Isc, beta/Voc when pct form)
  const alphaRel = params.alpha / curve.isc;
  const translated = curve.points.map(({ voltage, current }) => {
    const i2 = current * (1 + alphaRel * dT) * gFactor;
    const v2 =
      voltage +
      params.beta * dT -
      params.rs * (i2 - current) -
      params.kappa * i2 * dT;
    return { voltage: v2, current: i2 };
  });

  const iscNew = curve.isc * (1 + alphaRel * dT) * gFactor;
  return {
    points: translated,
    isc: iscNew,
    voc: curve.voc + params.beta * dT,
    irradiance: target.irradiance,
    temperature: target.temperature,
  };
}

/**
 * IEC 60891:2021 Procedure 3 — bilinear interpolation/extrapolation between
 * two reference I-V curves measured at (G_a, T_a) and (G_b, T_b). Requires no
 * knowledge of Rs, α, β, κ. Both reference curves must have the same number of
 * points. Target (G2, T2) may lie outside the pair (extrapolation).
 */
export function correctProcedure3(
  curveA: IVCurve,
  curveB: IVCurve,
  target: CorrectionTarget = STC,
): IVCurve {
  if (curveA.points.length !== curveB.points.length) {
    throw new Error('Procedure 3 requires equal-length reference curves');
  }
  if (curveA.irradiance === curveB.irradiance && curveA.temperature === curveB.temperature) {
    throw new Error('Reference curves must differ in G or T');
  }

  // Solve linear system for weights w_a, w_b such that
  //   w_a·G_a + w_b·G_b = G2
  //   w_a·T_a + w_b·T_b = T2 - with normalization w_a + w_b = 1 when possible.
  // Use the two-point interpolation along the (G,T) connecting line.
  const dG = curveB.irradiance - curveA.irradiance;
  const dT = curveB.temperature - curveA.temperature;
  const denom = dG * dG + dT * dT;
  if (denom === 0) throw new Error('Reference curves must differ in G or T');

  const num =
    (target.irradiance - curveA.irradiance) * dG +
    (target.temperature - curveA.temperature) * dT;
  const t = num / denom; // interpolation parameter, 0 → A, 1 → B

  const points = curveA.points.map((pa, i) => {
    const pb = curveB.points[i];
    return {
      voltage: pa.voltage + t * (pb.voltage - pa.voltage),
      current: pa.current + t * (pb.current - pa.current),
    };
  });

  const isc = curveA.isc + t * (curveB.isc - curveA.isc);
  const voc = curveA.voc + t * (curveB.voc - curveA.voc);
  return {
    points,
    isc,
    voc,
    irradiance: target.irradiance,
    temperature: target.temperature,
  };
}

/**
 * IEC 60891:2021 Procedure 4 — combined parametric method with Rs and Rsh.
 * Applies current and voltage translations using the two-diode style
 * resistive corrections. Fallback to Procedure 2 when Rsh is not provided.
 */
export function correctProcedure4(
  curve: IVCurve,
  params: ModuleParams,
  target: CorrectionTarget = STC,
): IVCurve {
  if (params.rsh === undefined || params.rsh <= 0) {
    return correctProcedure2(curve, params, target);
  }

  const g1 = curve.irradiance;
  const g2 = target.irradiance;
  const dT = target.temperature - curve.temperature;
  const gFactor = g2 / g1;
  const alphaRel = params.alpha / curve.isc;

  const translated = curve.points.map(({ voltage, current }) => {
    const i2 =
      current * (1 + alphaRel * dT) * gFactor +
      (voltage / params.rsh!) * (gFactor - 1);
    const v2 =
      voltage +
      params.beta * dT -
      params.rs * (i2 - current) -
      params.kappa * i2 * dT;
    return { voltage: v2, current: i2 };
  });

  const iscNew = curve.isc * (1 + alphaRel * dT) * gFactor;
  return {
    points: translated,
    isc: iscNew,
    voc: curve.voc + params.beta * dT,
    irradiance: target.irradiance,
    temperature: target.temperature,
  };
}

/**
 * Locate the maximum-power point on an I-V curve.
 */
export function findMPP(curve: IVCurve): { vmpp: number; impp: number; pmpp: number } {
  let best = { vmpp: 0, impp: 0, pmpp: -Infinity };
  for (const { voltage, current } of curve.points) {
    const p = voltage * current;
    if (p > best.pmpp) best = { vmpp: voltage, impp: current, pmpp: p };
  }
  return best;
}

/**
 * Fill factor.
 */
export function fillFactor(curve: IVCurve): number {
  const { pmpp } = findMPP(curve);
  if (curve.isc === 0 || curve.voc === 0) return 0;
  return pmpp / (curve.isc * curve.voc);
}
