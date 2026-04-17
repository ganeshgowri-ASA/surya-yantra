/**
 * Spectral Mismatch Factor (SMMF) per IEC 60904-7:2019.
 *
 *   SMMF = [∫E_test(λ)·SR_ref(λ)dλ / ∫E_ref(λ)·SR_ref(λ)dλ]
 *         / [∫E_test(λ)·SR_dut(λ)dλ / ∫E_ref(λ)·SR_dut(λ)dλ]
 *
 * where
 *   E_ref(λ)  = AM1.5G reference spectrum (IEC 60904-3)
 *   E_test(λ) = measured incident spectrum at the DUT plane
 *   SR_ref(λ) = spectral responsivity of the reference cell
 *   SR_dut(λ) = spectral responsivity of the device under test
 *
 * SMMF = 1 when spectra and devices match. Use to correct Isc:
 *   Isc_corrected = Isc_measured / SMMF
 */

export interface SpectralSeries {
  /** Wavelength grid in nanometres — strictly monotonic increasing. */
  wavelength: number[];
  /** Sample values. Units are irrelevant because they cancel in the ratio. */
  values: number[];
}

export interface SmmfInputs {
  testSpectrum: SpectralSeries;
  refSpectrum: SpectralSeries;
  refCellSR: SpectralSeries;
  dutSR: SpectralSeries;
}

function assertSeries(name: string, s: SpectralSeries) {
  if (s.wavelength.length !== s.values.length) {
    throw new Error(`${name}: wavelength and values length mismatch`);
  }
  if (s.wavelength.length < 2) {
    throw new Error(`${name}: need at least 2 samples`);
  }
  for (let i = 1; i < s.wavelength.length; i++) {
    if (s.wavelength[i] <= s.wavelength[i - 1]) {
      throw new Error(`${name}: wavelength grid must be strictly increasing`);
    }
  }
}

/** Linear interpolation onto `targetGrid`. Outside-range values use nearest edge (clamped to 0). */
export function interpolate(series: SpectralSeries, targetGrid: number[]): number[] {
  assertSeries('series', series);
  const out = new Array<number>(targetGrid.length);
  const { wavelength: wl, values: v } = series;
  let j = 0;
  for (let i = 0; i < targetGrid.length; i++) {
    const x = targetGrid[i];
    if (x < wl[0] || x > wl[wl.length - 1]) {
      out[i] = 0;
      continue;
    }
    while (j < wl.length - 2 && wl[j + 1] < x) j++;
    const frac = (x - wl[j]) / (wl[j + 1] - wl[j]);
    out[i] = v[j] + frac * (v[j + 1] - v[j]);
  }
  return out;
}

/** Trapezoidal integration of y(λ) over the provided grid. */
export function trapz(grid: number[], y: number[]): number {
  if (grid.length !== y.length) throw new Error('grid/y length mismatch');
  let s = 0;
  for (let i = 1; i < grid.length; i++) {
    const dx = grid[i] - grid[i - 1];
    s += 0.5 * dx * (y[i] + y[i - 1]);
  }
  return s;
}

/** Produce the union-sorted wavelength grid of the four series. */
export function unionGrid(...series: SpectralSeries[]): number[] {
  const set = new Set<number>();
  for (const s of series) for (const w of s.wavelength) set.add(w);
  return Array.from(set).sort((a, b) => a - b);
}

/**
 * Compute the spectral mismatch factor (SMMF).
 * Returns 1 for identical test/ref spectra and identical SR curves.
 */
export function computeSMMF(inputs: SmmfInputs): number {
  const { testSpectrum, refSpectrum, refCellSR, dutSR } = inputs;
  assertSeries('testSpectrum', testSpectrum);
  assertSeries('refSpectrum', refSpectrum);
  assertSeries('refCellSR', refCellSR);
  assertSeries('dutSR', dutSR);

  const grid = unionGrid(testSpectrum, refSpectrum, refCellSR, dutSR);
  const eTest = interpolate(testSpectrum, grid);
  const eRef = interpolate(refSpectrum, grid);
  const srRef = interpolate(refCellSR, grid);
  const srDut = interpolate(dutSR, grid);

  const numerator = trapz(grid, eTest.map((e, i) => e * srRef[i])) /
                    trapz(grid, eRef.map((e, i) => e * srRef[i]));
  const denominator = trapz(grid, eTest.map((e, i) => e * srDut[i])) /
                      trapz(grid, eRef.map((e, i) => e * srDut[i]));

  if (denominator === 0) throw new Error('Denominator integral is zero — spectra do not overlap DUT SR');
  return numerator / denominator;
}

/** Apply SMMF correction to a measured short-circuit current. */
export function correctIscForSpectrum(iscMeasured: number, smmf: number): number {
  if (smmf <= 0) throw new Error('SMMF must be positive');
  return iscMeasured / smmf;
}
