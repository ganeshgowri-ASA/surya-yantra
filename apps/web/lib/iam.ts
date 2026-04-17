/**
 * Incidence Angle Modifier (IAM) per IEC 61853-2:2016.
 *
 * Martin & Ruiz physical model:
 *   IAM(θ) = [1 - exp(-cos(θ)/ar)] / [1 - exp(-1/ar)]
 *
 * where `ar` is the angular-loss fitting coefficient (typical 0.14–0.20 for
 * single-glass modules, 0.17 default for crystalline silicon).
 *
 * Domain: θ ∈ [0°, 90°]. IAM(0°) = 1. IAM(90°) = 0.
 */

export const DEFAULT_AR = 0.17;

export interface IamOptions {
  /** Angular-loss coefficient (Martin-Ruiz `ar`). */
  ar?: number;
  /** If true, input angles are in radians instead of degrees. */
  radians?: boolean;
}

function toRadians(angle: number, radians: boolean): number {
  return radians ? angle : (angle * Math.PI) / 180;
}

/**
 * Compute IAM at a single angle using the Martin-Ruiz model.
 * θ is in degrees by default. Values outside [0°, 90°] clamp to the edges
 * (IAM=1 at 0°, IAM=0 at or beyond 90°).
 */
export function iamMartinRuiz(theta: number, options: IamOptions = {}): number {
  const ar = options.ar ?? DEFAULT_AR;
  if (ar <= 0) throw new Error('ar coefficient must be > 0');
  const rad = toRadians(theta, options.radians ?? false);
  if (!Number.isFinite(rad)) throw new Error('angle must be finite');
  if (rad <= 0) return 1;
  if (rad >= Math.PI / 2) return 0;
  const cosT = Math.cos(rad);
  const denom = 1 - Math.exp(-1 / ar);
  if (denom === 0) return 1;
  return (1 - Math.exp(-cosT / ar)) / denom;
}

/**
 * Vectorised variant — compute IAM for a set of angles.
 */
export function iamCurve(thetas: number[], options: IamOptions = {}): number[] {
  return thetas.map(t => iamMartinRuiz(t, options));
}

/**
 * Decompose plane-of-array irradiance into beam/diffuse/albedo components and
 * apply per-component IAM factors (IEC 61853-2 Annex C).
 *
 * Diffuse and albedo components use effective angles of 58° and 90° - 0.5788·β
 * + 0.002693·β² (ISO 9060/Reindl) respectively; we use the simplified constant
 * effective angles recommended by IEC 61853-2.
 */
export interface PoaDecomposition {
  beam: number;
  diffuse: number;
  albedo: number;
}

export function applyIamToPoa(
  poa: PoaDecomposition,
  aoiBeamDeg: number,
  options: IamOptions = {},
): number {
  const iamBeam = iamMartinRuiz(aoiBeamDeg, options);
  const iamDiffuse = iamMartinRuiz(58, options);
  const iamAlbedo = iamMartinRuiz(80, options);
  return (
    poa.beam * iamBeam +
    poa.diffuse * iamDiffuse +
    poa.albedo * iamAlbedo
  );
}
