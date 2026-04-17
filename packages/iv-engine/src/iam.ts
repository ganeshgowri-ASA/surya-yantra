// Incidence Angle Modifier (IAM) per IEC 61853-2 — Martin-Ruiz model
//
//   IAM(θ) = 1 − [ (1 − exp(−cos(θ)/a_r)) / (1 − exp(−1/a_r)) ]
//
// Where a_r is the AR coating coefficient. Typical values:
//   0.17  — modern glass with AR coating
//   0.16  — premium AR (HJT, TOPCon premium)
//   0.26  — uncoated tempered glass
//
// θ is the angle of incidence in degrees (0 = normal, 90 = grazing).

export function martinRuizIAM(aoiDeg: number, aR = 0.17): number {
  const θ = degToRad(Math.max(0, Math.min(90, aoiDeg)));
  const cosθ = Math.cos(θ);
  const num = 1 - Math.exp(-cosθ / aR);
  const den = 1 - Math.exp(-1 / aR);
  if (den === 0) return 1;
  // IAM(0°) = 1 (normal incidence); IAM(90°) = 0 (grazing).
  return num / den;
}

/**
 * Correct measured irradiance (or ISC) for AOI effects.
 * Returns factor by which the beam component should be multiplied.
 * Diffuse and albedo components retain their own IAM treatment (often 0.95).
 */
export interface IAMCorrectionInput {
  aoiDeg: number;
  /** Beam (direct) fraction of total POA irradiance */
  beamFraction: number;
  /** AR coating coefficient */
  aR?: number;
  /** Constant IAM for diffuse / albedo (default 0.95) */
  diffuseIAM?: number;
}

export function effectiveIAM(input: IAMCorrectionInput): number {
  const { aoiDeg, beamFraction } = input;
  const aR = input.aR ?? 0.17;
  const diffuseIAM = input.diffuseIAM ?? 0.95;
  const beamIAM = martinRuizIAM(aoiDeg, aR);
  return beamFraction * beamIAM + (1 - beamFraction) * diffuseIAM;
}

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
