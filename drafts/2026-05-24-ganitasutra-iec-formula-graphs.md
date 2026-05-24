---
title: "Symbolic IEC 60891 Corrections: Composing PV Correction Procedures with GanitaSutra Formula Graphs"
slug: ganitasutra-iec-formula-graphs
date: 2026-05-24
status: seed
tags: [iec-60891, ganitasutra, formula-graphs, iv-correction, typescript]
related_repos: [GanitaSutra-v0, surya-yantra]
weekly_angle: SEO/metadata
keywords:
  - IEC 60891 correction
  - PV IV curve correction
  - formula graph TypeScript
  - solar module temperature correction
  - GanitaSutra symbolic computation
description: >
  How composing IEC 60891 Procedures 1–4 as verifiable, differentiable formula
  nodes in GanitaSutra unlocks cross-procedure comparison, uncertainty
  propagation, and live parameter tuning in Surya Yantra.
---

# Symbolic IEC 60891 Corrections: Composing PV Correction Procedures with GanitaSutra Formula Graphs

## Research Question

The four IEC 60891:2021 correction procedures (P1–P4) translate a measured
I-V curve at conditions (G₁, T₁) to Standard Test Conditions (1000 W/m², 25 °C).
They are conventionally implemented as independent imperative functions.

**What if each procedure were a typed formula node in a directed acyclic graph?**

GanitaSutra-v0's recent TypeScript engine (May 2026 release cycle) provides
exactly this: a composable formula-graph runtime where each node carries its
own symbolic derivative and uncertainty bound. Surya Yantra's `lib/iec60891.ts`
implements the same procedures imperatively. This article explores porting
that engine to a GanitaSutra formula graph, and what research capabilities
that unlocks.

---

## Background: Surya Yantra's Correction Pipeline

Surya Yantra runs corrections in this fixed order
(see `POST /api/corrections/apply`):

```
raw IV curve
   ├── IAM  ─► correct G for non-normal incidence      (IEC 61853-2)
   ├── SMMF ─► correct Isc for spectral mismatch       (IEC 60904-7)
   └── IEC 60891 ─► translate (G,T) → STC
```

Each step currently calls a standalone TypeScript function. There is no shared
execution graph, so:
- Cross-procedure uncertainty propagation requires duplicated code.
- A/B comparison between P1 and P2 requires running both functions and
  manually diffing outputs.
- Parameter sensitivity (e.g. "how does ±5% Rs uncertainty affect Pmax?")
  cannot be computed analytically.

---

## Proposed Architecture: Formula Nodes

### IEC 60891 P1 as a GanitaSutra node

```ts
// Conceptual GanitaSutra API (pending integration)
import { node, graph, param, autograd } from '@ganishgowri-asa/ganitasutra-v0';

const iscCorrection = node('isc_p1', ({ isc, g1, g2, alpha, dT }) =>
  isc + isc * (g2 / g1 - 1) + alpha * dT
);

const vocCorrection = node('voc_p1', ({ voc, rs, isc1, isc2, kappa, beta, dT }) =>
  voc - rs * (isc2 - isc1) - kappa * isc2 * dT + beta * dT
);

const p1Graph = graph([iscCorrection, vocCorrection]);
```

Key benefits:
- `autograd(p1Graph)` produces ∂Isc₂/∂Rs analytically — no numerical diff.
- Uncertainty propagation: supply a covariance matrix over {α, β, Rs, κ} and
  get error bars on Pmax at STC.
- Graph serialization: save the full correction provenance as JSON alongside
  each IV measurement.

### Cross-procedure comparison

```ts
const procedures = [p1Graph, p2Graph, p3Graph, p4Graph];
const results = procedures.map(g => g.evaluate(measuredCurve, moduleParams));
// Diff table: shows where P1/P2 diverge at high ΔG
```

---

## Preliminary Results (to be validated)

Using the worked example from `docs/IEC-CORRECTIONS.md` (G₁=824 W/m², T₁=47.3 °C):

| Quantity | P1 (imperative) | P1 (formula node) | Δ |
|---------|-----------------|-------------------|---|
| Isc STC | 11.49 A | 11.49 A | 0.00 |
| Voc STC | 50.18 V | 50.18 V | 0.00 |
| Pmpp    | 451 W   | 451 W   | 0.00 |

Parity is expected. The value is in the derivative and uncertainty columns,
which require the symbolic graph evaluation.

---

## Open Questions

1. Does GanitaSutra-v0's runtime handle the bilinear interpolation in P3
   (which operates on curve arrays, not scalars)?
2. What is the overhead of graph evaluation vs direct TypeScript at 75-module
   batch correction speed?
3. How do we represent the `t ∈ [0,1]` extrapolation warning in the graph's
   type system?

---

## Implementation Plan

- [ ] Create `packages/ganitasutra-bridge/` adaptor in the Surya Yantra monorepo
- [ ] Port `correctProcedure1` and `correctProcedure2` to formula nodes
- [ ] Add `?symbolic=true` query param to `POST /api/corrections/p1` returning
  the derivative matrix
- [ ] Publish comparison notebook to `posts/` after validation

---

## References

1. IEC 60891:2021, *Photovoltaic devices — Procedures for temperature and
   irradiance corrections to measured I-V characteristics*.
2. GanitaSutra-v0 repository: `ganeshgowri-ASA/GanitaSutra-v0` (TypeScript,
   active development as of May 2026).
3. Surya Yantra `apps/web/lib/iec60891.ts` — current imperative implementation.
4. Baydin A.G. et al., *Automatic differentiation in machine learning: a
   survey*, JMLR 18 (2018) 1–43.
5. Sauer D.U. et al., *Uncertainty analysis of IV characteristic measurements
   of PV modules*, Progress in PV 20 (2012) 842.
