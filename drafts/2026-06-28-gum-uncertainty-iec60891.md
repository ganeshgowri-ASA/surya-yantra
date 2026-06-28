---
title: "GUM Uncertainty Propagation for IEC 60891:2021 IV Curve Corrections in Open-Source PV Test Software"
slug: "gum-uncertainty-iec60891-surya-yantra"
status: outline
target_venue: "Measurement (Elsevier)"
outline_date: 2026-06-28
linked_repos:
  - surya-yantra
  - SolarLabX
tags:
  - GUM
  - uncertainty
  - IEC-60891
  - NABL
  - ISO-17025
  - TypeScript
  - open-source
---

# GUM Uncertainty Propagation for IEC 60891:2021 IV Curve Corrections in Open-Source PV Test Software

> **Status:** outline — `lib/uncertainty.ts` implementation required (issue #209)

## Abstract (draft)

ISO 17025 accreditation for PV test laboratories (NABL in India) requires
documented expanded measurement uncertainty for every corrected IV curve
parameter. The Surya Yantra open-source platform implements all four
IEC 60891:2021 correction procedures with a full Vitest suite (commit
`61ae9b0`), but reports no uncertainty. This paper presents a TypeScript
implementation of GUM (JCGM 100:2008) uncertainty budgets for Procedures
1–4, validated against Monte Carlo simulation (N = 10 000 draws) and
calibration certificates from Srishti PV Lab's measurement chain
(Kipp & Zonen SMP10 pyranometer, Pt-100 class A sensors).

TODO: Monte Carlo validation data required.

## 1. Introduction

### 1.1 Motivation

IEC 61215:2021 specifies that expanded uncertainty U(P_mpp) ≤ 2 % is required
for module power rating measurements. Without uncertainty propagation, software
corrections cannot be included in an accredited calibration chain. Open-source
tools (pvlib, pyiv) provide corrections but not GUM budgets.

### 1.2 Scope

This paper covers Procedures 1–4 of IEC 60891:2021. Uncertainty sources:

| Source          | Symbol   | Typical u (k=1) |
| --------------- | -------- | --------------- |
| Irradiance      | u(G)     | 1–2 % (SMP10)   |
| Cell temperature| u(T)     | 0.3 K (Pt-100 A)|
| α coefficient   | u(α)     | 3–5 % of value  |
| β coefficient   | u(β)     | 3–5 % of value  |
| Series resistance| u(Rs)   | 5–10 % of value |
| κ factor        | u(κ)     | 10 % of value   |

## 2. Theoretical Framework

### 2.1 Procedure 1 — sensitivity coefficients

For a point (I₁, V₁) on the measured curve:

```
u²(I₂) = u²(I₁) + (Isc · G₂/G₁²)² · u²(G₁) + (T₂ − T₁)² · u²(α)

u²(V₂) = u²(V₁) + (I₂ − I₁)² · u²(Rs)
        + (I₂ · ΔT)² · u²(κ)
        + ΔT² · u²(β)
```

Correlated contributions (u(I₁) appears in u(V₂) via I₂ − I₁) are handled
by the covariance term in the combined standard uncertainty.

### 2.2 Procedures 2–4 — numerical Jacobian

Closed-form derivation of sensitivity coefficients for P3 (bilinear
interpolation of two curves) and P4 (shunt resistance extension) is
disproportionately complex. We apply a numerical Jacobian:

```
∂I₂/∂x_i ≈ [I₂(x_i + ε) − I₂(x_i − ε)] / (2ε),  ε = 10⁻⁴ · x_i
```

This decouples the uncertainty engine from the correction algebra and allows
the same `computeExpandedUncertainty` entry point to cover all four procedures.

### 2.3 Monte Carlo validation

For each procedure, draw N = 10 000 samples from the joint input distribution
(all inputs treated as Gaussian) and compare the empirical σ of P_mpp
against the GUM prediction. Acceptance criterion: GUM/MC ratio ∈ [0.95, 1.05].

TODO: Run after `lib/uncertainty.ts` is implemented.

## 3. Implementation

### 3.1 Proposed API (`lib/uncertainty.ts`)

```typescript
export function computeExpandedUncertainty(
  procedure: 1 | 2 | 3 | 4,
  correctedCurve: IVPoint[],
  inputs: UncertaintyBudget,
  k?: number   // coverage factor, default 2 (95 % CI)
): {
  uPmppPct:           number;  // standard uncertainty on P_mpp (%)
  UPmppPct:           number;  // expanded uncertainty k·u
  k:                  number;
  dominantContributor: string;
  budgetTable:        BudgetEntry[];
}
```

Full spec in issue #209.

### 3.2 API surface

`POST /api/corrections/apply` response gains:

```json
{
  "correctedCurve": [...],
  "uncertainty": {
    "uPmppPct": 0.87,
    "UPmppPct": 1.74,
    "k": 2,
    "dominantContributor": "u(G1)",
    "budgetTable": [...]
  }
}
```

### 3.3 PDF report integration

The uncertainty budget table is appended to the STC power report (PDF/XLSX)
to satisfy ISO 17025 clause 7.8.2 (reporting of measurement uncertainty).

## 4. Preliminary Results

TODO: After implementation and Monte Carlo validation (blocked on issue #209).

Expected dominant contributors by technology:

| Technology      | Primary contributor   | Expected U(P_mpp) |
| --------------- | --------------------- | ----------------- |
| TOPCon / HJT    | u(α)                  | 1.5–2.0 %         |
| IBC             | u(T₁)                 | 1.0–1.5 %         |
| First Solar CdTe| u(G₁) × SMMF stacking| 2.5–3.5 %         |

## 5. Discussion

### 5.1 NABL compliance path

With U(P_mpp) documented, Srishti PV Lab can:
1. Populate SolarLabX LIMS `uExpandedPct` field per measurement.
2. Include budget table in NABL audit evidence per ISO 17025 §7.8.
3. Reference this paper as the method validation record.

### 5.2 IEC 61215 acceptance criterion

IEC 61215:2021 Table 1 requires U(P_mpp) ≤ 2 % for design-qualification
measurements. CdTe modules measured at low irradiance with high SMMF may
exceed this; the API returns HTTP 422 when U > 3 % (calibration drift flag).

## 6. Conclusion

TODO: After results.

## References

1. JCGM 100:2008, *Evaluation of measurement data — Guide to the expression
   of uncertainty in measurement (GUM)*.
2. IEC 60891:2021, *Procedures for temperature and irradiance corrections
   to measured I-V characteristics*.
3. IEC 61215:2021, *Terrestrial photovoltaic (PV) modules — Design
   qualification and type approval*.
4. IEC 61853-1:2011, *PV module performance testing and energy rating —
   Part 1: Irradiance and temperature performance measurements*.
5. Martin N., Ruiz J.M., Solar Energy Materials & Solar Cells 70 (2001) 25–38.
   https://doi.org/10.1016/S0927-0248(00)00257-4
