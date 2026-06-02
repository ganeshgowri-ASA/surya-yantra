---
title: "ABCD Matrices from Grid to Panel: How GanitaSutra's Transmission-Line Math Extends to PV Equivalent Circuits"
date: 2026-06-02
status: outline
tags: [abcd-matrix, two-port-network, pv-modeling, ganitasutra, power-systems, complex-arithmetic]
related_repos: [GanitaSutra-v0, surya-yantra]
related_issues: []
---

# ABCD Matrices from Grid to Panel: How GanitaSutra's Transmission-Line Math Extends to PV Equivalent Circuits

> **Monday outline — 2026-06-02.** Skeleton only; prose to follow on Wed/Thu enhancement pass.
> Engineering hook: GanitaSutra-v0 PR #152 (2026-06-01) refactored `computeABCD` to hoist
> the short-model early-return, deferring `y_unit/Y` computation — the exact same pattern
> arises when modeling a PV module's series resistance element as a two-port network.

## Hook

On 2026-06-01, GanitaSutra-v0 merged a refactor of `computeABCD` — the function
that builds the ABCD transmission matrix for short, medium-π, and long power-line
models. On the same day, Surya Yantra was tracing IV curves across 75 PV modules.
These two projects look unrelated, but they share a deep mathematical infrastructure:
the two-port ABCD network formalism. This article shows the bridge.

## Target Audience

- Power systems engineers curious about PV device physics
- PV test engineers who want to understand the math behind their correction software
- Developers of GanitaSutra-v0 and Surya Yantra exploring cross-repo reuse

## Proposed Sections

### 1. The ABCD (Transmission) Matrix: A 60-Second Primer

- Definition: `[V_in; I_in] = [A B; C D] · [V_out; I_out]` for a two-port network
- Key property: cascade multiplication — three ABCD matrices in series multiply together
- Examples from power systems: short line (A=D=1, B=Z, C=0), medium-π, long (cosh/sinh)
- Reference: Glover-Sarma-Overbye *Power System Analysis and Design* 6th ed. §5
- GanitaSutra-v0 `computeABCD` covers all three models; PR #152 optimises the short-model path

### 2. A PV Module as a Two-Port Network

- The single-diode equivalent circuit: photocurrent source Iph, diode, series resistance Rs, shunt resistance Rsh
- At the small-signal level (near an operating point), the PV module terminal behavior is linear
- The ABCD matrix for a series element Rs: `[[1, Rs], [0, 1]]` — identical to a short transmission line with B=Z=Rs, C=0
- The ABCD matrix for a shunt element Rsh: `[[1, 0], [1/Rsh, 1]]`
- Cascaded two-port for the complete cell: `M_cell = M_series(Rs) · M_shunt(Rsh)`

### 3. IEC 60891 as Two-Port Translation

- IEC 60891 P1 correction: `V2 = V1 - Rs·(I2-I1) - κ·I2·(T2-T1) + β·(T2-T1)`
- Recognise `Rs·(I2-I1)` as the voltage drop across the series element — this IS the ABCD series impedance term
- The correction formula is implicitly applying the ABCD matrix: translating (V1, I1) at (G1,T1) to (V2, I2) at (G2,T2)
- Extension: P4 adds the shunt term (Rsh) — which is the shunt ABCD matrix element
- GanitaSutra's `computeABCD` for the short-line model returns `{A:1, B:z*l, C:0, D:1}` — the same form as the PV series-resistance two-port

### 4. Where the Math Diverges: Frequency Domain vs. DC Operating Point

- Power systems ABCD: phasor domain, complex impedances, `ccosh`/`csinh` for long lines (GanitaSutra PR #152)
- PV module ABCD: DC operating point, real-valued Rs/Rsh, no distributed parameter effects at module scale
- The interesting overlap: frequency-domain PV module impedance spectroscopy (EIS — Electrochemical Impedance Spectroscopy) does use complex ABCD matrices at AC frequencies
- GanitaSutra's complex arithmetic (`ccosh`, `csinh`, `cexp`, `cdiv`, `cmul`) could support EIS analysis

### 5. What a Shared Infrastructure Could Look Like

- Proposal: extract a `@srishtipvlab/two-port` package from GanitaSutra-v0's complex arithmetic helpers
- API: `abcdCascade(...matrices)`, `abcdToAdmittance()`, `abcdToImpedance()`, `computePVCellABCD(Rs, Rsh)`
- Surya Yantra could use this to replace the hard-coded P4 correction formula with a general cascade computation
- GanitaSutra-v0 already exports `cabs` (PR #147, 2026-05-27) — a precedent for incremental extraction

### 6. Research Narrative: Unifying Grid and Panel Math

- The Indian grid and Indian PV manufacturing are tightly coupled: HJT/HPBC/TOPCon modules feed into the same distribution network
- A unified mathematical library that speaks both transmission-line ABCD and PV-cell two-port would be a small but meaningful contribution to open-source power systems + PV tooling
- GanitaSutra-v0 Week-5 roadmap (PR #151, 2026-05-31) proposes "IEC 61853 PV" as Wave-6 direction — this article seeds that direction

## References (to fill in)

- [ ] Glover, Sarma, Overbye — *Power System Analysis and Design* 6th ed., §5 (ABCD matrices)
- [ ] IEC 60891:2021 — Procedures 1–4 (correction formulae with Rs/Rsh)
- [ ] IEC 61853-2:2016 — Small-signal PV module modeling
- [ ] Barsoukov & Macdonald — *Impedance Spectroscopy* (EIS background)
- [ ] GanitaSutra-v0 `lib/power/transmission-lines.ts` — `computeABCD`, `ccosh`, `csinh`
- [ ] GanitaSutra-v0 PR #152 (2026-06-01) — short-model early-return refactor
- [ ] Surya Yantra `apps/web/lib/iec60891.ts` — `correctProcedure4` (Rsh term)

## Ideation / Diagram

- Side-by-side: short transmission-line ABCD vs. PV series-resistance ABCD (show they are identical matrices)
- Diagram: PV module as cascaded two-port blocks (photocurrent source → Rs → Rsh → terminals)
- Code snippet: GanitaSutra `computeABCD` short path vs. proposed `computePVCellABCD`
- Mermaid diagram: ideation → implementation path (GanitaSutra two-port extract → Surya Yantra P4 refactor → SolarLabX P4 add)

## Estimated Word Count

~3,000 words + 2 code snippets + 3 diagrams

## Status Blockers

- Need GanitaSutra-v0 read access to verify `ccosh`/`csinh` signatures and export status
- Need to verify that IEC 61853-2 small-signal model uses ABCD formalism (check §A.3)
