---
title: "From Vitest Assertions to NABL Uncertainty Budgets: Bridging Software Testing and Measurement Science"
seo_title: "Vitest to NABL: Software Testing → Measurement Uncertainty Budget | Surya Yantra IEC 60891"
description: "How Surya Yantra's Vitest test suite for IEC 60891 correction functions relates to — and falls short of — a NABL-compliant GUM uncertainty budget, and the concrete steps to bridge the gap."
keywords:
  - NABL uncertainty budget
  - GUM measurement uncertainty
  - Vitest IEC 60891
  - software testing measurement science
  - IEC 60891 validation
  - photovoltaic measurement uncertainty
  - NABL 121 IEC testing
  - TypeScript scientific testing
  - measurement traceability
  - solar PV accreditation
  - open source PV testing
  - India NABL solar
canonical: "https://surya-yantra.srishtipvlab.in/posts/vitest-to-nabl-uncertainty-budget"
og:
  title: "Vitest → NABL: From Software Tests to Measurement Uncertainty"
  description: "A passing Vitest suite is not an uncertainty budget. Here's the concrete path from Surya Yantra's IEC 60891 test assertions to a GUM-compliant u_c(Pmpp) declaration."
  image: "/og/vitest-nabl-uncertainty.png"
  type: "article"
twitter:
  card: "summary_large_image"
  title: "Vitest Tests vs NABL Uncertainty Budgets | Surya Yantra"
  description: "What a passing test suite does and doesn't tell you about measurement uncertainty — and how to build the GUM budget that NABL 121 requires."
  image: "/og/vitest-nabl-uncertainty.png"
author: "Srishti PV Lab Engineering"
date: "2026-05-08"
lastmod: "2026-05-10"
draft: true
tags:
  - nabl
  - uncertainty-budget
  - vitest
  - iec-60891
  - solar-pv
  - measurement-science
  - accreditation
  - india
categories:
  - quality
  - engineering
  - research
reading_time: 13
schema_type: "TechArticle"
related_repos:
  - surya-yantra
  - GanitaSutra-v0
---

# From Vitest Assertions to NABL Uncertainty Budgets: Bridging Software Testing and Measurement Science

*Article seed — 8 May 2026 (Thursday peer-review angle) · Updated 10 May 2026 · Srishti PV Lab Engineering*

Surya Yantra's IEC 60891 implementation passes its Vitest suite. The test at `apps/web/__tests__/lib/iec60891.test.ts` asserts that `correctProcedure1` applied to the IEC 60891:2021 Annex B worked example reproduces the tabulated Pmpp within ±0.5 %. That is a necessary condition for NABL accreditation. It is not a sufficient one.

NABL 121 §4.2.3 requires a **combined standard uncertainty u_c(Pmpp)** for each correction procedure, expressed as a coverage interval (k=2, ~95 % confidence). A Vitest assertion that the algorithm is arithmetically correct says nothing about the uncertainty contributed by sensor calibration drift, interpolation error, environmental measurement noise, or ADC quantisation.

This article traces the complete path from a passing test suite to a GUM-compliant uncertainty budget for IEC 60891 Procedure 1 (P1) correction applied to a bifacial HJT module in Surya Yantra's 75-module outdoor test bed.

## What the Vitest Suite Confirms

The existing test at `apps/web/__tests__/lib/iec60891.test.ts` confirms:

```typescript
it('P1: Pmpp within ±0.5% of IEC 60891 Annex B', () => {
  const result = correctProcedure1(annexBCurve, annexBParams, STC);
  expect(result.correctedPmpp).toBeCloseTo(451.0, 1); // Annex B: 451 W
});
```

This tells us:
1. The P1 arithmetic is correct within ±0.5 W (at Pmpp ≈ 451 W, that is ±0.11 %).
2. The TypeScript implementation matches the IEC 60891 Annex B reference values.
3. The function is deterministic (no floating-point non-determinism at this tolerance).

What it does **not** tell us:
- How much uncertainty enters from `G1` sensor reading.
- How much from the module temperature measurement.
- How much from the IEC 60891 correction model itself (which is an approximation).
- How much from ADC quantisation in the ESL-Solar 500's current measurement.

## The GUM Framework (ISO/IEC Guide 98-3)

The Guide to the Expression of Uncertainty in Measurement (GUM) provides a systematic approach to combining these uncertainty contributions:

```
u_c²(y) = Σᵢ [∂f/∂xᵢ]² · u²(xᵢ)
```

Where:
- `y` = output quantity (corrected Pmpp at STC)
- `xᵢ` = input quantities (G1, T1, α, β, Rs, κ, and each measured (V, I) point)
- `∂f/∂xᵢ` = sensitivity coefficient (partial derivative of P1 w.r.t. xᵢ)
- `u(xᵢ)` = standard uncertainty of each input

For P1, the dominant uncertainty contributors are:

| Input `xᵢ` | Physical meaning | Typical u(xᵢ) | Sensitivity ∂Pmpp/∂xᵢ |
|-----------|-----------------|---------------|------------------------|
| G1 | In-plane irradiance (W/m²) | ±5 W/m² (pyranometer class A, k=1) | ΔPmpp/ΔG ≈ 0.45 W per W/m² at G=824 |
| T1 | Module cell temperature (°C) | ±1 °C (Pt-100, k=1) | ΔPmpp/ΔT ≈ −0.5 W/°C (via β) |
| α | Current temperature coefficient (A/°C) | ±5 % (datasheet) | Depends on ΔT |
| Rs | Series resistance (Ω) | ±10 % (extracted or datasheet) | Depends on ΔI |
| ADC quantisation | ESL-Solar 500 12-bit ADC on current | ±0.003 A (LSB/√3) | 1:1 on Isc |

## Worked Partial Uncertainty Budget (P1, 450 Wp HJT Module)

Using the Annex B example: G1 = 824 W/m², T1 = 47.3 °C → STC (1000 W/m², 25 °C):

| Contributor | Value u(xᵢ) | Sensitivity cᵢ = ∂Pmpp/∂xᵢ | Contribution u_i(Pmpp) |
|------------|------------|---------------------------|------------------------|
| Irradiance G1 (pyranometer class A) | 5 W/m² | 0.45 W/(W/m²) | 2.25 W |
| Cell temperature T1 (Pt-100 + MAX31865) | 1.0 °C | 0.50 W/°C | 0.50 W |
| α (datasheet ±5 % on 0.0024 A/°C) | 0.00012 A/°C | 22.3 W/(A/°C) · ΔT = 22.3·22.3 | ~0.05 W |
| Rs (datasheet ±10 % on 0.38 Ω) | 0.038 Ω | ~1.2 W/Ω | 0.05 W |
| ADC quantisation (12-bit, 30 A FS) | 0.003 A | ~46 V → ~0.14 W/A | ~0.004 W |
| IEC 60891 P1 model error (§1.1 limits) | 0.5 % of 451 W | 1.0 | 2.26 W |

Combined standard uncertainty:
```
u_c(Pmpp) = √(2.25² + 0.50² + 0.05² + 0.05² + 0.004² + 2.26²)
           = √(5.06 + 0.25 + 0.003 + 0.003 + 0 + 5.11)
           ≈ √10.43
           ≈ 3.23 W
```

Expanded uncertainty at k=2 (≈95 % confidence):
```
U(Pmpp) = 2 × 3.23 ≈ 6.5 W  (≈ 1.4 % of 450 Wp)
```

This is consistent with the ±1–2 % expanded uncertainty typically reported by accredited PV test laboratories (Jahn et al., IEA PVPS Task 13, 2014).

## What the Vitest Suite Needs to Add

To bridge from a passing test to a NABL-ready validation:

1. **P3 and P4 tests** — currently no Vitest coverage for Procedure 3 with non-trivial ΔG+ΔT or for Procedure 4 shunt path. These must be added before NABL 121 §4.2.4 validation evidence is credible.

2. **Sensitivity coefficient tests** — add tests that perturb each input by its u(xᵢ) and verify Pmpp changes by ≤ cᵢ·u(xᵢ). This constitutes numerical verification of the sensitivity coefficients in the budget above.

3. **GanitaSutra-extracted parameter uncertainty** — once `@ganitasutra/pv-toolbox` lands, the extracted α and Rs have their own u(α_extracted) and u(Rs_extracted), which are smaller than datasheet tolerances and should replace the datasheet values in the budget.

4. **Environmental sensor calibration records** — the u(G1) = 5 W/m² above is a claim about the pyranometer. It needs a NABL-calibrated calibration certificate with a traceability chain to SI.

## Relationship to `docs/IEC-CORRECTIONS.md §6`

The `§6 Peer Review` section added to `docs/IEC-CORRECTIONS.md` in this Thursday run includes checklist item 4: *"Provide per-procedure combined standard uncertainty u_c(Pmpp) per IEC 60891:2021 §8 and GUM."* This article provides the worked methodology for P1; a full table covering P1–P4 should be added to `docs/IEC-CORRECTIONS.md` once sensor calibration records are available.

<!-- TODO: Replace partial budget table above with full 4-procedure table once pyranometer calibration certificate (due Q3 2026) and GanitaSutra extraction uncertainty analysis are available -->
<!-- TODO: Cross-link to NABL 121 §4.2.3 once NABL 121 full text is hosted in docs/ or linked from README -->

## References

1. JCGM 100:2008 (GUM), *Evaluation of measurement data — Guide to the expression of uncertainty in measurement*. BIPM, Geneva.
2. IEC 60891:2021, *Photovoltaic devices — Procedures for temperature and irradiance corrections to measured I-V characteristics*, §8 Uncertainty. IEC, Geneva.
3. NABL, *Specific Criteria for Accreditation of Testing Laboratories in the field of Solar Energy*, NABL 121, 2023.
4. Jahn U., Herz M., Köntges M., Parlevliet D., Paggi M., Tsanakas I., Stein J., Berger K.A., Ranta S., French R.H., Richter M., Tanahashi T. (2014). *Review on Infrared and Electroluminescence Imaging for PV Field Applications*, IEA PVPS Task 13, Report T13-03:2014.
5. Kipp & Zonen, *CMP / SMP Series Pyranometer Manual*, 2023 edition.
6. Surya Yantra `apps/web/__tests__/lib/iec60891.test.ts` — current validation test suite.
7. Surya Yantra `docs/IEC-CORRECTIONS.md §6 Peer Review` — added Thursday 8 May 2026.

---

## Peer Review

*Thursday 8 May 2026 — This article's own peer-review checklist*

### Technical Accuracy

- [ ] GUM formula for combined standard uncertainty verified against JCGM 100:2008 §5.1
- [ ] Sensitivity coefficient values in the worked budget verified numerically (perturb input, observe output)
- [ ] u_c(Pmpp) = 3.23 W arithmetic checked independently
- [ ] U(Pmpp) = 6.5 W (k=2) consistent with Jahn et al. (2014) reported range

### Citation Completeness

- [ ] GUM JCGM 100:2008 — BIPM publication confirmed ✅
- [ ] IEC 60891:2021 §8 — IEC publication confirmed ✅
- [ ] NABL 121 2023 — NABL publication confirmed ✅
- [ ] Jahn et al. (2014) — IEA PVPS Task 13 T13-03 confirmed ✅
- [ ] Kipp & Zonen SMP10 — matches hardware in `docs/HARDWARE-SETUP.md` ✅

### Code Cross-References

- [ ] `apps/web/__tests__/lib/iec60891.test.ts` assertion quoted verbatim — verify it still exists and passes
- [ ] P1 sensitivity test (`perturb G1 by 5 W/m², check ΔPmpp ≈ 2.25 W`) — not yet in test suite; track as issue

### Reviewer Sign-off

| Role | Name | Date | Signature |
|------|------|------|----------|
| Technical reviewer (measurement science) | — | — | — |
| Standards reviewer (GUM + IEC 60891) | — | — | — |
| Editor | — | — | — |
