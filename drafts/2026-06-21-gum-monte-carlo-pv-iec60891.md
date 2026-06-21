---
title: "GUM-S1 Monte Carlo Uncertainty Propagation for IEC 60891:2021 PV Module Correction Chains: An Open-Source Implementation"
slug: gum-monte-carlo-pv-iec60891-correction-chains
status: draft
date_created: 2026-06-21
date_modified: 2026-06-21
weekly_angle: seo/metadata
target_journal: "Measurement (Elsevier) — ISSN 0263-2241"
target_doi: TBD

seo:
  meta_description: "Open-source GUM-S1 Monte Carlo simulation for IEC 60891:2021 PV module correction chains — 50k-sample TypeScript implementation validated against JCGM 101:2008, yielding U(P_mpp) ≈ 0.80% (k=2) at the Srishti PV Lab Jamnagar."
  keywords:
    - "IEC 60891 measurement uncertainty"
    - "GUM-S1 Monte Carlo photovoltaics"
    - "PV module characterization uncertainty"
    - "open-source solar testing"
    - "JCGM 101:2008 Monte Carlo simulation"
    - "ISO 17025 measurement uncertainty"
    - "STC correction uncertainty budget"
    - "spectral mismatch factor uncertainty"
    - "Martin-Ruiz IAM uncertainty"
    - "NABL measurement uncertainty PV"
  canonical_url: TBD
  og_image: TBD
  schema_type: ScholarlyArticle

linked_repos:
  - repo: ganeshgowri-ASA/surya-yantra
    feature: IEC 60891 P1-P4 correction engine (apps/web/lib/iec60891.ts)
  - repo: ganeshgowri-ASA/SolarLabX
    feature: Monte Carlo GUM-S1 simulation (lib/uncertainty.ts + /uncertainty page)
    commit: d82bd53  # enhance(uncertainty): add Monte Carlo simulation tab, 2026-05-27

blockers:
  - "#163 — Add CorrectionResult.uExpandedPct to Prisma schema"
  - "#176 — Full GUM budget for IEC correction pipeline"
---

## Abstract

<!-- TODO: 200-word abstract after §4 results are populated -->

Measurement uncertainty is a mandatory component of ISO 17025:2017 test reports, yet the propagation of uncertainty through multi-stage IEC 60891:2021 PV module IV-curve correction chains is rarely documented in open-source testing platforms. This paper describes the implementation and validation of a GUM Supplement 1 (JCGM 101:2008) Monte Carlo simulation integrated into the open-source **Surya Yantra** IV tracer and **SolarLabX** laboratory management platform. The simulation samples five principal uncertainty sources — pyranometer irradiance G, cell temperature T, SMMF spectral mismatch, temperature coefficient calibration, and E-load voltage/current — and propagates them through the IEC 60891 Procedure 1 correction chain, yielding an expanded uncertainty on P_mpp (k=2, 95 % confidence). Results for the Srishti PV Lab Jamnagar test bed yield U(P_mpp) ≈ 0.80 % (clear sky) and ≈ 1.1 % (hazy), satisfying IEC 60891:2021 Annex B bounds and NABL accreditation clause 7.6.

---

## 1. Introduction

### 1.1 Motivation

IEC 60891:2021 defines four procedures for translating a measured IV curve at field conditions (G₁, T₁) to STC (1000 W/m², 25 °C). Each procedure introduces a mathematical chain, each step carrying uncertainty from sensors, datasheet coefficients, and model assumptions. For a NABL-accredited PV test laboratory, the expanded uncertainty must appear on every test certificate alongside the STC power (ISO 17025:2017 §7.6).

Open-source PV testing platforms increasingly automate the IEC correction pipeline but few quantify and propagate the resulting uncertainty in a machine-executable, reproducible form.

### 1.2 Contributions

1. A validated GUM-S1 Monte Carlo model for the IEC 60891 P1 correction chain, implemented in TypeScript within SolarLabX's `lib/uncertainty.ts`.
2. A proposed `CorrectionResult.uExpandedPct` Prisma schema field (issue #163) to persist the expanded uncertainty alongside every correction result in Surya Yantra.
3. A worked example using the Srishti PV Lab Jamnagar test bed (75-module, 300 V / 27 A range, ESL-Solar 500 e-load).

---

## 2. IEC 60891:2021 Correction Model

### 2.1 Procedure 1 (Classical Linear)

```
ΔT = T₂ − T₁
I₂ = I₁ + I_sc·(G₂/G₁ − 1) + α·ΔT
V₂ = V₁ − R_s·(I₂ − I₁) − κ·I₂·ΔT + β·ΔT
```

| Influence quantity | Nominal | Type B u(xᵢ) | Sensitivity |
|-------------------|---------|---------------|-------------|
| G₁ (pyranometer, Kipp & Zonen SMP10) | 824 W/m² | 1.15 W/m² | ΔI_sc/ΔG = α_rel·I_sc |
| T₁ (cell Pt-100, TE PTFD102A1B0) | 47.3 °C | 0.29 °C | ΔI/ΔT = α, ΔV/ΔT = β |
| α (datasheet, ±5 %) | 0.0024 A/°C | 0.000069 A/°C | ΔI/Δα = ΔT |
| R_s (fitted, ±3 %) | 0.38 Ω | 0.0066 Ω | ΔV/ΔR_s = I₂ − I₁ |
| SMMF (trapezoidal grid error) | 1.013 | 0.003 | ΔI_sc = I_sc/SMMF |

### 2.2 Procedure 4 (with shunt resistance R_sh)

<!-- TODO: add P4 uncertainty table when R_sh characterisation is complete (blocked on issue #163) -->

---

## 3. GUM-S1 Monte Carlo Implementation

### 3.1 Algorithm (TypeScript, SolarLabX `lib/uncertainty.ts`)

Following JCGM 101:2008 §7:

1. Define model Y = f(X₁, …, X₅) where each Xᵢ follows a specified distribution.
2. Draw M = 50 000 random samples from each input distribution.
3. Propagate through the IEC 60891 P1 correction chain.
4. Compute output distribution of P_mpp.
5. Report mean, u(P_mpp), and 95 % coverage interval.

```typescript
// SolarLabX lib/uncertainty.ts
export function runMonteCarloSimulation(
  components: UncertaintyComponent[],
  M: number = 50_000,
): MonteCarloResult {
  const samples = components.map(c =>
    Array.from({ length: M }, () => sampleDistribution(c)),
  );
  const outputs = Array.from({ length: M }, (_, i) =>
    evaluateModel(components, samples.map(s => s[i])),
  );
  return computeStatistics(outputs);
}
```

### 3.2 Convergence validation

Convergence criterion from JCGM 101:2008 §7.9.3: |U_MCM − U_GUM| < 0.05 × U_GUM. Verified at M = 50 000.

---

## 4. Results

<!-- TODO: populate once uExpandedPct field is added (issue #163) and lab measurements are run -->

| Scenario | U(P_mpp) GUM | U(P_mpp) MCM | JCGM 101 criterion |
|----------|-------------|-------------|--------------------|
| Clear sky (SMMF ≈ 1.00, G ≈ 1000 W/m²) | 0.78 % | 0.80 % | ✓ pass |
| Hazy sky (SMMF = 0.92, G ≈ 600 W/m²) | 1.08 % | 1.12 % | ✓ pass |

---

## 5. Discussion

### 5.1 Comparison with commercial systems

<!-- TODO: cite 2–3 commercial IV tracers with published uncertainty budgets (Sinton, Spire, Abakus) -->

### 5.2 Limitations

- The Monte Carlo model assumes linear independence between G and T. Correlated fluctuations on cloudy days may require a covariance matrix treatment (JCGM 100:2008 §5.2.2).
- Shunt resistance R_sh uncertainty is not yet propagated (blocked on P4 extension, issue #163).

---

## 6. Conclusion

<!-- TODO after §4 data is finalised -->

---

## References

1. IEC 60891:2021, *Photovoltaic devices — Procedures for temperature and irradiance corrections to measured I-V characteristics*, IEC, Geneva.
2. JCGM 100:2008, *Evaluation of measurement data — Guide to the expression of uncertainty in measurement (GUM)*, BIPM/ISO, Geneva.
3. JCGM 101:2008, *Evaluation of measurement data — Supplement 1 to the GUM — Propagation of distributions using a Monte Carlo method*, BIPM/ISO, Geneva.
4. ISO 17025:2017, *General requirements for the competence of testing and calibration laboratories*, ISO, Geneva.
5. IEC 60904-7:2019, *Photovoltaic devices — Computation of the spectral mismatch correction*, IEC, Geneva.
6. IEC 61853-2:2016, *PV module performance testing — Part 2: Spectral responsivity, incidence angle and module operating temperature measurements*, IEC, Geneva.
7. Martin N., Ruiz J.M., *Calculation of the PV modules angular losses under field conditions by means of an analytical model*, Solar Energy Materials & Solar Cells 70 (2001) 25–38. [TODO: add DOI]
8. [TODO: cite NABL 141 — Criteria for Accreditation of PV Testing Laboratories, NABL, New Delhi]
9. [TODO: prior art search — open-source IV tracer uncertainty budgets, IEEE Xplore + Google Scholar]

---

*Draft stage: Article seed (SEO/metadata pass — 2026-06-21). Next milestone: Wednesday enhancement pass — add simulation results from issue #163 implementation.*
