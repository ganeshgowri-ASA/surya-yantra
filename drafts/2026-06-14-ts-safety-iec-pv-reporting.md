---
title: "TypeScript Type Safety as a Prerequisite for IEC-Compliant PV Measurement Reporting"
slug: "typescript-type-safety-iec-pv-reporting"
date: "2026-06-14"
status: outline
weekly_angle: roadmap
seeded_from: "SolarLabX PR #185 — strip @ts-nocheck from 22 shadcn/ui components (2026-06-09)"
description: >
  A research narrative connecting the systematic removal of TypeScript blanket
  suppressors (@ts-nocheck) in SolarLabX's UI layer to the measurement
  traceability requirements of IEC 61215, ISO 17025, and GUM uncertainty
  budgets in the Surya Yantra IV correction pipeline.
keywords:
  - TypeScript type safety
  - IEC 61215 measurement traceability
  - ISO 17025 NABL accreditation
  - PV module test reporting
  - open source solar lab software
  - GUM uncertainty
  - SolarLabX
  - Surya Yantra
target_venue: "Journal of Open Source Software (JOSS) or Measurement (Elsevier)"
og_image: ""
canonical_url: ""
reading_time_minutes: 10
---

# TypeScript Type Safety as a Prerequisite for IEC-Compliant PV Measurement Reporting

> **Article seed** — triggered by SolarLabX PR #185 (2026-06-09): systematic
> removal of `@ts-nocheck` from all 22 `components/ui/` files.
> Status: OUTLINE — lab data and measurement uncertainty figures needed.

---

## 1. Motivation

In June 2026, the SolarLabX repository completed the removal of `@ts-nocheck`
blanket suppressors from 22 React/TypeScript UI components. Each removal
surfaced real type errors previously hidden: missing `ShadingType.SOLID` fields
in Word export shading attributes, and over-wide `children: any[]` types that
violated docx's typed section-child contract.

This may appear to be routine code hygiene. But in the context of IEC-accredited
photovoltaic test laboratories, type errors in reporting code are not cosmetic —
they are measurement integrity issues. A corrupted Word document shading object
is a cosmetic error; a corrupted correction coefficient value (`alphaPct` used
as `alphaAbsolute` without conversion) can produce a wrong STC power figure
that propagates to a signed NABL test certificate.

This article argues that TypeScript's type system, applied consistently from the
numerical IEC correction engine down through the React UI layer, constitutes a
first-line defence for measurement traceability under ISO 17025.

---

## 2. Background

### 2.1 IEC measurement traceability requirements

IEC 61215:2021 (module design qualification) and ISO/IEC 17025:2017 (laboratory
competence) both require that test results be traceable to national standards
through an unbroken chain of calibrations and corrections. In software-mediated
testing this chain extends through:

1. Raw sensor reading (ADC / SCPI measurement)
2. Environmental correction (IAM, SMMF, IEC 60891 P1–P4)
3. Data model (TypeScript types in Prisma schema)
4. API serialisation (JSON route handlers)
5. UI display (React components)
6. Report export (PDF/Word/CSV)

A type error at any layer can silently corrupt the traceability chain.

### 2.2 The `@ts-nocheck` epidemiological model

SolarLabX accumulated 381 `@ts-nocheck` suppressors across its codebase
(issue #111). Each acts as a "dead zone" in the type graph — a region where
TypeScript's proof system produces no guarantees. When such a dead zone
contains coefficient handling, unit conversion, or data serialisation code,
the absence of type guarantees corresponds directly to an absence of formal
proof that the measured quantity is handled correctly.

Surya Yantra avoided this accumulation by bootstrapping with typed API
converters: `alphaPct` and `betaPct` are stored in the Prisma schema in
`%/°C` and converted to absolute units (A/°C, V/°C) before being passed
to `correctProcedure1`. The conversion is type-checked — passing the raw
`%/°C` value would require an explicit cast that serves as a code-review
signal.

---

## 3. The Shared Type Schema Proposal

### 3.1 Cross-repo type mismatches (TODO: verify with lab data)

Both Surya Yantra and SolarLabX implement IEC 60891:2021 correction engines
independently. Current evidence suggests coefficient storage conventions differ:

| Field | Surya Yantra (Prisma) | SolarLabX (TODO: verify) |
|-------|----------------------|--------------------------|
| α (Isc coeff) | `alphaPct: Float` (%/°C) | `alphaAbs?: Float` (A/°C)? |
| β (Voc coeff) | `betaPct: Float` (%/°C) | `betaAbs?: Float` (V/°C)? |
| κ (curve factor) | `kappa: Float` (Ω/°C) | unknown |

**Blocker:** Access to SolarLabX `lib/iec60891.ts` needed to confirm.
**(TODO: file issue to cross-check; add to companion PR)**

### 3.2 Proposed `@srishti/iv-types` package

A shared `packages/types/` package (already referenced in Surya Yantra's
README but not yet created) could export:

```typescript
/** Absolute temperature coefficients (A/°C, V/°C) as required by IEC 60891 §5.1 */
export interface IECCoefficients {
  alphaAbs: number;   // A/°C
  betaAbs: number;    // V/°C
  rs: number;         // Ω
  kappa: number;      // Ω/°C
  rsh?: number;       // Ω (optional, P4 only)
}

/** Storage form — percentage coefficients as stored in module datasheets */
export interface IECCoefficientsPercent {
  alphaPct: number;   // %/°C
  betaPct: number;    // %/°C
  gammaPct: number;   // %/°C
}

export function toAbsolute(pct: IECCoefficientsPercent, stc: { isc: number; voc: number }): IECCoefficients;
```

Both Surya Yantra and SolarLabX importing this package would make coefficient
unit mismatches a compile-time error rather than a runtime measurement bias.

---

## 4. Ideation → Implementation Diagram

```mermaid
flowchart LR
    A[SolarLabX\n@ts-nocheck removal\nPR #185] --> B[Type errors\nsurfaced]
    B --> C[ShadingType.SOLID fix\nchildren: any[] → precise union]
    C --> D{Research question}
    D --> E[Are IEC coefficient\nunits typed consistently\nacross repos?]
    E --> F[Cross-repo audit:\nSurya Yantra vs SolarLabX\niec60891.ts schemas]
    F --> G[@srishti/iv-types\nshared package proposal]
    G --> H[packages/types/\nin surya-yantra monorepo]
    H --> I[Both repos import\nsame coefficient types]
    I --> J[Compile-time proof of\nIEC traceability chain]
    J --> K[Paper: Type safety\nas IEC compliance tool]
```

---

## 5. Related Work

*(TODO: search for prior art on formal methods in PV testing software)*

- IEC 60891:2021 — coefficient definitions and units
- ISO/IEC 17025:2017 cl. 7.6 — evaluation of measurement uncertainty
- JCGM 100:2008 (GUM) — error propagation
- TODO: search for TypeScript-in-scientific-computing papers

---

## 6. Proposed Experiments

1. **Cross-repo coefficient audit** — compare IEC coefficient types in
   `surya-yantra/apps/web/prisma/schema.prisma` vs `SolarLabX/lib/iec60891.ts`
2. **Correction bias measurement** — run P1 correction with `alphaPct` passed
   as `alphaAbs` (without conversion) and quantify the resulting Pmpp error
   at ΔT = 20 K as a case study for why the distinction matters
3. **`@srishti/iv-types` prototype** — create the shared package and measure
   how many existing type errors surface in both codebases

---

## 7. Blockers

| # | Blocker | Action |
|---|---------|--------|
| B1 | SolarLabX IEC 60891 coefficient storage schema unknown | File issue; read `SolarLabX/lib/iec60891.ts` |
| B2 | `packages/types/` not created | Surya Yantra issue for monorepo package bootstrap |
| B3 | No live correction benchmark data from real modules | Lab commissioning required |

---

## 8. References (TODO: add DOIs)

1. IEC 60891:2021, *PV devices — Temperature and irradiance corrections*.
2. ISO/IEC 17025:2017, *General requirements for laboratory competence*.
3. IEC 61215:2021, *Terrestrial PV modules — Design qualification and type approval*.
4. JCGM 100:2008, *Guide to the expression of uncertainty in measurement (GUM)*.
5. TypeScript Team, *TypeScript Handbook — Advanced Types*, Microsoft, 2024.
6. TODO: JOSS papers on typed scientific computing

---

*Draft outline — seeded from SolarLabX PR #185 — Surya Yantra weekly routine — 2026-06-14*
