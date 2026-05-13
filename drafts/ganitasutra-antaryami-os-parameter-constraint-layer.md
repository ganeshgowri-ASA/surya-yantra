---
title: "Physics-Informed Parameter Constraints for LLM-Orchestrated PV Diagnostics: GanitaSutra 5PDM + Antaryami-OS"
seo_title: "GanitaSutra 5PDM + Antaryami-OS: Physics-Constrained LLM Diagnostics for Solar PV | Srishti PV Lab"
description: "How GanitaSutra's Levenberg-Marquardt 5-parameter diode model extractor creates a physics-informed constraint layer that reduces LLM hallucination risk in Antaryami-OS's pv-fault-router skill."
keywords:
  - GanitaSutra
  - 5PDM parameter extraction
  - Antaryami-OS
  - physics-informed AI
  - LLM diagnostics
  - solar PV fault detection
  - Levenberg-Marquardt
  - IV curve fitting
  - constraint layer
  - hallucination reduction
  - NABL diagnostics
  - parameter uncertainty
canonical: "https://surya-yantra.srishtipvlab.in/posts/ganitasutra-antaryami-os-parameter-constraint-layer"
og:
  title: "GanitaSutra 5PDM × Antaryami-OS: Physics-Constrained LLM PV Diagnostics"
  description: "Why giving an LLM extracted module parameters instead of datasheet values reduces diagnostic hallucination risk — and how GanitaSutra makes this possible."
  image: "/og/ganitasutra-antaryami-constraint-layer.png"
  type: "article"
twitter:
  card: "summary_large_image"
  title: "Physics-Informed LLM Diagnostics: GanitaSutra + Antaryami-OS"
  description: "Extracted 5PDM parameters from GanitaSutra constrain LLM reasoning in Antaryami-OS, reducing hallucination risk in PV fault diagnosis."
  image: "/og/ganitasutra-antaryami-constraint-layer.png"
author: "Srishti PV Lab Engineering"
date: "2026-05-13"
lastmod: "2026-05-13"
draft: true
tags:
  - ganitasutra
  - antaryami-os
  - physics-informed-ai
  - parameter-extraction
  - 5pdm
  - levenberg-marquardt
  - solar-pv
  - llm-diagnostics
  - constraint-layer
  - india
categories:
  - engineering
  - research
  - ai
reading_time: 13
schema_type: "TechArticle"
related_repos:
  - GanitaSutra-v0
  - antaryami-os
  - surya-yantra
---

# Physics-Informed Parameter Constraints for LLM-Orchestrated PV Diagnostics: GanitaSutra 5PDM + Antaryami-OS

*Wednesday seed — 13 May 2026 · Srishti PV Lab Engineering*

**Engineering signal:** [GanitaSutra-v0](https://github.com/ganeshgowri-ASA/GanitaSutra-v0) is actively building the `pv-toolbox` package (tracked in issue #18 of this repo). Its Levenberg-Marquardt 5-parameter diode model (5PDM) extractor — `extractModuleParams()` — produces physics-grounded values for α, Rₛ, Rₛₕ, diode ideality factor `a`, and photocurrent `I_L` with associated uncertainties from the Jacobian covariance matrix. Simultaneously, [Antaryami-OS](https://github.com/ganeshgowri-ASA/antaryami-os) is in the Day-2 aftermath of its 94-issue hypersprint and building the `pv-fault-router` skill that uses Claude to diagnose IV curve anomalies.

The integration point: when `pv-fault-router` reasons about why a module's Pmpp deviated by 3.2 %, it needs module parameters. It can use datasheet values — or it can use GanitaSutra's extracted values. The difference matters.

## The Datasheet Parameter Problem

Manufacturer datasheets report α, β, and Rₛ at nominal STC from a production-average measurement. For:

- **Aged modules** (5+ years): Rₛ increases by 20–40 % due to solder joint degradation; using the datasheet Rₛ understates the I-V translation error and causes P2-corrected Pmpp to be overestimated.
- **Modules in Jamnagar operating conditions** (700–1100 W/m², 30–55 °C cell): α in reality deviates from the datasheet value by ±8 % on c-Si and HJT modules (Villalva et al., 2009).
- **IEC 60891 P3 and P4 correction**: the bilinear and shunt-resistance procedures require Rₛₕ, which datasheets rarely provide accurately.

When Antaryami-OS's `pv-fault-router` uses stale datasheet parameters:

```
Measured curve anomaly: Pmpp = 432 W (vs. 450 W expected)
IEC 60891 P2 correction with datasheet Rs = 0.38 Ω:
  → Corrected Pmpp = 447 W  (deviation: 0.7 %, within tolerance)
  → LLM conclusion: "No degradation, likely measurement noise"

IEC 60891 P2 correction with GanitaSutra extracted Rs = 0.52 Ω:
  → Corrected Pmpp = 438 W  (deviation: 2.7 %, flag threshold crossed)
  → LLM conclusion: "Series resistance increase consistent with solder fatigue — recommend EL imaging"
```

The datasheet path misses a real degradation event. The GanitaSutra path flags it.

## The Physics-Informed Constraint Layer Architecture

The integration adds one step to the Antaryami-OS skill invocation pipeline:

```
IV curve measurement (Surya Yantra)
         │
         ▼
GanitaSutra parameter extraction (pv-toolbox)
  extractModuleParams(ivCurve)
  → { α, Rs, Rsh, a, IL, u_α, u_Rs, u_Rsh }
         │
         ▼
IEC 60891 correction (POST /api/corrections/apply)
  { autoExtract: true }  ← uses GanitaSutra params, not datasheet
         │
         ▼
Antaryami-OS pv-fault-router skill
  Claude receives:
  { correctedCurve, extractedParams, u_params, deviationFlags }
         │
         ▼
LLM diagnosis constrained to physically plausible hypotheses
  Rs elevation → solder fatigue
  Rsh drop    → shunting / soiling
  IL drop     → optical degradation / soiling
```

The key insight: the LLM receives not just the anomaly flag, but the **extracted parameter shift** (ΔRₛ, ΔRₛₕ, Δα) relative to the module's own historical baseline. This eliminates one class of hallucination — attributing anomalies to causes inconsistent with the actual parameter change direction.

## Parameter Uncertainty as a Diagnostic Confidence Signal

GanitaSutra's LM fitter returns uncertainty bounds on each extracted parameter from the Jacobian covariance matrix, per JCGM 100:2008 §5:

```typescript
// GanitaSutra pv-toolbox (conceptual interface — see issue #18)
interface ExtractedParams {
  Rs: number;          // Ω
  u_Rs: number;        // standard uncertainty, Ω
  Rsh: number;         // Ω
  u_Rsh: number;
  alpha: number;       // A/°C absolute
  u_alpha: number;
  a: number;           // diode ideality factor (dimensionless)
  IL: number;          // photocurrent, A
  fitResidual: number; // sum of squared residuals — extraction quality metric
}
```

These uncertainty bounds propagate directly to model-tier routing:

- If `u_Rs / Rs > 0.15`: parameter uncertainty too high to distinguish solder fatigue from noise → `pv-fault-router` routes to **Opus 4.7** for deeper analysis.
- If `u_Rs / Rs < 0.05` and `ΔRs > 0.10 Ω`: high-confidence parameter shift → **Haiku 4.5** can triage with pattern-match reasoning.

This closes the routing loop: GanitaSutra extraction quality directly drives Antaryami-OS cost management.

## The `autoExtract: true` API Flag

On Surya Yantra's `POST /api/corrections/apply` endpoint, the `autoExtract: true` flag triggers GanitaSutra extraction inline:

```json
POST /api/measurements/clx-m-042/correct
{
  "procedure": "IEC60891_P2",
  "target": { "irradiance": 1000, "temperature": 25 },
  "autoExtract": true,
  "publishExtractedParams": true
}
```

Response includes:
```json
{
  "correctedPmpp": 438.2,
  "extractedParams": {
    "Rs": 0.52, "u_Rs": 0.018,
    "Rsh": 142, "u_Rsh": 8.2
  },
  "extractionQuality": {
    "fitResidual": 0.0034, "convergenceFlag": true
  },
  "correctionProcedure": "IEC60891_P2"
}
```

<!-- TODO: Confirm autoExtract flag exists in apps/web/app/api/corrections/apply/route.ts -->
<!-- TODO: Confirm GanitaSutra pv-toolbox package name and import path once issue #18 is resolved -->
<!-- TODO: Add benchmark table comparing datasheet vs. extracted parameter accuracy on the Srishti lab module fleet (pairs with issue #18 benchmark table) -->
<!-- TODO: Add degradation case study: module with 3 years Jamnagar exposure, tracked Rs increase vs. EL imaging confirmation -->

## Research Narrative

This integration represents a general pattern: **physics-informed constraint layers for LLM-based diagnostic systems**. The research contribution:

1. Demonstration that replacing datasheet module parameters with LM-fitted 5PDM values reduces the false-negative diagnostic rate in IEC 60891-corrected IV curve analysis — quantified on the Srishti lab module fleet.
2. A formal mapping between parameter extraction uncertainty (`u_Rs`, `u_Rsh`) and LLM model-tier selection — the first principled uncertainty-cost tradeoff framework for AI-orchestrated PV diagnostics.
3. Empirical validation from Jamnagar operating conditions (700–1100 W/m², 30–55 °C cell) on bifacial HJT and mono-PERC modules.

Target venue: **Solar Energy** (Elsevier) or **Progress in Photovoltaics** — measurement + AI systems paper with direct industrial relevance.

## References

1. Villalva M.G., Gazoli J.R., Ruppert Filho E. (2009). *Comprehensive Approach to Modeling and Simulation of Photovoltaic Arrays*. IEEE Transactions on Power Electronics 24(5), 1198–1208. DOI: 10.1109/TPEL.2009.2013862. — Foundational 5PDM formulation used in GanitaSutra's implementation.
2. Marquardt D.W. (1963). *An Algorithm for Least-Squares Estimation of Nonlinear Parameters*. Journal of the Society for Industrial and Applied Mathematics 11(2), 431–441. DOI: 10.1137/0111030. — Origin of the Levenberg-Marquardt algorithm in GanitaSutra's `extractModuleParams()`.
3. JCGM 100:2008 (GUM). *Evaluation of measurement data — Guide to the expression of uncertainty in measurement*. BIPM, Paris. §5 (propagation of uncertainty), §6 (sensitivity coefficients). — Framework for computing `u_Rs`, `u_Rsh` from the LM Jacobian covariance matrix.
4. IEC 60891:2021. *Photovoltaic devices — Procedures for temperature and irradiance corrections to measured I-V characteristics*. IEC, Geneva. §7 (P2 correction) and Annex B (worked example).
5. GanitaSutra-v0: [github.com/ganeshgowri-ASA/GanitaSutra-v0](https://github.com/ganeshgowri-ASA/GanitaSutra-v0). `pv-toolbox` package — `extractModuleParams()` (in development; see issue #18).
6. Antaryami-OS `pv-fault-router` skill architecture: see `drafts/antaryami-os-skill-architecture-pv-lab.md`.
7. Surya Yantra `POST /api/corrections/apply` with `autoExtract: true`: see `docs/API.md`.
8. Batzelis E.I., Papathanassiou S.A. (2016). *A Method for the Analytical Extraction of the Single-Diode PV Model Parameters*. IEEE Transactions on Sustainable Energy 7(2), 504–512. DOI: 10.1109/TSTE.2015.2503435. — Reviews and benchmarks 5PDM extraction methods; validates LM fitting as the most accurate approach for aged modules with elevated Rs.

---

## Peer Review

*Not yet scheduled — seed article, 13 May 2026.*

### Reviewer Sign-off

| Role | Name | Date | Signature |
|------|------|------|----------|
| Technical reviewer (PV modelling) | — | — | — |
| Standards reviewer (IEC 60891 + GUM) | — | — | — |
| Editor | — | — | — |

*Assign reviewers in the GitHub PR before promoting `draft: true → false`.*
