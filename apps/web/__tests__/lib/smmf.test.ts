import { describe, expect, it } from 'vitest';
import {
  computeSMMF,
  correctIscForSpectrum,
  interpolate,
  trapz,
  unionGrid,
  type SpectralSeries,
} from '../../lib/smmf';

/**
 * Minimal AM1.5G reference points (IEC 60904-3 tabulated values, sampled).
 * Not the full 1-nm grid — the interpolator handles arbitrary grids.
 */
const AM15G: SpectralSeries = {
  wavelength: [300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
  values: [0.01, 0.82, 1.54, 1.58, 1.35, 1.05, 0.82, 0.72, 0.36, 0.32],
};

/** Representative c-Si spectral responsivity (A/W). */
const SR_CSI: SpectralSeries = {
  wavelength: [300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
  values: [0.05, 0.20, 0.35, 0.45, 0.52, 0.55, 0.50, 0.35, 0.05, 0.00],
};

/** CdTe thin-film — cut-off around 850 nm. */
const SR_CDTE: SpectralSeries = {
  wavelength: [300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
  values: [0.12, 0.38, 0.48, 0.46, 0.35, 0.15, 0.02, 0.00, 0.00, 0.00],
};

describe('SMMF — helpers', () => {
  it('interpolates linearly on the target grid', () => {
    const s: SpectralSeries = { wavelength: [400, 600], values: [2, 4] };
    const out = interpolate(s, [400, 500, 600]);
    expect(out).toEqual([2, 3, 4]);
  });

  it('returns zero outside the defined wavelength range', () => {
    const s: SpectralSeries = { wavelength: [400, 600], values: [2, 4] };
    expect(interpolate(s, [300, 700])).toEqual([0, 0]);
  });

  it('trapezoidal integration over a constant function returns width·value', () => {
    const grid = [0, 1, 2, 3, 4];
    const y = [2, 2, 2, 2, 2];
    expect(trapz(grid, y)).toBeCloseTo(8, 9);
  });

  it('unionGrid merges and sorts unique wavelengths', () => {
    const a: SpectralSeries = { wavelength: [300, 500, 700], values: [1, 1, 1] };
    const b: SpectralSeries = { wavelength: [400, 500, 600], values: [1, 1, 1] };
    expect(unionGrid(a, b)).toEqual([300, 400, 500, 600, 700]);
  });
});

describe('SMMF — IEC 60904-7', () => {
  it('is unity when test spectrum equals reference spectrum', () => {
    const smmf = computeSMMF({
      testSpectrum: AM15G,
      refSpectrum: AM15G,
      refCellSR: SR_CSI,
      dutSR: SR_CDTE,
    });
    expect(smmf).toBeCloseTo(1, 9);
  });

  it('is unity when DUT SR equals reference-cell SR', () => {
    const smmf = computeSMMF({
      testSpectrum: { ...AM15G, values: AM15G.values.map(v => v * 0.7) },
      refSpectrum: AM15G,
      refCellSR: SR_CSI,
      dutSR: SR_CSI,
    });
    expect(smmf).toBeCloseTo(1, 9);
  });

  it('is < 1 for a blue-rich test spectrum and a blue-sensitive DUT', () => {
    const blueRich: SpectralSeries = {
      wavelength: AM15G.wavelength,
      // Boost ≤500 nm, suppress >800 nm
      values: AM15G.values.map((v, i) => (AM15G.wavelength[i] <= 500 ? v * 1.5 : v * 0.7)),
    };
    const smmf = computeSMMF({
      testSpectrum: blueRich,
      refSpectrum: AM15G,
      refCellSR: SR_CSI,
      dutSR: SR_CDTE,
    });
    // CdTe collects the extra blue better than c-Si → denominator grows →
    // SMMF = num/denom < 1.
    expect(smmf).toBeLessThan(1);
  });

  it('is > 1 for a red-rich spectrum with a red-biased c-Si reference', () => {
    const redRich: SpectralSeries = {
      wavelength: AM15G.wavelength,
      values: AM15G.values.map((v, i) => (AM15G.wavelength[i] >= 700 ? v * 1.5 : v * 0.7)),
    };
    const smmf = computeSMMF({
      testSpectrum: redRich,
      refSpectrum: AM15G,
      refCellSR: SR_CSI,
      dutSR: SR_CDTE,
    });
    expect(smmf).toBeGreaterThan(1);
  });

  it('rejects non-monotonic wavelength grids', () => {
    const bad: SpectralSeries = { wavelength: [400, 300], values: [1, 2] };
    expect(() =>
      computeSMMF({ testSpectrum: bad, refSpectrum: AM15G, refCellSR: SR_CSI, dutSR: SR_CDTE }),
    ).toThrow();
  });
});

describe('SMMF — Isc correction', () => {
  it('divides Isc by the mismatch factor', () => {
    expect(correctIscForSpectrum(9.5, 0.95)).toBeCloseTo(10, 6);
  });

  it('rejects non-positive SMMF', () => {
    expect(() => correctIscForSpectrum(9.5, 0)).toThrow();
    expect(() => correctIscForSpectrum(9.5, -1)).toThrow();
  });
});
