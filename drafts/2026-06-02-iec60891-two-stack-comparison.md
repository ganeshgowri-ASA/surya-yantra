---
title: "Two Implementations, One Standard: IEC 60891 in SolarLabX and Surya Yantra"
date: 2026-06-02
status: outline
tags: [iec60891, pv-corrections, open-source, solar-lab, typescript]
related_repos: [SolarLabX, surya-yantra]
related_issues: []
---

# Two Implementations, One Standard: IEC 60891 in SolarLabX and Surya Yantra

> **Monday outline — 2026-06-02.** Skeleton only; prose to follow on Wed/Thu enhancement pass.

## Hook

Two open-source solar PV applications built by the same lab, on the same stack,
implementing the same IEC 60891:2021 standard — and making subtly different choices
at every decision point. This article does a side-by-side comparison, explains
why the choices diverge, and proposes what a canonical open implementation
should look like.

## Target Audience

- PV test engineers choosing or building correction software
- TypeScript/Next.js developers entering the solar instrumentation domain
- Standards committee members interested in reference implementations

## Proposed Sections

### 1. What IEC 60891:2021 Actually Says

- Four procedures, not one: P1 (classical linear), P2 (multiplicative), P3 (bilinear interpolation), P4 (P2 + shunt resistance)
- The standard leaves several implementation choices open: α/β units (absolute vs. %/°C), extrapolation limits, what to do when G1 ≤ 0
- Why these choices matter: a 2 % difference in Pmpp at the boundary of the ΔG/ΔT validity range
- Cite: IEC 60891:2021 §5.1–§5.4

### 2. SolarLabX Implementation (`lib/iec60891.ts`)

- Function names: `translateProcedure1`, `translateProcedure2`, `translateProcedure3`
- P2 approach: uses Isc-ratio (`I2 = I1 · (Isc2/Isc1)`) — requires a measured reference Isc at target irradiance
- P3 approach: linear interpolation between two reference curves (bilinear parameter `f`)
- No P4 (Rsh term) — shunt effects not modelled
- Test coverage: 30 unit tests (iec60891.test.ts), including Rs determination
- Strength: clean separation of concerns; no side-effects on non-P3 procedures

### 3. Surya Yantra Implementation (`apps/web/lib/iec60891.ts`)

- Function names: `correctProcedure1`, `correctProcedure2`, `correctProcedure3`, `correctProcedure4`
- P2 approach: multiplicative current scaling using `α_rel = α / Isc` — needs only STC coefficients, not a reference measurement
- P4 approach: extends P2 with `Rsh` term for leakage currents; falls back to P2 when Rsh not supplied
- Integration with SMMF and IAM as a correction pipeline (IAM → SMMF → IEC 60891 → STC power)
- Warning header `x-sy-correction-warning` when ΔG/ΔT exceed IEC validity range
- Test coverage: Vitest suite in `apps/web/__tests__/lib/iec60891.test.ts`
- Strength: full P4 implementation; correction pipeline enforces ordering

### 4. Key Divergence Points

| Decision | SolarLabX | Surya Yantra | IEC 60891 Guidance |
|---|---|---|---|
| P2 current correction | Isc-ratio method | α_rel multiplicative | Both are valid; §5.2 prefers Isc-ratio |
| P4 (shunt) | Not implemented | Implemented, optional Rsh | §5.4; recommended for large ΔG |
| Extrapolation guard | Implicit (no check) | Warning header at API layer | §4.2 recommends ΔG < 20 %, ΔT < 10 K |
| α/β unit handling | Internal to function | Schema stores %/°C, API converts | Not specified by standard |
| Pipeline composition | Standalone functions | Middleware pipeline (IAM → SMMF → P1–P4) | Not specified |

### 5. What a Canonical Open Implementation Should Include

- All four procedures with consistent input/output types
- Strict α/β unit handling at the schema boundary (store %/°C, compute in absolute)
- P4 as the recommended default when Rsh is known; P2 as the fallback
- Extrapolation guards with configurable warning vs. hard-abort behaviour
- Companion SMMF and IAM helpers as separate modules (composable)
- 50+ unit tests covering boundary cases (G1=0, ΔG=200 W/m², ΔT=15 K)
- Published as an npm package under `@srishtipvlab/iec60891`

### 6. Research Narrative: Convergent Evolution in Solar Software

- Two teams, same standard, different trade-offs — this is the normal state of industrial standards implementation
- The value of open-sourcing both is that the community can compare, test, and converge
- Proposal: extract both implementations into a shared benchmark harness and publish comparative accuracy data for the 75-module fleet at Srishti PV Lab

## References (to fill in)

- [ ] IEC 60891:2021
- [ ] IEC 60904-1:2020
- [ ] Martin & Ruiz (2001) — IAM model
- [ ] SolarLabX `lib/iec60891.ts` source
- [ ] Surya Yantra `apps/web/lib/iec60891.ts` source
- [ ] SolarLabX unit tests: 30 assertions for iec60891
- [ ] Surya Yantra Vitest suite

## Ideation / Diagram

- Side-by-side correction pipeline diagram (IAM → SMMF → P1/P2/P3/P4 → STC)
- Table: Pmpp error at boundary conditions for each procedure
- Code snippet: the one line that differs between P2 implementations

## Estimated Word Count

~2,500 words + 3 code snippets + 2 tables

## Status Blockers

- Need read access to `SolarLabX/lib/iec60891.ts` source to verify P2/P3 signatures
- Need field data from Srishti lab to compute comparative Pmpp error
