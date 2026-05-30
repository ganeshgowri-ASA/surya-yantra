---
title: "GanitaSutra-v0 as a Drop-in Quadrature Engine for Surya Yantra's SMMF Integration"
slug: "ganitasutra-smmf-quadrature"
status: "seed"
date: "2026-05-30"
lastmod: "2026-05-30"
author: "Srishti PV Lab"
affiliation: "Srishti PV Lab, Jamnagar, Gujarat, India"
target_venue: "Measurement (Elsevier) or Solar Energy (Elsevier)"
keywords:
  - ganitasutra
  - spectral mismatch factor
  - numerical integration
  - gaussian quadrature
  - iec-60904-7
  - measurement uncertainty
  - typescript
  - open-source
seed_source: "GanitaSutra-v0 TypeScript math engine (last commit 2026-05-08, 37 open issues); gap identified in drafts/2026-05-28-smmf-nabl-uncertainty.md"
---

# GanitaSutra-v0 as a Drop-in Quadrature Engine for Surya Yantra's SMMF Integration

## Engineering Signal

GanitaSutra-v0 (`ganeshgowri-ASA/GanitaSutra-v0`, TypeScript, 37 open issues as of
2026-05-08) implements a general-purpose numerical mathematics library for the
Srishti ecosystem. Among its stated capabilities is high-order numerical integration
(Gaussian quadrature, Romberg integration, adaptive Simpson) — precisely the
computational primitive that `apps/web/lib/smmf.ts` currently implements only via
the first-order trapezoidal rule (`trapz`).

The SMMF uncertainty draft (`drafts/2026-05-28-smmf-nabl-uncertainty.md`) identifies
trapezoidal discretisation error as an unquantified uncertainty contribution in the
NABL ISO 17025 budget. GanitaSutra's Gaussian quadrature could eliminate most of this
error (approximately 4 orders of magnitude improvement for the same data density)
while also providing a formal quadrature-error bound.

## Research Question

> Can GanitaSutra-v0's quadrature functions be used as a TypeScript-level drop-in
> replacement for `trapz()` in `apps/web/lib/smmf.ts`, and if so, what is the
> reduction in SMMF numerical integration error for the spectral responsivity grid
> spacings (1–50 nm) encountered in the Srishti lab?

## 1. Motivation

### 1.1 The trapz gap

`lib/smmf.ts` computes the IEC 60904-7 spectral mismatch factor by:
1. Resampling all four spectral series (`E_test`, `E_ref`, `SR_ref`, `SR_dut`) onto
   a union wavelength grid (`unionGrid()`).
2. Integrating each product using the trapezoidal rule (`trapz()`).
3. Forming the SMMF ratio.

For the IEC 60904-3 AM1.5G reference spectrum at 1 nm spacing (~900 points from
300–1200 nm), trapezoidal error is negligible. But most module spectral responsivity
(SR) datasheets are digitised at 10–50 nm spacing — the union grid after harmonisation
retains the coarse SR spacing, and the trapezoidal error on the numerator integral
can reach 0.3–0.8 % (see `drafts/2026-05-28-smmf-nabl-uncertainty.md §2.3`).

### 1.2 GanitaSutra's offer

GanitaSutra-v0 is a TypeScript math library with no browser/Node-specific dependencies,
designed to be consumed as an npm workspace package. If it exports:

```ts
gaussLegendre(f: (x: number) => number, a: number, b: number, n: number): number
// or
adaptiveIntegrate(f: (x: number) => number, a: number, b: number, tol: number): number
```

then `smmf.ts` can be refactored to pass a piecewise-linear interpolation of the
spectral data as `f`, giving the quadrature method control over the sampling density
rather than inheriting the coarse native grid.

## 2. Proposed Method

### 2.1 Refactored `computeSMMF`

```ts
// Current (trapezoidal)
const numerator   = trapz(grid, E_test.map((e, i) => e * SR_ref[i]));
const denominator = trapz(grid, E_ref.map((e, i) => e * SR_ref[i]));
// ...

// Proposed (GanitaSutra quadrature)
import { gaussLegendre } from '@srishti/ganitasutra';
import { piecewiseLinear } from '@srishti/ganitasutra';

const f_num = piecewiseLinear(nativeGrid, E_test_SR_ref_product);
const numerator = gaussLegendre(f_num, 300, 1200, 40);  // 40-point G-L
// ...
```

### 2.2 Validation

- Compute SMMF for synthetic spectra with known closed-form answers (Gaussian,
  polynomial SR × AM1.5G).
- Compare trapezoidal vs GanitaSutra quadrature error against the analytic reference.
- Sweep over SR grid spacings (1, 5, 10, 25, 50 nm) to characterise error vs. density.
- Test on Apogee SP-421 field data from Srishti lab (available ~W25 2026).

### 2.3 API input guard

Independently of which quadrature method is used, add a Zod validation rule to
`POST /api/corrections/smmf` that rejects SR data with native Δλ > 10 nm with a
descriptive 400 error:

```json
{ "error": "SR_dut grid spacing 42 nm exceeds 10 nm limit. Interpolate or resample before submission." }
```

## 3. Engineering Contribution

| Contribution | Scope |
|---|---|
| GanitaSutra quadrature adapter in `lib/smmf.ts` | Surya Yantra repo |
| Quadrature-error Type-B entry in NABL uncertainty budget | Surya Yantra docs |
| Vitest test suite for SMMF numerical accuracy | `apps/web/__tests__` |
| SR grid-spacing validator in `POST /api/corrections/smmf` | Surya Yantra API |
| GanitaSutra export of `gaussLegendre` + `piecewiseLinear` | GanitaSutra-v0 repo |

## 4. TODO before draft

- [ ] Confirm that GanitaSutra-v0 exports `gaussLegendre` or equivalent
- [ ] Check GanitaSutra-v0 package.json for npm workspace compatibility
- [ ] Run synthetic SMMF validation (known answer = 1.000) with trapezoidal vs G-L
- [ ] Derive formal quadrature-error bound as a function of SR grid spacing
- [ ] Add GanitaSutra dependency to `apps/web/package.json`

## References (seed)

1. IEC 60904-7:2019. *Computation of the spectral mismatch correction for
   measurements of photovoltaic devices*. IEC, Geneva.
2. JCGM 100:2008 (GUM). *Evaluation of measurement data — Guide to the Expression
   of Uncertainty in Measurement*. BIPM, Sèvres.
3. Press W.H. et al. (2007). *Numerical Recipes: The Art of Scientific Computing*,
   3rd ed. Cambridge University Press. ISBN 978-0-521-88068-8.
4. IEC 60904-3:2019. *Measurement principles for terrestrial PV devices with
   reference spectral irradiance data*. IEC, Geneva.
