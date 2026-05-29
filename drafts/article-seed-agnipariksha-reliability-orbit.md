# ARTICLE SEED — From Test Bench to Research Paper: Building IEC 61730-2 Reliability Tests in the Orbit of Surya Yantra

> **Status:** Seed (Thursday 2026-05-29)  
> **Source signal:** `agnipariksha` sweep 2026-05-28 — feat(gc), feat(eb), feat(ir), feat(rcot), feat(letid), feat(reports), feat(analysis)

---

## Research Hook

Yesterday's engineering sprint on **Agnipariksha** (Srishti PV Reliability Test
Station) merged five new IEC 61730-2 test orchestrators in a single sweep:

| Orchestrator | IEC Clause | What it measures |
|---|---|---|
| Ground Continuity (GC) | MST 13 | 4-wire R(t) across bonding points, PASS iff R_max ≤ 0.1 Ω |
| Equipotential Bonding (EB) | MST 13 | Pairwise NxN resistance heatmap across all bonding point pairs |
| IR Thermography | IEC TS 60904-12-1 | Forward-bias hot-spot detection via per-cell ΔT threshold |
| Reverse Current Overload (RCOT) | MST 26 | 1.35× fuse-rating reverse bias, thermal abort if T_j exceeds threshold |
| LeTID | IEC TS 63342 | Light-elevated-temperature-induced degradation: logistic Pmax(t) model |

The **analysis verdict engine** (Tab 4) now aggregates all five into a
single `POST /api/analysis/recompute` call that returns structured
`PASS / FAIL / INCONCLUSIVE` verdicts per IEC clause, consumed directly
by the Tab 5 IEC-formatted PDF/HTML report.

This is the mirror of what **Surya Yantra** does for IV-curve measurement
and IEC 60891 corrections — a natural cross-system research narrative emerges:

> *"From photon to verdict: how two open-source lab instruments bridge the gap
> between field IV measurement and IEC 61730-2 reliability qualification."*

---

## Proposed Article Structure

### 1. Introduction — Why IV curves are only half the story
- PV module qualification under IEC 61215 / IEC 61730 requires both
  performance characterisation (IV) **and** safety/reliability tests (GC, EB,
  thermal, degradation).
- Most open-source tools address one but not both.
- Surya Yantra + Agnipariksha together cover the full qualification pipeline.

### 2. Surya Yantra's role — measurement and correction
- IV sweep via ESL-Solar 500 SCPI, 4-wire Kelvin, 75-module MUX.
- IEC 60891 P1–P4 correction to STC, SMMF, IAM.
- Outputs: corrected `IVCurve`, `Pmpp`, `Voc`, `Isc`, `FF` at STC.

### 3. Agnipariksha's role — reliability and safety qualification
- GC / EB measure continuity integrity of the module frame and bonding network.
- IR thermography identifies early-stage hot spots before they degrade Pmpp.
- RCOT and LeTID quantify long-term degradation thresholds.
- All results flow into a structured verdict engine.

### 4. The bridge — using Surya Yantra's Pmpp as the LeTID baseline
- LeTID measures Pmax(t) / Pmax(0); Pmax(0) is the **STC-corrected Pmpp**
  from a Surya Yantra sweep.
- Connecting the two systems closes the provenance chain:
  `IV measurement → STC correction → Pmax baseline → LeTID/RCOT verdict`.
- This is the key research contribution: a reproducible, IEC-traceable
  workflow from first photon to final qualification verdict.

### 5. Implementation diagram (ideation → implementation)
```
Surya Yantra                         Agnipariksha
──────────────                       ────────────
IV sweep (SCPI)                      GC / EB continuity
  │ IEC 60891                          │ IEC 61730-2 MST 13
  │ P1–P4 correction                   │
  ▼                                    ▼
STC Pmpp ─────────────────────► LeTID Pmax(0) baseline
                                   │ IEC TS 63342
                                   │ Logistic Pmax(t) model
                                   ▼
                              Verdict: PASS / FAIL
                                   │
                                   ▼
                          IEC Report (PDF + HTML)
```

### 6. Open questions / calls for peer review
- Is 0.1 Ω the correct default R_max for MST 13, or should it be
  module-area-normalised?
- The LeTID logistic model uses a -3 % Pmax drop at 162 h DEMO fixture.
  What are the lab-validated parameters for Indian field conditions?
- SMMF correction factors for the Jamnagar spectrum vs AM1.5G?

---

## Target Venues

- **IEEE PVSC** (Photovoltaic Specialists Conference) — implementation paper
- **Progress in Photovoltaics** — open-source instrumentation note
- **Solar Energy** — field-test methodology
- **GitHub Discussions** on both repos — immediate community feedback

---

## Next Steps

- [ ] Author to validate LeTID parameters against measured Srishti lab data.
- [ ] Add `GET /api/sessions/:id/pmpp` shortcut to Surya Yantra to simplify
      the handoff to Agnipariksha's LeTID baseline.
- [ ] Draft §§ 1–2 (Introduction + Surya Yantra) by next Monday outline pass.

---

*Seed generated: 2026-05-29 · Surya Yantra editorial system · Thursday peer-review angle*
