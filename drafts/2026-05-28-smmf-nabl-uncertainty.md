---
title: "From trapz to NABL: Numerical Integration Uncertainty in IEC 60904-7 SMMF"
slug: "smmf-nabl-uncertainty-iec60904-7"
status: "seed"
date: "2026-05-28"
lastmod: "2026-05-28"
author: "Srishti PV Lab"
affiliation: "Srishti PV Lab, Jamnagar, Gujarat, India"
target_venue: "Measurement (Elsevier) or Solar Energy (Elsevier)"
keywords:
  - spectral mismatch factor
  - IEC 60904-7
  - numerical integration uncertainty
  - GUM JCGM 100
  - NABL ISO 17025
  - trapezoidal rule
  - solar irradiance spectrum
  - PV measurement uncertainty
  - AM1.5G
  - spectral responsivity
---

# From `trapz` to NABL: Numerical Integration Uncertainty in IEC 60904-7 Spectral Mismatch Factor

## Abstract (draft)

The IEC 60904-7:2019 spectral mismatch factor (SMMF) corrects short-circuit current
for differences between the test spectrum and the AM1.5G reference. In Surya Yantra's
`lib/smmf.ts`, the four required integrals are evaluated using the trapezoidal rule
over a harmonised wavelength grid. While numerically straightforward, this approach
introduces a discretisation error whose magnitude depends on the native grid spacing
of the input spectral data — a dependence that is neither documented in the
implementation nor quantified in the existing uncertainty budget.

This paper analyses the numerical integration error of `computeSMMF()` using the
GUM (JCGM 100:2008) framework, derives a Type-B uncertainty contribution from the
trapezoidal quadrature error, and maps the result onto the NABL ISO 17025 uncertainty
budget required for accredited PV measurement at Srishti PV Lab.

## 1. Motivation

NABL accreditation (ISO/IEC 17025:2017) requires a complete measurement uncertainty
budget for every reported quantity. The corrected Isc from `POST /api/corrections/smmf`
(`Isc_corrected = Isc_measured / SMMF`) inherits uncertainty from:

1. `Isc_measured` — instrument uncertainty of the ESL-Solar 500 (0.1% FS)
2. Irradiance sensor calibration — Kipp & Zonen SMP10 (< 2% per ISO 9060:2018)
3. Reference cell calibration — IMT Si-RS485TC-T-MB (traceable to ISE Fraunhofer)
4. **Numerical integration of SMMF** — unquantified in current implementation

Item 4 is the gap this paper addresses.

## 2. Method (outline)

### 2.1 Trapezoidal error formula

For a function `f(λ)` on `[a, b]` with `n` uniform intervals of width `h`:

```
ε_trap = -(b - a) · h² / 12 · f''(ξ)   for some ξ ∈ [a, b]
```

For non-uniform grids (the `unionGrid` case in `smmf.ts`), the bound is:

```
ε_trap ≤ Σ_i h_i³ / 12 · max|f''(λ)| on [λ_i, λ_{i+1}]
```

### 2.2 Spectral data grid spacing

| Source | Typical Δλ (nm) | Points in 300–1200 nm |
|--------|----------------|----------------------|
| IEC 60904-3 AM1.5G table | 1 nm | ~900 |
| Apogee SP-421 spectroradiometer | 1 nm | ~900 |
| Generic module SR datasheet | 10–50 nm | 18–90 |

Coarse SR datasheets (10–50 nm spacing) dominate the grid error.

### 2.3 GUM Type-B budget entry

The SMMF ratio amplifies the integration error. A first-order analysis gives:

```
u_B(SMMF) ≈ SMMF · √(ε_num_top² + ε_num_bot²) / integral_ref
```

Initial estimate (to be validated): for 50 nm SR grids, `u_B(SMMF) ≈ 0.3–0.8%`.
This is comparable to the typical SMMF range for c-Si under clear-sky (0.98–1.02),
making it non-negligible at NABL level.

## 3. Proposed fix (outline)

Two approaches:

1. **Minimum grid spacing requirement** — reject SR data with Δλ > 5 nm via the API
   input schema (`POST /api/corrections/smmf` validation).
2. **Gauss-Legendre quadrature** — replace `trapz` with 5-point G-L on each interval;
   increases accuracy by ~4 orders of magnitude with the same data.

## 4. TODO before draft

- [ ] Run `computeSMMF()` with synthetic test cases (known SMMF = 1.000) to measure
  actual numerical error vs. grid spacing
- [ ] Derive the formal GUM budget table with 5 uncertainty contributions
- [ ] Validate against Apogee SP-421 field data from the Srishti lab (when available)
- [ ] Add API input validation for SR grid spacing in `POST /api/corrections/smmf`
- [ ] Review IEC 60904-7:2019 Annex A for any guidance on integration method

## References (seed)

1. IEC 60904-7:2019, *Computation of the spectral mismatch correction for measurements
   of photovoltaic devices*. IEC, Geneva.
2. JCGM 100:2008 (GUM), *Evaluation of measurement data — Guide to the Expression
   of Uncertainty in Measurement*. BIPM, Sèvres.
3. NABL 141, *Guidelines for Estimation and Expression of Uncertainty in Measurement*.
   National Accreditation Board for Testing and Calibration Laboratories, India.
4. IEC 60904-3:2019, *Measurement principles for terrestrial PV devices with reference
   spectral irradiance data*. IEC, Geneva.
5. Smestad G.P. et al. (2008). *Reporting solar cell efficiencies in Solar Energy
   Materials and Solar Cells*. Sol. Energy Mater. Sol. Cells, 92(4), 371–373.
   DOI: 10.1016/j.solmat.2008.01.003
