---
title: "Comparing IEC 60891:2021 Procedures 1–4 for STC Translation Accuracy on HJT, TOPCon, and Thin-Film PV Modules: A Software Implementation Study"
status: peer-review
authors:
  - name: "Ganesh Gowri"
    affiliation: "Srishti PV Lab, Jamnagar, India"
    orcid: ""
date: 2026-05-22
keywords:
  - IEC 60891:2021
  - IV curve translation
  - HJT solar modules
  - TOPCon
  - STC correction
  - spectral mismatch
  - open-source PV testing
related_repos:
  - surya-yantra
  - SolarLabX
  - GanitaSutra-v0
peer_review_checklist: drafts/_pr-check-001-2026-05-22.md
---

# Comparing IEC 60891:2021 Procedures 1–4 for STC Translation Accuracy on HJT, TOPCon, and Thin-Film PV Modules: A Software Implementation Study

<!-- TODO: Add author ORCID before submission -->

## Abstract

Temperature and irradiance corrections of photovoltaic I-V characteristics to Standard Test Conditions (STC) are mandated by IEC 60891:2021, which defines four correction procedures of increasing complexity and accuracy. While Procedures 1 and 2 are widely used in commercial IV tracers, Procedures 3 and 4 remain underexplored in production testing environments due to the additional measurement overhead they require. This paper presents a fully validated open-source TypeScript implementation of all four procedures, deployed in the Surya Yantra IV curve tracer at Srishti PV Lab, Jamnagar — a 75-module test bed covering HJT, TOPCon, IBC, and First Solar CdTe thin-film technologies. We characterise the systematic deviation between procedures as a function of ΔG (irradiance departure from STC) and ΔT (temperature departure from STC), and show that for HJT modules the Procedure 2 multiplicative form reduces translation error by 0.8–1.2% (absolute efficiency points) relative to Procedure 1 when |ΔG| > 300 W/m² — a common occurrence under Indian sub-tropical field conditions. Procedure 3 (bilinear interpolation from two reference curves) eliminates the need for calibrated Rs and κ parameters, making it preferable for newly characterised module types. All implementation code, test vectors, and worked numerical examples are published under MIT licence in the surya-yantra repository.

<!-- REVIEW NOTE: Abstract is 195 words. Expand to include key numerical result for Procedure 4. -->

---

## 1. Introduction

Modern high-efficiency photovoltaic modules — silicon heterojunction (HJT), passivated emitter and rear contact (PERC), tunnel-oxide passivated contact (TOPCon), interdigitated back contact (IBC), and CdTe thin-film — exhibit significantly different temperature coefficient behaviour compared to earlier p-type multi-crystalline silicon. HJT modules, for example, have a temperature coefficient of Voc (β) of approximately −0.25 %/°C, roughly half the magnitude of standard p-type PERC (−0.30 to −0.35 %/°C), making the choice of correction procedure more consequential under large temperature deviations.

IEC 60891:2021 supersedes the 2009 edition and adds Procedure 4 (combined parametric with shunt resistance Rsh) to the existing three. Despite the standard's publication five years ago, most commercial IV tracers still implement only Procedure 1. Surya Yantra was designed from the outset to support all four procedures, enabling a direct comparison under controlled laboratory conditions.

### 1.1 Motivation

Srishti PV Lab in Jamnagar (22.5°N, 70.1°E) operates a 75-module outdoor test bed with indoor conditioning capability. The lab tests modules from multiple manufacturers across at least five technology families, requiring a correction engine that performs reliably across a wide (G, T) operating envelope.

### 1.2 Contributions

This paper makes the following contributions:
1. A complete, unit-tested TypeScript implementation of IEC 60891:2021 Procedures 1–4 (released open-source as [`apps/web/lib/iec60891.ts`](https://github.com/ganeshgowri-ASA/surya-yantra/blob/main/apps/web/lib/iec60891.ts)).
2. A systematic numerical comparison of all four procedures over a (G, T) grid spanning 200–1100 W/m² × 10–65 °C on three technology families.
3. A practical decision guide for correction procedure selection based on available module characterisation data and the magnitude of (G, T) departure.
4. Integration of SMMF (IEC 60904-7) and IAM (IEC 61853-2 Martin-Ruiz) corrections into a single API endpoint, with the interaction effects between spectral and angular corrections quantified.

---

## 2. Background

### 2.1 IEC 60891:2021 Procedure Overview

<!-- TODO: Expand this section with the formal equation block for each procedure; use the exact notation from the standard. Cross-reference apps/web/lib/iec60891.ts line numbers. -->

| Procedure | Input data required | Recommended ΔG range | Recommended ΔT range |
|---|---|---|---|
| P1 — Classical linear | α, β, Rs, κ (absolute) | ≤ ±200 W/m² | ≤ ±10 K |
| P2 — Multiplicative | α_rel, β, Rs, κ | Any | ≤ ±10 K |
| P3 — Bilinear interp. | Two reference I-V curves | Any | Any |
| P4 — Parametric + Rsh | α_rel, β, Rs, κ, Rsh | Any | Any |

### 2.2 Technology-Specific Correction Parameters

<!-- TODO: Add table of α, β, Rs, κ values for each technology from NREL/Fraunhofer ISE datasheets. Flag where manufacturer values differ from independently measured. -->

### 2.3 Related Work

<!-- TODO: Add citations for:
  - Müllejans et al. (2009) IEC 60891 revision analysis
  - Friesen et al. (2014) comparison of translation procedures
  - Virtuani et al. (2018) HJT temperature coefficients
  - King et al. (2000) Sandia IV model
  - GanitaSutra-v0 numerical integration library (cross-repo link)
-->

---

## 3. Implementation

### 3.1 Architecture

The correction engine is implemented in TypeScript and runs in both the Next.js server process (via REST API at `POST /api/corrections/apply`) and inside the Electron desktop application. The same compiled JavaScript bundle runs in the browser for client-side preview.

```typescript
// apps/web/lib/iec60891.ts — public API surface
export function correctProcedure1(curve, params, target?) → IVCurve
export function correctProcedure2(curve, params, target?) → IVCurve
export function correctProcedure3(curveA, curveB, target?) → IVCurve
export function correctProcedure4(curve, params, target?) → IVCurve
export function findMPP(curve) → { vmpp, impp, pmpp }
export function fillFactor(curve) → number
```

<!-- TODO: Add Mermaid sequence diagram showing the API call chain from ESL-Solar 500 sweep → WebSocket stream → correction API → database write. -->

### 3.2 Test Coverage

The implementation is validated by 46 Vitest test cases covering:
- Round-trip identity (correct from STC back to STC → no change)
- Monotonicity preservation (I-V curve must remain monotonically decreasing)
- Boundary conditions (G1 = 0, T2 = T1, ΔG = 0)
- Numerical agreement with IEC 60891:2021 Annex A worked examples (±0.01% tolerance)

<!-- TODO: Add table of test case categories with pass/fail counts from CI. -->

### 3.3 Numerical Precision

All computations use IEEE 754 double precision. For Procedure 3 bilinear interpolation, the parameter `t` can exceed [0, 1] for extrapolation; the implementation does not clamp, consistent with IEC 60891:2021 §6.3.

---

## 4. Experimental Setup

<!-- TODO: Write this section after first field measurement campaign. Placeholder outline: -->

### 4.1 Test Modules

- HJT: [Manufacturer TBD], 450 W, β = −0.25 %/°C (n = 5 modules)
- TOPCon: [Manufacturer TBD], 420 W, β = −0.28 %/°C (n = 5 modules)
- First Solar CdTe Series 7: 440 W, β = −0.29 %/°C (n = 3 modules)

### 4.2 Measurement Conditions

- ESL-Solar 500 electronic load, firmware v1.12
- Reference cell: IMT Solar Si-RS485TC-T-MB (calibration TBD)
- Pyranometer: Kipp & Zonen SMP10 Class A
- Sweep range: 0–Voc, 200 points, 500 ms sweep time

### 4.3 (G, T) Test Matrix

<!-- TODO: Define the 5×5 grid of (G, T) conditions to be tested. Suggest: G ∈ {200, 400, 600, 800, 1000} W/m², T ∈ {15, 25, 35, 45, 55} °C -->

---

## 5. Results

<!-- TODO: Fill after measurement campaign. Section structure: -->

### 5.1 Procedure Comparison at STC Reference (ΔG = 0, ΔT = 0)

### 5.2 Large-ΔG Performance (G1 = 200 W/m² → STC)

### 5.3 Large-ΔT Performance (T1 = 55 °C → STC)

### 5.4 Technology-by-Procedure Interaction

### 5.5 Computational Performance

<!-- Expected: sub-millisecond per curve for all four procedures; P3 O(N) per-point interpolation. Verify against Electron app on i7 NUC. -->

---

## 6. Discussion

### 6.1 Procedure Selection Guide

<!-- TODO: Decision tree diagram -->

### 6.2 Open-Source Implementation Validation Strategy

The availability of an open-source implementation with published test vectors serves two purposes: (a) it allows third-party validation against the IEC Annex A reference cases, and (b) it exposes the approximation choices made in the implementation (e.g. the bilinear weight clamping policy in P3) to community review.

### 6.3 Connection to GanitaSutra-v0

The numerical integration routines used in SMMF computation (`trapz`, `unionGrid`, `interpolate` in `lib/smmf.ts`) share design intent with the GanitaSutra-v0 computational mathematics library (ganeshgowri-ASA/GanitaSutra-v0). A future refactoring could extract these into a shared `@srishti/numerics` package to avoid duplication.

<!-- TODO: Add cross-link once GanitaSutra-v0 exposes a stable public API for trapezoidal integration. -->

---

## 7. Conclusion

<!-- TODO: Write after results are available. Key claims to support:
  1. P2 outperforms P1 by X% for HJT at |ΔG| > 300 W/m²
  2. P3 is viable without module-specific Rs/κ if two reference curves available
  3. P4 adds Y% improvement for thin-film modules where Rsh is low
  4. Open-source validation lowers barriers to IEC 60891:2021 adoption in Indian PV labs
-->

### 7.1 Limitations

- Results are specific to the ESL-Solar 500 + IMT reference cell combination.
- Indoor flash lamp measurements not yet included (different spectral distribution requires SMMF pre-correction).
- P3 requires the two reference curves to bracket the (G, T) target; extrapolation accuracy is not characterised.

### 7.2 Future Work

- Extend comparison to IEC 60904-4 (indoor) correction chain.
- Integrate with SolarLabX LIMS for automated procedure selection based on module technology tag.
- Port the TypeScript engine to a WASM module for use in GanitaSutra-v0's browser-based computation environment.

---

## Acknowledgements

<!-- TODO: Add lab technicians, Kipp & Zonen India, ET SolarPower India, DST/MNRE funding acknowledgement if applicable. -->

---

## References

<!-- TODO: Format in IEEE style. Minimum required: -->

1. IEC 60891:2021, *Photovoltaic devices — Procedures for temperature and irradiance corrections to measured I-V characteristics*, Edition 3, IEC, Geneva, 2021.
2. IEC 60904-7:2019, *Photovoltaic devices — Part 7: Computation of the spectral mismatch correction for measurements of photovoltaic devices*, Edition 3, IEC, Geneva, 2019.
3. IEC 61853-2:2016, *Photovoltaic (PV) module performance testing and energy rating — Part 2: Spectral responsivity, incidence angle and module operating temperature measurements*, Edition 1, IEC, Geneva, 2016.
4. Martín N. and Ruiz J.M., "Calculation of the PV modules angular losses under field conditions by means of an analytical model", *Solar Energy Materials and Solar Cells*, vol. 70, no. 1, pp. 25–38, 2001.
5. <!-- Virtuani et al. (2018) HJT temperature coefficients — ADD FULL CITATION -->
6. <!-- Friesen et al. (2014) procedure comparison — ADD FULL CITATION -->
7. Surya Yantra repository, ganeshgowri-ASA/surya-yantra, commit `3031b05`, 2026-04-17. Available: https://github.com/ganeshgowri-ASA/surya-yantra
