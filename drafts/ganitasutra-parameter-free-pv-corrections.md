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
lastmod: "2026-05-09"
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

*Roadmap seed — 3 May 2026 · Updated 9 May 2026 · Srishti PV Lab Engineering*

Every IEC 60891:2021 correction requires module parameters: the temperature coefficient α, voltage coefficient β, series resistance Rₛ, and curve correction factor κ. For new modules these come from the manufacturer's datasheet. But datasheets lie — or more precisely, they reflect factory-fresh STC performance, not the module you measured three years into field life.

[GanitaSutra-v0](https://github.com/ganeshgowri-ASA/GanitaSutra-v0) is in an active sprint (**16 open issues as of 9 May 2026**, up from 9 on 3 May) building a PV toolbox module that **extracts these parameters automatically from two measured IV curves**. When that lands, Surya Yantra will use GanitaSutra's extraction output to drive Procedure 3 and Procedure 4 corrections without any datasheet input.

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

The five parameters {Iph, I0, n, Rs, Rsh} are fitted simultaneously to a measured IV curve at known (G, T). Villalva et al. (2009) established this as the canonical approach for PV module characterisation; GanitaSutra's implementation follows their initialisation strategy but adds warm-start capability using a prior fit as the initial guess, which is critical for the iterative morning-to-noon correction workflow in Surya Yantra.

With **two curves** at different conditions:

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

This integration is the technical realisation of the Q2 2026 roadmap item in `posts/surya-yantra-open-source-pv-iv-tracer.md`. GanitaSutra's sprint velocity (7 new issues in 6 days) suggests this could ship in Q2 2026. The Surya Yantra side is already designed; only the GanitaSutra package publication is on the critical path.

<!-- TODO: Add benchmark comparing extraction accuracy vs. datasheet params on 10 modules (planned for NABL audit dataset) -->

## References

1. IEC 60891:2021, *Photovoltaic devices — Procedures for temperature and irradiance corrections to measured I-V characteristics*. IEC, Geneva.
2. Villalva M.G., Gazoli J.R., Filho E.R. (2009). *Comprehensive approach to modeling and simulation of photovoltaic arrays*. IEEE Trans. Power Electron. 24(5), 1198–1208. DOI: 10.1109/TPEL.2009.2013862.
3. De Soto W., Klein S.A., Beckman W.A. (2006). *Improvement and validation of a model for photovoltaic array performance*. Solar Energy 80(1), 78–88. DOI: 10.1016/j.solener.2005.06.010.
4. Marquardt D.W. (1963). *An algorithm for least-squares estimation of nonlinear parameters*. J. Soc. Ind. Appl. Math. 11(2), 431–441. DOI: 10.1137/0111030.
5. Batzelis E.I. (2019). *Non-iterative methods for the extraction of the single-diode model parameters of photovoltaic modules: a review and comparative assessment*. Energies 12(3), 358. DOI: 10.3390/en12030358.
6. Chegaar M., Ouennoughi Z., Hoffmann A. (2001). *A new method for evaluating illuminated solar cell parameters*. Solid-State Electronics 45(2), 293–296. DOI: 10.1016/S0038-1101(00)00277-X.
7. GanitaSutra-v0 PV toolbox: [github.com/ganeshgowri-ASA/GanitaSutra-v0](https://github.com/ganeshgowri-ASA/GanitaSutra-v0).
8. Surya Yantra IEC correction engine: `apps/web/lib/iec60891.ts`.

---

## Peer Review

*Thursday 8 May 2026 — Weekly peer-review checklist pass*

### Technical Accuracy

- [ ] All equations verified against cited source (DOI or section number confirmed)
- [ ] TypeScript code snippets compile without errors against current `apps/web/lib/`
- [ ] Numerical examples cross-checked against test suite values in `apps/web/__tests__/`
- [ ] Claims about companion-repo sprint state verified against latest GitHub activity
- [ ] All `<!-- TODO -->` items either resolved inline or tracked as open GitHub issues

### Citation Completeness

- [ ] All referenced papers include DOI or arXiv ID
- [ ] IEC standards cite year and section number
- [ ] Software references include version, commit hash, or publication DOI
- [ ] No citation appears as a bare URL without author/year

### Code Cross-References

- [ ] All TypeScript paths mentioned exist in `apps/web/lib/` on `main`
- [ ] Every described behaviour has test coverage in `apps/web/__tests__/`
- [ ] API endpoints described match current `docs/API.md`
- [ ] External package imports (`@ganitasutra/pv-toolbox` etc.) have a tracked issue or PR

### Reviewer Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Technical reviewer | — | — | — |
| Standards reviewer | — | — | — |
| Editor | — | — | — |

*Assign reviewers in the GitHub PR before promoting `draft: true → false`.*
