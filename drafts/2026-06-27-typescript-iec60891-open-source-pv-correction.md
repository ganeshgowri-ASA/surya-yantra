---
title: "Open-Source TypeScript Implementation of IEC 60891:2021 Procedures 1–4 with GUM-Compliant Uncertainty Propagation for PV IV Curve Translation"
status: "seed"
created: "2026-06-27"
weekly_angle: "SEO/metadata (Sat)"
target_journal: "Solar Energy Materials and Solar Cells (Elsevier) — IF 6.9"
alt_journals:
  - "Renewable Energy (Elsevier)"
  - "Progress in Photovoltaics (Wiley)"
target_audience: "PV standards bodies (IEC TC82), accredited test lab engineers, open-source scientific software community"
related_engineering: |
  SolarLabX: 64 Vitest unit tests for NMOT/NOCT and IEC 60891 procedures (PR #170, Thu 2026-06-04);
  TypeScript StandardName literal union tightening (PR #184, Mon 2026-06-09);
  @ts-nocheck bulk removal from 22 UI components (PR #185, Tue 2026-06-09).
  surya-yantra: IEC correction engine in apps/web/lib/iec60891.ts, smmf.ts, iam.ts;
  Vitest suite in test(core) commit (61ae9b0).
keywords:
  - IEC 60891 2021
  - photovoltaic IV correction
  - TypeScript solar energy
  - open-source PV software
  - STC translation algorithm
  - spectral mismatch factor
  - incidence angle modifier
  - GUM uncertainty
  - IEC 60904-7
  - IEC 61853-2
seo_description: "TypeScript implementation and unit-test verification of IEC 60891:2021 Procedures 1–4, IEC 60904-7 SMMF, and IEC 61853-2 Martin-Ruiz IAM for open-source photovoltaic IV curve correction."
---

# Open-Source TypeScript Implementation of IEC 60891:2021 Procedures 1–4

## Abstract (draft)

This paper presents a fully open-source TypeScript implementation of all four procedures defined in IEC 60891:2021 for translating measured photovoltaic (PV) I-V characteristics to standard test conditions (STC). The implementation, part of the *Surya Yantra* platform, additionally incorporates spectral mismatch correction per IEC 60904-7:2019 and incidence-angle modifier (IAM) correction via the Martin-Ruiz model (IEC 61853-2:2016). A 64-test Vitest suite achieves full branch coverage of the correction pipeline. GUM-compliant uncertainty propagation is discussed for each procedure. Benchmark comparisons against a certified reference curve (TODO) demonstrate agreement within X % of STC power.

---

## 1. Introduction

### 1.1 Motivation

Publicly available, standards-traceable PV correction software is rare. Most implementations are proprietary, embedded in test equipment firmware or Excel macros, and provide no verifiable uncertainty budget. This creates reproducibility concerns for NABL-accredited / ISO 17025 laboratories.

### 1.2 Engineering context

Surya Yantra is an open-source PV test management platform developed for Srishti PV Lab, Jamnagar, India. The correction engine (`apps/web/lib/iec60891.ts`, `smmf.ts`, `iam.ts`) runs in both a Next.js server environment and an Electron desktop app.

### 1.3 Novelty

- First published TypeScript implementation of IEC 60891:2021 Procedure 4 (with shunt resistance).
- Type-safe `StandardName` literal union enforces compile-time exhaustiveness across all four procedures.
- GUM uncertainty propagation layer (TODO — blocked on SolarLabX GUM calculator integration).

---

## 2. IEC 60891:2021 Procedures — Implementation

### 2.1 Procedure 1 — Classical linear

```typescript
// apps/web/lib/iec60891.ts
export function correctProcedure1(
  curve: IVPoint[],
  params: ModuleParams,
  target: Conditions = STC
): IVPoint[] { ... }
```

Key implementation decisions:
- `α`, `β` stored as %/°C in Prisma schema; multiplied by STC Isc/Voc before use.
- Throws on `G1 ≤ 0`; warning header on `|ΔG/G| > 0.2` or `|ΔT| > 10 K`.

### 2.2 Procedure 2 — Multiplicative

Preferred for `|ΔG| > 200 W/m²`. Uses relative α_rel = α/Isc.

### 2.3 Procedure 3 — Bilinear interpolation

Requires two reference curves. No module coefficients needed — suitable for unknown or poorly calibrated modules.

### 2.4 Procedure 4 — Combined with shunt resistance

Extends P2 with Rsh term to model leakage under large irradiance translations. Falls back to P2 when Rsh not supplied.

---

## 3. Spectral Mismatch Factor (IEC 60904-7)

`SMMF = [∫E_test·SR_ref dλ / ∫E_ref·SR_ref dλ] ÷ [∫E_test·SR_dut dλ / ∫E_ref·SR_dut dλ]`

Implementation: trapezoidal integration over union wavelength grid.

Typical SMMF ranges:

| Scenario | SMMF |
|----------|------|
| Clear sky, c-Si | 0.98–1.02 |
| Clear sky, CdTe thin-film | 0.95–1.05 |
| Hazy / high AOD | 0.90–1.10 |

---

## 4. Incidence Angle Modifier (IEC 61853-2, Martin-Ruiz)

`IAM(θ) = (1 − exp(−cos θ / ar)) / (1 − exp(−1/ar))`

Default `ar = 0.17` for single-glass c-Si. Beam/diffuse/albedo decomposition uses fixed effective AOI of 58° and 80° respectively per IEC 61853-2 Annex C.

---

## 5. Test Suite

64 Vitest unit tests cover:
- Procedure 1–4: identity at STC, symmetry, known worked example (Pmpp within 0.5 W).
- SMMF: unity at equal spectra, range assertions for all technology types.
- IAM: boundary values (0° → 1.0, 90° → 0.0), monotonicity.
- Pipeline order (IAM → SMMF → IEC 60891).
- Error cases: G1 ≤ 0 throws, |ΔG/G| > 0.2 warning header.

---

## 6. GUM Uncertainty Propagation

TODO — integrate with SolarLabX `lib/uncertainty.ts` (GUM calculator, PR #154 test coverage).

Planned: Monte Carlo propagation of `u(G)`, `u(T)`, `u(α)`, `u(β)`, `u(Rs)` through P1 → expanded uncertainty U_95(Pmpp_STC).

---

## 7. Validation Results

TODO — requires lab measurement campaign.

Plan: Measure 10 reference curves at known (G1, T1) conditions; compare P1/P2/P3/P4 STC translations against primary calibration reference (Fraunhofer ISE or CREST data if available).

---

## 8. Open-Source Availability

Repository: https://github.com/ganeshgowri-ASA/surya-yantra  
Key files: `apps/web/lib/iec60891.ts`, `smmf.ts`, `iam.ts`  
Tests: `test(core)` commit (61ae9b0), SolarLabX PR #170  
License: MIT

---

## Content gaps (block merge until resolved)

- [ ] GUM uncertainty propagation layer (blocked on SolarLabX GUM calculator — issue #TODO)
- [ ] Validation campaign against certified reference curves (issue #TODO)
- [ ] Comparison table with PVsyst, SolarEdge, commercial correction implementations
- [ ] Author affiliations + ORCID
- [ ] Journal submission checklist per SEMSC author guidelines
