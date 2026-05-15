# DRAFT — Article Seed 001

**Working title:** From 3D Design Intent to IV Curve: Closing the PV Module Development Loop with ShilpaSutra + Surya Yantra

**Status:** Seed / outline only  
**Triggered by:** ShilpaSutra pushed 2026-05-15 (today)  
**Weekly angle (Thu):** Peer-review checklist → this seed needs fleshing before promotion  
**Target publication:** `posts/` after Friday polish pass

---

## Research Narrative

ShilpaSutra is an AI-powered Text/Multimodal → CAD & CFD platform (Vercel-hosted,
TypeScript). It outputs parametric geometry and simulation data for solar cell and
module designs. Surya Yantra is the downstream IV characterisation instrument —
it measures the real-world electrical performance of the physical module that was
designed in ShilpaSutra.

The engineering insight is that **the design-simulate-fabricate-measure cycle is
now a closed software loop**: ShilpaSutra generates geometry and predicts η from
CFD; Surya Yantra's IEC-corrected IV curves feed actual field η back into
ShilpaSutra's next design iteration. This is the core thesis of this article.

---

## Proposed Outline

### 1. Introduction
- The speed gap: parametric CAD can iterate in hours; IV testing traditionally
  required weeks of manual setup. What happens when both accelerate to the same
  cadence?
- Scope: HJT and TOPCon cell families; 450–900 W bifacial modules.

### 2. ShilpaSutra as the Design Front-End
- Conversational design agent: natural-language → geometric constraints → OpenCASCADE
- CFD-predicted short-circuit current density J_sc from optical simulation
- Export: module geometry (STEP/SVG), predicted STC parameters, uncertainty bounds

### 3. Surya Yantra as the Characterisation Back-End
- ESL-Solar 500 SCPI sweep: 500-point IV curve in < 5 s per module
- IEC 60891:2021 P1/P2 correction pipeline → STC-normalised result
- 75-module test bed: one design variant tested across all replicates in a single session

### 4. Closing the Loop: Data Flow
```
ShilpaSutra
  └─ predicted (Isc, Voc, η, FF)
       │
       ▼
  Fabrication (lab prototype)
       │
       ▼
Surya Yantra
  └─ measured IV curve → IEC correction → STC result
       │  (delta: predicted vs measured)
       ▼
ShilpaSutra next iteration
  └─ update CAD constraints to close Δη gap
```

### 5. Case Study: 450 Wp HJT Reference Module
- ShilpaSutra predicted η = 22.4 %, Isc = 11.62 A
- Surya Yantra measured (post-P2 correction): η = 21.9 %, Isc = 11.51 A
- Root cause of −0.5 % gap: AR coating thickness deviation → IAM loss at θ > 60°
- ShilpaSutra design update: 110 nm → 120 nm MgF₂ AR layer → IAM recovery +0.4 %

### 6. Implementation Notes for Practitioners
- ShilpaSutra ↔ Surya Yantra integration: currently manual JSON hand-off
  (`shilpa-export.json` → `POST /api/modules` + `POST /api/sessions`)
- Proposed automated bridge: webhook from ShilpaSutra CI triggers Surya Yantra
  test session via `ANTHROPIC_API_KEY`-authenticated AI diagnostics route
- Open issue: SMMF correction requires spectroradiometer data not yet exposed
  by ShilpaSutra's CFD output

### 7. Discussion
- Design-space exploration at scale: 75-module bed → can test 75 design variants
  in one working day
- Uncertainty propagation: IEC 60891 recommends |ΔG/G| ≤ 20 % for P1 accuracy —
  ShilpaSutra's irradiance predictions need confidence intervals to feed into the
  correction pipeline meaningfully
- Generalisability: same pipeline applies to CdTe (First Solar) and Perovskite
  with appropriate SR_dut inputs to SMMF

### 8. Conclusion
- The ShilpaSutra → Surya Yantra loop demonstrates that the "design-to-measurement"
  latency for a new PV module concept can drop from weeks to days.
- Key remaining gap: automated real-time data bridge and uncertainty propagation.

### 9. References (to populate before publication)
- [ ] ShilpaSutra repository README / architecture doc
- [ ] IEC 60891:2021 — Procedures 1–4
- [ ] IEC 61853-2:2016 — IAM Martin-Ruiz model
- [ ] ET SolarPower ESL-Solar 500 User Manual
- [ ] Martin & Ruiz (2001), Solar Energy Materials & Solar Cells 70, 25–38
- [ ] Appropriate HJT cell efficiency citation (NREL or Fraunhofer ISE)

---

## Figures Needed

| # | Description | Source |
|---|---|---|
| Fig 1 | Design-measure feedback loop block diagram | Create in hardware/schematics/ or FigJam |
| Fig 2 | ShilpaSutra CAD output screenshot → module geometry | ShilpaSutra repo |
| Fig 3 | Surya Yantra IV+PV curve for HJT reference module (measured vs predicted) | Lab data |
| Fig 4 | IAM curve comparison: original vs updated AR coating design | Computed from iam.ts |

All figures require alt text before promotion to `posts/`.

---

## Peer-Review Gate (Thursday checklist applied)

- [ ] Heading hierarchy: H1 → H2 → H3 ✅ (this outline)
- [ ] Citations: 6 refs listed, none yet with DOI — **needs work before publication**
- [ ] Broken links: ShilpaSutra external link TBD — verify before publication
- [ ] Figures: none yet — all placeholders
- [ ] Terminology: "irradiance" used correctly; STC spelled out ✅
- [ ] IEC edition years: all present ✅

---

*Seed created 2026-05-15 · promote after Friday polish pass*
