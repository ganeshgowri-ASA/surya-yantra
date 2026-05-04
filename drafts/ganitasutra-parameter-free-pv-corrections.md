---
title: "Parameter-Free IEC 60891 Corrections: How GanitaSutra's Curve Fitting Eliminates the Datasheet Dependency"
seo_title: "Parameter-Free IEC 60891 P3/P4 Solar PV Corrections via GanitaSutra Curve Fitting | Srishti PV Lab"
description: "How GanitaSutra-v0's PV toolbox curve-fitting sprint removes the need for module datasheets in IEC 60891 P3/P4 IV curve corrections inside Surya Yantra."
keywords:
  - IEC 60891 parameter extraction
  - solar PV curve fitting
  - parameter-free IV correction
  - GanitaSutra PV toolbox
  - series resistance extraction
  - temperature coefficient extraction
  - IEC 60891 procedure 3
  - IEC 60891 procedure 4
  - photovoltaic characterisation
  - TypeScript scientific computing
  - Surya Yantra
  - open source solar
canonical: "https://surya-yantra.srishtipvlab.in/posts/ganitasutra-parameter-free-pv-corrections"
og:
  title: "Parameter-Free IEC 60891 Corrections via GanitaSutra Curve Fitting"
  description: "GanitaSutra's active sprint automates α, β, Rₛ extraction from two measured IV curves — making P3/P4 corrections the zero-configuration default in Surya Yantra."
  image: "/og/ganitasutra-parameter-free.png"
  type: "article"
twitter:
  card: "summary_large_image"
  title: "Parameter-Free PV Corrections: GanitaSutra × Surya Yantra"
  description: "GanitaSutra curve-fitting sprint: automatic α, β, Rₛ extraction from two measured IV curves → zero-configuration IEC 60891 P3/P4 corrections."
  image: "/og/ganitasutra-parameter-free.png"
author: "Srishti PV Lab Engineering"
date: "2026-05-03"
lastmod: "2026-05-04"
draft: true
tags:
  - iec-60891
  - solar-pv
  - ganitasutra
  - curve-fitting
  - parameter-extraction
  - typescript
  - scientific-computing
categories:
  - engineering
  - research
reading_time: 12
schema_type: "TechArticle"
related_repos:
  - surya-yantra
  - GanitaSutra-v0
---

# Parameter-Free IEC 60891 Corrections: How GanitaSutra's Curve Fitting Eliminates the Datasheet Dependency

*Roadmap seed — 3 May 2026 · Updated 4 May 2026 · Srishti PV Lab Engineering*

Every IEC 60891:2021 correction requires module parameters: the temperature coefficient α, voltage coefficient β, series resistance Rₛ, and curve correction factor κ. For new modules these come from the manufacturer's datasheet. But datasheets lie — or more precisely, they reflect factory-fresh STC performance, not the module you measured three years into field life.

[GanitaSutra-v0](https://github.com/ganeshgowri-ASA/GanitaSutra-v0) is in an active sprint (as of 3 May 2026, 9 open issues) to build a PV toolbox module that **extracts these parameters automatically from two measured IV curves**. When that lands, Surya Yantra will use GanitaSutra's extraction output to drive Procedure 3 and Procedure 4 corrections without any datasheet input — making parameter-free P3/P4 the zero-configuration default correction path.

This article documents the planned integration, the mathematics of parameter extraction, and what it means for labs that characterise aged, non-standard, or undocumented modules.

> **Roadmap update (4 May 2026):** This integration is now targeted for **Q2 2026** (pulled forward from Q3) based on the pace of GanitaSutra's active sprint. See the [Q2 2026 Roadmap article](./srishti-pv-lab-ecosystem-roadmap-q2-2026.md) for the full timeline.

## The Datasheet Problem

IEC 60891 Procedure 1 and Procedure 2 are point-by-point algebraic corrections: given (α, β, Rₛ, κ), each measured point is shifted analytically. The parameters must come from somewhere:

- **Manufacturer datasheet** — available for new stock, but typically measured at a single operating point with ±5 % tolerance.
- **Dedicated characterisation measurement** — costly (flash tester, calibrated cell reference); not practical for every batch.
- **Dead reckoning from technology defaults** — accurate for standard c-Si, dangerously wrong for CdTe, perovskite, or aged modules.

Procedure 3 sidesteps this entirely: given *two measured curves* at different (G, T) conditions, it bilinearly interpolates to any target condition. No α, no β, no Rₛ needed. But it requires those two reference curves, and it does not give you α/β for reporting purposes.

## GanitaSutra's Extraction Approach

GanitaSutra's PV toolbox sprint implements a **five-parameter single-diode model (5PDM) fit** via Levenberg-Marquardt optimisation:

```
I(V) = Iph − I0 · (exp((V + I·Rs) / (n·Vt)) − 1) − (V + I·Rs) / Rsh
```

The five parameters {Iph, I0, n, Rs, Rsh} are fitted simultaneously to a measured IV curve at known (G, T). With **two curves** at different conditions:

1. Fit 5PDM to each curve independently → two parameter sets {P₁, P₂}.
2. Extract the *differential* temperature sensitivity of Iph → α.
3. Extract the *differential* voltage shift → β.
4. Rs is taken from the average across fits (it is weakly temperature-dependent).
5. κ is derived from the Rs temperature gradient.

This makes the extracted {α, β, Rₛ, κ} *specific to the actual module under test* rather than a population average from the datasheet.

<!-- TODO: Add GanitaSutra-v0 PR link once the PV toolbox curve-fitting module is merged -->

## The Integration Architecture

```
Two measured IV curves (morning G₁T₁ + noon G₂T₂)
          │
          ▼
GanitaSutra PV toolbox
  extractModuleParams(curveA, curveB) → { alpha, beta, rs, kappa, rsh }
          │
          ▼
Surya Yantra /api/corrections/p2 or /p4
  correctProcedure2(curve, extractedParams, STC)
          │
          ▼
Corrected IV curve at STC
```

The integration surface is minimal: GanitaSutra exposes a TypeScript function `extractModuleParams(curveA: IVCurve, curveB: IVCurve): ModuleParams`. Surya Yantra calls it before the correction step, passes the result straight into the existing `correctProcedure2` / `correctProcedure4` functions. No schema changes required.

### When to use extraction vs. datasheet

| Scenario | Recommended approach |
|----------|---------------------|
| New module, datasheet available, G translation < 200 W/m² | P1 with datasheet params |
| New module, large G translation (indoor flash → STC) | P2 with datasheet params |
| Aged module, unknown or unreliable datasheet | **GanitaSutra extraction → P2/P4** |
| Non-standard technology (perovskite, CdTe, tandem) | **GanitaSutra extraction → P2/P4** |
| Batch of 75 modules, no individual datasheets | **GanitaSutra extraction per module** |

## What Changes in Surya Yantra

The POST `/api/corrections/apply` pipeline gains an optional `autoExtract` flag:

```json
POST /api/corrections/apply
{
  "measurementId": "clx-m-042",
  "procedure": "AUTO",
  "autoExtract": true,
  "referenceSessionId": "clx-sess-morning"
}
```

When `autoExtract: true`, the server:
1. Fetches the morning reference session's corrected IV curve for the same module slot.
2. Calls `extractModuleParams(referenceCurve, currentCurve)` via the GanitaSutra package.
3. Runs P2 (or P4 if Rsh extraction converges) with the extracted params.
4. Stores the extracted params alongside the `CorrectionResult` for audit traceability.

The extracted parameters are also written back to the `ModuleType` record as `alphaPct_extracted`, `betaPct_extracted`, etc. — separate from the datasheet values — enabling longitudinal tracking of parameter drift as modules age.

## Roadmap Alignment

This integration is the technical realisation of the Q2 2026 roadmap item (updated from Q3) in `posts/surya-yantra-open-source-pv-iv-tracer.md`:

> Q2 2026 — GanitaSutra parameter-extraction integration for zero-configuration P3/P4 corrections

GanitaSutra's active sprint suggests this could ship in Q2 2026. The Surya Yantra side is already designed; only the GanitaSutra package publication is on the critical path.

<!-- TODO: Add benchmark comparing extraction accuracy vs. datasheet params on 10 modules (planned for NABL audit dataset) -->

## References

1. IEC 60891:2021, *Photovoltaic devices — Procedures for temperature and irradiance corrections to measured I-V characteristics*. IEC, Geneva.
2. De Soto W., Klein S.A., Beckman W.A. (2006). *Improvement and validation of a model for photovoltaic array performance*. Solar Energy 80(1), 78–88. DOI: 10.1016/j.solener.2005.06.010.
3. Batzelis E.I., Kampitsis G.E., Papathanassiou S.A. (2013). *Power reserves control for PV systems with real-time MPP estimation via rooftop irradiance sensors*. IEEE Trans. Sustain. Energy, 8(2), 671–680.
4. GanitaSutra-v0 PV toolbox: [github.com/ganeshgowri-ASA/GanitaSutra-v0](https://github.com/ganeshgowri-ASA/GanitaSutra-v0).
5. Surya Yantra IEC correction engine: `apps/web/lib/iec60891.ts`.
