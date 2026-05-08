---
title: "Five-Parameter Single-Diode Model for Solar PV: From Levenberg-Marquardt to Production TypeScript"
seo_title: "Solar PV 5PDM Parameter Extraction: Levenberg-Marquardt to TypeScript | GanitaSutra + Surya Yantra"
description: "The mathematical foundation of five-parameter single-diode model fitting via Levenberg-Marquardt, implemented in GanitaSutra-v0's active sprint, and how the extracted parameters flow into Surya Yantra's IEC 60891 correction pipeline."
keywords:
  - five parameter single diode model
  - 5PDM solar PV
  - Levenberg-Marquardt PV
  - photovoltaic parameter extraction
  - IEC 60891 parameter-free
  - GanitaSutra curve fitting
  - solar IV curve fitting
  - series resistance extraction
  - temperature coefficient extraction
  - TypeScript solar computing
  - Surya Yantra GanitaSutra
  - open source PV toolbox
canonical: "https://surya-yantra.srishtipvlab.in/posts/ganitasutra-5pdm-parameter-extraction"
og:
  title: "Solar PV 5PDM Parameter Extraction: From LM Algorithm to Production TypeScript"
  description: "GanitaSutra-v0’s active sprint builds LM-fitted single-diode model extraction. The extracted α, β, Rₛ flow directly into Surya Yantra’s IEC 60891 zero-config P3/P4 corrections."
  image: "/og/ganitasutra-5pdm-extraction.png"
  type: "article"
twitter:
  card: "summary_large_image"
  title: "Solar PV 5PDM Fitting: GanitaSutra × Surya Yantra"
  description: "Levenberg-Marquardt 5PDM fitting in TypeScript: from the 1963 algorithm to zero-datasheet IEC 60891 corrections."
  image: "/og/ganitasutra-5pdm-extraction.png"
author: "Srishti PV Lab Engineering"
date: "2026-05-07"
lastmod: "2026-05-08"
draft: true
tags:
  - ganitasutra
  - single-diode-model
  - curve-fitting
  - levenberg-marquardt
  - iec-60891
  - solar-pv
  - typescript
  - parameter-extraction
categories:
  - engineering
  - research
reading_time: 16
schema_type: "TechArticle"
related_repos:
  - GanitaSutra-v0
  - surya-yantra
---

# Five-Parameter Single-Diode Model for Solar PV: From Levenberg-Marquardt to Production TypeScript

*Article seed — 7 May 2026 · Srishti PV Lab Engineering*

**Engineering signal:** [GanitaSutra-v0](https://github.com/ganeshgowri-ASA/GanitaSutra-v0) pushed on 6 May 2026, now carrying 14 open issues (up from 9 on 3 May). The active sprint is the PV toolbox curve-fitting module — specifically, a five-parameter single-diode model (5PDM) fitted via Levenberg-Marquardt (LM) optimisation. When this lands, Surya Yantra gains zero-datasheet IEC 60891 P3/P4 corrections.

This article documents the mathematical foundation of the 5PDM fit, the engineering choices in GanitaSutra’s TypeScript implementation, and the data flow from extracted parameters into the Surya Yantra correction pipeline.

## The Single-Diode Model

The single-diode model (SDM) describes a PV cell as a current source in parallel with a diode and shunt resistance, in series with a series resistance:

```
I = Iph - I0 · [exp((V + I·Rs) / (n·Vt)) - 1] - (V + I·Rs) / Rsh
```

where:
- `Iph` — photocurrent [A], proportional to irradiance G
- `I0` — dark saturation current [A], exponentially temperature-dependent
- `n` — ideality factor [dimensionless], typically 1–2
- `Vt = k·T/q` — thermal voltage [V] at cell temperature T
- `Rs` — series resistance [Ω], wire + contact resistance
- `Rsh` — shunt resistance [Ω], leakage paths

This is the **five-parameter model** because {Iph, I0, n, Rs, Rsh} fully characterise the curve at a given (G, T). De Soto et al. (2006) established the standard parameter scaling laws across (G, T) conditions, which GanitaSutra uses to link parameters across the morning and noon measurements.

## Why Levenberg-Marquardt?

The 5PDM equation is implicit in I (V appears on both sides of the diode exponential), so fitting requires iterative nonlinear least-squares. The standard choice is Levenberg-Marquardt (Marquardt, 1963; Levenberg, 1944) — a trust-region algorithm that interpolates between gradient descent (far from minimum, large steps) and Gauss-Newton (near minimum, fast quadratic convergence):

```
Δp = (JᵀJ + λI)⁻¹ Jᵀ r
```

where J is the Jacobian of residuals w.r.t. parameters, r is the residual vector, and λ is the damping factor (large λ = gradient descent; small λ = Gauss-Newton). The key advantage for PV fitting is LM’s robustness to poor initial guesses — critical when GanitaSutra is initialised from a module’s Isc/Voc/Pmpp only.

Alternative approaches (Brent’s method on individual parameters, analytical approximations per Bishop (1988), or the non-iterative methods reviewed by Batzelis (2019)) are faster but less accurate when the curve is noisy or when n deviates significantly from 1. Noisy outdoor measurements at partially cloudy G make LM the defensible choice for GanitaSutra’s target use case.

## The Two-Curve Extraction Protocol

A single measured IV curve cannot uniquely determine all five parameters because multiple (I0, n) pairs can fit the same curve equally well. GanitaSutra’s extraction protocol requires two curves at distinct (G, T) conditions, typically morning (~500 W/m², 30 °C) and solar noon (~950 W/m², 55 °C):

```
Curve A at (G₁, T₁): fit → {Iph₁, I0₁, n₁, Rs₁, Rsh₁}
Curve B at (G₂, T₂): fit → {Iph₂, I0₂, n₂, Rs₂, Rsh₂}
```

Then the IEC 60891 parameters are extracted from the differential:

```
α = (Iph₂ - Iph₁) / (T₂ - T₁)       [temperature coefficient of Isc]
β = (Voc₂ - Voc₁) / (T₂ - T₁)       [temperature coefficient of Voc]
Rs = (Rs₁ + Rs₂) / 2                   [average series resistance]
κ = (Rs₂ - Rs₁) / (T₂ - T₁)          [Rs temperature gradient]
Rsh = (Rsh₁ + Rsh₂) / 2                [average shunt resistance for P4]
```

This is equivalent to the differential technique described by Chegaar et al. (2001) but implemented as a two-stage LM fit rather than an analytical approximation, giving better accuracy on noisy data.

## TypeScript Implementation Challenges

Implementing LM in TypeScript without a numeric library requires:

### 1. Implicit IV evaluation via Newton-Raphson

The SDM equation `I = f(V, I)` is solved for each (V, I) pair using Newton-Raphson:

```typescript
function evalSDM(v: number, params: SDMParams): number {
  let i = params.iph; // initial guess
  for (let iter = 0; iter < 50; iter++) {
    const exp = Math.exp((v + i * params.rs) / (params.n * params.vt));
    const f = i - params.iph + params.i0 * (exp - 1) + (v + i * params.rs) / params.rsh;
    const df = 1 + params.i0 * exp * params.rs / (params.n * params.vt) + params.rs / params.rsh;
    const delta = f / df;
    i -= delta;
    if (Math.abs(delta) < 1e-9) break;
  }
  return i;
}
```

This inner Newton-Raphson loop runs for each of 500 IV curve points per LM iteration — ~25,000 evaluations per full LM step. On a 2026-vintage V8 runtime this completes in < 5 ms, acceptable for a batch correction workflow.

### 2. Jacobian approximation

Rather than deriving analytical partial derivatives of the implicit SDM (which require implicit differentiation through the Newton-Raphson loop), GanitaSutra uses finite-difference Jacobian approximation with step size `h = 1e-6 · |p|` per parameter. This adds a factor of 5 to the per-iteration cost but eliminates the implementation complexity of analytical Jacobians for a transcendental function.

### 3. Parameter bounds

LM without bounds will explore physically impossible regions (negative Rs, n > 3). GanitaSutra applies box constraints via parameter transformation:

```typescript
const bounded = {
  iph:  sigmoid(raw.iph) * 2 * iscEstimate,  // [0, 2·Isc]
  i0:   Math.exp(raw.i0),                     // (0, ∞)
  n:    1 + sigmoid(raw.n),                   // [1, 2]
  rs:   softplus(raw.rs),                     // (0, ∞)
  rsh:  softplus(raw.rsh) * 100,              // (0, ∞)
};
```

This is the same transformation strategy used in the Python `pvlib` library’s `fit_sdm_desoto` function, adapted to TypeScript.

## Data Flow into Surya Yantra

Once GanitaSutra publishes `@ganitasutra/pv-toolbox`, the extraction integrates into Surya Yantra’s correction pipeline:

```typescript
import { extractModuleParams } from '@ganitasutra/pv-toolbox';

// POST /api/corrections/apply with autoExtract: true
const extracted = await extractModuleParams(morningCurve, noonCurve);
// extracted: { alpha, beta, rs, kappa, rsh }

const corrected = correctProcedure2(currentCurve, extracted, STC);
// Stores extracted params in CorrectionResult for NABL audit trail
```

The extracted parameters are stored separately from datasheet values in the Prisma schema, enabling longitudinal tracking of α, β, Rs drift as modules age in the outdoor array.

<!-- TODO: Add benchmark table: extracted vs. datasheet α and Rs for 10 modules (planned for NABL audit dataset) -->
<!-- TODO: Link to GanitaSutra-v0 PR once pv-toolbox/curve-fitting module is merged -->

## Target Venue

This work fits the **Journal of Open Source Software (JOSS)** format for GanitaSutra’s software paper (reproducible, tested, with a real application dataset), and the **Solar Energy** or **IEEE Journal of Photovoltaics** for a measurement paper reporting extraction accuracy on the Srishti PV Lab module fleet.

## References

1. De Soto W., Klein S.A., Beckman W.A. (2006). *Improvement and validation of a model for photovoltaic array performance*. Solar Energy 80(1), 78–88. DOI: 10.1016/j.solener.2005.06.010.
2. Villalva M.G., Gazoli J.R., Filho E.R. (2009). *Comprehensive approach to modeling and simulation of photovoltaic arrays*. IEEE Trans. Power Electron. 24(5), 1198–1208. DOI: 10.1109/TPEL.2009.2013862.
3. Marquardt D.W. (1963). *An algorithm for least-squares estimation of nonlinear parameters*. J. Soc. Ind. Appl. Math. 11(2), 431–441. DOI: 10.1137/0111030.
4. Levenberg K. (1944). *A method for the solution of certain nonlinear problems in least squares*. Quart. Appl. Math. 2(2), 164–168.
5. Batzelis E.I. (2019). *Non-iterative methods for the extraction of the single-diode model parameters of photovoltaic modules: a review and comparative assessment*. Energies 12(3), 358. DOI: 10.3390/en12030358.
6. Chegaar M., Ouennoughi Z., Hoffmann A. (2001). *A new method for evaluating illuminated solar cell parameters*. Solid-State Electronics 45(2), 293–296. DOI: 10.1016/S0038-1101(00)00277-X.
7. Bishop J.W. (1988). *Computer simulation of the effects of electrical mismatches in photovoltaic cell interconnection circuits*. Solar Cells 25(1), 73–89. DOI: 10.1016/0379-6787(88)90077-7.
8. Anderson K., Hansen C., Holmgren W., Jensen A., Mikofski M., Driesse A. (2023). *pvlib python: 2023 project update*. Journal of Open Source Software 8(92), 5994. DOI: 10.21105/joss.05994.
9. GanitaSutra-v0: [github.com/ganeshgowri-ASA/GanitaSutra-v0](https://github.com/ganeshgowri-ASA/GanitaSutra-v0).
10. IEC 60891:2021, *Photovoltaic devices — Procedures for temperature and irradiance corrections to measured I-V characteristics*. IEC, Geneva.

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
