---
title: "SimuFlow MPPT Diagrams as IV Sweep Templates: Connecting GanitaSutra's Visual Programming to Surya Yantra's Correction Pipeline"
date: 2026-06-22
week: W26
day_angle: roadmap
status: seed
tags: [ganitasutra, simflow, mppt, iv-sweep, block-diagram, article-seed]
source_repo: GanitaSutra-v0
source_activity: "pushed 2026-06-21T03:38:10Z"
target_venue: "IEEE PVSC (Conference Paper) or MDPI Energies"
estimated_words: 4000
---

# Seed: SimuFlow MPPT Diagrams as IV Sweep Templates

## Research narrative

GanitaSutra-v0 shipped SimuFlow — a browser-native, MATLAB/Simulink-inspired block diagram environment with 21 engineering toolboxes. Among its toolboxes is an **Energy Systems** set covering perturb-and-observe (P&O) and incremental-conductance (InC) MPPT algorithms expressed as connected blocks.

Surya Yantra's IV sweep engine (`POST /api/sessions`, driven by the ESL-Solar 500 e-load over SCPI) runs fixed linear sweeps: `startV → stopV` in `stepCount` steps at `scanTimeSec`. That is a **open-loop ramp** — it has no feedback from the module's instantaneous power gradient.

The research question: **can a SimuFlow MPPT block diagram be compiled into a Surya Yantra sweep configuration that adaptively concentrates sample density near the MPP?**

## Proposed contribution

1. Define a SimuFlow→JSON schema that maps:
   - P&O step size `ΔV` → `stepCount` density function
   - InC threshold `ΔI/ΔV` → termination criterion
   - Feedback loop sample rate → `scanTimeSec`
2. Implement a `POST /api/sessions/adaptive` endpoint that accepts the compiled SimuFlow config.
3. Compare STC power uncertainty (GUM budget) for fixed vs. adaptive sweeps on the 450 Wp bifacial reference module.
4. Show that adaptive sweep reduces MPP interpolation error by ≥ 0.3% while staying within the IEC 60891 measurement window.

## Sections scaffold

1. Introduction — limits of fixed-ramp IV sweeps
2. SimuFlow block diagram language (brief, cite GanitaSutra-v0)
3. Compilation algorithm: SimuFlow → sweep config
4. Surya Yantra adaptive sweep implementation
5. Experimental validation: fixed vs. adaptive (needs lab data)
6. Uncertainty analysis (GUM, IEC 60891)
7. Conclusion

## Blockers

- Lab sweep data not yet available (hardware commissioning in progress).
- SimuFlow JSON export API not yet stable in GanitaSutra-v0 (pending PR in that repo).

## Action items

- [ ] Coordinate with GanitaSutra-v0 team to lock SimuFlow JSON schema.
- [ ] Add `POST /api/sessions/adaptive` stub to Surya Yantra API.
- [ ] Commission MUX matrix so reference module sweeps can be captured.
