---
title: "From Vitest to NABL: Turning Unit Tests into a Formal Measurement Uncertainty Budget"
status: draft
created: 2026-05-13
updated: 2026-05-20
tags: [vitest, nabl, uncertainty, iec-60891, metrology, testing]
weekly-angle: wednesday-reference-enhancement
resolves-issue: 33
---

# From Vitest to NABL: Turning Unit Tests into a Formal Measurement Uncertainty Budget

> **Status:** Draft — Wednesday reference-enhancement pass (2026-05-20). Metrology citations added per issue #33; numerical uncertainty budget table is a placeholder pending actual calibration data.

## Abstract

Surya Yantra's 46-test Vitest suite covers the IEC 60891 correction engine, SMMF computation, and Martin-Ruiz IAM model. These tests verify code correctness — but a NABL-accredited PV testing laboratory must also provide a **measurement uncertainty budget** linking software implementation to the physical accuracy of reported Pmax, Isc, and Voc at STC. This article bridges the gap: we show how each Vitest assertion corresponds to a GUM-compliant uncertainty component, and how to aggregate them into the combined expanded uncertainty U(k=2) required for NABL 141.

---

## 1. The Gap Between Software Testing and Metrological Uncertainty

A passing Vitest assertion like:

```ts
expect(correctProcedure1(curve, params, STC).pmpp).toBeCloseTo(451, 1);
```

tells us the implementation matches the reference calculation to one decimal place. It does **not** tell us:

- What the residual error of Procedure 1 vs. Procedure 2 is at this irradiance ratio (a **method uncertainty**).
- How much the reference cell's irradiance reading drifts over a working day (a **sensor uncertainty**).
- Whether the 16-bit ADC in the electronic load limits voltage resolution below the test tolerance (an **instrument uncertainty**).

NABL 141 [1] and the GUM framework [2] require all such components to be enumerated, quantified, and combined before a measurement result can carry a calibration-backed uncertainty statement.

---

## 2. Uncertainty Components in the IEC Correction Pipeline

### 2.1 Component taxonomy

Following GUM §4, uncertainty sources are classified as Type A (evaluated by statistical means) or Type B (evaluated from other information):

| Component | Type | Source |
|---|---|---|
| u₁ — E-load ADC quantisation (V) | B | ESL-Solar 500 spec: 16-bit, 0–300 V → LSB = 4.6 mV |
| u₂ — E-load ADC quantisation (I) | B | 16-bit, 0–27 A → LSB = 0.41 mA |
| u₃ — Reference cell irradiance (G) | B | Kipp & Zonen SMP10 Class A: ±2% at k=2 [8] |
| u₄ — Pt-100 temperature (T_cell) | A | Allan deviation from 30-day reference log |
| u₅ — IEC 60891 P1 method error | B | Worked example in IEC-CORRECTIONS.md §1.5: ΔPmpp = 1 W at 450 W |
| u₆ — SMMF field range | B | IEC 60904-7 Annex D: ±3% for c-Si under hazy conditions |
| u₇ — IAM Martin-Ruiz parameterisation | B | Literature: ar = 0.17 ± 0.01 → ΔIAM ≤ 0.3% at θ ≤ 60° |
| u₈ — 4-wire Kelvin lead resistance | B | Measured at commissioning; residual <0.5 mΩ → ΔV < 0.05 mV at 27 A |

### 2.2 Combination (GUM §5)

For Pmpp at STC, the combined standard uncertainty is:

```
u_c(Pmpp) = √[ (∂Pmpp/∂V·u₁)² + (∂Pmpp/∂I·u₂)² + (∂Pmpp/∂G·u₃)² + … ]
```

Partial derivatives are computed from the IEC 60891 equations. The dominant term at typical outdoor conditions (G = 800 W/m², T = 45 °C) is **u₃** (irradiance sensor), contributing ~1.0% to Pmpp uncertainty.

| Component | Standard uncertainty | Sensitivity coeff. | Contribution to u_c |
|---|---|---|---|
| u₁ (ADC V) | 1.3 mV | ∂P/∂V = 9.5 A | 12 mW |
| u₂ (ADC I) | 0.24 mA | ∂P/∂I = 45 V | 11 mW |
| u₃ (G sensor) | 1% (k=1) | ∂P/∂G = 0.45 W/(W/m²) | 4.5 W |
| u₅ (P1 method) | 0.22% (k=1) | — | 1.0 W |
| u₆ (SMMF) | 1.5% (k=1) | — | 6.8 W |
| **u_c(Pmpp)** | | | **~8.2 W (1.8%)** |
| **U(Pmpp) k=2** | | | **~16 W (3.6%)** |

> **Note:** This table uses estimated values; replace with actual calibration data from the lab's irradiance reference chain before NABL submission.

---

## 3. Mapping Vitest Tests to Uncertainty Components

| Vitest test | What it verifies | Uncertainty component it constrains |
|---|---|---|
| `correctProcedure1` reference point | P1 algorithm matches IEC §5.1 formula | u₅ — bounds method error to <1 W at 450 W Pmpp |
| `correctProcedure2` vs P1 comparison | P2 vs P1 discrepancy at ΔG=200 W/m² | u₅ — P1 vs P2 method choice contributes ≤0.5% |
| `computeSMMF` unit values | SMMF = 1.0 when E_test = E_ref | u₆ — software side verified; sensor side is separate |
| `iamMartinRuiz(60, {ar:0.17})` | IAM = 0.9499 ± 1e-4 | u₇ — algorithm error bounded to <0.01% |
| `findMPP` on synthetic curve | MPP located within ±0.1 W | Cursor resolution component (ADC quantisation) |

Annotating each test with `@uncertainty-component u₅` and the sensitivity coefficient in a YAML front-matter block creates a machine-readable link between the CI green state and the uncertainty budget — making it auditable without manual cross-referencing.

---

## 4. Proposed Test Annotation Schema

```ts
/**
 * @uncertainty-component u5
 * @sensitivity-coefficient 0.0022
 * @bound-type upper
 * @standard IEC 60891:2021 §5.1
 */
test("P1 correction matches worked example ±1 W at 450 W", () => {
  const result = correctProcedure1(referenceCurve, moduleParams);
  expect(result.pmpp).toBeCloseTo(451, 1);
});
```

A CI step can then extract these annotations, aggregate the contributions, and fail the build if `u_c(Pmpp)` exceeds a NABL-specified threshold.

---

## 5. Open Questions (gaps before promotion)

- [ ] Actual Allan deviation measurement for the Pt-100 chain (u₄) — needs 30-day temperature log from the lab.
- [ ] ESL-Solar 500 ADC non-linearity spec — the datasheet quotes INL but not TUE; request from ET SolarPower.
- [ ] GUM Supplement 1 [3] Monte Carlo propagation for non-linear correction (P3 bilinear interpolation).
- [ ] NABL 141 Annex A template: fill in "Laboratory name", "Test item", "Measurand" fields.

---

## References

1. NABL, *NABL 141: Guidelines for Estimation of Uncertainty of Measurement in Testing*, National Accreditation Board for Testing and Calibration Laboratories, New Delhi, India, 2021.
2. BIPM / IEC / IFCC / ILAC / ISO / IUPAC / IUPAP / OIML, *Evaluation of measurement data — Guide to the expression of uncertainty in measurement (GUM)*, JCGM 100:2008, Joint Committee for Guides in Metrology, 2008.
3. BIPM et al., *Evaluation of measurement data — Supplement 1 to the "GUM" — Propagation of distributions using a Monte Carlo method*, JCGM 101:2008, JCGM, 2008.
4. IEC 60891:2021, *Photovoltaic devices — Procedures for temperature and irradiance corrections to measured I-V characteristics*, IEC, Geneva, 2021.
5. IEC 60904-7:2019, *Photovoltaic devices — Part 7: Computation of the spectral mismatch correction for measurements of photovoltaic devices*, IEC, Geneva, 2019.
6. IEC 61853-2:2016, *Photovoltaic (PV) module performance testing and energy rating — Part 2: Spectral responsivity, incidence angle and module operating temperature measurements*, IEC, Geneva, 2016.
7. IEC 60904-1:2020, *Photovoltaic devices — Part 1: Measurement of photovoltaic current-voltage characteristics*, IEC, Geneva, 2020.
8. Kipp & Zonen, *SMP10 Pyranometer Datasheet*, Kipp & Zonen B.V., Delft, 2023. Available: https://www.kippzonen.com/Product/16/SMP10.
9. EA, *EA-4/02 M:2022 Evaluation of the Uncertainty of Measurement in Calibration*, European Accreditation, Brussels, 2022.
10. Martin, N. and Ruiz, J.M., "Calculation of the PV modules angular losses under field conditions by means of an analytical model," *Solar Energy Materials and Solar Cells*, vol. 70, no. 1, pp. 25–38, 2001. doi:10.1016/S0927-0248(00)00408-6.

---

*Wednesday reference-enhancement pass by Claude Code, 2026-05-20. Closes issue #33 citation gap. Numerical uncertainty budget is indicative; replace with lab-measured calibration data before NABL submission.*
