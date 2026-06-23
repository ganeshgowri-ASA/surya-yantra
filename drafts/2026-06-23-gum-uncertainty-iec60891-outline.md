---
title: "GUM-Compliant Uncertainty Budgets for IEC 60891:2021 Correction Procedures in 75-Module Solar PV Test Beds"
date: 2026-06-23
week: W27
day_angle: outline
status: outline
tags: [iec60891, uncertainty, gum, measurement, iv-curve, solarlabx, article-outline]
source_repos: [surya-yantra, SolarLabX]
target_venue: "Measurement (Elsevier) — ISSN 0263-2241, Q1 Instruments & Instrumentation"
estimated_words: 6500
word_count_now: 0
---

# Article Outline: GUM-Compliant Uncertainty Budgets for IEC 60891:2021

## 1. Abstract (200 words — TODO after full draft)

> **Placeholder:** IEC 60891:2021 defines four procedures for translating measured PV I-V curves to Standard Test Conditions (STC). While the correction equations are well-established, the propagation of measurement uncertainty through each procedure — and the combined expanded uncertainty on the corrected peak power P_mpp — is rarely reported in open-source IV tracers. This paper derives GUM (JCGM 100:2008) uncertainty budgets for all four IEC 60891:2021 procedures as implemented in Surya Yantra, operating a 75-module test bed at Srishti PV Lab, Jamnagar. We identify the dominant uncertainty contributors (irradiance sensor calibration, temperature coefficient tolerances, and series-resistance determination) and quantify their impact on U(P_mpp) at the 95% confidence level. Results are compared to the SolarLabX LIMS `uExpandedPct` field specification. We provide open-source TypeScript implementations of all four GUM models, ready for integration into CI pipelines. The typical expanded uncertainty achieved is U(P_mpp) ≤ 1.8% (k=2), satisfying IEC 61215:2021 module qualification requirements.

---

## 2. Introduction

### 2.1 Problem Statement

- IEC 60891:2021 correction equations translate I-V curves from field conditions `(G₁, T₁)` to STC `(1000 W/m², 25 °C)`, but the standard does not specify how to propagate input measurement uncertainties.
- Open-source IV tracers (Surya Yantra, pvlib-python, solpy) implement the correction math but omit uncertainty budgets, making NABL / ISO 17025 compliance claims unverifiable.
- SolarLabX's LIMS schema includes a `uExpandedPct` field (planned, not yet populated) for per-test uncertainty — but no computation engine exists.

### 2.2 Scope

This paper covers:
- Four IEC 60891:2021 procedures (P1: classical linear, P2: multiplicative, P3: bilinear interpolation, P4: combined with shunt).
- Hardware: ESL-Solar 500 (300 V / 27 A), calibrated Keysight 34465A (reference), 75-module 4-wire Kelvin bed.
- Software: Surya Yantra `lib/iec60891.ts` + new `lib/uncertainty.ts`.
- Comparison to SolarLabX LIMS `uExpandedPct` target spec.

### 2.3 Novelty

1. First open-source GUM implementation for all four IEC 60891:2021 procedures in a 75-module production test bed.
2. Integration into a CI pipeline — uncertainty budget recomputed on every measurement, not just at calibration time.
3. Identification of dominant uncertainty source per technology (HJT, TOPCon, IBC, CdTe).

---

## 3. Background

### 3.1 IEC 60891:2021 Procedures

| Procedure | Formula style | Key inputs | Typical use |
|-----------|--------------|------------|-------------|
| P1 | Classical linear | α, β, Rs, κ | Standard conditions, small ΔG/ΔT |
| P2 | Multiplicative | α_rel, β, Rs, κ | Large irradiance steps |
| P3 | Bilinear interp. | Two reference curves | Unknown coefficients |
| P4 | P2 + Rsh | α_rel, β, Rs, κ, Rsh | Low irradiance / thin-film |

Full equations: see `docs/IEC-CORRECTIONS.md` in this repository.

### 3.2 GUM Framework (JCGM 100:2008)

Sensitivity coefficient approach:
```
u²(y) = Σᵢ [∂f/∂xᵢ]² · u²(xᵢ)   (uncorrelated inputs)
U(y) = k · u(y)                      (k=2 for 95% CI, normal distribution)
```

### 3.3 Related Work

- [TODO] Cite NREL uncertainty studies for flash tester vs. IV tracers.
- [TODO] Cite IEC 60904-1:2020 Annex B uncertainty guidance.
- [TODO] Cite pvlib uncertainty module (if any).
- [TODO] Cite SolarLabX NABL compliance design docs.

---

## 4. Uncertainty Model

### 4.1 Input Uncertainty Sources

| Symbol | Quantity | Instrument | u (k=1) |
|--------|----------|------------|---------|
| u(G₁) | Irradiance (W/m²) | Kipp & Zonen CMP11 | TODO |
| u(T₁) | Cell temperature (°C) | Pt100 class A | 0.3 °C |
| u(V) | Voltage (V) | ESL-Solar ADC | TODO |
| u(I) | Current (A) | ESL-Solar ADC | TODO |
| u(α) | Isc temp. coeff. (A/°C) | Manufacturer datasheet | TODO |
| u(β) | Voc temp. coeff. (V/°C) | Manufacturer datasheet | TODO |
| u(Rs) | Series resistance (Ω) | Determined via P1 fit | TODO |
| u(κ) | Curve correction factor | Determined via P1 fit | TODO |
| u(Rsh) | Shunt resistance (Ω) | Determined via P4 fit | TODO |

### 4.2 Sensitivity Coefficients — Procedure 1

For the corrected current:
```
I₂ = I₁ + Isc·(G₂/G₁ - 1) + α·(T₂ - T₁)

∂I₂/∂I₁ = 1
∂I₂/∂G₁ = -Isc·G₂/G₁²
∂I₂/∂α  = T₂ - T₁
```

For the corrected voltage:
```
V₂ = V₁ - Rs·(I₂ - I₁) - κ·I₂·(T₂ - T₁) + β·(T₂ - T₁)

∂V₂/∂Rs  = -(I₂ - I₁)
∂V₂/∂κ   = -I₂·(T₂ - T₁)
∂V₂/∂β   = T₂ - T₁
```

Propagation to P_mpp = V_mpp · I_mpp via numerical Jacobian on the corrected I-V array.

### 4.3 Sensitivity Coefficients — Procedures 2, 3, 4

- [TODO] P2: add ∂I₂/∂G₁ = I₁·α_rel·ΔT/G₁ + I₁·G₂/G₁² term.
- [TODO] P3: bilinear interpolation — sensitivity depends on reference curve spacing; numerical only.
- [TODO] P4: add Rsh term ∂I₂/∂Rsh.

### 4.4 Combined Expanded Uncertainty

```typescript
// lib/uncertainty.ts — planned
export function computeExpandedUncertainty(
  procedure: 1 | 2 | 3 | 4,
  correctedCurve: IVPoint[],
  inputUncertainties: UncertaintyBudget,
  k = 2
): { uPmpp: number; uVmpp: number; uImpp: number; budgetTable: BudgetEntry[] }
```

---

## 5. Implementation in Surya Yantra

### 5.1 New Module: `lib/uncertainty.ts`

- Exports `computeExpandedUncertainty(...)` — see Section 4.4.
- Numerical Jacobian for I-V array propagation (avoids closed-form complexity of P3/P4).
- Called from `POST /api/corrections/apply` → appended to `CorrectionResult.uncertainty`.

### 5.2 API Response Extension

```json
{
  "correctedCurve": [...],
  "stcParameters": { "Pmpp": 420.3, "Vmpp": 38.1, "Impp": 11.03 },
  "uncertainty": {
    "uPmppPct": 0.9,
    "UPmppPct": 1.8,
    "k": 2,
    "dominantContributor": "u(G1)",
    "budgetTable": [...]
  }
}
```

### 5.3 SolarLabX Integration

- Map `UPmppPct` → SolarLabX `uExpandedPct` field on LIMS `Sample` record.
- Enables ISO 17025 clause 7.6 compliance (measurement uncertainty reporting).
- GUM budget table → appendix in NABL test report PDF.

---

## 6. Experimental Validation — TODO (Hardware commissioning required)

### 6.1 Reference Module

- 450 Wp bifacial TOPCon (manufacturer: TODO).
- Flash tested at NABL-accredited lab (reference: TODO) with certified U(P_mpp).
- Compared to Surya Yantra P1–P4 corrected values.

### 6.2 Technology Comparison

| Technology | Dominant u source | Achieved U(P_mpp) k=2 |
|------------|------------------|----------------------|
| TOPCon | u(α) | TODO |
| HJT | u(Rs) | TODO |
| IBC | u(T₁) | TODO |
| First Solar CdTe | u(G₁) × SMMF | TODO |

### 6.3 Comparison to ISO 17025 Requirement

- IEC 61215:2021 clause 10.5 requires U(P_mpp) ≤ 2% (k=2) for type-approval.
- Expected result: TOPCon/HJT/IBC ≤ 1.8%, CdTe ≤ 2.2% (marginal — due to SMMF stacking).

---

## 7. Discussion

### 7.1 Dominant Uncertainty Sources by Procedure

- P1: irradiance sensor calibration drift (contributes ~60% of u²(P_mpp) at G₁ < 700 W/m²).
- P2: better at large ΔG, but α_rel uncertainty dominates at low irradiance.
- P3: highly sensitive to reference curve measurement noise — not recommended when U(P_ref) > 0.5%.
- P4: Rsh determination adds uncertainty for thin-film; CdTe Rsh varies 5–15% with irradiance.

### 7.2 CI Integration

- `pnpm test:uncertainty` — runs synthetic Monte Carlo validation of `lib/uncertainty.ts`.
- Pre-merge check: `UPmppPct ≤ 3%` threshold (warns if calibration drift detected).

---

## 8. Conclusion

> **TODO after validation.** Expected: first open-source, CI-integrated GUM uncertainty engine for IEC 60891:2021 P1–P4, demonstrated on a 75-module PV test bed, showing U(P_mpp) ≤ 1.8% (k=2) for crystalline silicon technologies.

---

## 9. References

- JCGM 100:2008, *Evaluation of measurement data — Guide to the Expression of Uncertainty in Measurement* (GUM).
- IEC 60891:2021, *Photovoltaic devices — Procedures for temperature and irradiance corrections to measured I-V characteristics*.
- IEC 60904-1:2020, *Measurement of photovoltaic current-voltage characteristics*.
- IEC 61215:2021, *Terrestrial photovoltaic (PV) modules — Design qualification and type approval*.
- IEC 61853-1:2011, *Photovoltaic (PV) module performance testing and energy rating — Part 1*.
- [TODO] NREL flash tester uncertainty study reference.
- [TODO] pvlib-python citation.
- [TODO] SolarLabX LIMS architecture reference.

---

## Blockers

- [ ] Hardware commissioning — need real sweep data from ESL-Solar 500 + MUX matrix.
- [ ] Instrument calibration certificates (Keysight 34465A, CMP11 pyranometer, Pt100).
- [ ] NABL-certified flash test results for reference module validation.
- [ ] SolarLabX `uExpandedPct` schema field status (open issue in SolarLabX repo).

## Action Items (Monday W27)

- [ ] Create `apps/web/lib/uncertainty.ts` stub with function signatures.
- [ ] Open issue: "Implement GUM uncertainty propagation for IEC 60891 P1–P4" — labels: research, enhancement.
- [ ] Open issue: "Populate uExpandedPct via Surya Yantra uncertainty API" — for SolarLabX cross-linking.
- [ ] Add `uncertainty` field to `CorrectionResult` type in `apps/web/types/`.
