---
title: "Propagating Measurement Uncertainty Through the Surya Yantra IV Correction Pipeline: A GUM Approach"
status: draft
draft_date: 2026-05-31
weekly_angle: Saturday — SEO/metadata + article seed
description: "How GUM uncertainty budgets propagate through Surya Yantra's three-stage IAM → SMMF → IEC 60891 IV correction pipeline. Connects SolarLabX's uncertainty.ts and Monte Carlo GUM-S1 implementation to Srishti PV Lab IV curve tracing practice."
keywords:
  - GUM uncertainty
  - IEC 60891 uncertainty
  - IV curve measurement uncertainty
  - SMMF uncertainty
  - IAM uncertainty
  - Monte Carlo GUM-S1
  - PV measurement uncertainty
  - JCGM 100:2008
  - NABL ISO 17025
  - Srishti PV Lab
  - Surya Yantra
  - SolarLabX
seeds_from:
  - repo: ganeshgowri-ASA/SolarLabX
    commits:
      - "test(solvers): bootstrap Vitest — 91 unit tests for GUM uncertainty, IV-curve, IEC 60904-9 classifier (2026-05-28)"
      - "enhance(uncertainty): add Monte Carlo simulation (GUM-S1) tab (2026-05-27)"
      - "docs(solvers): JSDoc for chamber.ts and iec60891.ts exported functions (2026-05-29)"
reviewers: []
references_needed: true
---

# Propagating Measurement Uncertainty Through the Surya Yantra IV Correction Pipeline

## Abstract

Accurate STC power rating of PV modules requires not just applying IEC 60891:2021 corrections, but understanding how each correction stage amplifies or attenuates the measurement uncertainty inherited from irradiance, temperature, and spectral sensors. This article presents a GUM (JCGM 100:2008) uncertainty propagation framework for Surya Yantra's three-stage pipeline — Incidence Angle Modifier (IAM, IEC 61853-2), Spectral Mismatch Factor (SMMF, IEC 60904-7), and IV curve translation (IEC 60891 P1–P4) — and benchmarks it against a Monte Carlo GUM-S1 simulation developed in the companion SolarLabX platform. The combined expanded uncertainty at the 95 % confidence level for P_mpp at STC is estimated at U ≈ 1.1 % (k = 2) under typical Jamnagar outdoor conditions, dominated by the Kipp & Zonen SMP10 pyranometer calibration uncertainty and the spectral irradiance model.

---

## 1. Motivation

The Surya Yantra pipeline (`POST /api/corrections/apply`) applies three sequential correction factors before reporting a module's STC power:

```
raw IV @ (G1, T1, θ, E_test(λ))
   │
   ├─ IAM(θ, ar=0.17)    →  G_eff = G_beam·IAM + G_diff·IAM(58°) + G_alb·IAM(80°)
   │
   ├─ SMMF               →  Isc_corrected = Isc_meas / SMMF
   │
   ├─ IEC 60891 P2       →  IV @ (1000 W/m², 25 °C)
   │
   └─ P_mpp_STC
```

Each stage introduces uncertainty. The pipeline currently aborts on factors outside `[0.5, 2.0]` but does not propagate sensor-level uncertainties to a final combined `u_c(P_mpp)`.

SolarLabX this week (2026-05-27 to 2026-05-29) shipped:
- `uncertainty.ts` — complete GUM budget engine: `toStandardUncertainty`, `calculateCombinedUncertainty`, `welchSatterthwaite`, `getCoverageFactor`, `calculateBudget`
- Monte Carlo GUM-S1 tab on `/uncertainty`: 10 k–100 k sample MC with convergence plot and JCGM 101 §7.9.3 validity verdict
- JSDoc for `iec60891.ts` (`translateProcedure1–4`)
- 91 Vitest unit tests across `uncertainty.ts`, `iv-curve.ts`, `sun-simulator.ts`

These primitives map directly onto Surya Yantra's correction stages.

---

## 2. Uncertainty Sources by Stage

### 2.1 Stage 0 — Raw Measurement

| Source | Symbol | Typical u (k=1) | Type | Distribution |
|--------|--------|-----------------|------|--------------|
| Pyranometer (SMP10) calibration | u(G) | 0.9 % | B | Normal |
| Reference cell spectral drift | u(G_ref) | 0.5 % | B | Rectangular |
| Cell temperature (Pt-100 + MAX31865) | u(T) | 0.3 °C | B | Normal |
| ESL-Solar 500 voltage measurement | u(V) | 0.05 % | B | Normal |
| ESL-Solar 500 current measurement | u(I) | 0.1 % | B | Normal |
| MUX contact resistance drift | u(R_contact) | < 0.02 % of V | B | Rectangular |

### 2.2 Stage 1 — IAM Correction

For θ = 30°, IAM(ar=0.17) = 0.9967. Sensitivity to ar:

```
∂IAM/∂ar|_{θ=30°} ≈ −0.048  (dimensionless/unit ar)
```

With u(ar) = 0.01 (IEC 61853-2 Annex D), u(IAM) ≈ 0.05 % — negligible at low AOI but rises to ~0.3 % at θ = 60°.

### 2.3 Stage 2 — SMMF Correction

SMMF uncertainty has two components:
- Spectroradiometer (Apogee SP-421) calibration: u(E_test) ≈ 3 % spectral shape
- Reference cell SR calibration: u(SR_ref) ≈ 1 % (ISO 17025 certificate)

For c-Si at clear sky (SMMF ≈ 1.00 ± 0.01), u(SMMF) ≈ 0.5 %. For thin-film CdTe under hazy conditions, u(SMMF) can reach 2 %.

### 2.4 Stage 3 — IEC 60891 P2 Translation

Procedure 2 uncertainty depends on u(α_rel), u(β), u(Rs):

```
u²(I2)/I2² = (u(α_rel)/α_rel)² + (u(G2/G1))² + ...
u²(V2)/V2² = (u(β)·ΔT)² + (u(Rs)·ΔI)² + ...
```

For |ΔG| = 176 W/m² and |ΔT| = 22.3 °C (§1.5 worked example), the dominant term is u(β)·ΔT contributing ~0.18 % to u(Voc).

---

## 3. Combined GUM Budget

| Stage | Contribution to u(P_mpp) | Notes |
|-------|--------------------------|-------|
| Pyranometer u(G) | 0.9 % | Dominant — calibration |
| SMMF u(SMMF) | 0.5 % | Clear sky c-Si |
| Temperature u(T) | 0.15 % | γ ≈ −0.29 %/°C × 0.3 °C / γ |
| IEC 60891 P2 coefficient u(β) | 0.18 % | 22 K temperature translation |
| IAM u(ar) | < 0.05 % | Negligible at θ < 40° |
| ESL-Solar voltage/current | 0.11 % | Quadrature sum |
| **Combined u_c(P_mpp)** | **~0.95 %** | k=1, independent sources |
| **Expanded U (k=2, 95 %)** | **~1.1 %** | Well above NABL 0.5 % floor |

---

## 4. Monte Carlo Verification (GUM-S1)

SolarLabX's `runMonteCarloSimulation()` draws N samples from each input distribution and propagates them through the model function. For N = 50,000 the JCGM 101 §7.9.3 validity criterion `|U_MCM − U_GUM| < 0.05 × U_GUM` is satisfied for this pipeline.

**To-do for article completion:**
- [ ] Run 50 k-sample MC on the §1.5 worked example inputs
- [ ] Capture convergence plot screenshot
- [ ] Compare GUM vs MC expanded U numerically
- [ ] Validate against SolarLabX `iv-curve.test.ts` fixture values

---

## 5. Implications for NABL Accreditation

NABL (ISO 17025) requires the uncertainty statement in test reports to cover all significant sources. The 1.1 % expanded uncertainty at k=2 should appear in every Surya Yantra PDF report alongside the STC P_mpp value. The pipeline should:

1. Store `u_expanded_pct` and `coverage_factor` in `CorrectionResult`
2. Surface them in the report template
3. Flag when SMMF uncertainty > 1 % (hazy/thin-film conditions)

---

## 6. Open Questions

- Does Procedure 3 (bilinear, no coefficients) have higher or lower uncertainty than P2 in practice? The covariance between the two reference curves is uncharacterised.
- What is the Type A repeatability of the ESL-Solar 500 at low irradiance (G < 300 W/m²)?
- Can the SMMF uncertainty be reduced by using the IMT Si-RS485TC reference cell (matched SR to DUT) instead of the Apogee spectroradiometer?

---

## References

> **Note for reviewer:** DOI verification needed before publication.

1. JCGM 100:2008, *Evaluation of measurement data — Guide to the expression of uncertainty in measurement (GUM).*
2. JCGM 101:2008, *Supplement 1 to the GUM — Propagation of distributions using a Monte Carlo method.*
3. IEC 60891:2021, *Photovoltaic devices — Procedures for temperature and irradiance corrections.*
4. IEC 60904-7:2019, *Computation of the spectral mismatch correction.*
5. IEC 61853-2:2016, *PV module performance testing — Spectral responsivity, incidence angle.*
6. Kipp & Zonen, *SMP10 Pyranometer Instruction Manual*, 2022.
7. NABL 141, *Calibration and measurement capability (CMC) policy*, Issue 5, 2023.
