# GanitaSutra as the Visual Mathematical Engine for IEC PV Correction Algorithms

**Status:** seed  
**Date:** 2026-05-19  
**Author:** Srishti PV Lab  
**Tags:** ganitasutra, iec-60891, smmf, iam, numerical-methods, open-science  
**Sister repos:** surya-yantra · GanitaSutra

---

## Why This Article

`GanitaSutra` (last pushed 2026-05-03, TypeScript, 21 toolboxes + SimuFlow
block-diagram editor) is positioned as a browser-native MATLAB/Simulink
alternative. `surya-yantra`'s correction library (`lib/iec60891.ts`,
`lib/smmf.ts`, `lib/iam.ts`) contains exactly the kind of numerical
algorithms — trapezoidal integration, bilinear interpolation, iterative
curve fitting — that map naturally onto GanitaSutra SimuFlow blocks.

This article proposes a *live, visual explainer* for the IEC correction
pipeline, runnable entirely in the browser without a Python or MATLAB licence.

---

## Core Research Question

> Can the IEC 60891:2021 IV correction pipeline (P1–P4 + SMMF + IAM) be
> faithfully reproduced as a GanitaSutra SimuFlow diagram, and does that
> representation improve pedagogical clarity for PV engineers compared to
> the static pseudocode in standards documents?

---

## Proposed Narrative Arc

### 1. The "standards as black-boxes" problem

IEC 60891, 60904-7, and 61853-2 describe correction procedures in
mathematical notation that many PV field engineers find opaque. Existing
software (PVsyst, SolarEdge) implements them but hides the internals. Open,
inspectable, interactive implementations are rare.

### 2. surya-yantra's TypeScript reference implementation

Summarise what each function does and the design choices:
- Why trapezoidal integration over the *union* wavelength grid in `smmf.ts`.
- Why P2 (multiplicative) is preferred over P1 (linear) for `|ΔG| > 200 W/m²`.
- The `[0.5, 2.0]` abort guard on combined correction factors.

### 3. Mapping to GanitaSutra SimuFlow blocks

Proposed block decomposition:

```
[Irradiance G₁, T₁] ──► [IAM block: Martin-Ruiz θ→G_eff]
                                │
[Spectrum E_test, SR_ref] ──► [SMMF block: trapz integration]
                                │
[G_eff, SMMF, IVcurve] ──────► [IEC60891-P2 block] ──► [STC IVcurve]
                                                            │
                                                     [MPP finder] ──► Pmpp
```

Each block exposes its internal state for inspection, mirrors the TypeScript
function signatures in `lib/`, and can be driven by slider inputs for
interactive parameter exploration.

### 4. Educational validation

Compare understanding scores (pre/post quiz) between:
- Group A: reads IEC 60891 standard clause 6.2 (text + equations).
- Group B: runs the GanitaSutra SimuFlow diagram with real Jamnagar field data.

Hypothesis: Group B shows > 30% improvement in "apply correction to new
dataset" task accuracy.

### 5. Open artefact

Publish the SimuFlow diagram as a shareable GanitaSutra workspace. Link from
surya-yantra's `docs/IEC-CORRECTIONS.md` as a companion interactive resource.

---

## Implementation To-Do

- [ ] Confirm GanitaSutra supports `TypeScript` custom block authoring (or
  check if blocks are pure JS — need to verify with GanitaSutra maintainer)
- [ ] Port `lib/smmf.ts → computeSMMF()` to a GanitaSutra block spec
- [ ] Port `lib/iec60891.ts → correctProcedure2()` to a block spec
- [ ] Design the pre/post quiz (5 questions, applied scenario format)
- [ ] Collect field data sample for the interactive demo

---

## Target Venue

*IEEE Transactions on Education* (brief comm.) or *Solar Energy* teaching note.
Alternatively, conference paper at PVSC or EU PVSEC with live demo.

---

## References to Acquire

1. IEC 60891:2021 (full text — available via IEC Webstore).
2. IEC 60904-7:2019.
3. GanitaSutra documentation / block authoring guide (internal link TBD).
4. Freeman J. et al., "Numerical methods for solar resource assessment", NREL 2018.
5. (To add) User study methodology reference for engineering education research.
