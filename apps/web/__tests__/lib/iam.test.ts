import { describe, expect, it } from 'vitest';
import { iamMartinRuiz, iamCurve, applyIamToPoa, DEFAULT_AR } from '../../lib/iam';

describe('IAM — Martin-Ruiz (IEC 61853-2)', () => {
  it('IAM(0°) = 1 exactly', () => {
    expect(iamMartinRuiz(0)).toBe(1);
  });

  it('IAM(90°) = 0 exactly', () => {
    expect(iamMartinRuiz(90)).toBe(0);
  });

  it('produces Martin-Ruiz reference values with ar = 0.17', () => {
    // Closed-form reference: (1 - exp(-cosθ/ar)) / (1 - exp(-1/ar))
    const ar = 0.17;
    const denom = 1 - Math.exp(-1 / ar);
    const ref = (deg: number) =>
      (1 - Math.exp(-Math.cos((deg * Math.PI) / 180) / ar)) / denom;

    expect(iamMartinRuiz(30)).toBeCloseTo(ref(30), 9);
    expect(iamMartinRuiz(60)).toBeCloseTo(ref(60), 9);
    expect(iamMartinRuiz(80)).toBeCloseTo(ref(80), 9);
    // Sanity: all values fall inside published Martin-Ruiz ranges.
    expect(ref(30)).toBeGreaterThan(0.99);
    expect(ref(60)).toBeGreaterThan(0.94);
    expect(ref(60)).toBeLessThan(0.96);
    expect(ref(80)).toBeGreaterThan(0.60);
    expect(ref(80)).toBeLessThan(0.70);
  });

  it('accepts radians when the option is set', () => {
    expect(iamMartinRuiz(Math.PI / 3, { radians: true })).toBeCloseTo(
      iamMartinRuiz(60),
      9,
    );
  });

  it('is monotonic non-increasing on [0°, 90°]', () => {
    const thetas = Array.from({ length: 91 }, (_, i) => i);
    const values = iamCurve(thetas);
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeLessThanOrEqual(values[i - 1] + 1e-12);
    }
  });

  it('returns different curves for different ar coefficients', () => {
    const soft = iamMartinRuiz(70, { ar: 0.10 });
    const hard = iamMartinRuiz(70, { ar: 0.25 });
    // Lower ar = less loss at moderate AOI
    expect(soft).toBeGreaterThan(hard);
  });

  it('rejects invalid ar', () => {
    expect(() => iamMartinRuiz(30, { ar: 0 })).toThrow();
    expect(() => iamMartinRuiz(30, { ar: -0.1 })).toThrow();
  });

  it('clamps at θ < 0 and θ > 90', () => {
    expect(iamMartinRuiz(-10)).toBe(1);
    expect(iamMartinRuiz(100)).toBe(0);
  });

  it('exposes the documented default ar', () => {
    expect(DEFAULT_AR).toBeCloseTo(0.17, 9);
  });
});

describe('IAM — plane-of-array decomposition', () => {
  it('applies IAM per component and returns modified POA irradiance', () => {
    const poa = { beam: 800, diffuse: 150, albedo: 30 };
    const result = applyIamToPoa(poa, 30);
    // Each component should be scaled by a corresponding IAM factor ∈ (0, 1]
    expect(result).toBeLessThan(poa.beam + poa.diffuse + poa.albedo);
    expect(result).toBeGreaterThan(0);
  });

  it('at AOI=0° the beam component is not attenuated', () => {
    const poa = { beam: 800, diffuse: 0, albedo: 0 };
    const result = applyIamToPoa(poa, 0);
    expect(result).toBeCloseTo(800, 6);
  });

  it('at AOI=90° beam component is fully suppressed but diffuse/albedo survive', () => {
    const poa = { beam: 500, diffuse: 100, albedo: 20 };
    const result = applyIamToPoa(poa, 90);
    // beam contribution = 0, diffuse+albedo contributions scaled but nonzero
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(poa.diffuse + poa.albedo);
  });
});
