// Spectral Mismatch Factor (SMMF) per IEC 60904-7
//
// SMMF = [∫ E_ref(λ)·SR_dev(λ) dλ · ∫ E_meas(λ)·SR_ref(λ) dλ]
//      / [∫ E_ref(λ)·SR_ref(λ) dλ · ∫ E_meas(λ)·SR_dev(λ) dλ]
//
// Spectra and spectral responses are arrays of {λ [nm], value} and must
// share a common sampling grid (or be resampled via linear interpolation).

export interface SpectralPoint {
  wavelengthNm: number;
  value: number;
}

export interface SMMFInput {
  /** Reference spectrum (e.g. AM1.5G per IEC 60904-3) */
  eRef: SpectralPoint[];
  /** Measured spectrum (outdoor / solar simulator output) */
  eMeas: SpectralPoint[];
  /** Reference cell spectral response */
  srRef: SpectralPoint[];
  /** Device-under-test spectral response */
  srDev: SpectralPoint[];
}

export function computeSMMF(input: SMMFInput): number {
  const grid = buildCommonGrid([input.eRef, input.eMeas, input.srRef, input.srDev]);
  const eRef = resample(input.eRef, grid);
  const eMeas = resample(input.eMeas, grid);
  const srRef = resample(input.srRef, grid);
  const srDev = resample(input.srDev, grid);

  const num1 = trapezoid(grid, multiply(eRef, srDev));
  const num2 = trapezoid(grid, multiply(eMeas, srRef));
  const den1 = trapezoid(grid, multiply(eRef, srRef));
  const den2 = trapezoid(grid, multiply(eMeas, srDev));

  const denom = den1 * den2;
  if (denom === 0) return 1.0;
  return (num1 * num2) / denom;
}

// Reference AM1.5G spectrum (IEC 60904-3) — coarse 20 nm sampling, W/m²/nm
// Source: IEC 60904-3 Table 1 condensed for in-code default.
export const AM15G_REFERENCE: SpectralPoint[] = [
  { wavelengthNm: 300, value: 0.0005 },
  { wavelengthNm: 400, value: 0.6548 },
  { wavelengthNm: 500, value: 1.9556 },
  { wavelengthNm: 600, value: 1.5960 },
  { wavelengthNm: 700, value: 1.3650 },
  { wavelengthNm: 800, value: 1.0983 },
  { wavelengthNm: 900, value: 0.7874 },
  { wavelengthNm: 1000, value: 0.6730 },
  { wavelengthNm: 1100, value: 0.3625 },
  { wavelengthNm: 1200, value: 0.3830 },
  { wavelengthNm: 1300, value: 0.1795 },
  { wavelengthNm: 1400, value: 0.0305 },
  { wavelengthNm: 1500, value: 0.2360 },
  { wavelengthNm: 1600, value: 0.1765 },
  { wavelengthNm: 1700, value: 0.1185 },
  { wavelengthNm: 1800, value: 0.0060 },
  { wavelengthNm: 1900, value: 0.0015 },
  { wavelengthNm: 2000, value: 0.0400 },
  { wavelengthNm: 2100, value: 0.0715 },
  { wavelengthNm: 2200, value: 0.0575 },
  { wavelengthNm: 2300, value: 0.0265 },
  { wavelengthNm: 2400, value: 0.0130 },
  { wavelengthNm: 2500, value: 0.0070 },
];

function buildCommonGrid(sources: SpectralPoint[][]): number[] {
  const all = new Set<number>();
  for (const s of sources) for (const p of s) all.add(p.wavelengthNm);
  return [...all].sort((a, b) => a - b);
}

function resample(source: SpectralPoint[], grid: number[]): number[] {
  const sorted = [...source].sort((a, b) => a.wavelengthNm - b.wavelengthNm);
  return grid.map((λ) => linearInterp(sorted, λ));
}

function linearInterp(sorted: SpectralPoint[], λ: number): number {
  if (sorted.length === 0) return 0;
  if (λ <= sorted[0]!.wavelengthNm) return sorted[0]!.value;
  if (λ >= sorted[sorted.length - 1]!.wavelengthNm) return sorted[sorted.length - 1]!.value;
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i]!;
    const b = sorted[i + 1]!;
    if (λ >= a.wavelengthNm && λ <= b.wavelengthNm) {
      const t = (λ - a.wavelengthNm) / (b.wavelengthNm - a.wavelengthNm);
      return a.value + t * (b.value - a.value);
    }
  }
  return 0;
}

function multiply(a: number[], b: number[]): number[] {
  return a.map((v, i) => v * (b[i] ?? 0));
}

function trapezoid(x: number[], y: number[]): number {
  let total = 0;
  for (let i = 0; i < x.length - 1; i++) {
    const dx = x[i + 1]! - x[i]!;
    total += 0.5 * dx * (y[i]! + y[i + 1]!);
  }
  return total;
}
